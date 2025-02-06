from rest_framework import serializers

from blogs.serializers import PostUserSerializer
from followers.models import Follower


class FollowerSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = Follower
        fields = "__all__"


class GetFollowerSerializer(serializers.ModelSerializer):
    user = PostUserSerializer()
    follower = PostUserSerializer()

    class Meta:  # type: ignore
        model = Follower
        fields = "__all__"
