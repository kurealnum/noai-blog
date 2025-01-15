from django.db import models

from accounts.models import CustomUser


class Crosspost(models.Model):
    BLOG_POST = "BP"
    LIST = "L"
    POST_TYPE_CHOICES = {BLOG_POST: "Blog Post", LIST: "Listicle"}

    title = models.CharField(unique=True, max_length=100)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    post_type = models.CharField(choices=POST_TYPE_CHOICES, default=BLOG_POST)  # type: ignore
