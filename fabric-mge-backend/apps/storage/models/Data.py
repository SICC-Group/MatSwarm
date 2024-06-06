import mongoengine
import datetime

from apps.account.models import User
from apps.storage.models.Template import Template

mongoengine.connect('MGE', host='localhost:27017', alias='default')  # connect mongo


class Data(mongoengine.Document):
    id = mongoengine.SequenceField(primary_key=True)
    title = mongoengine.StringField(unique=True, max_length=255)
    # category = mongoengine.ReferenceField(Category)  # category_id
    category = mongoengine.IntField()  # category_id
    template = mongoengine.ReferenceField(Template)  # t_id
    keywords = mongoengine.ListField(mongoengine.StringField())
    methods = mongoengine.ListField(mongoengine.StringField())
    abstract_ = mongoengine.StringField(null=False)
    author = mongoengine.ReferenceField(User)
    # author = mongoengine.StringField()
    addTime = mongoengine.DateField(default=datetime.datetime.now())
    # project = mongoengine.ReferenceField(Project)  # project_name
    project = mongoengine.StringField()  # project_name
    # subject = mongoengine.ReferenceField(Subject)  # subject_name
    subject = mongoengine.StringField()  # subject_name
    approved = mongoengine.BooleanField(default=False)
    publicRange = mongoengine.StringField(default="public")
    contributor = mongoengine.StringField(default="")
    reference = mongoengine.StringField(default="")
    reviewer = mongoengine.StringField(default="")
    reviewerIns = mongoengine.StringField(default="")
    publicDate = mongoengine.DateField(default=datetime.datetime.now())
    platformBelong = mongoengine.StringField(default="离散数据汇交平台")
    reviewState = mongoengine.IntField(default=0)
    uploaderInstitution = mongoengine.StringField()
    doi = mongoengine.StringField()
    purpose = mongoengine.StringField()
    source = mongoengine.StringField()
    dataSetRefCount = mongoengine.IntField(default=0)
    content = mongoengine.DynamicField()
    score = mongoengine.IntField(default=0)
    downloads = mongoengine.IntField(default=0)
    views = mongoengine.IntField(default=0)
    externalLink = mongoengine.ListField(mongoengine.StringField())
    isDone = mongoengine.BooleanField(default=False)


