from django.contrib.auth.views import PasswordChangeView
from django.shortcuts import render


# Password reset views. Almost everything except the template is default.
class CustomPasswordChangeView(PasswordChangeView):
    template_name = "password_change_view.html"
