from django.test import TestCase

from accounts.models import CustomUser
from blogs.models import BlogPost


class CustomTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
        )
        self.user.set_password("TerriblePassword123")
        self.user.save()
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
        self.blog_post.save()
        return super().setUp()


class BlogPostTestCase(CustomTestCase):
    def test_get_sitemap_url(self):
        res = self.blog_post.get_sitemap_url()
        expected_result = "/post/bobby/my-awesome-blog-post/"
        self.assertEqual(res, expected_result)

    def test_get_absolute_url(self):
        res = self.blog_post.get_absolute_url()
        expected_result = "/api/blog-posts/get-post/bobby/my-awesome-blog-post/"
        self.assertEqual(res, expected_result)
