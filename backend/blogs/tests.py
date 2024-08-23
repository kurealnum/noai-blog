from django.test import TestCase
from accounts.models import CustomUser
from blogs.helpers import get_comment_replies
from rest_framework.test import APIRequestFactory, force_authenticate
import datetime

from blogs.views import BlogPostList, CommentReplyList, FeedList, PostReplyList

from .models import BlogPost, CommentReaction, PostReaction, Comment, ReplyTo


class BlogTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )

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


class CommentTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
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


class BlogPostListTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
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
            title="My awesome blog post",
            content="Here's something about my blog post",
        )

    def test_blogpostlist_returns_correctly(self):
        factory = APIRequestFactory()
        request = factory.get("/api/blog-posts/get-posts/")
        force_authenticate(request, user=self.user)
        response = BlogPostList.as_view()(request)
        # expected_title, basically
        expected_result = "My awesome blog post"
        self.assertEqual(expected_result, response.data[0].get("title"))


class CommentReplyListTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
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
        factory = APIRequestFactory()
        request = factory.get("/api/blog-posts/get-comment-replies/")
        force_authenticate(request, user=self.user)
        response = CommentReplyList.as_view()(request)
        expected_result = "This IS a reply!"
        self.assertEqual(expected_result, response.data[0].get("content"))


class PostReplyListTestCase(TestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
        self.user.set_password("TerriblePassword123")
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
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
        factory = APIRequestFactory()
        request = factory.get("/api/blog-posts/get-post-replies/")
        force_authenticate(request, user=self.user)
        response = PostReplyList.as_view()(request)
        expected_result = "This is NOT a reply!"
        self.assertEqual(expected_result, response.data[0].get("content"))


class FeedListTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
        )
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

    def test_feedlist_returns_correctly(self):
        factory = APIRequestFactory()
        request = factory.get("/api/blog-posts/feed/")
        force_authenticate(request, user=self.user)
        response = FeedList.as_view()(request)
        # the title of the 3rd blog post is 3
        expected_result = "3"
        self.assertEqual(expected_result, response.data[0].get("title"))
