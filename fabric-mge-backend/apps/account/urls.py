from django.urls import path
from django.views.generic import TemplateView

from apps.account.user import *

urlpatterns = [
    path('users/', users),  # get获取用户列表、post增加用户
    path(r'users/<str:username>/role/', edit_role, name='edit_role'),  # 管理员修改用户权限
    path(r'users/<str:username>/status/', toggle_enable, name='toggle_enable'),  # 管理员启用/禁用用户
    path('register/', registerAPI),  # 注册
    path('login/', loginAPI),  # 登录、注销
    path('info/',userInfoAPI)
]
