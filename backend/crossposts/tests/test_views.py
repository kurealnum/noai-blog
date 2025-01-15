from django.template.defaultfilters import slugify
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
        self.authenticated_client = APIClient()
        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )
        Crosspost.objects.create(title="crosspost_1", user=self.user, post_type="BP")
        Crosspost.objects.create(title="crosspost_2", user=self.user, post_type="L")


class CrossPostListViewTC(cTestCase):
    def setUp(self):
        super().setUp()

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


class CrosspostViewTC(cTestCase):
    def setUp(self):
        super().setUp()

    def test_does_get_with_username_and_slug(self):
        request = self.client.get(
            reverse_lazy("get_crosspost", args=["bobby", "crosspost_1"])
        )
        expected_title = "crosspost_1"
        self.assertEqual(expected_title, request.data["title"])  # type: ignore

    def test_does_post(self):
        data = {"title": "title", "post_type": "BP"}
        request = self.authenticated_client.post(
            reverse_lazy("create_crosspost"), data=data
        )
        expected_result = "title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_properly(self):
        # create a separate object to edit
        to_edit = Crosspost.objects.create(
            user=self.user,
            title="my unique blog post",
        )
        to_edit.save()

        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )
        data = {
            "title": "An edited title",
            "title_slug": to_edit.slug_field,
            "original_slug": to_edit.slug_field,
            "post_type": "BP",
        }
        request = self.authenticated_client.put(
            reverse_lazy("edit_crosspost"), data=data
        )
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_work_with_new_title(self):
        # create a separate object to edit
        to_edit = Crosspost.objects.create(
            user=self.user,
            title="my unique blog post",
        )
        to_edit.save()

        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )
        data = {
            "title": "An edited title",
            "title_slug": slugify("An edited title"),
            "post_type": "BP",
            "original_slug": to_edit.slug_field,
        }
        request = self.authenticated_client.put(
            reverse_lazy("edit_crosspost"), data=data
        )
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_not_put_with_duplicate_title(self):
        # create a separate object to edit
        to_edit = Crosspost.objects.create(
            user=self.user,
            title="A basic title",
        )
        to_edit.save()

        duplicate = Crosspost.objects.create(user=self.user, title="new-title")
        duplicate.save()

        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )
        data = {
            "title": "new-title",
            "title_slug": "new-title",
            "original_slug": to_edit.slug_field,
            "post_type": "BP",
        }
        request = self.authenticated_client.put(
            reverse_lazy("edit_crosspost"), data=data
        )
        expected_result = "A post with this title already exists!"
        self.assertEqual(expected_result, request.data["error"])

    def test_does_delete_work(self):
        # create an object, then delete it
        to_delete = Crosspost.objects.create(
            user=self.user,
            title="my unique crosspost",
        )
        to_delete.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {"slug": to_delete.slug_field}
        request = temp_client.delete(reverse_lazy("delete_crosspost"), data=data)
        expected_status = 204
        self.assertEqual(expected_status, request.status_code)
