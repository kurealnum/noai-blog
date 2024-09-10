from django.urls import path
from .views import (
    UserInfoView,
    login_user,
    check_is_authenticated,
    logout_user,
    UpdateUserInfo,
    ChangeProfilePictureView,
    Links,
)


urlpatterns = [
    path("login/", login_user, name="login"),
    path("is-authenticated/", check_is_authenticated, name="is_authenticated"),
    path("logout/", logout_user, name="logout"),
    path(
        "update-user-info/<int:pk>/", UpdateUserInfo.as_view(), name="update_user_info"
    ),
    path("user-info/", UserInfoView.as_view(), name="user_info"),
    path(
        "user-info/<username>/",
        UserInfoView.as_view(),
        name="user_info_by_username",
    ),
    path("manage-links/", Links.as_view(), name="links"),
    path("manage-links/<username>/", Links.as_view(), name="links"),
    path(
        "save-profile-picture/",
        ChangeProfilePictureView.as_view(),
        name="change_profile_picture",
    ),
]
