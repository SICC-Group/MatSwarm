import mongoengine


class Task(mongoengine.Document):
    task_id = mongoengine.StringField(primary_key=True)
    name = mongoengine.StringField()
    description = mongoengine.StringField()
    dataset_meta = mongoengine.StringField()
    test_dataset = mongoengine.StringField()
    ml_method = mongoengine.StringField()
    aggregation_method = mongoengine.StringField()
    use_tee = mongoengine.BooleanField(default=False)
    initiate_org = mongoengine.StringField()
    invited_orgs = mongoengine.ListField(mongoengine.StringField())
    accepted_orgs = mongoengine.ListField(mongoengine.StringField())
    orgs_datasets = mongoengine.DictField()
    task_status = mongoengine.IntField()


class TaskExecute(mongoengine.Document):
    task_id = mongoengine.StringField(primary_key=True)
    name = mongoengine.StringField()
    task_status = mongoengine.IntField()
