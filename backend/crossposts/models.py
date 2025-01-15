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


class CrosspostReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=Crosspost, on_delete=models.SET_NULL, null=True)

    class Meta:  # type: ignore
        unique_together = "user", "post"
