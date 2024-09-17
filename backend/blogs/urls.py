from django.urls import path
from django.views.decorators.cache import cache_page

from blogs.views import (
    BlogPostListView,
    BlogPostView,
    CommentReplyListView,
    FeedListView,
    PostReplyListView,
    CommentListView,
)

urlpatterns = [
    path("get-comments/", CommentListView.as_view(), name="get_comments"),
    path(
        "get-comment-replies/",
        CommentReplyListView.as_view(),
        name="get_comment_replies",
    ),
    path("get-post-replies/", PostReplyListView.as_view(), name="get_post_replies"),
    path("feed/", cache_page(60 * 20)(FeedListView.as_view()), name="feed"),
    # re_path(
    #     r"^get-posts/(?P<username>\w+/|)$", BlogPostList.as_view(), name="get_posts"
    # ),
    path("get-posts/", BlogPostListView.as_view(), name="get_posts"),
    path("get-posts/<username>/", BlogPostListView.as_view(), name="get_posts"),
    path("get-post/<username>/<slug>/", BlogPostView.as_view(), name="get_post"),
]
