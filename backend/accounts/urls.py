from django.urls import path
from .views import (
    UserInfoView,
    login_user,
    check_is_authenticated,
    logout_user,
    UpdateUserInfo,
)


urlpatterns = [
    path("login/", login_user, name="login"),
    path("is-authenticated/", check_is_authenticated, name="is_authenticated"),
    path("logout/", logout_user, name="logout"),
    path("user-info/", UserInfoView.as_view(), name="user_info"),
    path("update-user-info/", UpdateUserInfo.as_view(), name="update_user_info"),
]
