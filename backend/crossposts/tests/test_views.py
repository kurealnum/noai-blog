from django.template.defaultfilters import slugify
from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.test import APIClient, APIRequestFactory

from accounts.models import CustomUser
from crossposts.models import Crosspost, CrosspostComment, CrosspostReaction


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
        self.crosspost_1 = Crosspost.objects.create(
            title="crosspost_1", user=self.user, post_type="BP"
        )
        self.crosspost_2 = Crosspost.objects.create(
            title="crosspost_2", user=self.user, post_type="L"
        )


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


class CrosspostReactionViewTC(cTestCase):
    def setUp(self):
        super().setUp()
        self.reaction = CrosspostReaction.objects.create(
            user=self.user, post=self.crosspost_1
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

    def test_does_get_succesfully(self):
        self.authenticated_client.login(
            password="TerriblePassword123", username="bobby"
        )
        request = self.authenticated_client.get(
            reverse_lazy(
                "manage_crosspost_reactions",
                args=[self.crosspost_1.user.username, self.crosspost_1.slug_field],
            )
        )
        expected_response = 200
        self.assertEqual(expected_response, request.status_code)

    def test_does_succesfully_create(self):
        self.authenticated_client.login(
            password="TerriblePassword123", username="jonny"
        )
        data = {
            "slug": self.crosspost_1.slug_field,
            "username": self.crosspost_1.user.username,
        }
        request = self.authenticated_client.post(
            reverse_lazy("manage_crosspost_reactions"), data=data
        )
        expected_result = 201

        self.assertEqual(expected_result, request.status_code)

    def test_does_succesfully_delete(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        data = {"slug": self.crosspost_1.slug_field}
        request = temp_client.delete(
            reverse_lazy("manage_crosspost_reactions"), data=data
        )
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)


class CrosspostCommentViewTC(cTestCase):
    def setUp(self):
        super().setUp()
        self.comment_1 = CrosspostComment.objects.create(
            user=self.user, post=self.crosspost_1, content="This is NOT a reply!"
        )
        self.comment_2 = CrosspostComment.objects.create(
            user=self.user, post=self.crosspost_1, content="This is NOT a reply!"
        )

    def test_does_get_work_properly(self):
        request = self.client.get(
            reverse_lazy(
                "get_crosspost_comments",
                kwargs={
                    "slug": self.crosspost_1.slug_field,
                    "username": self.user.username,
                },
            )
        )
        expected_length = 2
        self.assertEqual(expected_length, len(request.data))  # type: ignore

    # delete should not actually delete the comment -- instead, it should set the content of the comment to "This comment was deleted" and change the user to a "ghost" user
    def test_does_delete_work_properly(self):
        new_comment = CrosspostComment.objects.create(
            user=self.user, post=self.crosspost_1, content="Comment"
        )
        id = new_comment.pk
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.delete(
            reverse_lazy("delete_crosspost_comment", args=[id])
        )
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)

    # should only update content
    def test_does_patch_work_properly(self):
        new_comment = CrosspostComment.objects.create(
            user=self.user, post=self.crosspost_1, content="Comment"
        )
        id = new_comment.pk
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.patch(
            reverse_lazy("edit_crosspost_comment", args=[id]),
            data={"content": "Edited!"},
        )

        expected_response = "Edited!"
        expected_status = 200
        self.assertEqual(expected_status, request.status_code)
        self.assertEqual(expected_response, request.data["content"])

    def test_does_create_work_properly_without_reply_to(self):
        data = {
            "slug": self.crosspost_1.slug_field,
            "content": "This is some content",
            "reply_to": "",
            "username": "bobby",
        }
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("create_crosspost_comment"), data)
        expected_status = 201
        self.assertEqual(expected_status, request.status_code)

    # "with" reply_to
    def test_does_create_work_properly_with_reply_to(self):
        data = {
            "slug": self.crosspost_1.slug_field,
            "content": "This is some content",
            "reply_to": self.comment_1.pk,
            "username": "bobby",
        }
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("create_crosspost_comment"), data)
        expected_status = 201
        self.assertEqual(expected_status, request.status_code)


class CrosspostFeedListViewTC(cTestCase):
    def setUp(self):
        super().setUp()
        self.crosspost_3 = Crosspost.objects.create(user=self.user, title="three")
        CrosspostReaction.objects.create(user=self.user, post=self.crosspost_3)
        self.crosspost_4 = Crosspost.objects.create(
            user=self.user,
            title="four",
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
        CrosspostReaction.objects.create(user=self.user, post=self.crosspost_4)
        CrosspostReaction.objects.create(user=self.user_two, post=self.crosspost_4)

    # the order should be list three, two, then one
    def test_does_get_return_in_order(self):
        request = self.client.get(reverse_lazy("get_crosspost_feed", args=[1]))
        expected_first_title = "four"
        expected_second_title = "three"
        expected_third_title = "crosspost_1"
        data = request.data  # type: ignore
        self.assertEqual(expected_first_title, data[0]["title"])
        self.assertEqual(expected_second_title, data[1]["title"])
        self.assertEqual(expected_third_title, data[2]["title"])
