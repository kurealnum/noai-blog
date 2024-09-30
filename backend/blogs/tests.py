import json
from typing_extensions import OrderedDict
from django.test import TestCase
from django.urls import reverse_lazy
from accounts.models import CustomUser
from blogs.helpers import get_comment_replies
from rest_framework.test import APIClient, APIRequestFactory

from .models import BlogPost, CommentReaction, Follower, PostReaction, Comment, ReplyTo


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


class BlogTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()

    def test_does_react_count(self):
        PostReaction.objects.create(user=self.user, post=self.blog_post)
        reaction_count = PostReaction.objects.filter(post=self.blog_post).count()
        expected_result = 1
        self.assertEqual(expected_result, reaction_count)

    def test_does_comment_register(self):
        Comment.objects.create(
            user=self.user, post=self.blog_post, content="A really good comment"
        )
        comment_count = Comment.objects.filter(post=self.blog_post).count()
        expected_result = 1
        self.assertEqual(expected_result, comment_count)

    def test_get_absolute_url(self):
        expected_result = "/api/blog-posts/get-post/bobby/my-awesome-blog-post/"
        result = self.blog_post.get_absolute_url()
        self.assertEqual(expected_result, result)


class CommentTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.comment = Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is a very polite comment"
        )

    def test_does_react_count(self):
        CommentReaction.objects.create(user=self.user, comment=self.comment)
        reaction_count = CommentReaction.objects.filter(user=self.user).count()
        expected_result = 1
        self.assertEqual(expected_result, reaction_count)

    def test_reply_query(self):
        # this is a hot mess. should probably wrap in function at somepoint
        new_comment = Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is a reply!"
        )
        ReplyTo.objects.create(comment=new_comment, reply=self.comment)

        new_comment_two = Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is a reply!"
        )
        ReplyTo.objects.create(comment=new_comment_two, reply=new_comment)

        # this comment should *not* show in result of query
        Comment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="This is a reply on a blog post!",
        )

        query_res = get_comment_replies(self.comment.id)  # type: ignore
        # this is the content of the comment. Checking that the entire comment is equivalent to a given expected result is too much of a pain
        expected_result = "This is a reply!"
        self.assertEqual(expected_result, query_res[0][2])
        self.assertEqual(expected_result, query_res[1][2])


class CommentListTestCase(CustomTestCase):
    def setUp(self):
        super().setUp()
        Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )

    def test_view(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        request = temp_client.get(reverse_lazy("get_comments"))
        # expected result for both
        expected_result = "This is NOT a reply!"
        result = json.loads(request.content)
        self.assertEqual(expected_result, result[0].get("content"))
        self.assertEqual(expected_result, result[1].get("content"))


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

    def test_does_create_properly(self):
        # temp client to log in
        temp_client = APIClient()
        temp_client.login(username="bobby", password="TerriblePassword123")
        data = {
            "title": "My blog post",
            "content": "Here's my awesome blog post ##",
            "likes": 0,
        }
        request = temp_client.post(reverse_lazy("create_post"), data=data)
        expected_result = "Here's my awesome blog post ##"
        self.assertEqual(expected_result, request.data["content"])


class BlogPostListTestCase(CustomTestCase):
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
        response = temp_client.get(reverse_lazy("get_posts"))

        # expected_title, basically
        expected_result = "My awesome blog post"
        self.assertEqual(expected_result, response.data[0].get("title"))

    def test_with_username(self):
        request = self.client.get(reverse_lazy("get_posts") + "bobby/")
        expected_result = "My awesome blog post"
        result = json.loads(request.content)[0].get("title")
        self.assertEqual(result, expected_result)

    def test_with_incorrect_username(self):
        request = self.client.get(reverse_lazy("get_posts") + "thewrongusername/")
        expected_result = "Not found."
        self.assertEqual(json.loads(request.content)["detail"], expected_result)


class CommentReplyListTestCase(CustomTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.comment = Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        self.comment_two = Comment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="This IS a reply!",
        )

        ReplyTo.objects.create(comment=self.comment, reply=self.comment_two)

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
        self.comment = Comment.objects.create(
            user=self.user, post=self.blog_post, content="This is NOT a reply!"
        )
        self.comment_two = Comment.objects.create(
            user=self.user,
            post=self.blog_post,
            content="This IS a reply!",
        )

        ReplyTo.objects.create(comment=self.comment, reply=self.comment_two)

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
        self.blog_post_1 = BlogPost.objects.create(
            user=self.user,
            title="1",
            content="Here's something about my blog post",
        )
        self.blog_post_2 = BlogPost.objects.create(
            user=self.user,
            title="2",
            content="Here's something about my blog post",
        )
        self.blog_post_3 = BlogPost.objects.create(
            user=self.user,
            title="3",
            content="Here's something about my blog post",
        )

        # adding a comment to test that the 3rd blog post is listed first
        Comment.objects.create(
            user=self.user, content="a comment", post=self.blog_post_3
        )

    def test_feedlist_returns_correctly_on_first_page(self):
        # temp client for logging in
        response = self.client.get(reverse_lazy("feed", kwargs={"index": 1}))
        # the title of the 3rd blog post is 3
        expected_result = "3"
        self.assertEqual(expected_result, response.data[0].get("title"))  # type: ignore

    # should return an empty array
    def test_feedlist_returns_correctly_on_second_page(self):
        response = self.client.get(reverse_lazy("feed", kwargs={"index": 2}))

        # there should be nothing on this page
        expected_length = 0
        self.assertEqual(expected_length, len(response.data))  # type: ignore


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
        expected_result = 200
        self.assertEqual(expected_result, request.status_code)

    # testing the deletion of self.follower (django tests run sequentially, so this should be fine!!!)
    def test_does_delete_request_function_properly(self):
        temp_client = APIClient()
        temp_client.login(password="TerriblePassword123", username="bobby")
        request = temp_client.delete(
            reverse_lazy("manage_followers"),
            data={"followee": self.altuser.username},
        )
        expected_result = 200
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
