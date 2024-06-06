import mongoengine


class Query(mongoengine.Document):
    id = mongoengine.SequenceField(primary_key=True)
    data = mongoengine.ListField()
    value = mongoengine.DynamicField()  # 查询的字段
    summary = mongoengine.DynamicField()
    total = mongoengine.IntField()


class QueryForAddr(mongoengine.Document):
    id = mongoengine.SequenceField(primary_key=True)
    value = mongoengine.DynamicField()  # 查询的字段
    data = mongoengine.ListField()  # addr list
