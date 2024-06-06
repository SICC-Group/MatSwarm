import mongoengine
import datetime
from apps.storage.models.Template import Template
from apps.account.models import Account
from apps.storage.models.Project import Project, Subject
from apps.storage.models.Category import Category


class Test(mongoengine.Document):
    id = mongoengine.SequenceField(primary_key=True)
    title = mongoengine.StringField()
    # category = mongoengine.ReferenceField(Category)  # category_id
    name = mongoengine.StringField()
    password = mongoengine.StringField()
    methods = mongoengine.StringField()