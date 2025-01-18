from django.urls import path

from .views import BlogPostSearch

urlpatterns = [
    path("posts/<search>/<page>/", BlogPostSearch.as_view(), name="search_blog_post"),
    path("posts/<page>/", BlogPostSearch.as_view(), name="search_blog_post"),
]
