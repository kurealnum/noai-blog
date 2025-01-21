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
        "get-comment-replies/",
        CommentReplyListView.as_view(),
        name="get_comment_replies",
    ),
    path(
        "get-post-replies/",
        PostReplyListView.as_view(),
        name="get_post_replies",
    ),
    path("feed/<post_type>/<index>/", (FeedListView.as_view()), name="feed"),
    # CommentListView URLs
    path(
        "get-comments/<username>/<slug>/",
        BlogPostCommentView.as_view(),
        name="get_comments",
    ),
    path(
        "delete-comment/<id>/",
        BlogPostCommentView.as_view(),
        name="delete_comment",
    ),
    path(
        "edit-comment/<id>/",
        BlogPostCommentView.as_view(),
        name="edit_comment",
    ),
    path(
        "create-comment/",
        BlogPostCommentView.as_view(),
        name="create_comment",
    ),
    # BlogPostListView
    path("get-posts/<post_type>/", BlogPostListView.as_view(), name="get_posts"),
    path(
        "get-posts/<post_type>/<username>/",
        BlogPostListView.as_view(),
        name="get_posts",
    ),
    # BlogPostView
    path(
        "get-post/<username>/<slug>/",
        BlogPostView.as_view(),
        name="get_post",
    ),
    path(
        "get-post/<slug>/",
        BlogPostView.as_view(),
        name="get_post",
    ),
    path("delete-post/", BlogPostView.as_view(), name="delete_post"),
    path("create-post/", BlogPostView.as_view(), name="create_post"),
    path("edit-post/", BlogPostView.as_view(), name="edit_post"),
    # CommentListUserView
    path(
        "manage-comments/",
        CommentListUserView.as_view(),
        name="manage_comments",
    ),
    # FollowerView
    path("manage-followers/", FollowerView.as_view(), name="manage_followers"),
    # FollowINGView
    path(
        "manage-following/",
        FollowingView.as_view(),
        name="manage_following",
    ),
    path(
        "manage-following/<username>/",
        FollowingView.as_view(),
        name="manage_following",
    ),
    # ReactionView
    path(
        "manage-post-reactions/",
        PostReactionView.as_view(),
        name="manage_post_reactions",
    ),
    path(
        "manage-post-reactions/<username>/<slug>/",
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
        "toggle-flagged-comment/<id>/",
        ModeratorModifyCommentView.as_view(),
        name="toggle_flagged_comment",
    ),
    # ModeratorModifyUserView
    path(
        "toggle-flagged-user/<username>/",
        ModeratorModifyUserView.as_view(),
        name="toggle_flagged_user",
    ),
    # AdminGetAllFlaggedPostsView
    path(
        "get-flagged-posts/",
        AdminGetAllFlaggedPostsView.as_view(),
        name="get_flagged_posts",
    ),
    # AdminGetAllFlaggedCommentsView
    path(
        "get-flagged-comments/",
        AdminGetAllFlaggedCommentsView.as_view(),
        name="get_flagged_comments",
    ),
    # AdminGetAllFlaggedUsersView
    path(
        "get-flagged-users/",
        AdminGetAllFlaggedUsersView.as_view(),
        name="get_flagged_users",
    ),
    # AdminManageListicleView
    path(
        "toggle-listicle/<username>/<slug>/",
        AdminManageListicleView.as_view(),
        name="toggle_listicle",
    ),
    # AdminManagePostView
    path(
        "admin/manage-post/<username>/<slug>/",
        AdminManagePostView.as_view(),
        name="admin_manage_post",
    ),
    # AdminManageCommentView
    path(
        "admin/manage-comment/<id>/",
        AdminManageCommentView.as_view(),
        name="admin_manage_comment",
    ),
    # AdminManageUserView
    path(
        "admin/manage-user/<username>/",
        AdminManagerUserView.as_view(),
        name="admin_manage_user",
    ),
]
