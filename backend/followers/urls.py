from django.urls import path

from followers.views import FollowerView, FollowingView


urlpatterns = [
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
]
