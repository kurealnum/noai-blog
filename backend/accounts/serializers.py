from rest_framework import serializers
from django.contrib.auth.hashers import make_password

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
            "technical_info",
            "profile_picture",
        )


# for saving without profile picture because saving profile picture happens in a different route
class PutCustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "about_me",
            "date_joined",
            "technical_info",
        )


class NewCustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "about_me",
            "date_joined",
            "technical_info",
            "password",
        )

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data.get("password"))
        return super(NewCustomUserSerializer, self).create(validated_data)


class LinkSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = Link
        fields = "__all__"

    def validate(self, attrs):
        # checking for https
        if attrs["link"][:8] != "https://":
            raise serializers.ValidationError("Your link needs to be HTTPS")
        return super().validate(attrs)
