from functools import wraps
from typing import Union

from django.http import HttpRequest
from django.utils.translation import gettext as _

from djangoProject.errors.models import FabricError
from .models import UserRole, User


def ensure_privacy(request: HttpRequest, user: Union[str, User], is_api=True, error_detail=None):
    """
    使用此函数检测user是否为当前登录的用户，保证只能由user指定的用户访问，如果不是user，中断请求返回错误信息
    :param user: 可以为用户的username，也可以为一个User对象
    :return: None
    """
    if isinstance(user, str):
        username = user
    elif isinstance(user, User):
        username = user.username
    else:
        username = None
    if username != request.user.username:
        raise FabricError.PERMISSION_DENIED(error_detail)


def is_the_same_user(request: HttpRequest, user: Union[str, User]):
    if isinstance(user, str):
        username = user
    elif isinstance(user, User):
        username = user.username
    else:
        raise ValueError('user应该为User类型对象或用户名字符串')
    return username == request.user.username


def check_login(request: HttpRequest, is_api=True):
    if not request.user.is_authenticated:
        raise FabricError.UNAUTHORIZED
    if not request.user.enabled:
        raise FabricError.USER_DISABLED


def login_required_api(func):
    @wraps(func)
    def real_func(request: HttpRequest, *args, **kwargs):
        check_login(request, True)
        return func(request, *args, **kwargs)

    return real_func


def has_role(user, role: UserRole):
    return getattr(user, 'role', UserRole.GUEST) >= role


def require_role(required_roles: UserRole, is_api=True):
    def inner(func):
        @wraps(func)
        def real_func(request: HttpRequest, *args, **kwargs):
            check_login(request, is_api)
            if request.user.role >= required_roles:
                return func(request, *args, **kwargs)
            else:
                raise FabricError.PERMISSION_DENIED(_('权限不足，需要"%s"权限') % required_roles.description)

        return real_func

    return inner

#
# def require_role_for_rfw(required_roles: UserRole, is_api=True):
#     '''
#     为restframework视图方法提供权限验证
#     '''
#
#     def inner(func):
#         @wraps(func)
#         def real_func(viewset, request: HttpRequest, *args, **kwargs):
#             if request.user.role >= required_roles:
#                 return func(viewset, request, *args, **kwargs)
#             else:
#                 raise FabricError.PERMISSION_DENIED
#
#         return real_func
#
#     return inner


def check_role(request, required_role: UserRole) -> None:
    """
    检测用户是否有某种（某几种）角色，若没有抛出异常，终止响应
    例如：
    :param request: HttpRequest对象
    :param required_role: 要求用户所具有的角色
    :return: 无
    """
    if not request.user.is_authenticated or not request.user.has_role(required_role):
        raise FabricError.PERMISSION_DENIED
