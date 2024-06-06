import os
import sys
import time

import torch
from torcheval.metrics.functional import r2_score
import pandas as pd
import paho.mqtt.client as mqtt

from config import (
    MQTT_SERVER, MQTT_PORT, MQTT_GLOBAL_UPDATE, MQTT_SUBMIT_TOPIC
)
from utils import *
from models import *


class Worker:
    def __init__(
            self, args, worker_id, local_save_path,
            worker_mqtt_client: mqtt.Client,
    ) -> None:
        self.args = args
        self.worker_id = worker_id
        self.local_save_path = local_save_path
        self.worker_mqtt_client = worker_mqtt_client
        self.avg_loss = []
        self.server_epoch = -1
        self.init_data_model()

        self.worker_mqtt_client.on_connect = self.on_worker_connect  # subscribe transfer or upd#
        self.worker_mqtt_client.on_message = self.on_worker_message  # receive#

        self.worker_mqtt_client.connect(MQTT_SERVER, MQTT_PORT, keepalive=3600)
        self.worker_mqtt_client.loop_start()

    def init_data_model(self):
        org_dataset_map = json.loads(self.args.org_dataset_map)
        self.df_train = getcsv_mongo(org_dataset_map[self.worker_id])
        # self.df_train = pd.read_csv(
        #     self.args.train_data_path + f"{self.worker_id}.csv"
        # )
        self.df_test = getcsv_mongo(self.args.test_dataset)
        # self.df_test = pd.read_csv(self.args.test_data_path)
        self.x_train_tensor, self.x_test_tensor, self.train_loader, self.test_loader, self.f_n = prepare_data(
            self.df_train, self.df_test, batch_size=self.args.batch_size
        )

        selected_model = globals().get(self.args.model)
        if selected_model is None:
            raise NotImplementedError(
                f"Model {self.args.model} is not implemented"
            )
        self.model = selected_model(input_size=self.x_test_tensor.shape[1])
        self.model.to(device)
        if self.args.optimizer == "adam":
            self.optimizer = torch.optim.Adam(self.model.parameters(), lr=self.args.lr)
        elif self.args.optimizer == "sgd":
            self.optimizer = torch.optim.SGD(self.model.parameters(), lr=self.args.lr)
        else:
            raise NotImplementedError(
                f"Optimizer {self.args.optimizer} is not implemented"
            )

    def start(self):
        torch.manual_seed(self.args.seed)
        np.random.seed(self.args.seed)

        # training details
        self.model.train()
        for epoch in range(self.args.global_epochs):
            # wait for server msg for synchronization
            # self.server_epoch is updated in `on_message`
            while True:
                if epoch == self.server_epoch:
                    break
                time.sleep(0.01)

            # local training
            if self.args.prox_term:
                last_global_model = self.model.get_serializable_state_list(
                    to_list=False
                ).detach()
            losses = []
            for x_batch, y_batch in self.train_loader:
                self.optimizer.zero_grad()
                predictions = self.model(x_batch)
                loss = self.model.local_loss(predictions, y_batch)
                if self.args.prox_term:  # penalty for proximal term
                    now_model = self.model.get_serializable_state_list(to_list=False)
                    prox_term = torch.sum((last_global_model - now_model) ** 2)
                    loss += self.args.prox_ratio * prox_term
                loss.backward()
                self.optimizer.step()
                losses.append(loss.item())

            self.avg_loss.append(sum(losses) / len(losses))
            print(
                "local loss of epoch - {}: {}\n".format(epoch, self.avg_loss[-1])
            )

            # save the local model for aggregation
            msg = {
                "model": self.model.get_serializable_state_list(),
                "worker_id": self.worker_id,
                "epoch": epoch,
                "local_loss": self.avg_loss[-1]
            }
            msg = json.dumps(msg).encode()
            self.worker_mqtt_client.publish(topic=MQTT_SUBMIT_TOPIC, payload=msg)
            # if self.args.aggregation == "mean":
            #     # to Go backend
            #     pass
            # else:
            #     # to the Python backend
            #     pass

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
            print(f'Test of worker {self.worker_id}:', all_loss)
        record(
            self.local_save_path, self.avg_loss, self.model,
            all_loss, y_batch_test.reshape(-1).tolist(), predictions.reshape(-1).tolist(),
            self.x_train_tensor, self.x_test_tensor, self.f_n
        )

    def on_worker_connect(self, client, userdata, connect_flags, reason_code, props):
        if reason_code == "Success":
            msg = "Worker {0} is successfully connected with broker@{1}".format(
                worker_id, MQTT_SERVER
            )
            client.subscribe(MQTT_GLOBAL_UPDATE)
            print(msg)

    def on_worker_message(self, client, userdata, msg):
        if msg.topic == MQTT_GLOBAL_UPDATE:
            msg_dict = json.loads(msg.payload.decode())
            self.model.load_serializable_state_list(msg_dict['model'])
            self.server_epoch = msg_dict['server_epoch']

            print("worker_{} receives the global model in server_epoch {}".format(
                self.worker_id, msg_dict['server_epoch']
            ))
        else:
            pass


if __name__ == "__main__":
    global_save_path = sys.argv[1]
    worker_id = sys.argv[2]
    with open(os.path.join(global_save_path, "global_config.yaml"), 'r') as f:
        d = yaml.safe_load(f)
    args = dict_to_namespace(d)

    local_save_path = os.path.join(global_save_path, worker_id)
    if not os.path.exists(local_save_path):
        os.mkdir(local_save_path)

    worker_mqtt_client = mqtt.Client(
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        client_id=f"worker_{worker_id}"
    )

    try:
        worker = Worker(args, worker_id, local_save_path, worker_mqtt_client)
        worker.start()
        time.sleep(10)
        worker_mqtt_client.loop_stop()
    except KeyboardInterrupt:
        print("=== {0:>8} is aborted by keyboard interrupt".format(
            'Worker {0}'.format(worker_id)
        ))
