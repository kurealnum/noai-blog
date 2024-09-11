from django.urls import path

from password_management.views import CustomPasswordChangeView

urlpatterns = [
    path("change-password/", CustomPasswordChangeView.as_view(), name="change_password")
]
