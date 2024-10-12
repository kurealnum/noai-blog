from django.db import models
from django.urls import reverse
from django.template.defaultfilters import slugify
from accounts.models import CustomUser


class BlogPost(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, unique=True)
    content = models.TextField(max_length=20000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    slug_field = models.SlugField(null=True, unique=True)
    is_listicle = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse(
            "get_post", kwargs={"username": self.user.username, "slug": self.slug_field}
        )

    def save(self, *args, **kwargs):
        self.slug_field = slugify(self.title)
        return super().save(*args, **kwargs)


class Follower(models.Model):
    follower = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="follower_id"
    )
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name="follower_user_id",
    )


class PostReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=BlogPost, on_delete=models.SET_NULL, null=True)

    class Meta:  # type: ignore
        unique_together = "user", "post"


class Comment(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(
        to=BlogPost, on_delete=models.SET_NULL, null=True, blank=True
    )
    content = models.TextField(max_length=2000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    reply_to = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="reply_to"
    )


class CommentReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(to=Comment, on_delete=models.SET_NULL, null=True)
