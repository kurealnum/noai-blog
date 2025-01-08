from django.urls import path

from lists.views import (
    List_ListView,
    ListCommentView,
    ListFeed,
    ListReactionView,
    ListView,
)

urlpatterns = [
    # ListFeed
    path("feed/<index>/", ListFeed.as_view(), name="list_feed"),
    # ListView
    path("get-list/<title>/", ListView.as_view(), name="get_list"),
    path("get-list/<username>/<slug>/", ListView.as_view(), name="get_list"),
    path("create-list/", ListView.as_view(), name="create_list"),
    path("edit-list/", ListView.as_view(), name="edit_list"),
    path("delete-list/", ListView.as_view(), name="delete_list"),
    # ListCommentView
    path(
        "get-comments/<username>/<slug>/",
        ListCommentView.as_view(),
        name="get_list_comments",
    ),
    path("delete-comment/<id>/", ListCommentView.as_view(), name="delete_list_comment"),
    path("edit-comment/<id>/", ListCommentView.as_view(), name="edit_list_comment"),
    path("create-comment/", ListCommentView.as_view(), name="create_list_comment"),
    # ListReactionView
    path(
        "manage-list-reactions/",
        ListReactionView.as_view(),
        name="manage_list_reactions",
    ),
    path(
        "manage-list-reactions/<username>/<slug>/",
        ListReactionView.as_view(),
        name="manage_list_reactions",
    ),
    # List_ListView
    path("get-lists/", List_ListView.as_view(), name="get_lists"),
    path("get-lists/<username>/", List_ListView.as_view(), name="get_lists"),
]
