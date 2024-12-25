from django.urls import path

from .views import BlogPostSearch

urlpatterns = [
    path(
        "blog-posts/<search>/<page>/", BlogPostSearch.as_view(), name="search_blog_post"
    ),
    path("blog-posts/<page>/", BlogPostSearch.as_view(), name="search_blog_post"),
]
