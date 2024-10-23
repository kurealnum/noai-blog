from io import BytesIO
import json
from unittest.case import expectedFailure
from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.views import LinksView
from .models import CustomUser, Link
from blogs.models import BlogPost, Comment
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
        request = self.client.get(reverse_lazy("is_authenticated"))
        self.assertFalse(request.data["is_authenticated"])  # type: ignore (for request.data)

    def test_does_authenticated_user_pass(self):
        # making a temp client because we have to authenticate
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("is_authenticated"))
        self.assertTrue(request.data["is_authenticated"])  # type: ignore (for request.data)


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
            "approved_ai_usage": False,
            "username": "bobby",
            "email": "bobbyjoe@gmail.com",
            "first_name": "Bobby",
            "last_name": "Joe",
            "about_me": "I am Bobby Joe, destroyer of worlds.",
            "technical_info": "",
            "flagged": False,
        }

        # remove date joined and profile picture for testing purposes
        data = result.data  # type: ignore
        data.pop("date_joined")
        data.pop("profile_picture")

        formatted_result = dict(data)
        self.assertEqual(expected_result, formatted_result)

    def test_output_when_user_does_not_exist(self):
        # temp client for logging in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("user_info") + "thewrongusername/")
        expected_result = "Not found."
        result = request.data

        self.assertEqual(expected_result, result["detail"])

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
            "approved_ai_usage": False,
            "flagged": False,
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
        result = str(result.data["profile_picture"][0])

        expected_result = (
            "The submitted data was not a file. Check the encoding type on the form."
        )
        self.assertEqual(expected_result, result)


class LinksTestCase(CustomTestCase):
    def setUp(self):
        # just doing this so i can add two new links to test a put and delete request on
        super().setUp()
        self.linkone = Link.objects.create(
            link="google.com", name="MyLink1", user=self.user
        )
        self.linktwo = Link.objects.create(
            link="google.com", name="MyLink2", user=self.user
        )

    # need to actually test a method here
    def test_get_permissions_with_anything_but_get(self):
        instance = LinksView()
        request = self.factory.put(reverse_lazy("links"))
        instance.request = request
        expected_result = (type(AllowAny()), type(IsAuthenticated()))
        result = instance.get_permissions()
        formatted_result = (type(result[0]), type(result[1]))
        self.assertEqual(expected_result, formatted_result)

    # see above
    def test_get_permissions_with_get_itself(self):
        instance = LinksView()
        request = self.factory.get(reverse_lazy("links"))
        instance.request = request
        expected_result = type(AllowAny())
        formatted_result = type(instance.get_permissions()[0])
        self.assertEqual(expected_result, formatted_result)

    # a put request where both links already exist
    def test_put_request(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        # type:ignore is again because the id field isnt detected
        # we have to use json.dumps because of the content_type in the put request
        data = json.dumps(
            [
                {
                    "link": "https://yahoo.com",
                    "name": "newName1",
                    "user": self.user.id,  # type: ignore
                    "id": self.linkone.id,  # type: ignore
                },
                {
                    "link": "https://yahoo.com",
                    "name": "newName2",
                    "user": self.user.id,  # type: ignore
                    "id": self.linktwo.id,  # type: ignore
                },
            ]
        )

        result = temp_client.put(
            reverse_lazy("links"), data, content_type="application/json"
        )

        expected_result = 201
        self.assertEqual(expected_result, result.status_code)

    def test_put_request_with_invalid_data(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")

        # type:ignore is again because the id field isnt detected
        # we have to use json.dumps because of the content_type in the put request
        data = json.dumps(
            [
                {
                    "name": "newName1",
                    "user": self.user.id,  # type: ignore
                    "id": self.linkone.id,  # type: ignore
                },
            ]
        )

        result = temp_client.put(
            reverse_lazy("links"), data, content_type="application/json"
        )
        result = str(result.data["link"][0])

        expected_result = "This field is required."
        self.assertEqual(expected_result, result)

    # the data in this is purposefully invalid
    def test_put_request_with_link_that_does_not_exist(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")

        # type:ignore is again because the id field isnt detected
        # we have to use json.dumps because of the content_type in the put request
        data = json.dumps(
            [
                {
                    "name": "newName1",
                    "user": self.user.id,  # type: ignore
                    "id": 999,
                },
            ]
        )

        result = temp_client.put(
            reverse_lazy("links"), data, content_type="application/json"
        )
        result = str(result.data["link"][0])
        expected_result = "This field is required."

        self.assertEqual(expected_result, result)

    # same as above, but with valid data
    def test_put_request_with_link_that_does_not_exist_with_valid_data(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")

        # type:ignore is again because the id field isnt detected
        # we have to use json.dumps because of the content_type in the put request
        data = json.dumps(
            [
                {
                    "link": "https://google.com",
                    "name": "newName1",
                    "user": self.user.id,  # type: ignore
                },
            ]
        )

        result = temp_client.put(
            reverse_lazy("links"), data, content_type="application/json"
        )

        expected_result = 201
        self.assertEqual(expected_result, result.status_code)

    def test_delete_request_when_object_exists(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {"id": self.linkone.id}  # type: ignore (because .id again)

        result = temp_client.delete(reverse_lazy("links"), data)

        expected_result = 204
        self.assertEqual(expected_result, result.status_code)

    def test_delete_request_when_object_does_not_exist(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {"id": 999}  # type: ignore (because .id again)

        result = temp_client.delete(reverse_lazy("links"), data)
        result = str(result.data["detail"])
        expected_result = "Not found."

        self.assertEqual(expected_result, result)

    def test_post_request(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "link": "https://google.com",
            "name": "MyNewLink",
        }

        result = temp_client.post(reverse_lazy("links"), data, format="json")
        expected_result = 201
        self.assertEqual(expected_result, result.status_code)

    def test_post_request_with_non_https_link(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "link": "http://google.com",
            "name": "MyNewLink",
        }

        result = temp_client.post(reverse_lazy("links"), data, format="json")
        expected_result = "Your link needs to be HTTPS"
        self.assertEqual(
            expected_result, json.loads(result.content)["non_field_errors"][0]
        )

    def test_get_request_with_correct_username(self):
        request = self.client.get(reverse_lazy("links") + "bobby/")
        expected_result = 200
        self.assertEqual(expected_result, request.status_code)

    def test_get_request_with_incorrect_username(self):
        request = self.client.get(reverse_lazy("links") + "anincorrectusername/")
        result = str(request.data["detail"])  # type: ignore because of .data (it's valid tho)
        expected_result = "Not found."
        self.assertEqual(expected_result, result)

    # using self.request.user to query instead of username (see view for more info)
    def test_get_request_with_logged_in_user(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("links"))
        expected_result = 200
        self.assertEqual(expected_result, request.status_code)


class RegisterTestCase(CustomTestCase):
    def test_register_with_valid_data(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        data = {
            "email": "toby@gmail.com",
            "username": "toby1",
            "first_name": "toby",
            "last_name": "maguire",
            "about_me": "i dont actually know who this person is",
            "password": "myawfulpassword123!!",
            "technical_info": "hacker",
            "profile_picture": img,
        }
        request = self.client.post(reverse_lazy("register"), data)
        expected_response = 201
        self.assertEqual(request.status_code, expected_response)

    # same thing as `test_register_with_valid_data` except we dont send `profile_picture` and `technical_info`
    def test_register_with_invalid_data(self):
        data = {
            "email": "toby@gmail.com",
            "username": "toby1",
            "first_name": "toby",
            "last_name": "maguire",
            "about_me": "i dont actually know who this person is",
            "password": "myawfulpassword123!!",
        }
        request = self.client.post(reverse_lazy("register"), data)
        expected_response = 400
        self.assertEqual(request.status_code, expected_response)


class NotificationViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.post = BlogPost.objects.create(
            user=self.user, title="My blog post", content="My weird blog post"
        )
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()
        self.alt_post = BlogPost.objects.create(
            user=self.altuser, title="huh", content="My weird blog post"
        )
        self.original_comment = Comment.objects.create(
            user=self.user, post=self.post, content="Hello world", is_read=True
        )

        # these should be included in the get request
        Comment.objects.create(
            user=self.user,
            post=self.post,
            content="Hello world",
            is_read=True,
            reply_to=self.original_comment,
        )
        Comment.objects.create(
            user=self.user,
            post=self.post,
            content="Hello world",
            is_read=False,
            reply_to=self.original_comment,
        )
        Comment.objects.create(
            user=self.user,
            post=self.alt_post,
            content="I am the other unread comment",
            is_read=False,
            reply_to=self.original_comment,
        )

        # this should not be included
        Comment.objects.create(
            user=self.user,
            post=self.alt_post,
            content="I am the other unread comment",
            is_read=False,
        )

    def test_does_get_return_correctly(self):
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("notifications"))
        expected_result = "Hello world"
        expected_read = False
        expected_length = 4

        self.assertEqual(expected_result, request.data[1]["content"])
        self.assertEqual(expected_read, request.data[1]["is_read"])
        self.assertEqual(expected_length, len(request.data))


class NotificationCountViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.post = BlogPost.objects.create(
            user=self.user, title="My blog post", content="My weird blog post"
        )

        # unread comments
        Comment.objects.create(
            user=self.user, post=self.post, content="Hello world", is_read=False
        )
        Comment.objects.create(
            user=self.user,
            post=self.post,
            content="I am the other unread comment",
            is_read=False,
        )

        # read comments
        Comment.objects.create(
            user=self.user, post=self.post, content="Hello world", is_read=True
        )

    # should only return unread comments
    def test_does_count_equal_three(self):
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("notifications_count"))
        expected_result = 2

        self.assertEqual(expected_result, request.data["count"])
