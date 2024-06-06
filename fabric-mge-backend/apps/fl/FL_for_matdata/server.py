import os, sys
import time
import json
import yaml

import torch
import torch.nn as nn
from torcheval.metrics.functional import r2_score
import pandas as pd
import paho.mqtt.client as mqtt

from apps.fl.FL_for_matdata.models.base import device
from config import (
    MQTT_SERVER, MQTT_PORT, MQTT_GLOBAL_UPDATE, MQTT_SUBMIT_TOPIC,
    SYNCHRONIZATION
)
from utils import dict_to_namespace, prepare_data, record, getcsv_mongo
from models import *
from aggregator import Aggregator


class Server:
    def __init__(self, args, global_save_path) -> None:
        self.args = args
        self.server_epoch = 0
        self.num_done_workers = 0
        self.global_save_path = global_save_path
        self.received_msg = {}
        self.has_test = False
        self.local_loss_info = None
        self.aggregated_info = []
        self.aggregator = Aggregator(self.args.aggregation)
        self.df_test = getcsv_mongo(self.args.test_dataset)
        # self.df_test = pd.read_csv(self.args.test_data_path)
        _, self.x_test_tensor, _, self.test_loader, self.f_n = prepare_data(
            df_train=None, df_test=self.df_test, batch_size=None
        )

        selected_model = globals().get(self.args.model)
        if selected_model is None:
            raise NotImplementedError(
                f"Model {self.args.model} is not implemented"
            )
        self.model = selected_model(input_size=self.x_test_tensor.shape[1])
        self.model.to(device)

    def aggregate(self, epoch_info_dict: dict):
        """
        info need to be aggregated:
        # length == self.args.workers
        {
            1: [1, 2, 3],
            2: [4, 5, 6],
            3: [2, 3, 4],
        }

        return:
        # average by dimension
        [3.5, 5, 6,5]
        """
        sums = [0] * len(next(iter(epoch_info_dict.values())))

        for _, values in epoch_info_dict.items():
            sums = [x + y for x, y in zip(sums, values)]

        return [x / self.args.workers for x in sums]

    def test(self):
        self.has_test = True
        self.model.load_serializable_state_list(self.aggregated_info)
        self.model.eval()
        with torch.no_grad():
            x_batch_test, y_batch_test = next(iter(self.test_loader))
            predictions = self.model(x_batch_test)
            mse_loss = nn.MSELoss()(predictions, y_batch_test)
            mae_loss = nn.L1Loss()(predictions, y_batch_test)
            r2 = r2_score(predictions, y_batch_test)
            rmse_loss = torch.sqrt(mse_loss)
            all_loss = {
                "MSE": mse_loss.item(), "MAE": mae_loss.item(),
                "RMSE": rmse_loss.item(), "R2": r2.item()
            }
            print('Test of server:', all_loss)
        record(
            self.global_save_path, None, self.model,
            all_loss, y_batch_test.reshape(-1).tolist(), predictions.reshape(-1).tolist(), self.x_test_tensor,
            self.x_test_tensor, self.f_n
        )


def on_server_connect(client, userdata, connect_flags, reason_code, props):
    if reason_code == "Success":
        client.subscribe(MQTT_SUBMIT_TOPIC)
        msg = f"Server is successfully connected with broker@{MQTT_SERVER}"
        print(msg)


def on_server_message(client, userdata, msg):
    if msg.topic == MQTT_SUBMIT_TOPIC:
        msg_dict = json.loads(msg.payload.decode())
        assert msg_dict["epoch"] == server.server_epoch - 1, "Epoch mismatch"

        if SYNCHRONIZATION:
            if msg_dict["epoch"] not in server.received_msg:
                server.received_msg[msg_dict["epoch"]] = {}
                server.local_loss_info = "\nEpoch {}: ".format(msg_dict["epoch"])

            server.received_msg[msg_dict["epoch"]][msg_dict["worker_id"]] = msg_dict["model"]
            server.local_loss_info += " worker_{}'s local loss - {:.6f};".format(
                msg_dict["worker_id"], msg_dict["local_loss"]
            )

            if len(server.received_msg[msg_dict["epoch"]]) == server.args.workers:
                print(server.local_loss_info) if (msg_dict["epoch"] + 1) % 10 == 0 else None
                ####################################################
                # execute aggregation
                if server.args.aggregation == "mean":
                    # upload to the Go backend
                    server.aggregated_info = server.aggregate(
                        server.received_msg[server.server_epoch - 1]
                    )
                else:
                    server.aggregated_info = server.aggregator(
                        server.received_msg[server.server_epoch - 1]
                    )
                ####################################################
                # it is not necessary to load the model in each epoch
                # server.model.load_serializable_state_list(aggregated_info)
                update_msg = {
                    "model": server.aggregated_info,
                    "server_epoch": server.server_epoch
                }
                server_mqtt_client.publish(
                    topic=MQTT_GLOBAL_UPDATE, payload=json.dumps(update_msg).encode()
                )
                server.server_epoch += 1
            if msg_dict["epoch"] == server.args.global_epochs - 1:
                server.num_done_workers += 1
        else:
            raise NotImplementedError("Asynchronous mode is not implemented yet")
    else:
        pass


if __name__ == "__main__":
    global_save_path = sys.argv[1]
    with open(os.path.join(global_save_path, "global_config.yaml"), 'r') as f:
        d = yaml.safe_load(f)
    args = dict_to_namespace(d)

    server = Server(args, global_save_path)

    server_mqtt_client = mqtt.Client(
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        client_id="Server"
    )
    server_mqtt_client.on_connect = on_server_connect  # subscribe the `submit` topic
    server_mqtt_client.on_message = on_server_message  # process the received msg

    server_mqtt_client.connect(MQTT_SERVER, MQTT_PORT, keepalive=3600)
    server_mqtt_client.loop_start()

    # initialization message
    init_msg = {
        "model": server.model.get_serializable_state_list(),
        "server_epoch": server.server_epoch
    }
    server_mqtt_client.publish(
        topic=MQTT_GLOBAL_UPDATE, payload=json.dumps(init_msg).encode()
    )
    server.server_epoch += 1

    try:
        while True:
            time.sleep(0.5)
            if server.num_done_workers == server.args.workers:
                server_mqtt_client.loop_stop()
                print("waiting for the `shap.KernelExplainer` of workers "
                      "and server to finish, may be 3 minutes or more... ")
                server.test()
                break
    except KeyboardInterrupt:
        print("=== {0:>8} is aborted by keyboard interrupt".format('Server'))
