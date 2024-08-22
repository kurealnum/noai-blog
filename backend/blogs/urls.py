from django.urls import path

from blogs.views import BlogPostList, CommentReplyList, PostReplyList

urlpatterns = [
    path("get-posts/", BlogPostList.as_view(), name="get_posts"),
    path(
        "get-comment-replies/", CommentReplyList.as_view(), name="get_comment_replies"
    ),
    path("get-post-replies/", PostReplyList.as_view(), name="get_post_replies"),
]
