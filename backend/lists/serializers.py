from blogs.serializers import PostUserSerializer
from rest_framework import serializers

from lists.models import List, ListComment, ListReaction


class ListSerializer(serializers.Serializer):
    user = PostUserSerializer()
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(
        max_length=101
    )  # length of 101 so frontend can easily check to see if it needs to add a "..." to the end
    created_date = serializers.DateTimeField(required=False)
    updated_date = serializers.DateTimeField(required=False)
    flagged = serializers.BooleanField(required=False)
    is_listicle = serializers.BooleanField(required=False)
    likes = serializers.IntegerField(default=-1, required=False)
    score = serializers.IntegerField(default=-1, required=False)
    thumbnail = serializers.ImageField(default=None, required=False)


class CreateOrUpdateListSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(allow_null=True, required=False)

    class Meta:  # type:ignore
        model = List
        fields = ("user", "title", "content", "thumbnail")


class ListReactionSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = ListReaction
        fields = "__all__"


class ListCommentSerializer(serializers.ModelSerializer):
    post = ListSerializer(required=False)

    class Meta:  # type:ignore
        model = ListComment
        fields = "__all__"


class CreateOrUpdateListCommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = ListComment
        fields = "__all__"
