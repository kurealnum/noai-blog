from django.urls import path

from .views import BlogPostSearch

urlpatterns = [
    path("blog-posts/<search>/", BlogPostSearch.as_view(), name="search_blog_post")
]
