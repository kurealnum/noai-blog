from django.urls import path

from blogs.views import PostList

urlpatterns = [path("get-posts/<str:username>", PostList.as_view(), name="get_posts")]
