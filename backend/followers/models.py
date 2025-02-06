from django.db import models

from accounts.models import CustomUser


class Follower(models.Model):
    follower = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="follower_id"
    )
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name="follower_user_id",
    )
