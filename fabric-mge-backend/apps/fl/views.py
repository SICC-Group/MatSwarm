import argparse
import json
import os
import subprocess
import sys

from django.http import HttpResponse, JsonResponse

from apps.account.auth import login_required_api
from apps.fl.FL_for_matdata.config import PROJECT_PATH, PYTHON_PATH
from apps.fl.FL_for_matdata.utils import make_training_save_path, make_training_save_path_muitiuser
from apps.task.models import Task


@login_required_api
def startTrain_singleuser(request, dataset_title):
    user = request.user
    res_path = os.path.join(PROJECT_PATH, f"results/{user.username}")
    global_save_path = make_training_save_path(res_path)
    p = subprocess.Popen([PYTHON_PATH,
                          os.path.join(PROJECT_PATH, "main_only_worker.py"), f"--username={user.username}",
                          f"--dataset_title={dataset_title}", f"--global_save_path={global_save_path}"],
                         stdout=sys.stdout,
                         stderr=sys.stdin)
    output, error = p.communicate()
    res = {
        "loss_pic": global_save_path.join("loss.png"),
        "shap_value_bar_pic": global_save_path.join("shap_value_bar.png"),
        "shap_value_dot_pic": global_save_path.join("shap_value_dot.png"),
        "y_test_vs_y_pred_pic": global_save_path.join("y_test_vs_y_pred.png"),

    }
    return HttpResponse(f"Output: {output}\nError: {error}")


@login_required_api
def startTrain_multiuser(request, task_id):
    task = Task.objects.filter(task_id=task_id)[0]
    res_path = os.path.join(PROJECT_PATH, f"results/{task.task_id}")
    global_save_path = make_training_save_path_muitiuser(base_path=res_path, isquery=False)
    # global_save_path = res_path
    print(global_save_path)
    if not os.path.exists(global_save_path):
        os.makedirs(global_save_path)
    accepted_orgs = json.dumps(list(task.accepted_orgs))
    org_dataset_map = json.dumps(task.orgs_datasets)
    # p = subprocess.Popen([PYTHON_PATH,
    #                       os.path.join(PROJECT_PATH, "main_fl.py"), f"--taskID={task_id}",
    #                       f"--accepted_orgs={accepted_orgs}", f"--org_dataset_map={org_dataset_map}",
    #                       f"--workers={len(task.accepted_orgs)}",
    #                       f"--global_save_path={global_save_path}", f"--test_dataset={task.test_dataset}"
    #                       ,f"--model={task.ml_method}",f"--aggregation={task.aggregation_method}"],
    #                      stdout=sys.stdout,
    #                      stderr=sys.stdin)
    with subprocess.Popen([PYTHON_PATH,
                           os.path.join(PROJECT_PATH, "main_fl.py"), f"--taskID={task_id}",
                           f"--accepted_orgs={accepted_orgs}", f"--org_dataset_map={org_dataset_map}",
                           f"--workers={len(task.accepted_orgs)}",
                           f"--global_save_path={global_save_path}", f"--test_dataset={task.test_dataset}"
                              , f"--model={task.ml_method}", f"--aggregation={task.aggregation_method}"],
                          stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, text=True) as proc:
        output, error = proc.communicate()
        print(output)
        print(error)
        proc.kill()
    task.task_status = 2
    task.save()
    with open(os.path.join(global_save_path + "/last_loss.txt"), 'r') as file:
        lines = file.readlines()
    last_loss = json.dumps(eval(lines[1].strip()))
    res = {
        "metrics": last_loss,
        "shap_value_bar_pic": global_save_path + "/shap_value_bar.png",
        "shap_value_dot_pic": global_save_path + "/shap_value_dot.png",
        "y_test_vs_y_pred_pic": global_save_path + "/y_test_vs_y_pred.png",
    }
    return JsonResponse(res)


@login_required_api
def get_single_result(request, task_id, username):
    task = Task.objects.filter(task_id=task_id)[0]
    if task.task_status < 2:
        return JsonResponse({"message": "任务未完成"})
    else:
        res_path = os.path.join(PROJECT_PATH, f"results/{task.task_id}")
        print(make_training_save_path_muitiuser(base_path=res_path, isquery=True))
        global_save_path = make_training_save_path_muitiuser(base_path=res_path, isquery=True) + f"/{username}/"
        print(global_save_path)
        with open(os.path.join(global_save_path + "avg_loss.txt"), 'r') as file:
            lines = file.readlines()
        avg_loss = json.dumps(eval(lines[1].strip()))
        res = {
            "metrics": avg_loss,
            "loss_pic": global_save_path + "loss.png",
            "shap_value_bar_pic": global_save_path + "shap_value_bar.png",
            "shap_value_dot_pic": global_save_path + "shap_value_dot.png",
            "y_test_vs_y_pred_pic": global_save_path + "y_test_vs_y_pred.png",
        }
        return JsonResponse(res)


@login_required_api
def get_multi_result(request, task_id):
    task = Task.objects.filter(task_id=task_id)[0]
    if task.task_status < 2:
        return JsonResponse({"message": "任务未完成"})
    else:
        res_path = os.path.join(PROJECT_PATH, f"results/{task.task_id}")
        print(make_training_save_path_muitiuser(base_path=res_path, isquery=True))
        global_save_path = make_training_save_path_muitiuser(base_path=res_path, isquery=True)
        print(global_save_path)
        with open(os.path.join(global_save_path + "/last_loss.txt"), 'r') as file:
            lines = file.readlines()
        last_loss = json.dumps(eval(lines[1].strip()))
        res = {
            "metrics": last_loss,
            "shap_value_bar_pic": global_save_path + "/shap_value_bar.png",
            "shap_value_dot_pic": global_save_path + "/shap_value_dot.png",
            "y_test_vs_y_pred_pic": global_save_path + "/y_test_vs_y_pred.png",
        }
        return JsonResponse(res)
