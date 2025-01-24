from io import BytesIO
import json
from django.template.defaultfilters import slugify
from django.test import TestCase
from django.urls import reverse_lazy
from accounts.models import CustomUser
from rest_framework.test import APIClient, APIRequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile

from ..models import (
    BlogPost,
    CommentReaction,
    Crosspost,
    Follower,
    PostReaction,
    PostComment,
)


class CustomTestCase(TestCase):
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
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
        self.blog_post.save()
        self.admin = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="bethy",
            is_admin=True,
        )
        self.admin.set_password("TerriblePassword123")
        self.admin.save()
        self.authenticated_client = APIClient()
        self.authenticated_client.login(
            username="bobby", password="TerriblePassword123"
        )


class CommentTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is a very polite comment"
        )

    def test_does_react_count(self):
        CommentReaction.objects.create(user=self.user, comment=self.comment)
        reaction_count = CommentReaction.objects.filter(user=self.user).count()
        expected_result = 1
        self.assertEqual(expected_result, reaction_count)


class CommentListUserViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )

    def test_get(self):
        # temp client to log in
        request = self.authenticated_client.get(
            reverse_lazy("manage_comments", kwargs={"post_type": "blog-post"}),
        )
        # expected result for both
        expected_result = "This is NOT a reply!"
        result = json.loads(request.content)
        self.assertEqual(expected_result, result[0].get("content"))
        self.assertEqual(expected_result, result[1].get("content"))


class CommentListUserView_CrosspostTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.crosspost_1 = BlogPost.objects.create(
            user=self.user,
            title="My very awesome list",
            content="Here's something about my list",
            post_type="crosspost",
        )
        PostComment.objects.create(
            user=self.user,
            post=self.crosspost_1,
            content="This is NOT a reply!",
            post_type="crosspost",
        )
        PostComment.objects.create(
            user=self.user,
            post=self.crosspost_1,
            content="This is NOT a reply!",
            post_type="crosspost",
        )

    def test_get(self):
        # temp client to log in
        request = self.authenticated_client.get(
            reverse_lazy("manage_comments", kwargs={"post_type": "crosspost"}),
        )
        # expected result for both
        expected_result = "This is NOT a reply!"
        result = request.data
        self.assertEqual(expected_result, result[0].get("content"))
        self.assertEqual(expected_result, result[1].get("content"))


class BlogPostCommentViewTC(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )

    def test_does_get_work_properly(self):
        request = self.client.get(
            reverse_lazy(
                "get_comments",
                kwargs={
                    "slug": self.blog_post.slug_field,
                    "username": self.user.username,
                },
            )
        )
        expected_length = 2
        self.assertEqual(expected_length, len(request.data))  # type: ignore

    # delete should not actually delete the comment -- instead, it should set the content of the comment to "This comment was deleted" and change the user to a "ghost" user
    def test_does_delete_work_properly(self):
        new_comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="Comment"
        )
        id = new_comment.pk
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.delete(reverse_lazy("delete_comment", args=[id]))
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)

    # should only update content
    def test_does_patch_work_properly(self):
        new_comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="Comment"
        )
        id = new_comment.pk
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.patch(
            reverse_lazy("edit_comment", args=[id]), data={"content": "Edited!"}
        )

        expected_response = "Edited!"
        expected_status = 200
        self.assertEqual(expected_status, request.status_code)
        self.assertEqual(expected_response, request.data["content"])

    def test_does_create_work_properly_without_reply_to(self):
        data = {
            "slug": self.blog_post.slug_field,
            "content": "This is some content",
            "reply_to": "",
            "username": "bobby",
        }
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("create_comment"), data)
        expected_status = 201
        self.assertEqual(expected_status, request.status_code)

    # "with" reply_to
    def test_does_create_work_properly_with_reply_to(self):
        data = {
            "slug": self.blog_post.slug_field,
            "content": "This is some content",
            "reply_to": self.comment.pk,
            "username": "bobby",
        }
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.post(reverse_lazy("create_comment"), data)
        expected_status = 201
        self.assertEqual(expected_status, request.status_code)


class BlogPostViewTestCase(CustomTestCase):
    def test_does_work_with_correct_title(self):
        request = self.client.get(
            reverse_lazy(
                "get_post", kwargs={"username": "bobby", "slug": "my-awesome-blog-post"}
            )
        )
        request = json.loads(request.content)
        expected_result = "Here's something about my blog post"
        self.assertEqual(expected_result, request["content"])

    def test_does_work_with_wrong_title(self):
        request = self.client.get(
            reverse_lazy(
                "get_post", kwargs={"username": "bobby", "slug": "the-wrong-title"}
            )
        )

        expected_status = 404
        self.assertEqual(expected_status, request.status_code)

    def test_does_post_with_post_type(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            "thumbnail": img,
            "post_type": "blog-post",
        }
        request = temp_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])

    def test_does_post_with_no_thumbnail(self):
        # temp client to log in
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            # this is how JS handles this, so we have to manually put "undefined"
            "thumbnail": "undefined",
            "post_type": "list",
        }
        request = self.authenticated_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])

    def test_does_delete_work(self):
        # create an object, then delete it
        to_delete = BlogPost.objects.create(
            user=self.user,
            title="my unique blog post",
            content="Here's something about my blog post",
        )
        to_delete.save()

        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {"slug": to_delete.slug_field}
        request = temp_client.delete(reverse_lazy("create_post"), data=data)
        expected_status = 204
        self.assertEqual(expected_status, request.status_code)

    def test_does_edit_properly(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = BlogPost.objects.create(
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
        request = temp_client.put(reverse_lazy("edit_post"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_work_with_no_img(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = BlogPost.objects.create(
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
        request = temp_client.put(reverse_lazy("edit_post"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_edit_work_with_new_title(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = BlogPost.objects.create(
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
        request = temp_client.put(reverse_lazy("edit_post"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])

    def test_does_not_put_with_duplicate_title(self):
        img = SimpleUploadedFile(
            "test.gif",
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00",
        )
        # create a separate object to edit
        to_edit = BlogPost.objects.create(
            user=self.user,
            title="A basic title",
            content="Here's something about my blog post",
            thumbnail=img,
        )
        to_edit.save()

        duplicate = BlogPost.objects.create(
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
        request = temp_client.put(reverse_lazy("edit_post"), data=data)
        expected_result = "A post with this title already exists!"
        self.assertEqual(expected_result, request.data["error"])

    def test_does_put_with_no_thumbnail_in_original_post(self):
        # create a separate object to edit
        to_edit = BlogPost.objects.create(
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
        request = temp_client.put(reverse_lazy("edit_post"), data=data)
        expected_result = "An edited title"
        self.assertEqual(expected_result, request.data["title"])


class BlogPostView_CrosspostTestCase(CustomTestCase):
    def test_does_post_with_post_type(self):
        img = BytesIO(
            b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00"
            b"\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x00\x00"
        )
        img.name = "myimage.gif"
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            "thumbnail": img,
            "post_type": "crosspost",
            "url": "https://google.com",
        }
        request = temp_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])

    def test_does_post_with_no_thumbnail(self):
        # temp client to log in
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
            # this is how JS handles this, so we have to manually put "undefined"
            "thumbnail": "undefined",
            "post_type": "crosspost",
            "url": "https://google.com",
        }
        request = self.authenticated_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])


class BlogPostListViewTC(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        # alternative user
        self.alternative_user = CustomUser.objects.create(
            email="marysue@gmail.com",
            first_name="Mary",
            last_name="Sue",
            about_me="I do not destroy worlds!",
            username="MarySue",
        )
        self.alternative_blog_post = BlogPost.objects.create(
            user=self.alternative_user,
            title="My very awesome blog post",
            content="Here's something about my blog post",
        )

    def test_blogpostlist_returns_correctly(self):
        # temp client for logging in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        response = temp_client.get(
            reverse_lazy("get_posts", kwargs={"post_type": "blog-post"})
        )

        # expected_title, basically
        expected_result = "My awesome blog post"
        self.assertEqual(expected_result, response.data[0].get("title"))

    def test_with_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts", kwargs={"username": "bobby", "post_type": "blog-post"}
            )
        )
        expected_result = "My awesome blog post"
        result = json.loads(request.content)[0].get("title")
        self.assertEqual(result, expected_result)

    def test_with_incorrect_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts",
                kwargs={"username": "thewrongusername", "post_type": "blog-post"},
            )
        )
        expected_result = "Not found."
        self.assertEqual(json.loads(request.content)["detail"], expected_result)


class BlogPostList_List_TestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        # alternative user
        self.alternative_user = CustomUser.objects.create(
            email="marysue@gmail.com",
            first_name="Mary",
            last_name="Sue",
            about_me="I do not destroy worlds!",
            username="MarySue",
        )
        self.alternative_user.set_password("TerriblePassword123")
        self.alternative_user.save()
        self.alternative_list = BlogPost.objects.create(
            user=self.alternative_user,
            title="My very awesome list",
            content="Here's something about my list",
            post_type="list",
        )

    def test_get_returns_correctly_with_list(self):
        temp_client = APIClient()
        temp_client.login(username="MarySue", password="TerriblePassword123")
        response = temp_client.get(
            reverse_lazy("get_posts", kwargs={"post_type": "list"})
        )

        # expected_title, basically
        expected_result = "My very awesome list"
        self.assertEqual(expected_result, response.data[0].get("title"))

    def test_with_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts", kwargs={"post_type": "list", "username": "MarySue"}
            )
        )
        expected_result = "My very awesome list"
        result = json.loads(request.content)[0].get("title")
        self.assertEqual(result, expected_result)

    def test_with_incorrect_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts",
                kwargs={"post_type": "list", "username": "thewrongusername"},
            )
        )
        expected_result = "Not found."
        self.assertEqual(json.loads(request.content)["detail"], expected_result)


class BlogPostList_CrosspostViewTC(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        # alternative user
        self.alternative_user = CustomUser.objects.create(
            email="marysue@gmail.com",
            first_name="Mary",
            last_name="Sue",
            about_me="I do not destroy worlds!",
            username="MarySue",
        )
        self.alternative_user.set_password("TerriblePassword123")
        self.alternative_user.save()
        self.crosspost_1 = BlogPost.objects.create(
            user=self.alternative_user,
            title="My very awesome list",
            content="Here's something about my list",
            post_type="crosspost",
        )
        self.crosspost_1_data = Crosspost.objects.create(
            blog_post=self.crosspost_1, url="https://google.com"
        )

    def test_get_returns_correctly_with_list(self):
        temp_client = APIClient()
        temp_client.login(username="MarySue", password="TerriblePassword123")
        request = temp_client.get(
            reverse_lazy("get_posts", kwargs={"post_type": "crossposts"})
        )

        # expected_title, basically
        expected_result = "My very awesome list"
        expected_url = "https://google.com"
        self.assertEqual(expected_url, request.data[0]["crosspost"].get("url"))
        self.assertEqual(expected_result, request.data[0].get("title"))

    def test_with_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts", kwargs={"post_type": "cross-post", "username": "MarySue"}
            )
        )
        expected_result = "My very awesome list"
        expected_url = "https://google.com"
        data = request.data  # type: ignore
        self.assertEqual(expected_url, data[0]["crosspost"].get("url"))
        self.assertEqual(expected_result, data[0].get("title"))

    def test_with_incorrect_username(self):
        request = self.client.get(
            reverse_lazy(
                "get_posts",
                kwargs={"post_type": "crosspost", "username": "thewrongusername"},
            )
        )
        expected_result = "Not found."
        self.assertEqual(json.loads(request.content)["detail"], expected_result)


class CommentReplyListTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        self.comment_two = PostComment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="This IS a reply!",
            reply_to=self.comment,
        )

    # checks to ensure that this view only returns replies to *comments* that a user has made
    def test_commentreplylist_returns_correctly(self):
        # temp client for logging in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        response = temp_client.get(reverse_lazy("get_comment_replies"))
        expected_result = "This IS a reply!"
        self.assertEqual(expected_result, response.data[0].get("content"))


class PostReplyListTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        self.comment_two = PostComment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="This IS a reply!",
            reply_to=self.comment,
        )

    # checks to ensure that this view only returns replies to *posts* that a user has made
    def test_postreplylist_returns_correctly(self):
        # temp client for logging in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        response = temp_client.get(reverse_lazy("get_post_replies"))
        expected_result = "This is NOT a reply!"
        self.assertEqual(expected_result, response.data[0].get("content"))


class FeedListTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()

        # alt user
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()

        # creating blog posts to "query" for
        self.blog_post_1 = BlogPost.objects.create(
            user=self.user,
            title="1",
            content="Here's something about my blog post",
        )
        # this post should be worth 50 "score"
        self.blog_post_2 = BlogPost.objects.create(
            user=self.altuser,
            title="2",
            content="Here's something about my blog post",
        )
        self.blog_post_3 = BlogPost.objects.create(
            user=self.user,
            title="3",
            content="Here's something about my blog post",
        )

        # adding a comment to test that the 3rd blog post is listed first
        PostComment.objects.create(
            user=self.user, content="a comment", post=self.blog_post_3
        )

        Follower.objects.create(user=self.altuser, follower=self.user)

    def test_feedlist_returns_correctly_on_first_page(self):
        # temp client for logging in
        response = self.client.get(
            reverse_lazy("feed", kwargs={"index": 1, "post_type": "blogPost"})
        )
        # the title of the 3rd blog post is 3
        expected_result = "3"
        self.assertEqual(expected_result, response.data[0].get("title"))  # type: ignore

    # should return an empty array
    def test_feedlist_returns_correctly_on_second_page(self):
        response = self.client.get(
            reverse_lazy("feed", kwargs={"index": 2, "post_type": "blogPost"})
        )

        # there should be nothing on this page
        expected_length = 0
        self.assertEqual(expected_length, len(response.data))  # type: ignore

    def test_feedlist_returns_correctly_for_authenticated_user(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        response = temp_client.get(
            reverse_lazy("feed", kwargs={"index": 1, "post_type": "blogPost"})
        )
        expected_response = 50

        self.assertEqual(expected_response, response.data[0]["score"])

    def test_feedlist_returns_correctly_with_listicle_debuff(self):
        self.blog_post_1.is_listicle = True
        self.blog_post_1.save()

        response = self.client.get(
            reverse_lazy("feed", kwargs={"index": 1, "post_type": "blogPost"})
        )
        expected_score = -30

        self.assertEqual(expected_score, response.data[-1]["score"])  # type: ignore


class FeedList_CrosspostTC(CustomTestCase):
    def setUp(self):
        super().setUp()
        # alt user
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()

        # creating blog posts to "query" for
        self.crosspost_1 = BlogPost.objects.create(
            user=self.user,
            title="1",
            content="Here's something about my blog post",
            post_type="crosspost",
        )

        self.crosspost_1_data = Crosspost.objects.create(
            blog_post=self.crosspost_1, url="https://google.com"
        )

        # this post should be worth 50 "score" because of the follower object
        self.crosspost_2 = BlogPost.objects.create(
            user=self.altuser,
            title="2",
            content="Here's something else about another blog post",
            post_type="crosspost",
        )

        self.crosspost_2_data = Crosspost.objects.create(
            blog_post=self.crosspost_2, url="https://example.com"
        )

        self.crosspost_3 = BlogPost.objects.create(
            user=self.user,
            title="3",
            content="Yet another blog post to crosspost",
            post_type="crosspost",
        )

        self.crosspost_3_data = Crosspost.objects.create(
            blog_post=self.crosspost_3, url="https://stackoverflow.com"
        )

        # adding a comment to test that the 3rd blog post is listed first
        PostComment.objects.create(
            user=self.user, content="a comment", post=self.crosspost_3
        )

        Follower.objects.create(user=self.altuser, follower=self.user)

    def test_get_returns_correctly_with_crosspost(self):
        request = self.client.get(
            reverse_lazy("feed", kwargs={"index": 1, "post_type": "crosspost"})
        )

        # the title of the 3rd blog post is 3
        expected_result = "3"
        expected_link = "https://stackoverflow.com"
        self.assertEqual(expected_result, request.data[0].get("title"))  # type: ignore
        self.assertEqual(expected_link, request.data[0]["crosspost"].get("url"))  # type: ignore


class FollowerViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()
        self.follower = Follower.objects.create(follower=self.altuser, user=self.user)

    def test_does_get_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.get(reverse_lazy("manage_followers"))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data[0]["user"]["username"])

    def test_does_post_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.post(
            reverse_lazy("manage_followers"),
            data={"followee": self.altuser.username},
        )
        expected_result = 201
        self.assertEqual(expected_result, request.status_code)

    # testing the deletion of self.follower (django tests run sequentially, so this should be fine!!!)
    def test_does_delete_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.delete(
            reverse_lazy("manage_followers"),
            data={"followee": self.altuser.username},
        )
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)


class FollowingViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.altuser = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Jon",
            last_name="Lasty",
            about_me="I am Jon, destroyer of worlds.",
            username="jonny",
        )
        self.altuser.set_password("TerriblePassword123")
        self.altuser.save()
        self.follower = Follower.objects.create(follower=self.altuser, user=self.user)

    def test_does_get_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following"))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data[0]["user"]["username"])

    def test_does_get_request_with_parameter_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following", args=["bobby"]))
        expected_result = "bobby"

        self.assertEqual(expected_result, request.data["user"]["username"])

    def test_does_get_with_incorrect_username_return_404(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        request = temp_client.get(reverse_lazy("manage_following", args=["idontexist"]))
        expected_result = "This user does not exist"

        self.assertEqual(expected_result, request.data["error"])


class ReactionViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.reaction = PostReaction.objects.create(user=self.user, post=self.blog_post)
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
                "manage_post_reactions",
                args=[self.blog_post.user.username, self.blog_post.slug_field],
            )
        )
        expected_response = 200
        self.assertEqual(expected_response, request.status_code)

    def test_does_succesfully_create(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="jonny")
        data = {
            "slug": self.blog_post.slug_field,
            "username": self.blog_post.user.username,
        }
        request = temp_client.post(reverse_lazy("manage_post_reactions"), data=data)
        expected_result = 201

        self.assertEqual(expected_result, request.status_code)

    def test_does_succesfully_delete(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        data = {"slug": self.blog_post.slug_field}
        request = temp_client.delete(reverse_lazy("manage_post_reactions"), data=data)
        expected_result = 204
        self.assertEqual(expected_result, request.status_code)


class ModeratorModifyPostViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.moderator = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="moderator",
            is_mod=True,
        )
        self.moderator.set_password("TerriblePassword123")
        self.moderator.save()

    def test_does_patch_work(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="moderator")
        request = temp_client.patch(
            reverse_lazy(
                "toggle_flagged_post",
                kwargs={"username": "bobby", "slug": self.blog_post.slug_field},
            )
        )

        expected_result = 204
        flagged_blog_post = BlogPost.objects.get(
            user__username="bobby", slug_field=self.blog_post.slug_field
        )
        self.assertEqual(expected_result, request.status_code)
        self.assertTrue(flagged_blog_post.flagged)


class ModeratorModifyCommentViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.moderator = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="moderator",
            is_mod=True,
        )
        self.moderator.set_password("TerriblePassword123")
        self.moderator.save()

    def test_does_patch_work_with_mod_user(self):
        comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="A really good comment"
        )
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="moderator")
        request = temp_client.patch(
            reverse_lazy("toggle_flagged_comment", kwargs={"id": comment.pk}),
        )

        new_comment = PostComment.objects.get(pk=comment.pk)
        expected_status = 204
        self.assertEqual(expected_status, request.status_code)
        self.assertTrue(new_comment.flagged)


class ModeratorModifyUserViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        self.moderator = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="moderator",
            is_mod=True,
        )
        self.moderator.set_password("TerriblePassword123")
        self.moderator.save()

    def test_does_patch_work_with_mod_user(self):
        user = CustomUser.objects.create(
            email="testuser@gmail.com",
            first_name="test",
            last_name="user",
            about_me="I am a test user, destroyer of worlds.",
            username="testuser1",
        )

        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="moderator")
        request = temp_client.patch(
            reverse_lazy("toggle_flagged_user", kwargs={"username": user.username})
        )

        user.refresh_from_db()
        expected_status = 204
        self.assertEqual(expected_status, request.status_code)
        self.assertTrue(user.flagged)


class AdminGetAllFlaggedPostsTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        # unflagged posts
        BlogPost.objects.create(
            user=self.user,
            title="omg so many tests",
            content="Here's something about my blog post",
        )
        BlogPost.objects.create(
            user=self.user,
            title="test 93",
            content="Here's something about my blog post",
            flagged=False,
        )

        # flagged posts
        BlogPost.objects.create(
            user=self.user,
            title="test idek anymore",
            content="A flagged post",
            flagged=True,
        )

    def test_does_get_return_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")
        request = temp_client.get(reverse_lazy("get_flagged_posts"))

        expected_length = 1
        expected_content = "A flagged post"

        self.assertEqual(expected_length, len(request.data))
        self.assertEqual(expected_content, request.data[0]["content"])


class AdminGetAllFlaggedCommentsViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()

        # unflagged
        PostComment.objects.create(
            user=self.user, post=self.blog_post, content="A really good comment"
        )
        PostComment.objects.create(
            user=self.user, post=self.blog_post, content="A really good comment"
        )

        # flagged
        PostComment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="A flagged comment",
            flagged=True,
        )

    def test_does_get_work_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")
        request = temp_client.get(reverse_lazy("get_flagged_comments"))

        expected_length = 1
        expected_content = "A flagged comment"

        self.assertEqual(expected_length, len(request.data))
        self.assertEqual(expected_content, request.data[0]["content"])


class AdminGetAllFlaggedUsersViewTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()

        # flagged users
        self.user_one = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="userone",
            flagged=True,
        )
        self.user_two = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="I am Beth, destroyer of worlds.",
            username="usertwo",
            flagged=True,
        )
        self.user_three = CustomUser.objects.create(
            email="jon@gmail.com",
            first_name="Beth",
            last_name="Lasty",
            about_me="flaggeduser3.",
            username="userthree",
            flagged=True,
        )

    def test_does_get_work_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")
        request = temp_client.get(reverse_lazy("get_flagged_users"))

        expected_length = 3
        expected_content = "flaggeduser3."

        self.assertEqual(expected_length, len(request.data))
        self.assertEqual(expected_content, request.data[-1]["about_me"])


class AdminManagePostViewTestCase(CustomTestCase):
    def test_delete_post(self):
        post = BlogPost.objects.create(
            user=self.user,
            title="i will be deleted",
            content="Here's something about my blog post",
        )

        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")

        request = temp_client.delete(
            reverse_lazy(
                "admin_manage_post",
                kwargs={
                    "username": self.user.username,
                    "slug": post.slug_field,
                },
            )
        )

        expected_status = 204
        self.assertEqual(expected_status, request.status_code)

        with self.assertRaises(BlogPost.DoesNotExist):
            BlogPost.objects.get(
                user__username=self.user.username, slug_field=post.slug_field
            )


class AdminManageCommentViewTestCase(CustomTestCase):
    # this should NOT actually delete the comment. see the delete method in the model
    def test_delete_comment(self):
        comment = PostComment.objects.create(
            user=self.user, post=self.blog_post, content="A really good comment"
        )

        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")

        request = temp_client.delete(
            reverse_lazy(
                "admin_manage_comment",
                kwargs={"id": comment.pk},
            )
        )

        expected_status = 204
        self.assertEqual(expected_status, request.status_code)

        comment.refresh_from_db()
        expected_content = "This comment was deleted"
        self.assertEqual(expected_content, comment.content)


class AdminManageUserViewTestCase(CustomTestCase):
    def test_delete_user(self):
        user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="todelete",
        )

        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bethy")

        request = temp_client.delete(
            reverse_lazy(
                "admin_manage_user",
                kwargs={"username": user.username},
            )
        )

        expected_status = 204
        self.assertEqual(expected_status, request.status_code)

        with self.assertRaises(CustomUser.DoesNotExist):
            CustomUser.objects.get(username=user.username)
