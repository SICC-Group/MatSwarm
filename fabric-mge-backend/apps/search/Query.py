from apps.search.models.Query import Query
from django.http import JsonResponse
import json
from apps.storage.loggger import logger
from apps.storage.init import mpt
from apps.storage.utils import MptStrToArray


def Summary(categories, data, q_id):
    for category in categories:
        if data['category'] == category['name']:
            if category['templates'] is not None:
                for temp in category['templates']:
                    if temp['name'] == data['template']['title']:
                        category['count_at_least'] = category['count_at_least'] + 1
                        temp['count_at_least'] = temp['count_at_least'] + 1
                        return categories
                category['templates'].append({  # 此模板没有出现过
                    'count_at_least': 1,
                    'id': data['template']['id'],
                    'name': data['template']['title'],
                    'download': False,
                    'url': '/api/v2/search/query/' + str(q_id) + '/' + str(data['template']['id'])
                })
                return categories
    categories.append({  # 此category没有出现过
        'count_at_least': 1,
        'id': data['category'],
        'name': data['category'],
        'templates': [
            {
                'count_at_least': 1,
                'id': data['template']['id'],
                'name': data['template']['title'],
                'download': False,
                'url': '/api/v2/search/query/' + str(q_id) + '/' + str(data['template']['id'])
            }
        ]
    })
    return categories


def search(text, q_id):
    data_origin = mpt.get(text.encode('utf-8'))
    data = MptStrToArray(data_origin.data)
    data_ = []
    summary = {
        'category': [],
        'keywords': [],
        'realname': []
    }
    for item in data:
        data_.append({
            'download': item['downloads'],
            'score': item['score'],
            'data': {
                'abstract': item['abstract'],
                'add_time': item['add_time'],
                'category': item['category'],
                'category_name': item['category'],
                'downloads': item['downloads'],
                'external_link': None,
                'id': item['id'],
                'methods': item['methods'],
                'project': item['project'],
                'realname': item['author'],
                'score': item['score'],
                'source': item['source'],
                'subject': item['subject'],
                'template': item['template']['id'],
                'template_name': item['template']['title'],
                'title': item['title'],
                'user': item['author'],
                'views': item['views']
            }
        })
        categories = summary['category']
        summary['category'] = Summary(categories, item, q_id)

    return data_, summary


def searchAPI(request):  # 不带page的search
    logger(request, 'Query')
    data = json.loads(request.body.decode().replace("'", "\""))
    q = data.get('q')
    text = q.get('text')
    query = Query(
        value={'text': text},
    )
    res, summary = search(text, query.id)
    query.data = res
    query.summary = summary
    query.total = len(res)
    query.save()
    return JsonResponse({
        'id': query.id,
        'q': {
            'data': query.data,
            'summary': query.summary,
            'total': query.total,
            'value': query.value,
            'page': 1,
            'page_size': 20
        },
        'username': None
    })


def searchAPITemplate(request, q_id, t_id):
    logger(request, 'Query')
    query = Query.objects(id=q_id)[0]
    data = query.data
    res = []
    for item_ in data:
        item = item_['data']
        if item['template'] == t_id:
            res.append({
                'data': {
                    'abstract': item['abstract'],
                    'add_time': item['add_time'],
                    'category': item['category'],
                    'category_name': item['category_name'],
                    'downloads': item['downloads'],
                    'external_link': None,
                    'id': item['id'],
                    'methods': item['methods'],
                    'project': item['project'],
                    'realname': item['realname'],
                    'score': item['score'],
                    'source': item['source'],
                    'subject': item['subject'],
                    'template': item['template'],
                    'template_name': item['template_name'],
                    'title': item['title'],
                    'user': item['realname'],
                    'views': item['views']
                },
                'download': 0,
                'score': 0
            })
    return JsonResponse({
        'data': res,
        'total': len(res),
        'page': 1,
        'pageSize': 20,
    })


def searchAPIPage(request, q_id):
    logger(request, 'Query')
    query = Query.objects(id=int(q_id))[0]
    return JsonResponse({
        'id': query.id,
        'q': {
            'data': query.data,
            'summary': query.summary,
            'total': query.total,
            'value': query.value,
            'page': 1,
            'page_size': 20
        },
        'username': None
    })
