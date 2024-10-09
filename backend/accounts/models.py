from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=200)
    first_name = models.CharField(max_length=50, unique=False)
    last_name = models.CharField(max_length=50, unique=False)
    about_me = models.TextField(max_length=250)
    technical_info = models.TextField(max_length=150)
    password = models.CharField(max_length=100, unique=False)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True)
    approved_ai_usage = models.BooleanField(default=False)


class Link(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    link = models.CharField(unique=False, max_length=100)
    name = models.CharField(unique=False, max_length=50)
