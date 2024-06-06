import csv
import os
import subprocess

import io
import pandas
import yaml
import json
import socket
from typing import Tuple, Optional
from argparse import Namespace

import numpy as np
import torch
import torch.nn as nn
from pymongo import MongoClient
from torch.utils.data import TensorDataset, DataLoader
from sklearn.preprocessing import StandardScaler
import pandas as pd
import matplotlib.pyplot as plt
import shap

# from apps.fl.FL_for_matdata.config import PYTHON_PATH, PROJECT_PATH
# from config import PYTHON_PATH, PROJECT_PATH

PYTHON_PATH = "D:/Anaconda/Anaconda3/envs/fabric-mge-backend/python.exe"
PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# device = torch.device("cpu")
from apps.fl.FL_for_matdata.models.base import device


def dict_to_namespace(d: dict):
    namespace = Namespace()
    for k, v in d.items():
        if isinstance(v, dict):
            setattr(namespace, k, dict_to_namespace(v))
        else:
            setattr(namespace, k, v)
    return namespace


def standard_process(
        df: pd.DataFrame
) -> Tuple[pd.DataFrame, np.ndarray]:
    df = df.dropna(axis=0, how='any')
    y = df['e_form'].values
    x = df.drop(
        [
            "formula", "atom a", "atom b", "lowest distortion",
            "e_form", "composition", "composition_oxid"
        ],
        axis=1
    )
    ss = StandardScaler()
    pt = ss.fit_transform(x)

    x = pd.DataFrame(pt, columns=x.columns)
    # correlated_matrix = x.corr()
    # correlated_feature = set()
    # for i in range(len(correlated_matrix.columns)):
    #     for j in range(i):
    #         if abs(correlated_matrix.iloc[i,j])>0.9:
    #             colname = correlated_matrix.columns[i]
    #             correlated_feature.add(colname)

    # x = x.drop(labels=correlated_feature,axis=1)
    return x, y


def prepare_data(
        df_train: Optional[pd.DataFrame],
        df_test: pd.DataFrame,
        batch_size=128
) -> Tuple[
    Optional[torch.Tensor],
    torch.Tensor,
    Optional[DataLoader],
    DataLoader,
    list
]:
    '''
    prepare data for training and testing
    '''
    x_test, y_test = standard_process(df_test)
    feature_names = x_test.columns.tolist()
    x_test_tensor = torch.tensor(x_test.values, dtype=torch.float32, device=device)
    y_test_tensor = torch.tensor(y_test, dtype=torch.float32, device=device).view(-1, 1)
    test_dataset = TensorDataset(x_test_tensor, y_test_tensor)
    test_loader = DataLoader(dataset=test_dataset, batch_size=len(y_test), shuffle=True)

    if df_train is None:
        return None, x_test_tensor, None, test_loader, feature_names

    x_train, y_train = standard_process(df_train)
    x_train_tensor = torch.tensor(x_train.values, dtype=torch.float32, device=device)
    y_train_tensor = torch.tensor(y_train, dtype=torch.float32, device=device).view(-1, 1)
    train_dataset = TensorDataset(x_train_tensor, y_train_tensor)
    train_loader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)

    return x_train_tensor, x_test_tensor, train_loader, test_loader, feature_names


def record(
        save_path: str,
        avg_loss: list,
        model: nn.Module,
        all_loss: dict,
        y_batch_test: np.ndarray,
        predictions: np.ndarray,
        x_train: torch.Tensor,
        x_test: torch.Tensor,
        feature_names: list
):
    '''
    record the test results and save the plots
    '''
    serializable_state = model.get_serializable_state_list()

    with open(os.path.join(save_path, "model_weights.json"), 'w') as f:
        json.dump(serializable_state, f)

    if avg_loss:
        plt.figure()
        plt.plot(avg_loss)
        plt.grid()
        plt.xlabel('Epochs', fontsize=14)
        plt.ylabel('Avg-Loss', fontsize=14)
        plt.savefig(os.path.join(save_path, "loss.png"))
        with open(os.path.join(save_path, "avg_loss.txt"), 'w') as f:
            f.write("Test metrics:\n{}\nTrain loss: \n".format(all_loss))
            for item in avg_loss:
                f.write("%s\n" % item)
    else:
        with open(os.path.join(save_path, "last_loss.txt"), 'w') as f:
            f.write("Test metrics of final global model:\n{}".format(all_loss))

    # plot the y_test vs y_pred
    plt.figure()
    plt.scatter(y_batch_test, predictions, c='g', label='data', s=100)
    plt.tick_params(axis='both', which='major', labelsize=14)
    plt.xlabel('y_test', fontsize=14)
    plt.ylabel('y_pred', fontsize=14)
    plt.xlim(-5.0, 0)
    plt.ylim(-5.0, 0)
    plt.savefig(os.path.join(save_path, "y_test_vs_y_pred.png"))

    # save the y_test and y_pred
    with open(os.path.join(save_path, "y_test_vs_y_pred.csv"), 'w') as f:
        f.write("y_test,y_pred\n")
        for y_test, y_pred in zip(y_batch_test, predictions):
            data = ",".join([str(y_test), str(y_pred)])
            f.write(f"{data}\n")

    # plot the shap value
    explainer = shap.GradientExplainer(model, x_train)
    model.train()
    shap_value = explainer.shap_values(x_test)
    plt.figure()
    shap.summary_plot(shap_value, x_test.cpu(), plot_type="dot",
                      show=False, feature_names=feature_names, )
    plt.savefig(os.path.join(save_path, "shap_value_dot.png"))

    plt.figure()
    shap.summary_plot(shap_value, x_test.cpu(), plot_type="bar",
                      show=False, feature_names=feature_names)
    plt.savefig(os.path.join(save_path, "shap_value_bar.png"))


def make_training_save_path(base_path):
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    print(os.getcwd())
    listdir = os.listdir(base_path)
    num = [int(dir.split('run')[-1]) for dir in listdir if "run" in dir]
    if len(num) == 0:
        return os.path.join(base_path, "run0")
    else:
        return os.path.join(base_path, "run" + str(max(num) + 1))


def make_training_save_path_muitiuser(base_path, isquery=False):
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    listdir = os.listdir(base_path)
    num = [int(dir.split('run')[-1]) for dir in listdir if "run" in dir]
    if len(num) == 0:
        return os.path.join(base_path, "run0")
    else:
        if isquery:
            return os.path.join(base_path, "run" + str(max(num)))
        else:
            return os.path.join(base_path, "run" + str(max(num) + 1))


def save_global_config(save_path, args) -> str:
    with open(os.path.join(save_path, "global_config.yaml"), 'w') as f:
        yaml.dump(args, f)
        f.close()


def run_server(global_save_path):
    # std_out_path = os.path.join(PROJECT_PATH, "out_err", "server_stdout.txt")
    # std_err_path = os.path.join(PROJECT_PATH, "out_err", "server_stderr.txt")
    # server_stdout = open(std_out_path, "w")
    # server_stderr = open(std_err_path, "w")

    subprocess.run(
        [PYTHON_PATH, os.path.join(PROJECT_PATH, "server.py"), global_save_path],
        # stdout=server_stdout,
        # stderr=server_stderr
    )

    # server_stdout.close()
    # server_stderr.close()


def run_worker(global_save_path, worker_id):
    std_out_path = os.path.join(
        PROJECT_PATH, "out_err", f"worker_{worker_id}_stdout.txt"
    )
    std_err_path = os.path.join(
        PROJECT_PATH, "out_err", f"worker_{worker_id}_stderr.txt"
    )
    worker_stdout = open(std_out_path, "w")
    worker_stderr = open(std_err_path, "w")
    subprocess.run(
        [PYTHON_PATH, os.path.join(PROJECT_PATH, "worker.py"), global_save_path, str(worker_id)],
        stdout=worker_stdout,
        stderr=worker_stderr
    )

    worker_stdout.close()
    worker_stderr.close()


def run_worker_multiuser(global_save_path, worker_id):
    # std_out_path = os.path.join(
    #     PROJECT_PATH, "out_err", f"worker_{worker_id}_stdout.txt"
    # )
    # std_err_path = os.path.join(
    #     PROJECT_PATH, "out_err", f"worker_{worker_id}_stderr.txt"
    # )
    # worker_stdout = open(std_out_path, "w")
    # worker_stderr = open(std_err_path, "w")
    subprocess.run(
        [PYTHON_PATH, os.path.join(PROJECT_PATH, "worker.py"), global_save_path, worker_id],
        # stdout=worker_stdout,
        # stderr=worker_stderr
    )

    # worker_stdout.close()
    # worker_stderr.close()


def getcsv_mongo(title):
    client = MongoClient('mongodb://localhost:27017/')
    db = client['MGE']
    collection = db['data']
    url = None
    datas = collection.find({'title': title})
    for data in datas:
        url = data.get('content').get('url')
    from djangoProject import settings
    df = pandas.read_csv(str(settings.BASE_DIR) + url)
    return df
