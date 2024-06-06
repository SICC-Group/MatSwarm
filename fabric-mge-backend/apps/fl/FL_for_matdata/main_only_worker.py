import os
import time
import shutil
import argparse
from multiprocessing import Process


from config import PROJECT_PATH
from utils import (
    make_training_save_path, save_global_config, run_server, run_worker
)

args = argparse.ArgumentParser()
args.add_argument("--workers", type=int, default=1, help="Number of workers")
args.add_argument("--id", type=int, default=0, help="worker id")
args.add_argument(
    "--model", type=str, default="MLP", choices=["MLP", "Lasso"], 
    help="Model to use, Lasso is not performed well"
)
args.add_argument(
    "--optimizer", type=str, choices=["adam", "sgd"], default="adam",
    help="Type of optimizer to use (adam or sgd)."
)
args.add_argument("--seed", type=int, default=0)
args.add_argument("--lr", type=float, default=0.002)
args.add_argument("--global_epochs", type=int, default=100)
args.add_argument("--batch_size", type=int, default=128)

args.add_argument(
    "--train_data_path", type=str,
    default=f"{PROJECT_PATH}/data/train_part",
)
args.add_argument(
    "--test_data_path", type=str,
    default=f"{PROJECT_PATH}/data/test_dataset.csv",
)
args.add_argument(
    "--username", type=str,
    default="root",
)

args.add_argument(
    "--dataset_title", type=str,
    default="钙钛矿数据集-org1.csv",
)

args.add_argument(
    "--global_save_path", type=str,
    default="10",
)

if __name__ == '__main__':
    args = args.parse_args()
    # create the save path
    res_path = os.path.join(PROJECT_PATH, f"results/{args.username}")
    if not os.path.exists(res_path):
        os.makedirs(res_path)
    # global_save_path = make_training_save_path(res_path)
    global_save_path = args.global_save_path
    if not os.path.exists(global_save_path):
        os.makedirs(global_save_path)
    
    out_err_path = os.path.join(PROJECT_PATH, "out_err")
    if os.path.exists(out_err_path):
        shutil.rmtree(out_err_path)
    os.makedirs(out_err_path)
    
    save_global_config(global_save_path, vars(args))

    try:
        worker = Process(target=run_worker,
                            args=(global_save_path, args.id,))
        worker.start()
        time.sleep(0.1)
        
        chief = Process(target=run_server, args=(global_save_path,))
        chief.start()
        chief.join()

        worker.join()
        
        shutil.move(out_err_path, global_save_path)
    except KeyboardInterrupt as error:
        print("=== {0:>8} is aborted by keyboard interrupt".format('Main'))