from django.test import TestCase

from accounts.models import CustomUser
from lists.models import List


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
        self.list = List.objects.create(
            user=self.user,
            title="My awesome list",
            content="Here's something about my blog post",
        )
        self.list.save()
        return super().setUp()


class ListTestCase(CustomTestCase):
    def test_get_sitemap_url(self):
        res = self.list.get_sitemap_url()
        expected_result = "/list/bobby/my-awesome-list/"
        self.assertEqual(res, expected_result)

    def test_get_absolute_url(self):
        res = self.list.get_absolute_url()
        expected_result = "/api/lists/get-list/bobby/my-awesome-list/"
        self.assertEqual(res, expected_result)
