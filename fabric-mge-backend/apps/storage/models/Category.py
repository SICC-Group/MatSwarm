import mongoengine


class Category(mongoengine.Document):
    id = mongoengine.IntField(primary_key=True)
    name = mongoengine.StringField()
