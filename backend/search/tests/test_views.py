from django.test import TestCase
from django.urls import reverse_lazy
from rest_framework.test import APIClient

from accounts.models import CustomUser
from blogs.models import BlogPost
from lists.models import List


class cTestCase(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = CustomUser.objects.create(
            email="bobbyjoe@gmail.com",
            first_name="Bobby",
            last_name="Joe",
            about_me="I am Bobby Joe, destroyer of worlds.",
            username="bobby",
        )
        self.user.set_password("TerriblePassword123")
        self.user.save()


class BlogPostSearchTC(cTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.blog_post = BlogPost.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
        self.blog_post.save()
        self.blog_post_two = BlogPost.objects.create(
            user=self.user,
            title="No keyword here",
            content="Here's something about my blog post",
        )
        self.blog_post_two.save()

    def test_does_get_with_correct_query(self):
        request = self.client.get(
            reverse_lazy("search_blog_post", kwargs={"search": "awesome", "page": "1"})
        )
        expected_length = 1
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_get_with_no_query(self):
        request = self.client.get(
            reverse_lazy("search_blog_post", kwargs={"page": "1"})
        )
        expected_length = 2
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_not_get_with_incorrect_query(self):
        request = self.client.get(
            reverse_lazy(
                "search_blog_post", kwargs={"search": "wrongwrong", "page": "1"}
            )
        )
        expected_length = 0
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_get_with_page_two(self):
        # makes sure that querying for a page that doesn't have anything on it works ok
        request = self.client.get(
            reverse_lazy("search_blog_post", kwargs={"page": "2"})
        )
        expected_length = 0
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)


class ListSearchTC(cTestCase):
    def setUp(self) -> None:
        super().setUp()
        self._list = List.objects.create(
            user=self.user,
            title="My awesome blog post",
            content="Here's something about my blog post",
        )
        self._list.save()
        self._list_two = List.objects.create(
            user=self.user,
            title="No keyword here",
            content="Here's something about my blog post",
        )
        self._list_two.save()

    def test_does_get_with_correct_query(self):
        request = self.client.get(
            reverse_lazy("search_list", kwargs={"search": "awesome", "page": "1"})
        )
        expected_length = 1
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_get_with_no_query(self):
        request = self.client.get(reverse_lazy("search_list", kwargs={"page": "1"}))
        expected_length = 2
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_not_get_with_incorrect_query(self):
        request = self.client.get(
            reverse_lazy("search_list", kwargs={"search": "wrongwrong", "page": "1"})
        )
        expected_length = 0
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)

    def test_does_get_with_page_two(self):
        # makes sure that querying for a page that doesn't have anything on it works ok
        request = self.client.get(reverse_lazy("search_list", kwargs={"page": "2"}))
        expected_length = 0
        expected_status = 200
        self.assertEqual(expected_length, len(request.data))  # type: ignore
        self.assertEqual(expected_status, request.status_code)
