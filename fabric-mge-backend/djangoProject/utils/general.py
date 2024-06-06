import json
import os
import random
import shutil
import string
from datetime import datetime
from functools import wraps
from tempfile import mkdtemp as python_mkdtemp

from bson.objectid import ObjectId
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, HttpRequest
from django.utils import timezone
from django.utils.encoding import force_text
from django.utils.functional import Promise
from django.utils.translation import gettext as _
from itsdangerous import TimedJSONWebSignatureSerializer, BadSignature, SignatureExpired, BadTimeSignature

from apps.account.auth import *
from djangoProject.errors.models import FabricError
# from .middleware import GlobalRequestMiddleware
#
#
from djangoProject.utils.middleware import GlobalRequestMiddleware


def _get_type_name(class_type):
    if class_type == str:
        return 'string'
    if class_type == int:
        return 'integer'
    if class_type == float:
        return 'float'
    if class_type == bool:
        return 'boolean'
    if class_type == object:
        return 'object'
    if class_type == list:
        return 'array'

    return str(class_type)
#
#
class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, (Promise, ObjectId)):
            return force_text(obj)
        if isinstance(obj, datetime):
            try:
                obj = timezone.localtime(obj)
            except ValueError:
                pass
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        return super(LazyEncoder, self).default(obj)
#
#
def generate_token(data, expires_in=7 * 24 * 60 * 60):
    s = TimedJSONWebSignatureSerializer(secret_key=settings.SECRET_KEY, expires_in=expires_in)
    return s.dumps(data).decode()


def decode_token(token):
    s = TimedJSONWebSignatureSerializer(secret_key=settings.SECRET_KEY)
    try:
        return s.loads(token)
    except (BadTimeSignature, SignatureExpired, BadSignature):
        return None
#
#
def json_response(data=None, msg: str = '', status_code: int = 200, **kwargs) -> HttpResponse:
    """
    将字典数据转为JSON返回（正常返回数据，错误代码为0即成功）
    :param data: 需要返回的数据
    :param msg: 提示消息
    :param status_code: http 状态码，默认 200
    :param kwargs: 附加信息，直接嵌入JSON第一级
    :return: None
    """
    result = {'code': FabricError.SUCCESS.code,
              'data': data}
    if msg:
        result['msg'] = msg
    if kwargs:
        result['extra'] = kwargs
    return HttpResponse(json.dumps(result, ensure_ascii=False, cls=LazyEncoder),
                        content_type='application/json; charset=utf-8',
                        status=status_code)


def load_request_body(request=None, expected=dict):
    """
    获取用户请求中的原始JSON数据
    :return: JSON字典
    """
    try:
        if not request:
            request = GlobalRequestMiddleware.get_current_request()
        if request.content_type != 'application/json':
            raise FabricError.NOT_ACCEPTABLE('Content-Type must be application/json')
        json_data = json.loads(request.body)
        if not isinstance(json_data, expected):
            raise FabricError.NOT_ACCEPTABLE('expect %s but %s given' % (str(expected), str(type(json_data))))
        return json_data
    except Exception as ex:
        raise FabricError.NOT_ACCEPTABLE(str(ex))


def get_field(json_data, field, required_type=object, allow_none=False, allowed=None, force=False, default=None):
    value = json_data.get(field)
    if value is None and not allow_none:
        if not force:
            raise FabricError.FIELD_MISSING(_('field "%(field_name)s" is missing') % {'field_name': field})
    elif value is None and allow_none:
        return default
    elif isinstance(value, required_type):
        if allowed is not None and value not in allowed:
            if not force:
                raise FabricError.WRONG_FIELD_TYPE(
                    _('Value of field "%(field)s" should be one of [%(allowed_values)s].') % {
                        'field': field, 'allowed_values': ','.join(allowed)})
        return value
    else:
        raise FabricError.WRONG_FIELD_TYPE(_('Field "%(field)s" should be %(required_type)s.') % {
            'field': field, 'required_type': _get_type_name(required_type)})


def get_json_field_r(request: HttpRequest, field, required_type=object, allow_none=False, allowed=None, force=False,
                     default=None):
    """
    获取JSON中的字段值，若发生错误则终止响应
    :param field: JSON字段名
    :param required_type: 要求的数据类型
    :param allow_none: 是否可以为null或者为空白
    :param allowed: 若此项不为None则参数的值只能选取allowed（list）中的值
    :param force: 如果为True，则发生任何错误都返回None而不是中断响应
    :return: 字段的值
    """

    attr = 'mge_json_data'
    if hasattr(request, attr):
        json_data = getattr(request, attr)
    else:
        try:
            json_data = json.loads(request.body)
            setattr(request, attr, json_data)
        except Exception as e:
            if not force:
                raise FabricError.NOT_ACCEPTABLE(str(e))
            return default

    value = json_data.get(field)
    if required_type in (dict, list, str):
        if not value:
            value = None  # 空白值也认为是None
    if value is None and not allow_none:
        if not force:
            raise FabricError.FIELD_MISSING(_('field "%(field_name)s" is missing') % {'field_name': field})
    elif value is None and allow_none:
        return default
    elif isinstance(value, required_type):
        if allowed is not None and value not in allowed:
            if not force:
                allowed = [str(allow) for allow in allowed]
                raise FabricError.WRONG_FIELD_TYPE(
                    _('Value of field "%(field)s" should be one of [%(allowed_values)s].') % {
                        'field': field, 'allowed_values': ','.join(allowed)})
        return value
    else:
        raise FabricError.WRONG_FIELD_TYPE(_('Field "%(field)s" should be %(required_type)s.') % {
            'field': field, 'required_type': _get_type_name(required_type)})


def get_multipart_field(request: HttpRequest, field, required_type=str, allow_none=False, allowed_values=None,
                        default=None):
    """
    获取multipart/form-data中的字段值，若发生错误则终止响应
    :param request: HttpRequest
    :param field: JSON字段名
    :param required_type: 要求的数据类型
    :param allow_none: 是否可以为null或者为空白
    :param allowed_values: 可选值，如果不为空则value只能是此列表中指定的值，否则报错
    :param default: 默认值
    :return: 字段的值
    """
    assert required_type != dict, "不支持dict"
    if not request.content_type.startswith('multipart/form-data'):
        raise FabricError.NOT_ACCEPTABLE("Content-Type必须为multipart/form-data")
    if required_type == bytes:
        value = request.FILES.get(field)
    elif required_type == list:
        value = request.POST.getlist(field)
        if not value and not allow_none:
            value = None
    else:
        value = request.POST.get(field)
        if not value:
            value = None
    if value is None and not allow_none:
        raise FabricError.FIELD_MISSING(_('field "%(field_name)s" is missing') % {'field_name': field})
    elif value is None and allow_none:
        return default
    if required_type not in (str, bytes):
        try:
            value = required_type(value)
            if allowed_values is not None and value not in allowed_values:
                raise FabricError.WRONG_FIELD_TYPE(
                    _('Value of field "%(field)s" should be one of [%(allowed_values)s].') % {
                        'field': field, 'allowed_values': ','.join(allowed_values)})
        except (ValueError, TypeError):
            raise FabricError.WRONG_FIELD_TYPE(_('Field "%(field)s" should be %(required_type)s.') % {
                'field': field, 'required_type': _get_type_name(required_type)})
        return value
    return value


def get_param_value(field, value, allow_none=True, allowed=None, convert_to=None, force=False):
    def not_empty(raw_value):
        return raw_value and raw_value.strip()

    if convert_to:
        if allowed:
            allowed = [convert_to(x) for x in allowed]
        try:
            if value is not None:
                if convert_to is list:
                    value = list(filter(not_empty, value.split(',')))
                if convert_to is bool:
                    value = value == str('true')
                else:
                    value = convert_to(value)
        except Exception:
            if not force:
                raise FabricError.WRONG_FIELD_TYPE(_('Field "%(field)s" should be %(required_type)s.') % {
                    'field': field, 'required_type': _get_type_name(convert_to)})
            else:
                value = None
    if value is None and not allow_none:
        if not force:
            raise FabricError.FIELD_MISSING('Field "%s" is missing' % field)
        return None
    elif value is None and allow_none:
        return None
    elif allowed is not None and value not in allowed:
        if not force:
            raise FabricError.WRONG_FIELD_TYPE(_('Value of field "%(field)s" should be one of %(allowed_values)s.') % {
                'field': field, 'allowed_values': allowed})
        return None

    else:
        if isinstance(value, str):
            return value.strip()
        return value


def get_param(field, allow_none=True, allowed=None, convert_to=None, force=False, default=None):
    """
    获取HTTP的GET参数，若发生错误则终止响应
    :param convert_to: 转换类型
    :param default: 默认值
    :param field: 字段名
    :param allow_none: 是否可以为空
    :param allowed: 若此项不为None则参数的值只能选取allowed（list）中的值
    :param force: 如果为True，则发生任何错误都返回None而不是中断响应
    :return: 字段值

    """
    value = GlobalRequestMiddleware.get_current_request().GET.get(field, default)
    return get_param_value(field, value, allow_none, allowed, convert_to, force)
#
#
# def get_remote_ip():
#     """
#     返回发起请求的主机IP地址
#     :return: IP地址
#     """
#     request = GlobalRequestMiddleware.get_current_request()
#     if 'HTTP_X_FORWARDED_FOR' in request.META:
#         return request.META['HTTP_X_FORWARDED_FOR']
#     else:
#         return request.META['REMOTE_ADDR']


def require_methods_api(request_methods_list):
    def decorator(func):
        @wraps(func)
        def inner(request, *args, **kwargs):
            if request.method not in request_methods_list:
                raise FabricError.METHOD_NOT_ALLOWED('Method ' + request.method + ' is not allowed!')
            return func(request, *args, **kwargs)

        return inner

    return decorator


require_GET_api = require_methods_api(["GET"])
require_POST_api = require_methods_api(["POST"])
require_PATCH_api = require_methods_api(["PATCH"])
require_PUT_api = require_methods_api(["PUT"])
require_DELETE_api = require_methods_api(["DELETE"])




# def get_current_username(default='_system') -> str:
#     try:
#         request = GlobalRequestMiddleware.get_current_request()
#         cur_user = getattr(request, 'user')
#         if cur_user:
#             return cur_user.username
#     except BaseException:
#         pass
#     return default


def patch_resource(obj, fields: (tuple, list), data: dict, action_map: dict = dict):
    """
    更新资源
    :param obj: 待更新对象
    :param fields: 待检测字段
    :param data: 数据集 QueryDict
    :param action_map: 设置值的操作，默认为直接赋值，即： lambda o, f, v: setattr(o, f, v)
            如若设置，则应该为字段名对应一个设置函数，函数包含 o, f, d 三个参数，分别代表对象、字段名和值
    :return:
    """

    def action_default(o, f, v):
        setattr(o, f, v)

    changed_fields = list()
    # action_default = lambda o, f, d: setattr(o, f, d)
    for field in fields:
        if field in data:
            action = action_map.get(field, action_default)
            action(obj, field, data.get(field))
            changed_fields.append(field)
    return obj, changed_fields


def gen_secret_key(length=48):
    """生成隨機字符串，可選字符為大小寫英文字母及數字"""
    characters = string.ascii_letters + string.digits
    return ''.join([random.choice(characters) for _ in range(length)])


def build_full_url(url: str):
    """
    非常傻逼的获取完整 url 方式，等待聪神优化...
    :param url: 原 url
    :return: 拼接之后 url
    """
    site_addr = settings.SITE_ADDR
    site_base_url = settings.SITE_BASE_URL
    real_url = url.replace('\\', '/')

    if site_addr.endswith('/'):
        site_addr = site_addr[:-1]

    if not site_base_url.startswith('/'):
        site_base_url = '/' + site_base_url
    if site_base_url.endswith('/'):
        site_base_url = site_base_url[:-1]

    if not real_url.startswith('/'):
        real_url = '/' + real_url

    return site_addr + site_base_url + real_url


def mkdtemp():
    temp_dir = getattr(settings, 'TEMP_DIR')
    if temp_dir:
        os.makedirs(temp_dir, exist_ok=True)
        return os.path.join(temp_dir, python_mkdtemp())
    return python_mkdtemp()


def mge_make_archive(base_name, format, root_dir=None, base_dir=None, verbose=0,
                     dry_run=0, owner=None, group=None, logger=None):
    os.chdir(settings.BASE_DIR)
    shutil.make_archive(base_name, format, root_dir, base_dir, verbose,
                        dry_run, owner, group, logger)


def get_page_info(request: HttpRequest, page_size=10, max_page_size=500) -> (int, int):
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', page_size)
    try:
        page = int(page)
    except ValueError:
        page = 1
    try:
        page_size = int(page_size)
    except ValueError:
        page_size = page_size
    if page_size > max_page_size:
        page_size = max_page_size
    return page, page_size
