from django.urls import path

from crossposts.views import CrosspostListView

urlpatterns = [
    path("get-crossposts/", CrosspostListView.as_view(), name="get_crossposts"),
    path(
        "get-crossposts/<username>/", CrosspostListView.as_view(), name="get_crossposts"
    ),
]
