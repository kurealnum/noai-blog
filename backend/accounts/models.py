from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200)
    first_name = models.CharField(max_length=50, unique=False)
    last_name = models.CharField(max_length=50, unique=False)
    about_me = models.TextField(max_length=250)
    technical_info = models.TextField(max_length=150)
    password = models.CharField(max_length=100, unique=False)


class Link(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    link = models.CharField(unique=False)
    name = models.CharField(unique=False)

    # user can have a maximum of five links
    # def save(self, *args, **kwargs):
    #     if Link.objects.filter(user=self.user).count() > 5:
    #         return
    #
    #     super().save(*args, **kwargs)
