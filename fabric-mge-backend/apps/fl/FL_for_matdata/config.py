import os
import argparse


def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')


PYTHON_PATH = "D:/Anaconda/Anaconda3/envs/fabric-mge-backend/python.exe"
PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))

MQTT_SERVER = "localhost"
MQTT_PORT = 1883
MQTT_SUBMIT_TOPIC = "submit"
MQTT_GLOBAL_UPDATE = "global_update"

SYNCHRONIZATION = True

args = argparse.ArgumentParser()

args.add_argument("--workers", type=int, default=3, help="Number of workers")

args.add_argument(
    "--model", type=str, default="MLP", choices=["MLP", "Lasso", "LSTM", "RNN"],
    help="Model to use, Lasso is not performed well"
)
args.add_argument(
    "--optimizer", type=str, choices=["adam", "sgd"], default="adam",
    help="Type of optimizer to use (adam or sgd)."
)
args.add_argument("--aggregation", type=str, default="mean",
                  choices=["mean", "median", "multi_krum", "centered_clipping", "geo_med"],
                  help="Type of aggregator for all local infos")
args.add_argument("--seed", type=int, default=0)
args.add_argument("--lr", type=float, default=0.002)
# args.add_argument("--global_epochs", type=int, default=100)
args.add_argument("--global_epochs", type=int, default=30)
# args.add_argument("--batch_size", type=int, default=128)
args.add_argument("--batch_size", type=int, default=32)
args.add_argument("--prox_term", type=str2bool, default=False,
                  help="use proximal term if set the flag, default non-proximal term")
args.add_argument("--prox_ratio", type=float, default=0.1)

args.add_argument(
    "--train_data_path", type=str,
    default=f"{PROJECT_PATH}/data/train_part",
)
args.add_argument(
    "--test_data_path", type=str,
    default=f"{PROJECT_PATH}/data/test_dataset.csv",
)

args.add_argument('--taskID', type=str, default='1713852468385451801')
args.add_argument('--test_dataset', type=str, default='test_dataset')
args.add_argument('--org_dataset_map', type=str, default='{"org1": "dataset1", "org2": "dataset2", "org3": "dataset3"}')
args.add_argument('--accepted_orgs', type=str, default='["InvitedOrgs2", "InvitedOrgs3"]')
args.add_argument('--global_save_path', type=str,
                  default=r'D:\Pycharm\SCode\fabric-mge-backend\fabric-mge-backend\apps\fl\FL_for_matdata\results/1713852468385451801\run3')
# args.add_argument("--worker_id", type=int, default=None)
