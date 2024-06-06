from django.urls import path
from django.views.generic import TemplateView

from apps.storage import dataViews

urlpatterns = [
    path('data/<int:data_id>', dataViews.findDataById),
    path('data/<str:username>', dataViews.findDataByUser),
    # path('data/<str:title>', dataViews.findDataByTitle),
    path('dataset_csv/', dataViews.datasets_CSV),
    path('dataset_csv_user/<str:username>', dataViews.datasets_CSV_user),
    path('dataset_csv_title/<str:title>', dataViews.findCSVByTitle),
    path('datas/', dataViews.findAllData),
    path('mpt/update/', dataViews.update_mpt),
]
