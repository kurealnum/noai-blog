from django.urls import path

from blogs.views import (
    AdminGetAllFlaggedCommentsView,
    AdminGetAllFlaggedPostsView,
    AdminGetAllFlaggedUsersView,
    AdminManageCommentView,
    AdminManageListicleView,
    AdminManagePostView,
    AdminManagerUserView,
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
    BlogPostCommentView,
    CommentListUserView,
    PostReactionView,
)

urlpatterns = [
    # Misc. URLs
    path(
        "get-comment-replies/<post_type>/",
        CommentReplyListView.as_view(),
        name="get_comment_replies",
    ),
    path(
        "get-post-replies/<post_type>/",
        PostReplyListView.as_view(),
        name="get_post_replies",
    ),
    path("feed/<post_type>/<index>/", (FeedListView.as_view()), name="feed"),
    # CommentListView URLs
    path(
        "get-comments/<post_type>/<username>/<slug>/",
        BlogPostCommentView.as_view(),
        name="get_comments",
    ),
    path(
        "delete-comment/<post_type>/<id>/",
        BlogPostCommentView.as_view(),
        name="delete_comment",
    ),
    path(
        "edit-comment/<post_type>/<id>/",
        BlogPostCommentView.as_view(),
        name="edit_comment",
    ),
    path(
        "create-comment/<post_type>/",
        BlogPostCommentView.as_view(),
        name="create_comment",
    ),
    # BlogPostLISTView
    path("get-posts/<post_type>/", BlogPostListView.as_view(), name="get_posts"),
    path(
        "get-posts/<post_type>/<username>/",
        BlogPostListView.as_view(),
        name="get_posts",
    ),
    # BlogPostView
    path(
        "get-post/<post_type>/<username>/<slug>/",
        BlogPostView.as_view(),
        name="get_post",
    ),
    path("delete-post/<post_type>/", BlogPostView.as_view(), name="get_post"),
    path("create-post/<post_type>/", BlogPostView.as_view(), name="create_post"),
    path("edit-post/<post_type>/", BlogPostView.as_view(), name="edit_post"),
    # CommentListUserView
    path(
        "manage-comments/<post_type>/",
        CommentListUserView.as_view(),
        name="manage_comments",
    ),
    path(
        "manage-comments/<post_type>/<slug>/",
        CommentListUserView.as_view(),
        name="manage_comments",
    ),
    # FollowerView
    path(
        "manage-followers/<post_type>/", FollowerView.as_view(), name="manage_followers"
    ),
    # FollowINGView
    path(
        "manage-following/<post_type>/",
        FollowingView.as_view(),
        name="manage_following",
    ),
    path(
        "manage-following/<post_type>/<username>/",
        FollowingView.as_view(),
        name="manage_following",
    ),
    # ReactionView
    path(
        "manage-post-reactions/<post_type>/",
        PostReactionView.as_view(),
        name="manage_post_reactions",
    ),
    path(
        "manage-post-reactions/<post_type>/<username>/<slug>/",
        PostReactionView.as_view(),
        name="manage_post_reactions",
    ),
    # ModeratorModifyPostView
    path(
        "toggle-flagged-post/<post_type>/<username>/<slug>/",
        ModeratorModifyPostView.as_view(),
        name="toggle_flagged_post",
    ),
    # ModeratorModifyCommentView
    path(
        "toggle-flagged-comment/<post_type>/<id>/",
        ModeratorModifyCommentView.as_view(),
        name="toggle_flagged_comment",
    ),
    # ModeratorModifyUserView
    path(
        "toggle-flagged-user/<post_type>/<username>/",
        ModeratorModifyUserView.as_view(),
        name="toggle_flagged_user",
    ),
    # AdminGetAllFlaggedPostsView
    path(
        "get-flagged-posts/<post_type>/",
        AdminGetAllFlaggedPostsView.as_view(),
        name="get_flagged_posts",
    ),
    # AdminGetAllFlaggedCommentsView
    path(
        "get-flagged-comments/<post_type>/",
        AdminGetAllFlaggedCommentsView.as_view(),
        name="get_flagged_comments",
    ),
    # AdminGetAllFlaggedUsersView
    path(
        "get-flagged-users/<post_type>/",
        AdminGetAllFlaggedUsersView.as_view(),
        name="get_flagged_users",
    ),
    # AdminManageListicleView
    path(
        "toggle-listicle/<post_type>/<username>/<slug>/",
        AdminManageListicleView.as_view(),
        name="toggle_listicle",
    ),
    # AdminManagePostView
    path(
        "admin/manage-post/<post_type>/<username>/<slug>/",
        AdminManagePostView.as_view(),
        name="admin_manage_post",
    ),
    # AdminManageCommentView
    path(
        "admin/manage-comment/<post_type>/<id>/",
        AdminManageCommentView.as_view(),
        name="admin_manage_comment",
    ),
    # AdminManageUserView
    path(
        "admin/manage-user/<post_type>/<username>/",
        AdminManagerUserView.as_view(),
        name="admin_manage_user",
    ),
]
