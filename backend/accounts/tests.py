from io import BytesIO
from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.views import Links, UserInfoView
from .models import CustomUser, Link
from blogs.models import BlogPost
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate


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
        self.client = APIClient()
        self.factory = APIRequestFactory()


# Models


class CustomUserTestCase(CustomTestCase):
    def test_can_make_blog_post(self):
        BlogPost.objects.create(
            user=self.user, title="My blog post", content="My weird blog post"
        )

        is_blog_post = BlogPost.objects.get(user=self.user)
        self.assertIsNotNone(is_blog_post)


# Views
class LoginUserTestCase(CustomTestCase):
    def test_do_correct_credentials_authenticate_user(self):
        request = self.client.post(
            reverse_lazy("login"),
            {"username": "bobby", "password": "TerriblePassword123"},
            format="json",
        )

        expected_result = "User authenticated"
        self.assertEqual(expected_result, request.data["success"])  # type: ignore (for request.data)

    def test_does_incorrect_password_not_authenticate_user(self):
        request = self.client.post(
            reverse_lazy("login"),
            {"username": "bobby", "password": "TheWrongPassword"},
            format="json",
        )

        expected_result = "Error Authenticating"
        self.assertEqual(expected_result, request.data["error"])  # type: ignore (for request.data)


class CheckAuthenticatedTestCase(CustomTestCase):
    def test_does_unauthenticated_user_fail(self):
        request = self.client.post(reverse_lazy("is_authenticated"))
        expected_result = "error"
        self.assertEqual(expected_result, request.data["isAuthenticated"])  # type: ignore (for request.data)

    def test_does_authenticated_user_pass(self):
        # making a temp client because we have to authenticate
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("is_authenticated"))
        expected_result = "success"
        self.assertEqual(expected_result, request.data["isAuthenticated"])  # type: ignore (for request.data)


class LogoutUserTestCase(CustomTestCase):
    def test_does_logout_work_on_authenticated_user(self):
        # again, making a temp client as to not mess with authentication
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("logout"))
        expected_result = "You have been logged out"
        self.assertEqual(expected_result, request.data["success"])


class UserInfoTestCase(CustomTestCase):

    def test_does_request_return_correct_output(self):
        # request = self.factory.get("/accounts/user-info/")
        # force_authenticate(request)
        # result = UserInfoView.as_view()(request, username="bobby")  # type: ignore
        result = self.client.get(reverse_lazy("user_info") + "bobby/")
        expected_result = {
            "username": "bobby",
            "email": "bobbyjoe@gmail.com",
            "first_name": "Bobby",
            "last_name": "Joe",
            "about_me": "I am Bobby Joe, destroyer of worlds.",
            "technical_info": "",
        }

        # remove date joined and profile picture for testing purposes
        data = result.data  # type: ignore
        data.pop("date_joined")
        data.pop("profile_picture")

        formatted_result = dict(data)
        self.assertEqual(expected_result, formatted_result)

    def test_output_when_user_does_not_exist(self):
        request = self.factory.get(reverse_lazy("user_info"))
        force_authenticate(request)
        result = UserInfoView.as_view()(request, username="NotCorrectName")  # type: ignore
        expected_result = 404

        self.assertEqual(expected_result, result.status_code)

    # testing output with no username, instead using user.id (see view for more details)
    def test_output_with_logged_in_user(self):
        # using temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        result = temp_client.get(reverse_lazy("user_info"))
        expected_result = {
            "username": "bobby",
            "email": "bobbyjoe@gmail.com",
            "first_name": "Bobby",
            "last_name": "Joe",
            "about_me": "I am Bobby Joe, destroyer of worlds.",
            "technical_info": "",
        }

        # remove date joined and profile picture for testing purposes
        result.data.pop("date_joined")
        result.data.pop("profile_picture")

        self.assertEqual(expected_result, result.data)


class ChangeProfilePictureTestCase(CustomTestCase):
    def test_can_set_profile_picture(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        # using temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        result = temp_client.patch(
            reverse_lazy("change_profile_picture"),
            {"profile_picture": img},
            format="multipart",
        )

        expected_result = 201
        self.assertEqual(expected_result, result.status_code)

    def test_bad_request(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        # using temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        result = temp_client.patch(
            reverse_lazy("change_profile_picture"),
            {
                "profile_picture": img.getvalue()
            },  # this is the incorrect part (.getvalue())
            format="multipart",
        )

        expected_result = 400
        self.assertEqual(expected_result, result.status_code)


class LinksTestCase(CustomTestCase):
    def setUp(self):
        # just doing this so i can add two new links to test a put and delete request on
        super().setUp()
        Link.objects.create(link="google.com", name="MyLink1", user=self.user)
        Link.objects.create(link="google.com", name="MyLink2", user=self.user)

    # need to actually test a method here
    def test_get_permissions_with_anything_but_get(self):
        instance = Links()
        request = self.factory.put(reverse_lazy("links"))
        instance.request = request
        excpected_result = (type(AllowAny()), type(IsAuthenticated()))
        result = instance.get_permissions()
        formatted_result = (type(result[0]), type(result[1]))
        self.assertEqual(excpected_result, formatted_result)

    # see above
    def test_get_permissions_with_get_itself(self):
        instance = Links()
        request = self.factory.get(reverse_lazy("links"))
        instance.request = request
        excpected_result = type(AllowAny())
        formatted_result = type(instance.get_permissions()[0])
        self.assertEqual(excpected_result, formatted_result)

    def test_put_request(self):
        # temp client to log in
        temp_factory = APIRequestFactory()
        data = [{"link": "yahoo.com", "name": "newName1"}]
        request = temp_factory.put(reverse_lazy("links"), data=data)
        force_authenticate(request)
        result = Links.as_view()(request)

        print(result.status_code)
