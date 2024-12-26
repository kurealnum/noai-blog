from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.views import APIView

from accounts.helpers import IsAdmin, IsModerator
from accounts.models import CustomUser

"""
Note: we simply pass in `APIView()` to the view parameter to test these classes, because there's no reason to do anything else. We never actually use the view parameter in the class itself anyways.

We test this shit (authentication related stuff) rigorously. If the tests seem over-engineered, good.
"""


class IsModeratorTestCase(TestCase):
    def setUp(self) -> None:
        self.callable = IsModerator()
        self.factory = APIRequestFactory()
        super().setUp()

    def test_with_no_user(self):
        tmp = self.factory.get("/", content_type="application/json")
        request = Request(tmp)  # type:ignore
        # messy? yes, but this is necessary to get full coverage
        request.user = None  # type: ignore
        res = self.callable.has_permission(request, APIView())

        self.assertFalse(res)

    # should still return False because the current user isnt a moderator
    def test_with_authenticated_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
        )
        tmp = self.factory.get("/", content_type="application/json")
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertFalse(res)

    def test_with_authenticated_moderator_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_mod=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)

    def test_with_authenticated_admin_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_admin=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)

    def test_with_authenticated_mod_and_admin_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_mod=True,
            is_admin=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)

    def test_with_authenticated_superuser_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_superuser=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)


class IsAdminTestCase(TestCase):
    def setUp(self) -> None:
        self.callable = IsAdmin()
        self.factory = APIRequestFactory()
        super().setUp()

    def test_with_no_user(self):
        tmp = self.factory.get("/", content_type="application/json")
        request = Request(tmp)  # type:ignore
        # messy? yes, but this is necessary to get full coverage
        request.user = None  # type: ignore
        res = self.callable.has_permission(request, APIView())

        self.assertFalse(res)

    # should still return False because the current user isnt a moderator
    def test_with_authenticated_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
        )
        tmp = self.factory.get("/", content_type="application/json")
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertFalse(res)

    def test_with_authenticated_admin_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_admin=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)

    def test_with_authenticated_superuser_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
            is_superuser=True,
        )
        tmp = self.factory.get("/", content_type="application/json")
        tmp.user = user
        force_authenticate(tmp, user)

        request = Request(tmp)  # type:ignore
        res = self.callable.has_permission(request, APIView())

        self.assertTrue(res)
