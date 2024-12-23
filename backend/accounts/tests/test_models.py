from django.test import TestCase

from accounts.models import CustomUser


class CustomTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser(username="bobby", email="bobby@gmail.com")
        return super().setUp()


class CustomUserTestCase(CustomTestCase):
    def test_get_absolute_url(self):
        res = self.user.get_absolute_url()
        expected_result = "/homepage/bobby/"
        self.assertEqual(res, expected_result)
