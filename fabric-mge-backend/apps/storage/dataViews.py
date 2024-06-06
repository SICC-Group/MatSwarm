import csv
import io
import os
import uuid

import pandas
from django.core.files.storage import FileSystemStorage
from pymongo import MongoClient

from apps.storage.models.Data import Data
from apps.storage.models.Template import Template
from django.http import HttpResponse, JsonResponse

from djangoProject.utils.general import json_response
from .templateViews import ObjectToJson
from .utils import DataToJson
import datetime
from apps.storage.loggger import logger
from apps.storage.init import mpt
from apps.storage.sign.sign import CreateSHA
from textrank4zh import TextRank4Keyword
import base64
import json
import time
from apps.account.auth import require_role, login_required_api
from ..account.models import UserRole


def findDataById(request, data_id):
    logger(request, 'FindDataById')
    res_ = Data.objects(id=data_id)[0]
    temp = res_.template
    res = {
        "id": data_id,
        "title": res_.title,
        "category": res_.category,
        "category_id": res_.category,
        "source": res_.source,
        "methods": res_.methods,
        "tid": temp.id,
        "keywords": res_.keywords,
        "doi": res_.doi,
        "score": res_.score,
        "downloads": res_.downloads,
        "views": res_.views,
        "abstract": res_.abstract_,
        "purpose": res_.purpose,
        "author": res_.author.username,
        "add_time": str(res_.addTime),
        "reference": res_.reference,
        "project": res_.project,
        "subject": res_.subject,
        "contributor": res_.contributor,
        "institution": "",
        "reviewer": res_.reviewer,
        "reviewer_ins": res_.reviewerIns,
        "approved": res_.approved,
        "external_link": res_.externalLink,
        "public_date": str(res_.publicDate),
        "public_range": res_.publicRange,
        "platform_belong": res_.platformBelong,
        "content": res_.content,
        "template": ObjectToJson(temp),
        "review_state": res_.reviewState,
        "disapprove_reason": None,
        "version": 0,
        "uploader_institution": '北京科技大学',
        "project_name": res_.project,
        "subject_name": res_.subject,
        "dataset_ref_count": res_.dataSetRefCount,
        "is_done": res_.isDone,
    }
    temp = CreateSHA('test')
    base64_bytes = base64.b64encode(temp[0])
    str_s = base64_bytes.decode('utf-8')
    msg = {
        "code": 0,
        "data": res,
        "publicKeyUrl": temp[1],
        "sign": str_s,
        "signText": 'test',
    }
    return HttpResponse(json.dumps(msg), content_type='application/json')
    # return JsonResponse({
    #     "code": 0,
    #     "data": res,
    # })


def findDataByUser(request, username):
    datas = Data.objects(author=request.user)
    res = []
    for data in datas:
        res.append({
            "id": data.id,
            "title": data.title
        })

    return JsonResponse({
        "code": 0,
        "data": {
            "datas": res,
            "total": len(res)
        }
    })


def datasets_CSV(request):
    if request.method == 'POST' and request.FILES['file']:
        csv_file = request.FILES['file'].read().decode('utf-8')  # 以字节模式读取文件，并解码为字符串
        csv_data = io.StringIO(csv_file)  # 将字符串转换为文本模式的文件对象
        client = MongoClient('mongodb://localhost:27017/')
        db = client['MGE']
        collection = db['csv_collection']
        # Read CSV file and insert into MongoDB with additional properties
        reader = csv.DictReader(csv_data)
        for row in reader:
            # Add additional properties
            row['author'] = request.user.username
            row['title'] = request.FILES['file'].name
            collection.insert_one(row)
        return JsonResponse({'status': 'success'})
    elif request.method == 'GET':
        client = MongoClient('mongodb://localhost:27017/')
        db = client['MGE']
        collection = db['csv_collection']
        # Get all titles from MongoDB
        titles = list(collection.find().distinct('title'))
        return JsonResponse({'titles': titles})
    else:
        return JsonResponse({'status': 'error', 'message': 'Unsupported method'}, status=400)


def datasets_CSV_user(request, username):
    client = MongoClient('mongodb://localhost:27017/')
    db = client['MGE']
    collection = db['csv_collection']
    # Get all titles from MongoDB
    titles = list(collection.find({'author': username}).distinct('title'))
    return JsonResponse({'titles': titles})


@login_required_api
def findCSVByTitle(request, title):
    logger(request, 'FindDataById')
    client = MongoClient('mongodb://localhost:27017/')
    db = client['MGE']
    collection = db['csv_collection']
    print(title)
    csv_data = list(collection.find({'title': title}))
    print(len(csv_data))
    csv_buffer = io.StringIO()
    excluded_columns = ['_id', 'id', 'title', 'author']
    # Write CSV data to the buffer
    writer = csv.DictWriter(csv_buffer, fieldnames=[col for col in csv_data[0].keys() if col not in excluded_columns],
                            lineterminator='\n')
    writer.writeheader()
    for data in csv_data:
        # Exclude specified columns from each row
        row = {key: value for key, value in data.items() if key not in excluded_columns}
        writer.writerow(row)
    # Return CSV file
    csv_buffer.seek(0)
    df = pandas.read_csv(csv_buffer).dropna(how='all')
    response = HttpResponse(csv_buffer.getvalue().encode('utf-8-sig'), content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(title)
    return response


def Public_Range(origin):
    if origin == 0:
        return "public"
    elif origin == 1:
        return "project"
    elif origin == 2:
        return "subject"
    else:
        return "self"


def Public_Date(origin):
    temp = datetime.datetime.now()
    if origin == 0:
        return temp
    elif origin == 1:
        return temp + datetime.timedelta(days=365)
    elif origin == 2:
        return temp + datetime.timedelta(days=365 * 2)
    else:
        return temp + datetime.timedelta(days=365 * 3)


def Methods(origin):
    res = []
    for index, method in enumerate(origin):
        if index == 0:
            if method == '1':
                res.append('computation')
        elif index == 1:
            if method == '1':
                res.append('experiment')
        elif index == 2:
            if method == '1':
                res.append('production')
        else:
            if method == '1':
                res.append('other')
    return res


def Source(origin):
    if origin == '10':
        return 'self-production'
    else:
        return 'reference'


@require_role(UserRole.RESEARCHER)
def createData(request):
    logger(request, 'SaveMgeData')
    data = json.loads(request.body.decode().replace("'", "\""))
    t1 = time.time()
    meta = data.get('meta')
    tem = data.get('content')
    content = tem
    if type(content) == 'str':
        content = json.loads(content)
    template_id = meta.get('tid')
    template = Template.objects(id=template_id)[0]
    temp = Data(
        title=meta.get('title'),
        abstract_=meta.get('abstract'),
        author=request.user,
        contributor=meta.get('contributor'),
        doi=meta.get('doi'),
        uploaderInstitution=meta.get('institution'),
        keywords=list(map(str, meta.get('keywords').split(','))),
        project=meta.get('other_info').get('project'),
        subject=meta.get('other_info').get('subject'),
        publicRange=Public_Range(meta.get('public_range')),
        publicDate=Public_Date(meta.get('public_date')),
        methods=Methods(meta.get('source').get('methods')),
        source=Source(meta.get('source').get('source')),
        reference=meta.get('source').get('reference'),
        template=template,
        content=content,
        category=template.category
    )
    signs = CreateSHA('test')
    base64_bytes = base64.b64encode(signs[0])
    str_s = base64_bytes.decode('utf-8')
    msg = {
        "code": 0,
        "data": str(temp.id),
        "publicKeyUrl": signs[1],
        "sign": str_s,
        "signText": 'test',
    }
    temp.isDone = True
    temp.save()
    return HttpResponse(json.dumps(msg), content_type='application/json')

    # return JsonResponse({
    #     "code": 0,
    #     "data": temp.id
    # })


class MGEError:
    pass


def uploaded_data_content_file(request):
    """
    post: 提交数据文件（数据文件格式需符合原来生成的模板）
        params: 数据放在 POST 部分
            file: 提交的数据文件
        return: 提交成功的文件的 id
    delete:
        params: none
        return: none
    """
    if request.method == 'POST':
        try:
            file_urls = list()
            fs = FileSystemStorage()
            for file in request.FILES.getlist('files[]'):
                basename, ext = os.path.splitext(file.name)
                file.name = f'{uuid.uuid4()}{ext}'
                fn = fs.save(file.name, file)
                file_urls.append(fs.url(fn))
            return json_response(file_urls)
        except ValueError as ex:
            raise MGEError.BAD_PARAMETER(str(ex))


def update_mpt(request):
    data_all = json.loads(request.body.decode().replace("'", "\""))

    tit = data_all.get('title')
    blockhash = data_all.get('blockhash')

    print(str(blockhash))
    # 通过tile从数据库中获取content进行分析
    tr4w = TextRank4Keyword()
    queryInfo = Data.objects(title=tit)[0]
    res_id = queryInfo.id
    # queryInfo.to_mongo().to_dict()
    item = str(queryInfo.content)
    # item = str(queryInfo.to_mongo().to_dict())
    tr4w.analyze(text=item, lower=True, window=2)
    for item_ in tr4w.get_keywords(40, word_min_len=1):
        print(item_)
        mpt_data = {
            "title": tit,
            "addr": blockhash
        }
        mpt.update_mge(item_.word.encode('utf-8'), json.dumps(mpt_data))

    return JsonResponse({
        "code": 0,
        "data": str(res_id)
    })


# for test format "id=xxx"
def update_mpt_test(request):
    data_all = json.loads(request.body.decode().replace("'", "\""))
    data_id = data_all.get('title')
    data_object = Data.objects(title=data_id)[0]
    data = DataToJson(data_object)
    mpt.update_mge(data_id.encode('utf-8'), json.dumps(data))
    return JsonResponse({
        "code": 0,
        "data": str(data_id)
    })


def findAllData(request):
    datas = Data.objects(author=request.user)
    res = []
    for data in datas:
        res.append({
            "id": data.id,
            "title": data.title
        })

    return JsonResponse({
        "code": 0,
        "data": {
            "datas": res,
            "total": len(res)
        }
    })
