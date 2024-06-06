import json
import os
import time
import shutil
from multiprocessing import Process


from config import *
from utils import (
    make_training_save_path, save_global_config, run_server, run_worker,run_worker_multiuser
)


if __name__ == '__main__':
    args = args.parse_args()
    # create the save path
    res_path = os.path.join(PROJECT_PATH, f"results/{args.taskID}")
    # if not os.path.exists(res_path):
    #     os.makedirs(res_path)
    # global_save_path = make_training_save_path(res_path)
    global_save_path = args.global_save_path

    
    out_err_path = os.path.join(res_path, "out_err")
    if os.path.exists(out_err_path):
        shutil.rmtree(out_err_path)
    os.makedirs(out_err_path)
    
    save_global_config(global_save_path, vars(args))

    try:
        workers = []
        accepted_orgs = json.loads(args.accepted_orgs)
        # for worker_id in range(args.workers):
        #     worker = Process(target=run_worker,
        #                      args=(global_save_path, worker_id,))
        #     workers.append(worker)
        #     worker.start()
        #     time.sleep(0.01)

        for worker_name in accepted_orgs:
            worker = Process(target=run_worker_multiuser,
                             args=(global_save_path, worker_name,))
            workers.append(worker)
            worker.start()
            time.sleep(1)
        
        time.sleep(10)
        # print(len(workers))
        chief = Process(target=run_server, args=(global_save_path,))
        chief.start()

        chief.join()

        for worker in workers:
            worker.join()
        
        shutil.move(out_err_path, global_save_path)
    except KeyboardInterrupt as error:
        print("=== {0:>8} is aborted by keyboard interrupt".format('Main'))