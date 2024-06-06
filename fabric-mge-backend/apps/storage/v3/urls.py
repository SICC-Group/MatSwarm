from django.urls import path
from django.views.generic import TemplateView

from apps.storage import templateViews

urlpatterns = [
    path('templates/', templateViews.create_template),
]
