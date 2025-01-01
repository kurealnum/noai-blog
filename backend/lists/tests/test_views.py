from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.template.defaultfilters import slugify
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
        request = self.client.get(reverse_lazy("get_list", args=["one"]))
        expected_title = "one"
        self.assertEqual(expected_title, request.data["title"])  # type: ignore

    def test_does_get_with_username_and_slug(self):
        request = self.client.get(reverse_lazy("get_list", args=["bobby", "one"]))
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
        request = self.authenticated_client.post(reverse_lazy("create_list"), data=data)
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
        request = self.authenticated_client.post(reverse_lazy("create_list"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])

    def test_does_edit_properly(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = List.objects.create(
            user=self.user,
            title="my unique blog post",
            content="Here's something about my blog post",
            thumbnail=img,
        )
        to_edit.save()

        # i have no idea why we have to use SimpleUploadedFile for some things and BytesIO for others
        new_img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        new_img.name = "myimage.gif"

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "An edited title",
            "title_slug": to_edit.slug_field,
            "content": "Some new content",
            "thumbnail": new_img,
            "original_slug": to_edit.slug_field,
        }
        request = temp_client.put(reverse_lazy("edit_list"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_work_with_no_img(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = List.objects.create(
            user=self.user,
            title="my unique blog post",
            content="Here's something about my blog post",
            thumbnail=img,
        )
        to_edit.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "An edited title",
            "title_slug": to_edit.slug_field,
            "content": "Some new content",
            "original_slug": to_edit.slug_field,
            "thumbnail": "undefined",
        }
        request = temp_client.put(reverse_lazy("edit_list"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_work_with_new_title(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = List.objects.create(
            user=self.user,
            title="my unique blog post",
            content="Here's something about my blog post",
            thumbnail=img,
        )
        to_edit.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "An edited title",
            "title_slug": slugify("An edited title"),
            "content": "Some new content",
            "original_slug": to_edit.slug_field,
            "thumbnail": "undefined",
        }
        request = temp_client.put(reverse_lazy("edit_list"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_not_put_with_duplicate_title(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = List.objects.create(
            user=self.user,
            title="A basic title",
            content="Here's something about my blog post",
            thumbnail=img,
        )
        to_edit.save()

        duplicate = List.objects.create(
            user=self.user, title="new-title", content="content", thumbnail=img
        )
        duplicate.save()

        # i have no idea why we have to use SimpleUploadedFile for some things and BytesIO for others
        new_img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        new_img.name = "myimage.gif"

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "new-title",
            "title_slug": "new-title",
            "content": "Some new content",
            "thumbnail": new_img,
            "original_slug": to_edit.slug_field,
        }
        request = temp_client.put(reverse_lazy("edit_list"), data=data)
        expected_result = "A post with this title already exists!"
        self.assertEqual(expected_result, request.data["error"])

    def test_does_put_with_no_thumbnail_in_original_post(self):
        # create a separate object to edit
        to_edit = List.objects.create(
            user=self.user,
            title="my unique blog post",
            content="Here's something about my blog post",
        )
        to_edit.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "An edited title",
            "title_slug": to_edit.slug_field,
            "content": "Some new content",
            "thumbnail": "undefined",
            "original_slug": to_edit.slug_field,
        }
        request = temp_client.put(reverse_lazy("edit_list"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_delete_work(self):
        # create an object, then delete it
        to_delete = List.objects.create(
            user=self.user,
            title="my unique list",
            content="Here's something about my list",
        )
        to_delete.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {"slug": to_delete.slug_field}
        request = temp_client.delete(reverse_lazy("delete_list"), data=data)
        expected_status = 204
        self.assertEqual(expected_status, request.status_code)


class ListReactionViewTC(cTestCase):
    def setUp(self):
        super().setUp()
        self.reaction = ListReaction.objects.create(user=self.user, post=self.list_one)
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()

    def test_does_get_succesfully(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.get(
            reverse_lazy(
                "manage_list_reactions",
                args=[self.list_one.user.username, self.list_one.slug_field],
            )
        )
        expected_response = 200
        self.assertEqual(expected_response, request.status_code)

    def test_does_succesfully_create(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        data = {
            "slug": self.list_one.slug_field,
            "username": self.list_one.user.username,
        }
        request = temp_client.post(reverse_lazy("manage_list_reactions"), data=data)
        expected_result = 201

        self.assertEqual(expected_result, request.status_code)

    def test_does_succesfully_delete(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        data = {"slug": self.list_one.slug_field}
        request = temp_client.delete(reverse_lazy("manage_list_reactions"), data=data)
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)
