import json
import demjson
from apps.storage.templateViews import ObjectToJson


def DataToJson(data):
    temp = data.template
    res = {
        "id": str(data.id),
        "title": data.title,
        "category": data.category,
        "category_id": data.category,
        "source": data.source,
        "methods": data.methods,
        "tid": temp.id,
        "keywords": data.keywords,
        "doi": data.doi,
        "score": data.score,
        "downloads": data.downloads,
        "views": data.views,
        "abstract": data.abstract_,
        "purpose": data.purpose,
        "author": data.author,
        "add_time": str(data.addTime),
        "reference": data.reference,
        "project": data.project,
        "subject": data.subject,
        "contributor": data.contributor,
        "institution": "",
        "reviewer": data.reviewer,
        "reviewer_ins": data.reviewerIns,
        "approved": data.approved,
        "external_link": data.externalLink,
        "public_date": str(data.publicDate),
        "public_range": data.publicRange,
        "platform_belong": data.platformBelong,
        "content": data.content,
        "template": TemplateToJson(temp),
        "review_state": data.reviewState,
        "disapprove_reason": None,
        "version": 0,
        "uploader_institution": '北京科技大学',
        "project_name": data.project,
        "subject_name": data.subject,
        "dataset_ref_count": data.dataSetRefCount
    }
    return res


def TemplateToJson(res_):
    res = {
        "id": res_.id,
        "title": res_.title,
        "category": res_.category,
        "category_id": res_.category,
        "author": res_.author,
        "abstract": res_.abstract_,
        "ref_count": res_.refCount,
        "pub_date": str(res_.pubDate),
        "username": res_.author,
        "published": res_.published,
        "content": res_.content
    }
    return res


def MptStrToArray(mpt_str):
    data = mpt_str.decode('utf-8')
    data = data.replace("null","None")
    data = data.replace("true", "True")
    data = data.replace("false", "False")
    res = data.split('/div/')
    res_ = []
    for item in res:
        print(item)
        res_.append(eval(item))
    # print("")
    # print(res_)
    return res_


