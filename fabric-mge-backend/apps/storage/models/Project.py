import mongoengine


class Project(mongoengine.Document):
    project_name = mongoengine.StringField()
    project_id = mongoengine.StringField()


class Subject(mongoengine.Document):
    subject_name = mongoengine.StringField()
    subject_id = mongoengine.StringField()
