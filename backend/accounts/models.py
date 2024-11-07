from django.db import models
from django.contrib.auth.models import AbstractUser
from django_resized import ResizedImageField


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=200)
    first_name = models.CharField(max_length=50, unique=False, blank=True)
    last_name = models.CharField(max_length=50, unique=False, blank=True)
    about_me = models.TextField(max_length=250)
    technical_info = models.TextField(max_length=150)
    password = models.CharField(max_length=100, unique=False)
    # profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True)
    profile_picture = ResizedImageField(
        size=[64, 64],
        upload_to="profile_pictures/",
        blank=True,
        scale=1,
        quality=100,
        keep_meta=False,
        force_format="JPEG",
        crop=["middle", "center"],
    )
    approved_ai_usage = models.BooleanField(default=False)
    is_mod = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    flagged = models.BooleanField(default=False)

    def toggle_flagged(self):
        self.flagged = not self.flagged
        self.save()


class Link(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    link = models.CharField(unique=False, max_length=100)
    name = models.CharField(unique=False, max_length=50)
