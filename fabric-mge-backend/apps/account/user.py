import json

from mongoengine.queryset.visitor import Q
from django.http import HttpRequest

from .auth import require_role, login_required_api
from .models import User, UserRole, AccountAction

from djangoProject.errors.models import FabricError
from djangoProject.utils.general import require_methods_api, json_response, get_json_field_r, get_field, \
    load_request_body, get_param


@require_methods_api(["POST"])
def registerAPI(request):
    username = get_json_field_r(request, 'username', str)
    password = get_json_field_r(request, 'password', str)
    realname = get_json_field_r(request, 'realname', str)
    email = get_json_field_r(request, 'email', str)
    role = get_json_field_r(request, 'role', int)

    if User.objects.filter(Q(username=username) | Q(email=email)).first():
        raise FabricError.USER_ALREADY_EXISTS
    else:
        user = User.create_user(username=username, password=password, realname=realname, email=email, role=role)
        return json_response({'user': user.username, 'email': user.email})


@require_methods_api(["POST", "DELETE"])
def loginAPI(request: HttpRequest):
    """
    POST: 登录
        username: 用户名
        password: 密码
    DELETE: 注销
    """
    if request.method == "POST":
        username_or_email = get_json_field_r(request, 'user', str)
        password = get_json_field_r(request, 'password', str)

        # if 'HTTP_X_FORWARDED_FOR' in request.META.keys():
        #     ip = request.META['HTTP_X_FORWARDED_FOR']
        # else:
        #     ip = request.META['REMOTE_ADDR']

        user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
        if user:
            if user.check_password(password):
                if not request.user.is_authenticated:
                    if not user.enabled:
                        raise FabricError.USER_DISABLED
                    request.user = user
                    # LoginHistory.objects.create(user=user, ip=get_remote_ip())
                return json_response(
                    {'user': user.username, 'email': user.email, 'token': user.generate_token(AccountAction.LOGIN)})
            else:
                raise FabricError.WRONG_PASSWORD
        else:
            raise FabricError.USER_NOT_FOUND
    else:
        ret_data = {}
        if request.user.is_authenticated:
            ret_data['username'] = request.user.username
            ret_data['email'] = request.user.email
        request.user = None
        return json_response(ret_data)


@require_methods_api(['GET', 'POST'])
@require_role(UserRole.ROOT)
def users(request: HttpRequest):
    if request.method == 'GET':
        return get_user_list(request)
    if request.method == 'POST':
        return add_user(request)


@login_required_api
@require_methods_api(['GET', 'PATCH'])
def userInfoAPI(request: HttpRequest):
    if request.method == 'GET':
        user = request.user
        ret = user.to_dict()
        return json_response(ret)
    if request.method == 'PATCH':
        data = load_request_body(request)
        username = request.user.username
        password = get_field(data, 'password', str, allow_none=True)
        realname = get_field(data, 'realname', str, allow_none=True)
        # email = get_field(data, 'email')
        # role = get_field(data, 'role', int)
        user = User.objects.filter(Q(username=username)).first()
        if user:
            User.password = password
            user.realname = realname
            user.save()
            return json_response({'username': username, 'others': '其他信息'})
        else:
            raise FabricError.USER_NOT_FOUND


@require_methods_api(['PATCH'])
@require_role(UserRole.ROOT)
def edit_role(request: HttpRequest, username: str):
    data = load_request_body(request)
    role = get_field(data, 'role', int)
    user = User.objects.filter(Q(username=username)).first()
    if user:
        user.role = role
        user.save()
        return json_response({'role': role, 'username': username})
    else:
        raise FabricError.USER_NOT_FOUND


@require_methods_api(['PATCH'])
@require_role(UserRole.ROOT)
def toggle_enable(request: HttpRequest, username: str):
    data = load_request_body(request)
    enabled = get_field(data, 'enabled', bool)
    user = User.objects.filter(Q(username=username)).first()
    if user:
        user.enabled = enabled
        user.save()
        return json_response({'enabled': enabled, 'username': username})
    else:
        raise FabricError.USER_NOT_FOUND


def add_user(request: HttpRequest):
    data = load_request_body(request)
    username = get_field(data, 'username', str)
    password = get_field(data, 'password', str)
    realname = get_field(data, 'realname', str)
    email = get_field(data, 'email')
    # institution = get_field(data, 'institution')
    role = get_field(data, 'role', int)
    if role == UserRole.ROOT:
        raise FabricError.PERMISSION_DENIED
    elif User.objects.filter(Q(username=username) | Q(email=email)).first():
        raise FabricError.USER_ALREADY_EXISTS
    else:
        user = User.create_user(username=username, password=password, realname=realname, email=email, role=role)
    # user.set_password(password)
    return json_response()


def get_user_list(request: HttpRequest):
    # page = get_param('page', allow_none=True, convert_to=int, default=1)
    # page_size = get_param('page_size', allow_none=True, convert_to=int)
    # page_size = page_size or 10
    email = get_param('email', allow_none=True, convert_to=str)
    real_name = get_param('realname', allow_none=True, convert_to=str)
    # institution = get_param('institution', allow_none=True, convert_to=str)
    q = Q()
    q &= Q(role__ne=UserRole.ROOT)
    if email:
        q &= Q(email=email)
    if real_name:
        q &= Q(real_name=real_name)
    # if institution:
    #     q &= Q(institution__icontains=institution)

    _queryset = User.objects.filter(q).order_by('username')

    # paginator = Paginator(_queryset, page_size)
    # try:
    #     _queryset: list[User] = paginator.page(page)
    # except (PageNotAnInteger, EmptyPage):
    #     _queryset: list[User] = paginator.page(1)
    #     page = 1
    # return json_response({
    #     'page': page,
    #     'page_size': page_size,
    #     'items': [ins.to_dict() for ins in _queryset],
    #     'num_items': paginator.count
    # })
    return json_response({
        'items': [ins.to_dict() for ins in _queryset]
    })
