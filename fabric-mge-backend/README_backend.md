部署，使用，。。。
主要是文档从零部署的依赖和工程主要架构，使用说明，

# 后端

## 环境安装
安装python3.9、MongoDB、Mosquitto

$ pip install install -r ./requirements.txt

## 配置更改
### 将出现localhost:27017的地方改为MongoDB的运行地址和端口

### 修改文件：fabric-mge-backend/apps/fl/FL_for_matdata/config.py:
- PYTHON_PATH改为安装的Python中python.exe的绝对地址
- 将MQTT_SERVER改为Mosquitto的运行地址

### 修改文件：fabric-mge-backend/djangoProject/settings.py:
- DEBUG修改为True
## 运行
python manage.py runserver 8001


## API
- 请求和响应数据以示例为准
---
title: fabric-mge-backend
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.23"

---

# fabric-mge-backend

Base URLs:

* <a href="http://dev-cn.your-api-server.com">开发环境: http://dev-cn.your-api-server.com</a>

# Authentication

# account

## POST 注册

POST /api/v1/account/register/

> Body 请求参数

```json
"{\r\n    \"username\":\"root\",\r\n    \"password\":\"root\",\r\n    \"realname\":\"root\",\r\n    \"email\":\"root@33.com\",\r\n    \"role\":2\r\n}\r\n\r\n// {\r\n//     \"username\":\"RESEARCHER\",\r\n//     \"password\":\"RESEARCHER\",\r\n//     \"realname\":\"RESEARCHER\",\r\n//     \"email\":\"RESEARCHER@164.com\",\r\n//     \"role\":1\r\n// }\r\n\r\n// {\r\n//     \"username\":\"GUEST\",\r\n//     \"password\":\"GUEST\",\r\n//     \"realname\":\"GUEST\",\r\n//     \"email\":\"GUEST@33.com\",\r\n//     \"role\":0\r\n// }\r\n\r\n"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|
|» realname|body|string| 是 |none|
|» email|body|string| 是 |none|
|» role|body|integer| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» role|0|
|» role|1|
|» role|2|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "user": "DGUEST",
    "email": "DGUEST@33.com"
  }
}
```

> 禁止访问

```json
{
  "code": 2005,
  "msg": "Username already exists.",
  "data": {}
}
```

> 参数错误

```json
{
  "code": 2007,
  "msg": "Invalid email address",
  "data": {}
}
```

```json
{
  "code": 2010,
  "msg": "Invalid username",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|禁止访问|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|参数错误|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» username|string|true|none||none|
|»» email|string|true|none||none|

状态码 **403**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **422**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## POST 登录

POST /api/v1/account/login/

> Body 请求参数

```json
{
  "user": "root",
  "password": "root"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» user|body|string| 是 |用户名或邮箱|
|» password|body|string| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "user": "dwdwd",
    "email": "dwd@33.com",
    "token": "eyJhbGciOiJIUzUxMiIsImlhdCI6MTcxMzI2MTI2MywiZXhwIjoxNzEzODY2MDYzfQ.eyJ1c2VybmFtZSI6ImR3ZHdkIiwiYWN0aW9uIjowfQ.ZXHN3yUVpx9aIOP_86k_jwtWaxCgHUTKs48dTohKg45ozebV5yUJARwtqOq9Rwh9d_CNYS-5983NONXyFrQJzg"
  }
}
```

> 没有权限

```json
{
  "code": 2004,
  "msg": "Wrong password",
  "data": {}
}
```

> 禁止访问

```json
{
  "code": 402,
  "msg": "User disabled",
  "data": {}
}
```

> 记录不存在

```json
{
  "code": 2003,
  "msg": "User not found",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|禁止访问|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» user|string|true|none||none|
|»» email|string|true|none||none|
|»» token|string|true|none||测试时鉴权用|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **403**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» msg|integer|true|none||none|
|» data|object|true|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## POST 管理员添加用户

POST /api/v1/account/users/

> Body 请求参数

```json
{
  "username": "dwdwd",
  "password": "dwdwd",
  "realname": "dwd",
  "email": "dwd@33.com",
  "role": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |登陆用户的token，需要有管理员权限|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|
|» realname|body|string| 是 |none|
|» email|body|string| 是 |none|
|» role|body|integer| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": null
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

> 禁止访问

```json
{
  "code": 2005,
  "msg": "Username already exists.",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|禁止访问|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **403**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## GET 管理员查看用户列表

GET /api/v1/account/users/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "username": "DGUEST",
        "institution": null,
        "email": "DGUEST@33.com",
        "email_verified": true,
        "realname": "DGUEST",
        "tel": null,
        "enabled": true,
        "role": 0
      },
      {
        "username": "GUEST",
        "institution": null,
        "email": "GUEST@33.com",
        "email_verified": true,
        "realname": "GUEST",
        "tel": null,
        "enabled": true,
        "role": 0
      },
      {
        "username": "RESEARCHER",
        "institution": null,
        "email": "RESEARCHER@164.com",
        "email_verified": true,
        "realname": "RESEARCHER",
        "tel": null,
        "enabled": true,
        "role": 1
      },
      {
        "username": "dwdwd",
        "institution": null,
        "email": "dwd@33.com",
        "email_verified": true,
        "realname": "rlnm",
        "tel": null,
        "enabled": false,
        "role": 1
      },
      {
        "username": "dwdwd2",
        "institution": null,
        "email": "dwd@323.com",
        "email_verified": true,
        "realname": "dwd",
        "tel": null,
        "enabled": true,
        "role": 1
      }
    ]
  }
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|
|»» item|[object]|true|none||none|
|»»» username|string|true|none||none|
|»»» institution|string|true|none||none|
|»»» email|string|true|none||none|
|»»» email_verified|boolean|true|none||none|
|»»» realname|string|true|none||none|
|»»» tel|string|true|none||none|
|»»» enabled|boolean|true|none||none|
|»»» role|integer|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## PATCH 管理员更改用户权限

PATCH /api/v1/account/users/{username}/role/

> Body 请求参数

```json
{
  "role": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» role|body|integer| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "role": 1,
    "username": "dwdwd"
  }
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

> 记录不存在

```json
{
  "code": 2003,
  "msg": "User not found",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» data|object|true|none||none|
|»» role|integer|true|none||none|
|»» username|string|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## PATCH 管理员更改用户状态

PATCH /api/v1/account/users/{username}/status/

> Body 请求参数

```json
{
  "enabled": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|body|body|object| 否 |none|
|» enabled|body|boolean| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "enabled": false,
    "username": "dwdwd"
  }
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

> 记录不存在

```json
{
  "code": 2003,
  "msg": "User not found",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» enabled|boolean|true|none||none|
|»» username|string|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## GET 用户查看个人信息

GET /api/v1/account/info/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "username": "dwdwd",
    "institution": null,
    "email": "dwd@33.com",
    "email_verified": true,
    "realname": "rlnm",
    "tel": null,
    "enabled": true,
    "role": 1
  }
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

> 禁止访问

```json
{
  "code": 402,
  "msg": "User disabled",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|禁止访问|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

状态码 **403**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

## PATCH 用户修改个人信息

PATCH /api/v1/account/info/

> Body 请求参数

```json
{
  "realname": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» realname|body|string| 是 |未定，用户将修改的字段|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "username": "dwdwd",
    "others": "其他信息"
  }
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|

# storage

## POST 创建模板

POST /api/v3/storage/templates/

> Body 请求参数

```json
{
  "id": 759,
  "real_name": "任俊",
  "method": 1,
  "method_id": 63,
  "data_count": 1664,
  "avg_score": -1,
  "title": "2016YFB0700702-数据33",
  "abstract": "钙钛矿单晶和薄膜的高通量制备和表征(2016YFB0700702)",
  "pub_date": "2021-01-19",
  "published": true,
  "review_state": 0,
  "content": {
    "_ord": [
      "样品名称",
      "预制层元素配比",
      "热处理条件",
      "薄膜元素配比",
      "化学式",
      "方阻值",
      "透过率"
    ],
    "化学式": {
      "r": false,
      "t": 1,
      "misc": {}
    },
    "方阻值": {
      "r": false,
      "t": 2,
      "misc": {
        "unit": "Ω"
      }
    },
    "透过率": {
      "r": false,
      "t": 5,
      "misc": {
        "multi": false
      }
    },
    "样品名称": {
      "r": false,
      "t": 1,
      "misc": {}
    },
    "热处理条件": {
      "r": false,
      "t": 9,
      "misc": {
        "_ord": [
          "温度",
          "时间",
          "气氛"
        ],
        "时间": {
          "r": false,
          "t": 2,
          "misc": {
            "unit": "min"
          }
        },
        "气氛": {
          "r": false,
          "t": 1,
          "misc": {}
        },
        "温度": {
          "r": false,
          "t": 2,
          "misc": {
            "unit": "℃"
          }
        }
      }
    },
    "薄膜元素配比": {
      "r": false,
      "t": 10,
      "misc": {
        "_opt": [
          "Ba-Bi-Sb-V",
          "Cs-Ag-Bi-Br"
        ],
        "Ba-Bi-Sb-V": {
          "r": false,
          "t": 9,
          "misc": {
            "V": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Ba": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Bi": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Sb": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "_ord": [
              "Ba",
              "Bi",
              "Sb",
              "V"
            ]
          }
        },
        "Cs-Ag-Bi-Br": {
          "r": false,
          "t": 9,
          "misc": {
            "Ag": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Bi": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Br": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Cs": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "_ord": [
              "Cs",
              "Ag",
              "Bi",
              "Br"
            ]
          }
        }
      }
    },
    "预制层元素配比": {
      "r": false,
      "t": 10,
      "misc": {
        "_opt": [
          "Ba-Bi-Sb-V",
          "Cs-Ag-Bi-Br"
        ],
        "Ba-Bi-Sb-V": {
          "r": false,
          "t": 9,
          "misc": {
            "V": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Ba": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Bi": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Sb": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "_ord": [
              "Ba",
              "Bi",
              "Sb",
              "V"
            ]
          }
        },
        "Cs-Ag-Bi-Br": {
          "r": false,
          "t": 9,
          "misc": {
            "Ag": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Bi": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Br": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "Cs": {
              "r": false,
              "t": 2,
              "misc": {
                "unit": "（at%）"
              }
            },
            "_ord": [
              "Cs",
              "Ag",
              "Bi",
              "Br"
            ]
          }
        }
      }
    }
  },
  "disapprove_reason": null,
  "constraints": {},
  "tag": 0,
  "category": "63",
  "user": "1115255202",
  "reviewer": null
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": 1
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|integer|true|none||none|

## POST 创建数据

POST /api/v1/storage/data/full/

> Body 请求参数

```json
{
  "meta": {
    "tid": 1,
    "title": "CsAgBiBr钙钛矿薄膜3377",
    "材料分类": "太阳能电池材料",
    "abstract": "成分 热处理工艺 方阻 透过率",
    "keywords": "成分, 热处理工艺, 方阻, 透过率",
    "contributor": "何绪林",
    "publicDate": "2020-07-23 16:04:23",
    "source": {
      "source": "MGE-SOURCE_HEADER v1 010 10 #",
      "methods": "method"
    },
    "审核人": "刘禹",
    "institution": "江南大学、中物院成科中心",
    "other_info": {
      "project": "2016YFB0700700",
      "subject": "2016YFB0700702"
    }
  },
  "content": {
    "样品名称": "2491116",
    "预制层元素配比": {},
    "热处理条件": {
      "温度": 200,
      "时间": 60,
      "气氛": "真空"
    },
    "薄膜元素配比": {
      "Cs-Ag-Bi-Br": {
        "Cs": 0.10676397562260176,
        "Ag": 0.0669324186520812,
        "Bi": 0.10508182601205858,
        "Br": 0.7086722562883244
      }
    },
    "化学式": "Cs1.07Ag0.67Bi1.05Br7.09",
    "方阻值": 218329040.2,
    "透过率": [
      "2022957test-248.20200722143320.xls"
    ]
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": "1",
  "publicKeyUrl": "-----BEGIN RSA PUBLIC KEY-----\r\nMIGJAoGBALQjzWRcA0tVU7vYvEuYm6w3ySO8TnwcSZ2wxOdjhuEr+G8WTu9l473y\r\nm5NewH+15HE6rp2iIF1wgjxF/pLFMwf8uf4n+1C//huspHJABzt7H7eJsDyR+Eb+\r\nVbdIGRWtdRQ00IFdK/qzhpvNRFe+7RPcwwn0ZIm8BgeSHiypxQ4PAgMBAAE=\r\n-----END RSA PUBLIC KEY-----\r\n",
  "sign": "Az3iVPbafJDiZuI2pNmSA0fmgOW7thjRx9VTB3JBxoEfoVGnXRFQJzvV7h8356WWU2m7xSADKuqys+oMA2s+99FNEirzXQrIdqyP59bucsqr1Kd1I2PQQwxr3rFsbDrZSXUBbx/0F3vNrNr/Y9YSnv8I2pCUapTAE9U3TntI7dY=",
  "signText": "test"
}
```

> 没有权限

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|没有权限|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|string|true|none||none|
|» publicKeyUrl|string|true|none||none|
|» sign|string|true|none||none|
|» signText|string|true|none||none|

## GET 获取模板

GET /api/v1/storage/template/{template_id}/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|template_id|path|string| 是 |none|
|Authorization|header|string| 否 |需要登录|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "id": "1",
    "title": "2016YFB0700702-数据33",
    "category": "63",
    "category_id": null,
    "author": "dwdwd",
    "abstract": "钙钛矿单晶和薄膜的高通量制备和表征(2016YFB0700702)",
    "ref_count": null,
    "pub_date": "2024-04-16",
    "username": "dwdwd",
    "published": true,
    "content": {
      "_ord": [
        "样品名称",
        "预制层元素配比",
        "热处理条件",
        "薄膜元素配比",
        "化学式",
        "方阻值",
        "透过率"
      ],
      "化学式": {
        "r": false,
        "t": 1,
        "misc": {}
      },
      "方阻值": {
        "r": false,
        "t": 2,
        "misc": {
          "unit": "Ω"
        }
      },
      "透过率": {
        "r": false,
        "t": 5,
        "misc": {
          "multi": false
        }
      },
      "样品名称": {
        "r": false,
        "t": 1,
        "misc": {}
      },
      "热处理条件": {
        "r": false,
        "t": 9,
        "misc": {
          "_ord": [
            "温度",
            "时间",
            "气氛"
          ],
          "时间": {
            "r": false,
            "t": 2,
            "misc": {
              "unit": "min"
            }
          },
          "气氛": {
            "r": false,
            "t": 1,
            "misc": {}
          },
          "温度": {
            "r": false,
            "t": 2,
            "misc": {
              "unit": "℃"
            }
          }
        }
      },
      "薄膜元素配比": {
        "r": false,
        "t": 10,
        "misc": {
          "_opt": [
            "Ba-Bi-Sb-V",
            "Cs-Ag-Bi-Br"
          ],
          "Ba-Bi-Sb-V": {
            "r": false,
            "t": 9,
            "misc": {
              "V": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Ba": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Bi": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Sb": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "_ord": [
                "Ba",
                "Bi",
                "Sb",
                "V"
              ]
            }
          },
          "Cs-Ag-Bi-Br": {
            "r": false,
            "t": 9,
            "misc": {
              "Ag": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Bi": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Br": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Cs": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "_ord": [
                "Cs",
                "Ag",
                "Bi",
                "Br"
              ]
            }
          }
        }
      },
      "预制层元素配比": {
        "r": false,
        "t": 10,
        "misc": {
          "_opt": [
            "Ba-Bi-Sb-V",
            "Cs-Ag-Bi-Br"
          ],
          "Ba-Bi-Sb-V": {
            "r": false,
            "t": 9,
            "misc": {
              "V": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Ba": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Bi": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Sb": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "_ord": [
                "Ba",
                "Bi",
                "Sb",
                "V"
              ]
            }
          },
          "Cs-Ag-Bi-Br": {
            "r": false,
            "t": 9,
            "misc": {
              "Ag": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Bi": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Br": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "Cs": {
                "r": false,
                "t": 2,
                "misc": {
                  "unit": "（at%）"
                }
              },
              "_ord": [
                "Cs",
                "Ag",
                "Bi",
                "Br"
              ]
            }
          }
        }
      }
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 获取原始数据

GET /api/v2/storage/data/{data_id}/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|data_id|path|string| 是 |none|
|Authorization|header|string| 否 |需要登录|

> 返回示例

> 成功

```json
"{\r\n    \"code\": 0,\r\n    \"data\": {\r\n        \"id\": 1,\r\n        \"title\": \"CsAgBiBr钙钛矿薄膜3377\",\r\n        \"category\": 63,\r\n        \"category_id\": 63,\r\n        \"source\": \"reference\",\r\n        \"methods\": [],\r\n        \"tid\": 1,\r\n        \"keywords\": [\r\n            \"成分\",\r\n            \" 热处理工艺\",\r\n            \" 方阻\",\r\n            \" 透过率\"\r\n        ],\r\n        \"doi\": null,\r\n        \"score\": 0,\r\n        \"downloads\": 0,\r\n        \"views\": 0,\r\n        \"abstract\": \"成分 热处理工艺 方阻 透过率\",\r\n        \"purpose\": null,\r\n        \"author\": \"dwdwd\",\r\n        \"add_time\": \"2024-04-16\",\r\n        \"reference\": \"\",\r\n        \"project\": \"2016YFB0700700\",\r\n        \"subject\": \"2016YFB0700702\",\r\n        \"contributor\": \"何绪林\",\r\n        \"institution\": \"\",\r\n        \"reviewer\": \"\",\r\n        \"reviewer_ins\": \"\",\r\n        \"approved\": false,\r\n        \"external_link\": [],\r\n        \"public_date\": \"2027-04-16\",\r\n        \"public_range\": \"self\",\r\n        \"platform_belong\": \"离散数据汇交平台\",\r\n        \"content\": {\r\n            \"样品名称\": \"2491116\",\r\n            \"预制层元素配比\": {},\r\n            \"热处理条件\": {\r\n                \"温度\": 200.0,\r\n                \"时间\": 60.0,\r\n                \"气氛\": \"真空\"\r\n            },\r\n            \"薄膜元素配比\": {\r\n                \"Cs-Ag-Bi-Br\": {\r\n                    \"Cs\": 0.10676397562260176,\r\n                    \"Ag\": 0.0669324186520812,\r\n                    \"Bi\": 0.10508182601205858,\r\n                    \"Br\": 0.7086722562883244\r\n                }\r\n            },\r\n            \"化学式\": \"Cs1.07Ag0.67Bi1.05Br7.09\",\r\n            \"方阻值\": 218329040.2,\r\n            \"透过率\": [\r\n                \"2022957test-248.20200722143320.xls\"\r\n            ]\r\n        },\r\n        \"template\": {\r\n            \"id\": \"1\",\r\n            \"title\": \"2016YFB0700702-数据33\",\r\n            \"category\": \"63\",\r\n            \"category_id\": null,\r\n            \"author\": \"dwdwd\",\r\n            \"abstract\": \"钙钛矿单晶和薄膜的高通量制备和表征(2016YFB0700702)\",\r\n            \"ref_count\": null,\r\n            \"pub_date\": \"2024-04-16\",\r\n            \"username\": \"dwdwd\",\r\n            \"published\": true,\r\n            \"content\": \"{\\\"_ord\\\": [\\\"\\样\\品\\名\\称\\\", \\\"\\预\\制\\层\\元\\素\\配\\比\\\", \\\"\\热\\处\\理\\条\\件\\\", \\\"\\薄\\膜\\元\\素\\配\\比\\\", \\\"\\化\\学\\式\\\", \\\"\\方\\阻\\值\\\", \\\"\\透\\过\\率\\\"], \\\"\\化\\学\\式\\\": {\\\"r\\\": false, \\\"t\\\": 1, \\\"misc\\\": {}}, \\\"\\方\\阻\\值\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\Ω\\\"}}, \\\"\\透\\过\\率\\\": {\\\"r\\\": false, \\\"t\\\": 5, \\\"misc\\\": {\\\"multi\\\": false}}, \\\"\\样\\品\\名\\称\\\": {\\\"r\\\": false, \\\"t\\\": 1, \\\"misc\\\": {}}, \\\"\\热\\处\\理\\条\\件\\\": {\\\"r\\\": false, \\\"t\\\": 9, \\\"misc\\\": {\\\"_ord\\\": [\\\"\\温\\度\\\", \\\"\\时\\间\\\", \\\"\\气\\氛\\\"], \\\"\\时\\间\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"min\\\"}}, \\\"\\气\\氛\\\": {\\\"r\\\": false, \\\"t\\\": 1, \\\"misc\\\": {}}, \\\"\\温\\度\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\℃\\\"}}}}, \\\"\\薄\\膜\\元\\素\\配\\比\\\": {\\\"r\\\": false, \\\"t\\\": 10, \\\"misc\\\": {\\\"_opt\\\": [\\\"Ba-Bi-Sb-V\\\", \\\"Cs-Ag-Bi-Br\\\"], \\\"Ba-Bi-Sb-V\\\": {\\\"r\\\": false, \\\"t\\\": 9, \\\"misc\\\": {\\\"V\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Ba\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Bi\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Sb\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"_ord\\\": [\\\"Ba\\\", \\\"Bi\\\", \\\"Sb\\\", \\\"V\\\"]}}, \\\"Cs-Ag-Bi-Br\\\": {\\\"r\\\": false, \\\"t\\\": 9, \\\"misc\\\": {\\\"Ag\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Bi\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Br\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Cs\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"_ord\\\": [\\\"Cs\\\", \\\"Ag\\\", \\\"Bi\\\", \\\"Br\\\"]}}}}, \\\"\\预\\制\\层\\元\\素\\配\\比\\\": {\\\"r\\\": false, \\\"t\\\": 10, \\\"misc\\\": {\\\"_opt\\\": [\\\"Ba-Bi-Sb-V\\\", \\\"Cs-Ag-Bi-Br\\\"], \\\"Ba-Bi-Sb-V\\\": {\\\"r\\\": false, \\\"t\\\": 9, \\\"misc\\\": {\\\"V\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Ba\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Bi\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Sb\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"_ord\\\": [\\\"Ba\\\", \\\"Bi\\\", \\\"Sb\\\", \\\"V\\\"]}}, \\\"Cs-Ag-Bi-Br\\\": {\\\"r\\\": false, \\\"t\\\": 9, \\\"misc\\\": {\\\"Ag\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Bi\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Br\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"Cs\\\": {\\\"r\\\": false, \\\"t\\\": 2, \\\"misc\\\": {\\\"unit\\\": \\\"\\（at%\\）\\\"}}, \\\"_ord\\\": [\\\"Cs\\\", \\\"Ag\\\", \\\"Bi\\\", \\\"Br\\\"]}}}}}\"\r\n        },\r\n        \"review_state\": 0,\r\n        \"disapprove_reason\": null,\r\n        \"version\": 0,\r\n        \"uploader_institution\": \"北京科技大学\",\r\n        \"project_name\": \"2016YFB0700700\",\r\n        \"subject_name\": \"2016YFB0700702\",\r\n        \"dataset_ref_count\": 0,\r\n        \"is_done\": true\r\n    },\r\n    \"publicKeyUrl\": \"-----BEGIN RSA PUBLIC KEY-----\\r\\nMIGJAoGBALQjzWRcA0tVU7vYvEuYm6w3ySO8TnwcSZ2wxOdjhuEr+G8WTu9l473y\\r\\nm5NewH+15HE6rp2iIF1wgjxF/pLFMwf8uf4n+1C//huspHJABzt7H7eJsDyR+Eb+\\r\\nVbdIGRWtdRQ00IFdK/qzhpvNRFe+7RPcwwn0ZIm8BgeSHiypxQ4PAgMBAAE=\\r\\n-----END RSA PUBLIC KEY-----\\r\\n\",\r\n    \"sign\": \"Az3iVPbafJDiZuI2pNmSA0fmgOW7thjRx9VTB3JBxoEfoVGnXRFQJzvV7h8356WWU2m7xSADKuqys+oMA2s+99FNEirzXQrIdqyP59bucsqr1Kd1I2PQQwxr3rFsbDrZSXUBbx/0F3vNrNr/Y9YSnv8I2pCUapTAE9U3TntI7dY=\",\r\n    \"signText\": \"test\"\r\n}"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 获取全部数据集名称清单(作为测试集选取)

GET /api/v2/storage/datas/

获取全部数据集名称清单，名称为创建数据时的title

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |需要登录|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "datas": [
      {
        "id": 4,
        "title": "CsAgBiBr钙钛矿薄膜23424"
      },
      {
        "id": 6,
        "title": "钙钛矿数据集-org1"
      },
      {
        "id": 7,
        "title": "train_partroot1"
      },
      {
        "id": 8,
        "title": "train_partroot2"
      },
      {
        "id": 9,
        "title": "train_partroot3"
      },
      {
        "id": 10,
        "title": "test_dataset"
      }
    ],
    "total": 6
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 根据标题获取一个数据集

GET /api/v2/storage/dataset_csv/{title}

获取标题为title的数据集详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|title|path|string| 是 |none|
|Authorization|header|string| 否 |需要登录|

> 返回示例

> 成功

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 获取某用户上传的数据集名称清单

GET /api/v2/storage/data/{username}

获取root上传的数据集名称清单：http://127.0.0.1:8000/api/v2/storage/data/root

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|Authorization|header|string| 否 |需要登录|

> 返回示例

> 成功

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## POST 用户上传数据集(CSV文件)

POST /api/v2/storage/dataset_csv/

> Body 请求参数

```yaml
file: cmMtdXBsb2FkLTE3MTUwNzY0NzIyMzAtMg==/钙钛矿数据集-org1.csv

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |需要登录|
|Content-Type|header|string| 否 |一次只能上传一个文件|
|body|body|object| 否 |none|
|» file|body|string(binary)| 否 |暂时只能上传csv格式|

> 返回示例

> 成功

```json
{
  "status": "success"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## POST 更新MPT树

POST /api/v2/storage/mpt/update/

> Body 请求参数

```json
{
  "title": "CsAgBiBr钙钛矿薄膜",
  "blockhash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» title|body|string| 是 |数据标题|
|» blockhash|body|string| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": "2"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## POST 上传数据集文件

POST /api/v1/storage/file/data/content

在创建数据页面上传数据集文件，一个数据只能有一个数据集文件。上传后返回url，此url作为创建的数据的content
创建数据时，title为数据标题(唯一标识)，数据集作者为当前登录用户，content中放url，其它随便。如下所示：
        {
            "meta": {
                "tid": 1,
                "title": "test_dataset",
                "材料分类": "太阳能电池材料",
                "abstract": "成分 热处理工艺 方阻 透过率",
                "keywords": "成分, 热处理工艺, 方阻, 透过率",
                "contributor": "何绪林",
                "publicDate": "2020-07-23 16:04:23",
                "source":{ "source":"MGE-SOURCE_HEADER v1 010 10 #","methods":"method"},
                "审核人": "刘禹",
                "institution": "江南大学、中物院成科中心",
                "other_info":{"project": "2016YFB0700700", "subject": "2016YFB0700702"}
            },
            "content": {
                "url": "/media/ab968fc7-0974-4aa7-8ed8-1fbe224b5c2d.csv"
            }
        }

> Body 请求参数

```yaml
"files[]": cmMtdXBsb2FkLTE3MTcxNjMxMjY5MTMtMg==/钙钛矿数据集-org1.csv

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» files[]|body|string(binary)| 否 |在创建数据页面上传数据集文件，一个数据只能有一个数据集文件|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": [
    "/media/9e29abfe-94d3-428b-a7cf-5b3042e44213.csv"
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

# search

## GET 查询

GET /api/v2/search/query/

> Body 请求参数

```json
{
  "q": {
    "text": "温度"
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

# FC

## GET 获取邀请方列表

GET /api/v1/task/getOrgs

联邦计算，任务下发接口，获取邀请方列表。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 成功

```json
[
  {
    "OrgAdminUser": "Admin",
    "OrgName": "Org1",
    "OrgMspId": "Org1MSP",
    "OrgUser": "User1",
    "OrgAdminClientContext": null,
    "OrgResMgmt": null,
    "OrgPeerNum": 1,
    "OrgAnchorFile": "D:\\Go\\GoProjects\\src\\fabric-mge\\fabric-mge/fixtures/channel-artifacts/Org1MSPanchors.tx",
    "OrgAddress": "peer0.org1.example.com:7051"
  },
  {
    "OrgAdminUser": "Admin",
    "OrgName": "Org2",
    "OrgMspId": "Org2MSP",
    "OrgUser": "User1",
    "OrgAdminClientContext": null,
    "OrgResMgmt": null,
    "OrgPeerNum": 1,
    "OrgAnchorFile": "D:\\Go\\GoProjects\\src\\fabric-mge\\fabric-mge/fixtures/channel-artifacts/Org2MSPanchors.tx",
    "OrgAddress": "peer0.org2.example.com:9051"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» inviter|[string]|true|none||none|

## POST 提交任务

POST /api/v1/task/create

提交任务下发的信息表单

> Body 请求参数

```json
"{\r\n    \"name\": \"TestTask11\",\r\n    \"description\": \"TestDescription\",\r\n    \"datasetMeta\": \"TestDatasetMeta\",//没啥用\r\n    \"mlMethod\": \"TestMLMethod\",\r\n    \"aggregationMethod\": \"AggregationMethod\",\r\n    \"useTEE\": \"UseTEE\",\r\n    \"initiateOrg\": \"Org1\",\r\n    \"invitedOrgs\": [\r\n        \"Orgs2\",\r\n        \"Orgs3\"\r\n    ],\r\n    \"test_dataset\":\"test_dataset\"\r\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskID|query|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» task|body|object| 是 |none|
|»» title|body|string| 是 |none|
|»» describe|body|string| 否 |none|
|»» metadata describe|body|string| 否 |none|
|»» Initiator|body|string| 是 |none|
|»» ml|body|string| 是 |none|
|»» aa|body|string| 是 |none|
|»» TEE|body|boolean| 是 |none|
|»» inviter|body|[string]| 是 |none|

> 返回示例

> 成功

```json
{
  "taskId": 1713852488746093300,
  "taskName": "任务1"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 根据id获取单条任务的信息

GET /api/v1/task/getTask

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskID|query|string| 否 |ID 编号|
|Authorization|header|string| 否 |none|

> 返回示例

> 成功

```json
{
  "ID": "1715845592845504100",
  "Name": "TestTask11",
  "Description": "TestDescription",
  "DatasetMeta": "TestDatasetMeta",
  "MLMethod": "TestMLMethod",
  "AggregationMethod": "AggregationMethod",
  "UseTEE": false,
  "InitiateOrg": "Org1",
  "InvitedOrgs": [
    "Orgs2",
    "Orgs3"
  ],
  "AcceptedOrgs": [
    "org1",
    "org2"
  ],
  "TaskStatus": 2,
  "test_dataset": "test_dataset",
  "orgs_datasets": {
    "org1": "dataset1",
    "org2": "dataset2"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» task|object|true|none||none|

## GET 获取邀请的任务清单

GET /api/v1/task/getInvitedTasks

获取邀请当前组织的任务清单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orgName|query|string| 否 |当前组织名|
|Authorization|header|string| 否 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "tasks": [
      {
        "task_id": "1713852488746093200",
        "name": "TestTask_test7",
        "description": "TestDescription",
        "task_status": 2
      },
      {
        "task_id": "1713862439431048800",
        "name": "TestTask_test8",
        "description": "TestDescription",
        "task_status": 0
      }
    ],
    "total": 2
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» tasklist|[object]|true|none||none|

## POST 接受/拒绝任务邀请

POST /api/v1/task/handle

org1接受/拒绝任务1713852242798116500

> Body 请求参数

```json
{
  "orgName": "org1",
  "isAccepted": true,
  "taskID": "1713852242798116500"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 成功

```json
{
  "isAccepted": true,
  "taskId": "1713852242798116500"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 获取发起的任务清单

GET /api/v1/task/getInitiateTasks

获取当前组织发起的任务清单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orgName|query|string| 否 |当前组织名|
|Authorization|header|string| 是 |none|

> 返回示例

> 成功

```json
{
  "code": 0,
  "data": {
    "tasks": [
      {
        "task_id": "1713852468385451800",
        "name": "TestTask_test6",
        "description": "TestDescription",
        "task_status": 0
      },
      {
        "task_id": "1713852488746093200",
        "name": "TestTask_test7",
        "description": "TestDescription",
        "task_status": 2
      },
      {
        "task_id": "1713862439431048800",
        "name": "TestTask_test7",
        "description": "TestDescription",
        "task_status": 0
      }
    ],
    "total": 3
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## POST 开始训练

POST /api/v1/task/start_multi

任务发起方点击开始训练调用此接口，代表任务1715845592845504100在Python后端开始联邦训练。(除了mean聚合，其它聚合都在python后端进行)。训练结束后返回训练结果，训练过程中暂时只能阻塞等待。返回值metrics为联邦训练的结果指标，其它为训练中生成的图片，暂时用文件路径表示。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskID|query|array[string]| 否 |任务ID|

> 返回示例

> 成功

```json
{
  "metrics": "{\"MSE\": 3.462855815887451, \"MAE\": 1.4215829372406006, \"RMSE\": 1.8608750104904175, \"R2\": -2.838991403579712}",
  "shap_value_bar_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_bar.png",
  "shap_value_dot_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_dot.png",
  "y_test_vs_y_pred_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/y_test_vs_y_pred.png"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

## GET 查看单个用户(组织)在任务中的训练结果

GET /api/v1/task/getSingleResult

> Body 请求参数

```json
{
  "orgName": "org1",
  "taskID": "1715845592845504100"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |分组|
|body|body|object| 否 |none|

> 返回示例

> 成功

```json
{
  "metrics": "{\"MSE\": 3.462855815887451, \"MAE\": 1.4215830564498901, \"RMSE\": 1.8608750104904175, \"R2\": -2.838989734649658}",
  "loss_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/org1/loss.png",
  "shap_value_bar_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/org1/shap_value_bar.png",
  "shap_value_dot_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/org1/shap_value_dot.png",
  "y_test_vs_y_pred_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/org1/y_test_vs_y_pred.png"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» result|object|true|none||none|

## GET 查看整个任务的结果

GET /api/v1/task/getMultiResult

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskID|query|string| 否 |none|

> 返回示例

> 成功

```json
{
  "metrics": "{\"MSE\": 3.462855815887451, \"MAE\": 1.4215829372406006, \"RMSE\": 1.8608750104904175, \"R2\": -2.838991403579712}",
  "shap_value_bar_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_bar.png",
  "shap_value_dot_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_dot.png",
  "y_test_vs_y_pred_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/y_test_vs_y_pred.png"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» result|object|true|none||none|

## POST 组织选取训练集

POST /api/v1/task/selectDataset

任务1715845592845504100中的组织org1指定标题为dataset1的训练集

> Body 请求参数

```json
{
  "orgName": "org1",
  "datasetTitle": "dataset1",
  "taskID": "1715845592845504100"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

