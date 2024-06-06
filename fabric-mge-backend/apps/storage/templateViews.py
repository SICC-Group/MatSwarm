import json
from django.http import HttpResponse, JsonResponse

from apps.account.auth import require_role, login_required_api
from apps.account.models import UserRole
from apps.storage.models.Template import Template
from apps.storage.loggger import logger


@login_required_api
def get_all_template(request):
    logger(request, 'GetAllTemplate')
    res_ = Template.objects()
    res = []
    for item in res_:
        res.append({
            "id": item.id,
            "title": item.title
        })
    return JsonResponse({
        "code": 0,
        "data": {
            "templates": res,
            "total": len(res)
        }
    })


def ObjectToJson(res_):
    return {
        "id": str(res_.id),
        "title": res_.title,
        "category": res_.category,
        "category_id": res_.categoryId,
        "author": res_.author.username,
        "abstract": res_.abstract_,
        "ref_count": res_.refCount,
        "pub_date": str(res_.pubDate),
        "username": res_.author.username,
        "published": res_.published,
        "content": res_.content
    }


def get_template(request, template_id):
    logger(request, 'GetTemplate')
    res_ = Template.objects(id=template_id)[0]
    if isinstance(res_.content, str):
        res_.content = json.loads(res_.content)
    res = ObjectToJson(res_)
    return JsonResponse({
        "code": 0,
        "data": res
    })


@require_role(UserRole.RESEARCHER)
def create_template(request):
    logger(request, 'SaveMgeTemplate')
    data = json.loads(request.body.decode().replace("'", "\""))
    temp = Template(
        title=data.get('title'),
        category=data.get('category'),
        categoryId=data.get('categoryId'),
        abstract_=data.get('abstract'),
        published=data.get('published'),
        method=data.get('method'),
        author=request.user,
        # content=json.dumps(json.loads(data.get('content')))
        content=json.dumps(data.get('content'))
    )

    temp.save()
    return JsonResponse({
        "code": 0,
        "data": temp.id
    })
