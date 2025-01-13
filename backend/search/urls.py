from django.urls import path

from .views import BlogPostSearch, ListSearch

urlpatterns = [
    path("posts/<search>/<page>/", BlogPostSearch.as_view(), name="search_blog_post"),
    path("posts/<page>/", BlogPostSearch.as_view(), name="search_blog_post"),
    path("lists/<search>/<page>/", ListSearch.as_view(), name="search_list"),
    path("lists/<page>/", ListSearch.as_view(), name="search_list"),
]
