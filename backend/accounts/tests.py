from django.test import TestCase

from accounts.views import UserInfoView
from .models import CustomUser
from blogs.models import BlogPost
from rest_framework.test import APIRequestFactory, force_authenticate


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


class UserInfoTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )

    def test_does_request_return_correct_output(self):
        factory = APIRequestFactory()
        request = factory.get("/accounts/user-info/")
        force_authenticate(request, user=self.user)
        result = UserInfoView.as_view()(request, pk=self.user.id)  # type: ignore
        expected_result = {
            "id": 2,
            "last_login": None,
            "is_superuser": False,
            "username": "",
            "is_staff": False,
            "is_active": True,
            "email": "bobbyjoe@gmail.com",
            "first_name": "Bobby",
            "last_name": "Joe",
            "about_me": "I am Bobby Joe, destroyer of worlds.",
            "password": "",
            "groups": [],
            "user_permissions": [],
        }
        # remove date joined for testing purposes
        result.data.pop("date_joined")
        self.assertEqual(expected_result, result.data)
