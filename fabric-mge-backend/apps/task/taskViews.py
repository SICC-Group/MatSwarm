import json
from django.http import HttpResponse, JsonResponse
from mongoengine import Q

from apps.account.auth import require_role, login_required_api
from apps.account.models import UserRole
from apps.task.models import Task
from apps.storage.loggger import logger


# @login_required_api
# def get_all_template(request):
#     logger(request, 'GetAllTemplate')
#     res_ = Template.objects()
#     res = []
#     for item in res_:
#         res.append({
#             "id": item.id,
#             "title": item.title
#         })
#     return JsonResponse({
#         "code": 0,
#         "data": {
#             "templates": res,
#             "total": len(res)
#         }
#     })


def ObjectToJson(res_):
    return {
        "ID": str(res_.task_id),
        "Name": res_.name,
        "Description": res_.description,
        "DatasetMeta": res_.dataset_meta,
        "MLMethod": res_.ml_method,
        "AggregationMethod": res_.aggregation_method,
        "UseTEE": res_.use_tee,
        "InitiateOrg": res_.initiate_org,
        "InvitedOrgs": res_.invited_orgs,
        "AcceptedOrgs": res_.accepted_orgs,
        "TaskStatus": res_.task_status,
        "test_dataset":res_.test_dataset,
        "orgs_datasets":res_.orgs_datasets
    }


def getTask(request, task_id):
    logger(request, 'GetTemplate')
    res_ = Task.objects(task_id=task_id)[0]
    res = ObjectToJson(res_)
    return JsonResponse(res)


def getInitiateTasks(request, orgName):
    logger(request, 'GetTasks')
    res_ = Task.objects.filter(Q(initiate_org=orgName))
    res = []
    for item in res_:
        res.append({
            "task_id": item.task_id,
            "name": item.name,
            "description": item.description,
            "task_status": item.task_status
        })
    return JsonResponse({
        "code": 0,
        "data": {
            "tasks": res,
            "total": len(res)
        }
    })


def getinvitedTasks(request, orgName):
    logger(request, 'GetTasks')
    res_ = Task.objects.filter(Q(invited_orgs__contains=orgName))
    res = []
    for item in res_:
        res.append({
            "task_id": item.task_id,
            "name": item.name,
            "description": item.description,
            "task_status": item.task_status
        })
    return JsonResponse({
        "code": 0,
        "data": {
            "tasks": res,
            "total": len(res)
        }
    })


@require_role(UserRole.RESEARCHER)
def createTask(request):
    logger(request, 'SaveTask')
    data = json.loads(request.body.decode().replace("'", "\""))
    task = Task.objects.filter(task_id=data.get('id')).first()
    print(data)
    if task:
        print(task.task_id)
        task.accepted_orgs = data.get('acceptedOrgs')
        task.task_status = data.get('taskStatus')
        task.orgs_datasets = data.get('orgs_datasets')
        task.test_dataset = data.get('test_dataset')
    else:
        task = Task(
            task_id=data.get('id'),
            name=data.get('name'),
            description=data.get('description'),
            dataset_meta=data.get('datasetMeta'),
            test_dataset=data.get('test_dataset'),
            ml_method=data.get('mlMethod'),
            aggregation_method=data.get('aggregationMethod'),
            use_tee=data.get('useTEE'),
            initiate_org=data.get('initiateOrg'),
            invited_orgs=data.get('invitedOrgs'),
            accepted_orgs=data.get('acceptedOrgs'),
            orgs_datasets=data.get('orgs_datasets'),
            task_status=data.get('taskStatus')
        )
    task.save()
    return JsonResponse({
        "code": 0,
        "data": task.task_id
    })
