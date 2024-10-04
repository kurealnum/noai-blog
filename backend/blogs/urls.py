from django.urls import path

from blogs.views import (
    BlogPostListView,
    BlogPostView,
    CommentReplyListView,
    FeedListView,
    FollowerView,
    FollowingView,
    PostReplyListView,
    CommentListView,
    ReactionView,
)

urlpatterns = [
    path("get-comments/", CommentListView.as_view(), name="get_comments"),
    path(
        "get-comment-replies/",
        CommentReplyListView.as_view(),
        name="get_comment_replies",
    ),
    path("get-post-replies/", PostReplyListView.as_view(), name="get_post_replies"),
    path("feed/<index>/", (FeedListView.as_view()), name="feed"),
    # re_path(
    #     r"^get-posts/(?P<username>\w+/|)$", BlogPostList.as_view(), name="get_posts"
    # ),
    path("get-posts/", BlogPostListView.as_view(), name="get_posts"),
    path("get-posts/<username>/", BlogPostListView.as_view(), name="get_posts"),
    path("get-post/<username>/<slug>/", BlogPostView.as_view(), name="get_post"),
    path("create-post/", BlogPostView.as_view(), name="create_post"),
    path("manage-followers/", FollowerView.as_view(), name="manage_followers"),
    path("manage-following/", FollowingView.as_view(), name="manage_following"),
    path(
        "manage-following/<username>/", FollowingView.as_view(), name="manage_following"
    ),
    path(
        "manage-post-reactions/", ReactionView.as_view(), name="manage_post_reactions"
    ),
]
