from rest_framework import serializers

from accounts.models import CustomUser, Link


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "about_me",
            "date_joined",
        )


class LinkSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = Link
        fields = "__all__"
