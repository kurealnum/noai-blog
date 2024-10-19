from django.urls import path

from blogs.views import (
    AdminGetAllFlaggedComments,
    AdminGetAllFlaggedPosts,
    BlogPostListView,
    BlogPostView,
    CommentReplyListView,
    FeedListView,
    FollowerView,
    FollowingView,
    ModeratorModifyCommentView,
    ModeratorModifyPostView,
    ModeratorModifyUserView,
    PostReplyListView,
    CommentListView,
    CommentListUserView,
    ReactionView,
)

urlpatterns = [
    # Misc. URLs
    path(
        "get-comment-replies/",
        CommentReplyListView.as_view(),
        name="get_comment_replies",
    ),
    path("get-post-replies/", PostReplyListView.as_view(), name="get_post_replies"),
    path("feed/<index>/", (FeedListView.as_view()), name="feed"),
    # CommentListView URLs
    path(
        "get-comments/<username>/<slug>/",
        CommentListView.as_view(),
        name="get_comments",
    ),
    path("delete-comment/<id>/", CommentListView.as_view(), name="delete_comment"),
    path("edit-comment/<id>/", CommentListView.as_view(), name="edit_comment"),
    path("create-comment/", CommentListView.as_view(), name="create_comment"),
    # BlogPostLISTView
    path("get-posts/", BlogPostListView.as_view(), name="get_posts"),
    path("get-posts/<username>/", BlogPostListView.as_view(), name="get_posts"),
    # BlogPostView
    path("get-post/<username>/<slug>/", BlogPostView.as_view(), name="get_post"),
    path("delete-post/", BlogPostView.as_view(), name="get_post"),
    path("create-post/", BlogPostView.as_view(), name="create_post"),
    path("edit-post/", BlogPostView.as_view(), name="edit_post"),
    # CommentListUserView
    path("manage-comments/", CommentListUserView.as_view(), name="manage_comments"),
    path(
        "manage-comments/<slug>/", CommentListUserView.as_view(), name="manage_comments"
    ),
    # FollowerView
    path("manage-followers/", FollowerView.as_view(), name="manage_followers"),
    # FollowINGView
    path("manage-following/", FollowingView.as_view(), name="manage_following"),
    path(
        "manage-following/<username>/", FollowingView.as_view(), name="manage_following"
    ),
    # ReactionView
    path(
        "manage-post-reactions/", ReactionView.as_view(), name="manage_post_reactions"
    ),
    path(
        "manage-post-reactions/<slug>/",
        ReactionView.as_view(),
        name="manage_post_reactions",
    ),
    # ModeratorModifyPostView
    path(
        "toggle-flagged-comment/<username>/<slug>/",
        ModeratorModifyPostView.as_view(),
        name="toggle_flagged_post",
    ),
    # ModeratorModifyCommentView
    path(
        "toggle-flagged-comment/<id>/",
        ModeratorModifyCommentView.as_view(),
        name="toggle_flagged_comment",
    ),
    # ModeratorModifyUserView
    path(
        "toggle-flagged-user/<id>/",
        ModeratorModifyUserView.as_view(),
        name="toggle_flagged_user",
    ),
    # AdminGetAllFlaggedPostsView
    path(
        "get-flagged-posts/",
        AdminGetAllFlaggedPosts.as_view(),
        name="get_flagged_posts",
    ),
    # AdminGetAllFlaggedCommentsView
    path(
        "get-flagged-comments/",
        AdminGetAllFlaggedComments.as_view(),
        name="get_flagged_comments",
    ),
]
