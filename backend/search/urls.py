from django.urls import path

from .views import BlogPostSearch

urlpatterns = [
    path(
        "posts/<post_type>/<search>/<page>/",
        BlogPostSearch.as_view(),
        name="search_blog_post",
    ),
    path(
        "posts/<post_type>/<page>/", BlogPostSearch.as_view(), name="search_blog_post"
    ),
]
