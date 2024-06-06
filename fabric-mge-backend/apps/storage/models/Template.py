from django.db import models
import mongoengine
from apps.account.models import Account, User
from apps.storage.models.Category import Category
import datetime


# Create your models here.


class Template(mongoengine.Document):
    id = mongoengine.SequenceField(primary_key=True)
    title = mongoengine.StringField(unique=True, max_length=255)
    # category = mongoengine.ReferenceField(Category)  # category_id
    category = mongoengine.StringField()  # 9 category_name
    # categoryId = mongoengine.ReferenceField(Category) # category_id
    categoryId = mongoengine.IntField(default=1)
    # abstract = mongoengine.StringField()
    abstract_ = mongoengine.StringField()
    pubDate = mongoengine.DateField(default=datetime.datetime.now())
    published = mongoengine.BooleanField(default=True)
    # content = mongoengine.DictField()
    content = mongoengine.StringField()
    reviewState = mongoengine.IntField(default=0)  # 0: 待审核   1: 审核通过 2: 审核不通过
    reviewer = ''
    author = mongoengine.ReferenceField(User)
    # author = mongoengine.StringField()
    refCount = mongoengine.IntField()
    method = mongoengine.IntField()
