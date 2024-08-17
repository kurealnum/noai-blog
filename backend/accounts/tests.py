from django.test import TestCase
from .models import CustomUser
from blogs.models import BlogPost


class CustomUserTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")

    def test_can_make_blog_post(self):
        BlogPost.objects.create(
            user=self.user, title="My blog post", content="My weird blog post"
        )

        is_blog_post = BlogPost.objects.get(user=self.user)
        self.assertIsNotNone(is_blog_post)
