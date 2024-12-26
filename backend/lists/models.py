from django.db import models
from django.template.defaultfilters import slugify
from django.urls import reverse
from django_resized import ResizedImageField

from accounts.models import CustomUser


class List(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=101, unique=True)
    content = models.TextField(max_length=20000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    slug_field = models.SlugField(null=True, unique=True, max_length=200)
    flagged = models.BooleanField(default=False)
    thumbnail = ResizedImageField(
        size=[520, 292],
        upload_to="blog_thumbnails/",
        blank=True,
        scale=1,
        quality=100,
        keep_meta=False,
        force_format="JPEG",
    )

    # the url for the frontend, basically
    def get_sitemap_url(self):
        return "/list/" + self.user.username + "/" + self.slug_field + "/"

    def get_absolute_url(self):
        return reverse(
            "get_post", kwargs={"username": self.user.username, "slug": self.slug_field}
        )

    def save(self, *args, **kwargs):
        self.slug_field = slugify(self.title)
        return super().save(*args, **kwargs)

    def toggle_flagged(self):
        self.flagged = not self.flagged
        self.save()

    def toggle_listicle(self):
        self.is_listicle = not self.is_listicle
        self.save()
