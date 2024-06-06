from django.urls import path

from apps.task import taskViews

urlpatterns = [
    path('create/', taskViews.createTask),
    path('getTask/<str:task_id>/', taskViews.getTask),
    path('getInitiateTasks/<str:orgName>/', taskViews.getInitiateTasks),
    path('getInvitedTasks/<str:orgName>/', taskViews.getinvitedTasks),
]
