"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from .sitemaps import StaticSitemap, UserSitemap, BlogPostSitemap
from django.contrib.sitemaps.views import sitemap

sitemaps = {"static": StaticSitemap, "users": UserSitemap, "posts": BlogPostSitemap}

API_URL = "api/"

urlpatterns = [
    path(
        "a-beautiful-fruit-tree-swaying-in-the-wind-fb520ad7a6e0e3f11a860efbcef3e66c/",
        admin.site.urls,
    ),
    path(API_URL + "accounts/", include("accounts.urls")),
    path(API_URL + "blog-posts/", include("blogs.urls")),
    path(API_URL + "search/", include("search.urls")),
    path(API_URL + "crossposts/", include("crossposts.urls")),
    path(
        "sitemap.xml",
        sitemap,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
    ),
    path("manage-password/", include("password_management.urls")),
]

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns.extend(
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),  # type:ignore
    )
