from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.test import APIClient, APIRequestFactory

from accounts.models import CustomUser
from crossposts.models import Crosspost


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


class CrossPostListViewTestCase(cTestCase):
    def setUp(self):
        super().setUp()
        Crosspost.objects.create(title="crosspost_1", user=self.user, post_type="BP")
        Crosspost.objects.create(title="crosspost_2", user=self.user, post_type="L")

    def test_get_work(self):
        # temp client for logging in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        response = temp_client.get(reverse_lazy("get_crossposts"))

        # expected_title, basically
        expected_result = "crosspost_2"
        self.assertEqual(expected_result, response.data[-1].get("title"))

    def test_get_with_correct_username(self):
        request = self.client.get(reverse_lazy("get_crossposts", args=["bobby"]))
        expected_result = "crosspost_2"
        result = request.data[-1].get("title")  # type: ignore
        self.assertEqual(result, expected_result)

    def test_get_with_incorrect_username(self):
        request = self.client.get(
            reverse_lazy("get_crossposts", args=["theworngusername"])
        )
        expected_result = "Not found."
        self.assertEqual(request.data["detail"], expected_result)  # type: ignore
