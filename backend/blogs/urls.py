from django.urls import path

from blogs.views import BlogPostList

urlpatterns = [path("get-posts/", BlogPostList.as_view(), name="get_posts")]
