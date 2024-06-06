"""djangoProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from apps.search import Query
from apps.storage import dataViews
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = ([
                   path('admin/', admin.site.urls),
                   # api v1 url
                   path(r'api/v1/storage/',
                        include(('apps.storage.v1.urls', 'apps.storage'), namespace='api_v1_storage')),
                   path(r'api/v1.1/storage/',
                        include(('apps.storage.v1.urls', 'apps.storage'), namespace='api_v1.1_storage')),
                   path(r'api/v1/account/',
                        include(('apps.account.urls', 'apps.account'), namespace='api_v1_account')),
                   path(r'api/v1/task/',
                        include(('apps.task.urls', 'apps.task'), namespace='api_v1_task')),
                   path(r'api/v1/fl/',
                        include(('apps.fl.urls', 'apps.fl'), namespace='api_v1_fl')),

                   # api v2 url
                   path(r'api/v2/storage/',
                        include(('apps.storage.v2.urls', 'apps.storage'), namespace='api_v2_storage')),
                   path(r'api/v2/search/',
                        include(('apps.search.urls', 'apps.search'), namespace='api_v2_search')),

                   # api v3 url
                   path(r'api/v3/storage/',
                        include(('apps.storage.v3.urls', 'apps.storage'), namespace='api_v3_storage')),

                   # for test
                   path('api/vtest/storage/data/full', dataViews.createData),
                   # create data format: {meta: xxxx, content: xxxx}
                   path('api/vtest/mpt/update', dataViews.update_mpt_test),  # update_mpt format: {id:xxxx}
                   path('api/vtest/search/query/', Query.searchAPI),  # query format: {q: {text: xxx}}
                   path('api/vtest/search/query/<int:q_id>', Query.searchAPIPage),
                   path('api/vtest/search/query/<int:q_id>/<int:t_id>', Query.searchAPITemplate),

               ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
