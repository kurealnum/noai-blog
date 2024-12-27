from io import BytesIO
from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.test import APIClient, APIRequestFactory

from accounts.models import CustomUser
from lists.models import List, ListReaction


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
        self.list_one = List.objects.create(
            user=self.user, title="one", content="1. 2. 3."
        )
        self.authenticated_client = APIClient()
        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )


class ListFeedTC(cTestCase):
    def setUp(self):
        super().setUp()
        self.list_two = List.objects.create(
            user=self.user, title="two", content="1. 2. 3."
        )
        ListReaction.objects.create(user=self.user, post=self.list_two)
        self.list_three = List.objects.create(
            user=self.user, title="three", content="1. 2. 3."
        )
        self.user_two = CustomUser.objects.create(
            email="janejoe@gmail.com",
            first_name="Jane",
            last_name="Joe",
            about_me="I am Jane Joe, destroyer of worlds.",
            username="jane",
        )
        self.user_two.set_password("TerriblePassword123")
        self.user_two.save()
        ListReaction.objects.create(user=self.user, post=self.list_three)
        ListReaction.objects.create(user=self.user_two, post=self.list_three)

    # the order should be list three, two, then one
    def test_does_get_return_in_order(self):
        request = self.client.get(reverse_lazy("list_feed", args=[1]))
        expected_first_title = "three"
        expected_second_title = "two"
        expected_third_title = "one"
        data = request.data  # type: ignore
        self.assertEqual(expected_first_title, data[0]["title"])
        self.assertEqual(expected_second_title, data[1]["title"])
        self.assertEqual(expected_third_title, data[2]["title"])


class ListViewTC(cTestCase):
    def test_does_get_with_title(self):
        request = self.client.get(reverse_lazy("manage_list", args=["one"]))
        expected_title = "one"
        self.assertEqual(expected_title, request.data["title"])  # type: ignore

    def test_does_get_with_username_and_slug(self):
        request = self.client.get(reverse_lazy("manage_list", args=["bobby", "one"]))
        expected_title = "one"
        self.assertEqual(expected_title, request.data["title"])  # type: ignore

    def test_does_post_with_thumbnail(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            "thumbnail": img,
        }
        request = self.authenticated_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])

    def test_does_post_with_no_thumbnail(self):
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            # this is how JS handles this, so we have to manually put "undefined"
            "thumbnail": "undefined",
        }
        request = self.authenticated_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])
