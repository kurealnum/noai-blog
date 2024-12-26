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
