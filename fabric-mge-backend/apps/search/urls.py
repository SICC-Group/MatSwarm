from django.urls import path

from apps.search import Query, QueryForAddr

urlpatterns = [

    path('query/', Query.searchAPI),
    path('query/<int:q_id>', Query.searchAPIPage),
    path('query/<int:q_id>/<int:t_id>', Query.searchAPITemplate),

    path('query/addr/', QueryForAddr.searchAPI),
    path('query/addr/<int:q_id>', QueryForAddr.searchAPITemplate),
]
