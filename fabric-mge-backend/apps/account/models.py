from enum import IntEnum

from django.contrib.auth.models import AbstractUser
import mongoengine
import re

# Create your models here.
from djangoProject.errors.models import FabricError


class Account(mongoengine.Document):
    name = mongoengine.StringField()


class AccountAction(IntEnum):
    """
    账户操作枚举，用于token验证
    """
    LOGIN = 0
    VERIFY_EMAIL = 1
    RESET_PASSWORD = 2
    DELETE = 3


class UserRole(IntEnum):
    """
    高级权限包括所有低级权限
    """

    # ROOT = 1
    # VERIFIED = 2
    # TEMPLATE_UPLOADER = 4
    # DATA_UPLOADER = 10

    GUEST = 0  # 访客，只可查看公开数据
    RESEARCHER = 1  # 科研人员，可创建模板、上传数据，但是公开数据必须经过管理员审核，只能修改自己的模板和数据
    ROOT = 2  # 管理员，可以修改任何模板和数据，可以修改领域分类、管理用户

    @property
    def description(self):
        return {
            UserRole.ROOT: '管理员',
            UserRole.RESEARCHER: '科研人员',
            UserRole.GUEST: '游客'
        }[self]


mongoengine.connect('MGE', host='localhost:27017', alias='default')  # connect mongo


class User(mongoengine.Document):
    username = mongoengine.StringField(primary_key=True, max_length=100)
    realname = mongoengine.StringField(max_length=255, db_index=True)
    password = mongoengine.StringField(max_length=128)
    email = mongoengine.EmailField(unique=True, db_index=True)
    email_verified = mongoengine.BooleanField(default=True)
    institution = mongoengine.StringField(blank=True, db_index=True)
    role = mongoengine.IntField(default=UserRole.GUEST.value)  # 假设 UserRole 是一个枚举类型
    tel = mongoengine.StringField(max_length=15, blank=True)
    enabled = mongoengine.BooleanField(default=True)
    last_online = mongoengine.DateTimeField(null=True, blank=True)
    is_active = True  # 这个字段是一个布尔类型，但在 MongoEngine 中使用的是 `DynamicDocument` 或者 `Document`，没有类似的 `is_active` 这样的字段
    first_name = None  # 这两个字段可以直接省略，因为 MongoEngine 不需要显式定义
    last_name = None
    is_authenticated = True

    @classmethod
    def create_user(cls, username, password, realname, email, role):
        user = cls(username=username, password=password, realname=realname, email=email, role=role)
        user.clean()
        user.save()
        return user

    def clean(self):
        # 在保存之前验证用户名和电子邮件格式
        if not self.is_valid_username(self.username):
            raise FabricError.BAD_USERNAME
        if not self.is_valid_email(self.email):
            raise FabricError.BAD_EMAIL

    @staticmethod
    def is_valid_username(username):
        return re.match(r'^[\w.@+-]+$', username) is not None

    @staticmethod
    def is_valid_email(email):
        return re.match(r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$', email) is not None

    def check_password(self, raw_password):
        return self.password == raw_password

    def has_role(self, role: UserRole):
        return self.role >= role

    def generate_token(self, account_action):
        """
        生成操作token
        :param account_action: 账户操作类型，AccountAction枚举类型
        :return: token
        """
        from djangoProject.utils.general import generate_token
        d = {'username': self.username, 'action': account_action}
        if account_action == AccountAction.RESET_PASSWORD:
            d['salt'] = hash(str(self.last_online) + self.password)
        elif account_action == AccountAction.VERIFY_EMAIL:
            d['email'] = self.email
        return generate_token(d)

    def verify_token(self, token, account_action):
        """
        验证操作token，token中记录的用户名和用户本身一致，
        并且操作类型也和请求一致时才认为token有效。
        :param token: token
        :param account_action: token中本应包含的操作类型
        :return: token是否有效
        """
        from djangoProject.utils.general import decode_token
        d = decode_token(token)
        if d is None:
            return None
        if d['username'] == self.username and d['action'] == account_action:
            changed = False
            if account_action == AccountAction.VERIFY_EMAIL:
                if self.email_verified or d.get('email', None) != self.email:
                    return None
                self.email_verified = True
                changed = True
            if account_action == AccountAction.RESET_PASSWORD:
                if d.get('salt', None) != hash(str(self.last_online) + self.password):
                    return None
            if changed:
                self.save()
            return d
        else:
            return None

    def to_dict(self, fields=None):
        if not fields:
            fields = ['username', 'institution', 'email', 'email_verified',
                      'realname', 'tel', 'enabled', 'role']
        d = self._to_dict_with_fields(*fields)

        return d

    def _to_dict_with_fields(self, *args):
        d = {}
        for arg in args:
            d[arg] = getattr(self, arg)
        return d


# class User(AbstractUser):
#     # REQUIRED_FIELDS = ['email', 'tel', 'real_name']
#     username = models.CharField('用户名', validators=[UnicodeUsernameValidator()],
#                                 max_length=100, primary_key=True)
#     realname = models.CharField('真实姓名', max_length=255, db_index=True)
#     password = models.CharField('password', max_length=128)
#     email = models.EmailField('Email address', unique=True, db_index=True)
#     email_verified = models.BooleanField("Email verified", default=True)
#     institution = models.TextField('Institution', blank=True, db_index=True)
#     role = models.IntegerField(default=UserRole.GUEST.value)
#     tel = models.CharField(max_length=15, blank=True, null=True)
#     enabled = models.BooleanField(default=True)
#     last_online = models.DateTimeField(null=True, blank=True)
#     is_active = True
#     first_name = None
#     last_name = None
# 
#     def has_role(self, role: UserRole):
#         return self.role >= role
# 
#     def full_clean(self, exclude=None, validate_unique=True):
#         """
#         包装django的full_clean，验证email和username的有效性，
#         如果无效，转换成对应的Exception
#         :param exclude:
#         :param validate_unique:
#         :return:
#         """
#         try:
#             super().full_clean(exclude=exclude, validate_unique=validate_unique)
#         except ValidationError as e:
#             if 'email' in e.message_dict:
#                 raise FabricError.BAD_EMAIL
#             elif 'username' in e.message_dict:
#                 raise FabricError.BAD_USERNAME
#             else:
#                 raise
# 
#     def save(self, *args, **kwargs):
#         self.full_clean()
#         super().save(*args, **kwargs)
# 
#     def to_dict(self, fields=None):
#         if not fields:
#             fields = ['username', 'institution', 'email', 'email_verified',
#                       'real_name', 'tel', 'enabled', 'role', 'date_joined']
#         d = self._to_dict_with_fields(*fields)
# 
#         return d
# 
#     def _to_dict_with_fields(self, *args):
#         d = {}
#         for arg in args:
#             d[arg] = getattr(self, arg)
#         return d
