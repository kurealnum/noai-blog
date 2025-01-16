from django.urls import path

from crossposts.views import (
    CrosspostCommentView,
    CrosspostFeedListView,
    CrosspostListView,
    CrosspostReactionView,
    CrosspostView,
)

urlpatterns = [
    # CrosspostListView
    path("get-crossposts/", CrosspostListView.as_view(), name="get_crossposts"),
    path(
        "get-crossposts/<username>/", CrosspostListView.as_view(), name="get_crossposts"
    ),
    # CrosspostView
    path("get-crosspost/<title>/", CrosspostView.as_view(), name="get_crosspost"),
    path(
        "get-crosspost/<username>/<slug>/",
        CrosspostView.as_view(),
        name="get_crosspost",
    ),
    path("create-crosspost/", CrosspostView.as_view(), name="create_crosspost"),
    path("edit-crosspost/", CrosspostView.as_view(), name="edit_crosspost"),
    path("delete-crosspost/", CrosspostView.as_view(), name="delete_crosspost"),
    path(
        "manage-reactions/",
        CrosspostReactionView.as_view(),
        name="manage_crosspost_reactions",
    ),
    path(
        "manage-reactions/<username>/<slug>/",
        CrosspostReactionView.as_view(),
        name="manage_crosspost_reactions",
    ),
    path(
        "get-comments/<username>/<slug>/",
        CrosspostCommentView.as_view(),
        name="get_crosspost_comments",
    ),
    path(
        "delete-comment/<id>/",
        CrosspostCommentView.as_view(),
        name="delete_crosspost_comment",
    ),
    path(
        "edit-comment/<id>/",
        CrosspostCommentView.as_view(),
        name="edit_crosspost_comment",
    ),
    path(
        "create-comment/",
        CrosspostCommentView.as_view(),
        name="create_crosspost_comment",
    ),
    path("feed/<index>/", CrosspostFeedListView.as_view(), name="get_crosspost_feed"),
]
