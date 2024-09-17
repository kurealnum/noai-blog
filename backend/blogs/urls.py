from django.urls import path
from django.views.decorators.cache import cache_page

from blogs.views import (
    BlogPostList,
    BlogPostView,
    CommentReplyList,
    FeedList,
    PostReplyList,
    CommentList,
)

urlpatterns = [
    path("get-comments/", CommentList.as_view(), name="get_comments"),
    path(
        "get-comment-replies/", CommentReplyList.as_view(), name="get_comment_replies"
    ),
    path("get-post-replies/", PostReplyList.as_view(), name="get_post_replies"),
    path("feed/", cache_page(60 * 20)(FeedList.as_view()), name="feed"),
    # re_path(
    #     r"^get-posts/(?P<username>\w+/|)$", BlogPostList.as_view(), name="get_posts"
    # ),
    path("get-posts/", BlogPostList.as_view(), name="get_posts"),
    path("get-posts/<username>/", BlogPostList.as_view(), name="get_posts"),
    path("get-post/<username>/<slug>/", BlogPostView.as_view(), name="get_post"),
]
