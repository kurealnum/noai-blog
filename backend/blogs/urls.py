from django.urls import path

from blogs.views import BlogPostList, CommentReplyList

urlpatterns = [
    path("get-posts/", BlogPostList.as_view(), name="get_posts"),
    path(
        "get-comment-replies/", CommentReplyList.as_view(), name="get_comment_replies"
    ),
]
