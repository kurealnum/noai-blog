from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.test import APIClient

from accounts.models import CustomUser
from blogs.models import BlogPost


class cTestCase(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
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
        self.blog_post_two = BlogPost.objects.create(
            user=self.user,
            title="No keyword here",
            content="Here's something about my blog post",
        )
        self.blog_post_two.save()


class BlogPostSearchTC(cTestCase):
    def test_does_get_with_correct_query(self):
        request = self.client.get(
            reverse_lazy("search_blog_post", kwargs={"search": "awesome"})
        )
        expected_length = 1
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_get_with_no_query(self):
        request = self.client.get(
            reverse_lazy(
                "search_blog_post",
            )
        )
        expected_length = 2
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_not_get_with_incorrect_query(self):
        request = self.client.get(
            reverse_lazy("search_blog_post", kwargs={"search": "wrongwrong"})
        )
        expected_length = 0
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)
