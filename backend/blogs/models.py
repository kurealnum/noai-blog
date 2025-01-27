from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse
from django.template.defaultfilters import slugify
from accounts.models import CustomUser
from django_resized import ResizedImageField


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username="deleted")[0]


def post_type_reducer(post_type):
    """
    Reduces a bunch of alternate spellings of "blogPost" into the correct spelling. See post_type_reducer.
    kwargs["post_type"] = kwargs["post_type"] if post_type_reducer can't match anything.
    """
    reduced_post_type = post_type
    if (
        post_type == "blogs"
        or post_type == "blog-posts"
        or post_type == "blog"
        or post_type == "blog-post"
    ):
        reduced_post_type = "blogPost"

    elif post_type == "lists":
        reduced_post_type = "list"

    elif (
        post_type == "crossposts"
        or post_type == "cross-post"
        or post_type == "cross-posts"
    ):
        reduced_post_type = "crosspost"

    return reduced_post_type if reduced_post_type != "" else post_type


class PostTypeReducerMixin(models.Manager):
    def filter(self, *args, **kwargs):

        post_type = kwargs.get("post_type")
        if post_type:
            kwargs["post_type"] = post_type_reducer(post_type)

        return super().filter(*args, **kwargs)


class BlogPostManager(models.Manager):
    def filter(self, *args, **kwargs):

        post_type = kwargs.get("post_type")
        if post_type:
            kwargs["post_type"] = post_type_reducer(post_type)

        if post_type == "crosspost":
            return super().filter(*args, **kwargs).select_related("crosspost")

        return super().filter(*args, **kwargs)


class PostTypesMixin:
    BLOG_POST = "blogPost"
    LIST = "list"
    CROSSPOST = "crosspost"
    POST_TYPE_CHOICES = {
        BLOG_POST: "Blog Post",
        LIST: "Listicle",
        CROSSPOST: "Crosspost",
    }


class BlogPost(models.Model, PostTypesMixin):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=101, unique=True)
    content = models.TextField(max_length=20000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    slug_field = models.SlugField(null=True, unique=True, max_length=200)
    is_listicle = models.BooleanField(default=False)
    flagged = models.BooleanField(default=False)
    post_type = models.CharField(
        choices=PostTypesMixin.POST_TYPE_CHOICES, default=PostTypesMixin.BLOG_POST  # type: ignore
    )
    thumbnail = ResizedImageField(
        size=[520, 292],
        upload_to="blog_thumbnails/",
        blank=True,
        scale=1,
        quality=100,
        keep_meta=False,
        force_format="JPEG",
    )

    objects = BlogPostManager()

    # the url for the frontend, basically
    def get_sitemap_url(self):
        return "/post/" + self.user.username + "/" + self.slug_field + "/"

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


class Crosspost(models.Model, PostTypesMixin):
    blog_post = models.OneToOneField(BlogPost, on_delete=models.CASCADE)
    url = models.URLField(max_length=100)
    crosspost_type = models.CharField(choices=PostTypesMixin.POST_TYPE_CHOICES, default=PostTypesMixin.BLOG_POST)  # type: ignore


class Follower(models.Model):
    follower = models.ForeignKey(
        to=CustomUser, on_delete=models.CASCADE, related_name="follower_id"
    )
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name="follower_user_id",
    )


class PostReaction(models.Model, PostTypesMixin):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=BlogPost, on_delete=models.SET_NULL, null=True)
    post_type = models.CharField(
        choices=PostTypesMixin.POST_TYPE_CHOICES, default=PostTypesMixin.BLOG_POST  # type: ignore
    )

    objects = PostTypeReducerMixin()

    class Meta:  # type: ignore
        unique_together = "user", "post"


class PostComment(models.Model, PostTypesMixin):
    user = models.ForeignKey(to=CustomUser, on_delete=models.SET(get_sentinel_user))
    post = models.ForeignKey(
        to=BlogPost, on_delete=models.CASCADE, null=True, blank=True
    )
    content = models.TextField(max_length=2000)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    reply_to = models.ForeignKey(
        "self", on_delete=models.DO_NOTHING, null=True, blank=True, related_name="reply"
    )
    flagged = models.BooleanField(default=False)
    post_type = models.CharField(
        choices=PostTypesMixin.POST_TYPE_CHOICES, default=PostTypesMixin.BLOG_POST  # type: ignore
    )

    objects = PostTypeReducerMixin()

    def delete(self, *args, **kwargs):  # type: ignore
        self.content = "This comment was deleted"
        self.is_read = True
        self.user = get_sentinel_user()
        self.save()
        return

    def toggle_flagged(self):
        self.flagged = not self.flagged
        self.save()


class CommentReaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(to=PostComment, on_delete=models.SET_NULL, null=True)
    post_type = models.CharField(
        choices=PostTypesMixin.POST_TYPE_CHOICES, default=PostTypesMixin.BLOG_POST  # type: ignore
    )

    objects = PostTypeReducerMixin()
