from django.urls import path
from django.views.generic import TemplateView

from apps.storage import templateViews, dataViews

urlpatterns = [
    path('templates/', templateViews.get_all_template),
    path('template/<int:template_id>/', templateViews.get_template),

    path('data/full/', dataViews.createData),

    path(r'file/data/content',dataViews.uploaded_data_content_file, name='data_content_file')
]
