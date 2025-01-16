from rest_framework import serializers

from blogs.serializers import PostUserSerializer
from crossposts.models import Crosspost, CrosspostComment, CrosspostReaction


class CrosspostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        fields = "__all__"
        model = Crosspost


class CreateOrUpdateCrosspostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        fields = ("title", "post_type", "user")
        model = Crosspost


class CrosspostReactionSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        fields = "__all__"
        model = CrosspostReaction


class CrosspostCommentSerializer(serializers.ModelSerializer):
    post = CrosspostSerializer(required=False)

    class Meta:  # type:ignore
        model = CrosspostComment
        fields = "__all__"


class CreateOrUpdateCrosspostCommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CrosspostComment
        fields = "__all__"


class CrosspostCommentAndUserSerializer(serializers.Serializer):
    user = PostUserSerializer()
    reply_to = CrosspostCommentSerializer()
    content = serializers.CharField()
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()
    id = serializers.IntegerField()
    flagged = serializers.BooleanField()
