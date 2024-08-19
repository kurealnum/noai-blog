from django.test import TestCase
from django.db import connection
from accounts.models import CustomUser
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
        comment = Comment.objects.filter(post=self.blog_post).count()
        self.assertIsNotNone(comment)


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
            user=self.user, post=self.blog_post, content="This is a reply!"
        )

        # FIXME: still need to fix this query to join everything
        query = f"""
        WITH RECURSIVE comments AS (
                SELECT reply_id 
                FROM blogs_replyto
                WHERE id = %s
            UNION ALL
                SELECT comment_id
                FROM blogs_replyto AS br
                JOIN blogs_comment bc ON bc.id=br.comment_id
        )
        SELECT * FROM comments;
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [self.comment.id])
            row = cursor.fetchall()
            expected_length = 2
            self.assertEqual(expected_length, len(row))
