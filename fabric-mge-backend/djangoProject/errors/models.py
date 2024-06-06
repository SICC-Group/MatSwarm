from django.utils.translation import gettext_lazy as _


class FabricException(Exception):
    """
    异常类，必须指定产生的异常的FabricError枚举值
    """
    _code_set = set()

    def __new__(cls, *args, **kwargs):
        return super().__new__(cls, *args, **kwargs)

    def __init__(self, msg: str = '', code: int = 500, status_code: int = 422, data=None):
        self._msg = str(msg)  # gettext_lazy
        self._code = code
        self._status_code = status_code
        self._error_detail = None
        self._secret_detail = None
        self._data = data or {}

    @property
    def msg(self):
        return self._msg

    @property
    def code(self):
        return self._code

    @property
    def error_detail(self):
        return self._error_detail

    @property
    def secret_detail(self):
        return self.secret_detail

    @property
    def status_code(self):
        return self._status_code

    @property
    def data(self):
        return self.data

    def to_dict(self):
        d = {'code': self._code, 'msg': self._msg, 'data': self._data}
        if self._error_detail:
            d['error_detail'] = self._error_detail
        return d

    def __str__(self):
        msg = self._msg
        if self._error_detail:
            msg += f" ({self._error_detail})"
        if self._secret_detail:
            msg += f'\n{self._secret_detail}'
        return msg

    def __call__(self, error_detail=None, secret_detail=None, data=None):
        self._error_detail = error_detail
        self._secret_detail = secret_detail
        if data:
            self._data = data
        return self

    def __eq__(self, other: 'FabricException'):
        if not isinstance(other, FabricException):
            return False
        return self._code == other._code

    @property
    def full_string(self):
        msg = f"FabricException: {self._msg} "
        if self._error_detail:
            msg += f" ({self._error_detail})"
        if self._secret_detail:
            msg += f'\n{self._secret_detail}'
        return msg


class _FabricErrorMetaClass(type):
    _error_code_dict = {}
    _enum_members = set()

    def __new__(mcs, cls_name, bases, class_dict):
        for member, value in class_dict.items():
            if isinstance(value, FabricException):
                if value.code in _FabricErrorMetaClass._error_code_dict:
                    raise ValueError(
                        f"错误码{value.code}已经存在({_FabricErrorMetaClass._error_code_dict[value.code][0]})")
                _FabricErrorMetaClass._error_code_dict[value.code] = member, value
                _FabricErrorMetaClass._enum_members.add(member)
        return super().__new__(mcs, cls_name, bases, class_dict)

    def __getattribute__(self, item):
        super_item = super().__getattribute__(item)
        if item in _FabricErrorMetaClass._enum_members:
            return FabricException(msg=super_item.msg, code=super_item.code, status_code=super_item.status_code)
        return super_item

    def __setattr__(self, key, value):
        raise ValueError("Cannot set attributes to FabricError")

    def __getitem__(self, item: int) -> FabricException:
        super_item = self._error_code_dict[item][1]
        return FabricException(msg=super_item.msg, code=super_item.code, status_code=super_item.status_code)


e = FabricException


class FabricError(metaclass=_FabricErrorMetaClass):
    """
    错误枚举
    三元组，错误信息，错误码，HTTP状态码，其中HTTP状态码可以省略，默认为422
    """
    SUCCESS = e(_("Success"), 0, 422)
    UNKNOWN_ERROR = e(_("Internal server error"), 500, 500)
    BAD_REQUEST = e(_("Bad request"), 400, 422)
    PERMISSION_DENIED = e(_("Permission denied"), 403, 403)
    METHOD_NOT_ALLOWED = e(_("Method not allowed"), 405, 405)
    UNAUTHORIZED = e(_("Unauthorized"), 401, 401)
    USER_DISABLED = e(_("User disabled"), 402, 403)
    NOT_FOUND = e(_("Not found"), 404, 404)
    BAD_TOKEN = e(_("Invalid token"), 2002, 401)
    USER_NOT_FOUND = e(_("User not found"), 2003, 404)
    WRONG_PASSWORD = e(_("Wrong password"), 2004, 401)
    USER_ALREADY_EXISTS = e(_("Username already exists."), 2005, 403)
    EMAIL_ALREADY_EXISTS = e(_("Email address already exists"), 2006, 422)
    BAD_EMAIL = e(_("Invalid email address"), 2007, 422)
    EMAIL_NOT_VERIFIED = e(_("Email address not verified"), 2008, 403)
    EMAIL_ALREADY_VERIFIED = e(_("Email address already verified"), 2009, 422)
    BAD_USERNAME = e(_("Invalid username"), 2010, 422)
    WRONG_CAPTCHA = e(_("Wrong captcha"), 2011, 422)
    BAD_TEMPLATE = e(_("Bad template"), 2101, 422)
    BAD_DATA = e(_("Bad data"), 2102, 422)
    BAD_JSON = e(_("Bad JSON"), 2103, 422)
    BAD_XML = e(_("Bad XML"), 2104, 422)
    BAD_PARAMETER = e(_("Bad URL parameter"), 2105, 422)
    BAD_EXCEL = e(_("Bad Excel"), 2106, 422)
    BAD_ARCHIVE = e(_("Bad archive file"), 2107, 422)
    NO_VALID_FILE = e(_("找不到任何xlsx，json或xml文件"), 2108, 422)
    UPLOADED_FILE_NOT_FOUND = e(_("Cannot find uploaded file"), 2109, 422)
    EXCEED_MAX_VALIDATE_FILE_SIZE = e(_("The validate file is too large, please split the original validate file"),
                                      2110, 422)
    TOO_MANY_DATA = e(_("数据量过大"), 2111, 422)
    ONE_TEMPLATE_ONLY = e(_("每次只能导入一个模板的数据"), 2112, 422)
    FIELD_MISSING = e(_("Field missing"), 2200, 422)
    WRONG_FIELD_TYPE = e(_("Wrong field type"), 2201, 422)
    NOT_ACCEPTABLE = e(_("Wrong content-type (JSON required)"), 2202, 406)
    NOT_UNIQUE = e(_("Field not unique"), 2203, 422)
    INVALID_FIELD_VALUE = e(_("Invalid field value"), 2204, 422)
    TEMPLATE_REFERENCED = e('模板下存在数据，无法删除', 2300, )
    NO_AVAILABLE_DATA = e(_("No available data."), 2301, 422)
    INTERNAL_DATA_ERROR = e(_("Data corrupted"), 2302, 500)
    TEMPLATE_CORRUPTED = e(_("Template corrupted"), 2303, 422)
    UNSUPPORTED_FIELDS_FILTERING = e(_("Cannot filter fields"), 2304, 422)
    UNSUPPORTED_TEMPLATE_EDITING = e(_("Cannot edit template."), 2305, 422)
    INVALID_TEMPLATE_IDENTIFIER = e(_("Invalid template identifier."), 2306, 422)
    BAD_QUERY_SYNTAX = e(_("Bad query syntax"), 3001, 422)
    UNKNOWN_META_FIELD = e(_("Unknown meta field"), 3002, 422)
    UNKNOWN_TEMPLATE_FIELD = e(_("Unknown template field"), 3003, 422)
    INVALID_QUERY = e(_("Invalid query"), 2400, 422)
    TASK_IS_STILL_RUNNING = e(_("Task is still running"), 4001, 422)
    TASK_FILE_EXPIRED = e(_("The File(s) that the task needs expired. Please re-submit the task"), 4002, 422)
    TASK_ABORTED = e(_("Task aborted"), 4003, 422)
    INVALID_CERTIFICATE = e(_("Invalid Certificate"), 4100, 422)
    CERTIFICATE_ALREADY_UP_TO_DATE = e(_("Certificate is already up-to-date"), 4101, 422)
    PROJECT_OR_SUBJECT_NOT_FOUND = e(_("Project or subject not found"), 4104, 404)
    TEMPLATE_SCORE_FAILED = e(_("Not yet finished scoring all templates"), 4105, 422)
    PROJECT_ID_FORMAT_WRONG = e(_("Project id format wrong"), 4106, 422)
    TEMPLATE_INCONSISTENT = e(_("不能修改模板的已有字段"), 5001, 422)

    EMAIL_SENDING_FAILED = e(_("Email sent failed"), 6001, 422)
    THIRD_PARTY_COMMUNICATION_FAILED = e(_("Failed to connect to third party."), 6002, 500)
    THIRD_PARTY_REQUEST_FAILED = e(_("Failed to request to third party."), 6003, 500)
    OPEN_API_PERMISSION_DENIED = e(_("Open API Permission denied"), 6004, 403)
    OPEN_API_INVALID_REQUEST = e(_("Open API Invalid request"), 6005, 403)
    RESOURCE_NOT_FOUND = e(_("Resource not found"), 6006, 403)
    ALREADY_EXISTS = e(_("已存在"), 6010, 422)
    TOO_MANY_FILE_CANDIDATES = e(
        _('压缩包根目录只允许一个数据文件（xlsx，json或xml，三者只能有一个）。如果xlsx/json/xml本身作为附件，请将其放入单独的文件夹中，并在数据文件中填写其路径。例如"附件文件夹/data.json"'),
        6011, 422)
    DELETE_FORBIDDEN = e(_("无法删除"), 7000, 422)
    CATEGORY_CONFLICT = e(_("修改冲突"), 7001, 422)
    MALFORMED_CATEGORY_TREE = e(_("无效的领域分类层级"), 7002, 422)
    INVALID_EXCEL_CELL_VALUE = e(_("Excel填写错误"), 7003, 422)
    CANNOT_DELETE_USER = e(_("无法删除用户"), 7004, 422)
    WEAK_PASSWORD = e(_("密码强度不足"), 7005, 422)
