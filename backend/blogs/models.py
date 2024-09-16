from django.db import models
from accounts.models import CustomUser


class BlogPost(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=10000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)


class Follower(models.Model):
    follower = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="follower_id"
    )
    user = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="follower_user_id"
    )


class Following(models.Model):
    following = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="following_id"
    )
    user = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="following_user_id"
    )


class PostReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=BlogPost, on_delete=models.SET_NULL, null=True)


class Comment(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(
        to=BlogPost, on_delete=models.SET_NULL, null=True, blank=True
    )
    content = models.TextField(max_length=10000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)


class CommentReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(to=Comment, on_delete=models.SET_NULL, null=True)


class ReplyTo(models.Model):
    comment = models.ForeignKey(
        to=Comment, on_delete=models.CASCADE, related_name="comment_id"
    )
    reply = models.ForeignKey(
        to=Comment, on_delete=models.CASCADE, related_name="reply_id"
    )
