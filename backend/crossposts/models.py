from django.db import models
from django.template.defaultfilters import slugify

from accounts.models import CustomUser
from blogs.models import get_sentinel_user


class Crosspost(models.Model):
    BLOG_POST = "BP"
    LIST = "L"
    POST_TYPE_CHOICES = {BLOG_POST: "Blog Post", LIST: "Listicle"}

    title = models.CharField(unique=True, max_length=101)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    post_type = models.CharField(choices=POST_TYPE_CHOICES, default=BLOG_POST)  # type: ignore
    slug_field = models.SlugField(null=True, unique=True, max_length=200)

    def save(self, *args, **kwargs):
        self.slug_field = slugify(self.title)
        return super().save(*args, **kwargs)


class CrosspostReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=Crosspost, on_delete=models.SET_NULL, null=True)

    class Meta:  # type: ignore
        unique_together = "user", "post"


class CrosspostComment(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.SET(get_sentinel_user))
    post = models.ForeignKey(
        to=Crosspost, on_delete=models.CASCADE, null=True, blank=True
    )
    content = models.TextField(max_length=2000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    reply_to = models.ForeignKey(
        "self", on_delete=models.DO_NOTHING, null=True, blank=True, related_name="reply"
    )
    flagged = models.BooleanField(default=False)

    def delete(self, *args, **kwargs):  # type: ignore
        self.content = "This comment was deleted"
        self.is_read = True
        self.user = get_sentinel_user()
        self.save()
        return

    def toggle_flagged(self):
        self.flagged = not self.flagged
        self.save()
