from django.contrib.auth.views import (
    PasswordChangeDoneView,
    PasswordChangeView,
    PasswordResetCompleteView,
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetView,
)


# Password reset views. Almost everything except the template is default.
class CustomPasswordChangeView(PasswordChangeView):
    template_name = "password_change.html"


class CustomPasswordChangeDoneView(PasswordChangeDoneView):
    template_name = "password_change_done.html"


class CustomPasswordResetView(PasswordResetView):
    template_name = "password_reset.html"


class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = "password_reset_done.html"


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = "password_reset_confirm.html"


class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = "password_reset_complete.html"
