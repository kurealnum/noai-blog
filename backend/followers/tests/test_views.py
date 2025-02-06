from django.test import TestCase

from django.urls.base import reverse_lazy
from rest_framework.test import APIClient, APIRequestFactory

from accounts.models import CustomUser
from blogs.models import BlogPost
from followers.models import Follower


class cTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
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
        self.admin = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="bethy",
            is_admin=True,
        )
        self.admin.set_password("TerriblePassword123")
        self.admin.save()
        self.authenticated_client = APIClient()
        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )


class FollowerViewTestCase(cTestCase):
    def setUp(self):
        super().setUp()
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()
        self.follower = Follower.objects.create(follower=self.altuser, user=self.user)

    def test_does_get_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.get(reverse_lazy("manage_followers"))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data[0]["user"]["username"])

    def test_does_post_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.post(
            reverse_lazy("manage_followers"),
            data={"followee": self.altuser.username},
        )
        expected_result = 201
        self.assertEqual(expected_result, request.status_code)

    # testing the deletion of self.follower (django tests run sequentially, so this should be fine!!!)
    def test_does_delete_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.delete(
            reverse_lazy("manage_followers"),
            data={"followee": self.altuser.username},
        )
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)


class FollowingViewTestCase(cTestCase):
    def setUp(self):
        super().setUp()
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()
        self.follower = Follower.objects.create(follower=self.altuser, user=self.user)

    def test_does_get_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following"))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data[0]["user"]["username"])

    def test_does_get_request_with_parameter_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following", args=["bobby"]))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data["user"]["username"])

    def test_does_get_with_incorrect_username_return_404(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following", args=["idontexist"]))
        expected_result = "This user does not exist"

        self.assertEqual(expected_result, request.data["error"])
