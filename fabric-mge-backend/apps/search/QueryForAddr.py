from apps.search.models.Query import QueryForAddr
from django.http import JsonResponse
import json
from apps.storage.loggger import logger
from apps.storage.init import mpt
from apps.storage.utils import MptStrToArray


def search_for_addr(text):
    data_origin = mpt.get(text.encode('utf-8'))
    data = MptStrToArray(data_origin.data)
    return data


def searchAPI(request):
    logger(request, 'QueryForAddr')
    data = json.loads(request.body.decode().replace("'", "\""))
    q = data.get('q')
    text = q.get('text')
    addr_list = search_for_addr(text)
    query = QueryForAddr(
        value={'text': text},
        data=addr_list,
    )
    query.save()
    return JsonResponse({
        'id': str(query.id),
        'data': addr_list
    })


def searchAPITemplate(request, q_id):
    logger(request, 'QueryForAddr')
    query = QueryForAddr.objects(id=int(q_id))[0]
    return JsonResponse({
        'id': str(query.id),
        'data': query.data  # addr_list
    })

