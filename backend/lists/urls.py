from django.urls import path

from lists.views import ListFeed, ListReactionView, ListView

urlpatterns = [
    path("feed/<index>", ListFeed.as_view(), name="list_feed"),
    path("get-list/<title>", ListView.as_view(), name="get_list"),
    path("get-list/<username>/<slug>/", ListView.as_view(), name="get_list"),
    path("create-list/", ListView.as_view(), name="create_list"),
    path("edit-list/", ListView.as_view(), name="edit_list"),
    path("delete-list/", ListView.as_view(), name="delete_list"),
    # ReactionView
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
]
