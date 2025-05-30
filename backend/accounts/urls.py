from django.urls import path
from .views import (
    NotificationCountView,
    NotificationView,
    AccountManagementView,
    UserInfoView,
    LoginUserView,
    CheckAuthenticatedView,
    LogoutUserView,
    UpdateUserInfoView,
    ChangeProfilePictureView,
    LinksView,
)


urlpatterns = [
    path("login/", LoginUserView.as_view(), name="login"),
    path(
        "is-authenticated/", CheckAuthenticatedView.as_view(), name="is_authenticated"
    ),
    path("logout/", LogoutUserView.as_view(), name="logout"),
    path(
        "update-user-info/<int:pk>/",
        UpdateUserInfoView.as_view(),
        name="update_user_info",
    ),
    path("user-info/", UserInfoView.as_view(), name="user_info"),
    path(
        "user-info/<username>/",
        UserInfoView.as_view(),
        name="user_info_by_username",
    ),
    path("manage-links/", LinksView.as_view(), name="links"),
    path("manage-links/<username>/", LinksView.as_view(), name="links"),
    path(
        "save-profile-picture/",
        ChangeProfilePictureView.as_view(),
        name="change_profile_picture",
    ),
    path("register/", AccountManagementView.as_view(), name="register"),
    path("delete-account/", AccountManagementView.as_view(), name="delete_account"),
    path("notifications/", NotificationView.as_view(), name="notifications"),
    path(
        "notifications-count/",
        NotificationCountView.as_view(),
        name="notifications_count",
    ),
]
