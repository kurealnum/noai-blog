from rest_framework import serializers

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer
from .models import BlogPost, Crosspost, PostComment, Follower, PostReaction


class NotificationBlogPostSerializer(serializers.Serializer):
    user = CustomUserSerializer()
    slug_field = serializers.CharField()


class NotificationCommentSerializer(serializers.Serializer):
    user = CustomUserSerializer()
    post = NotificationBlogPostSerializer()
    content = serializers.CharField()
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()
    id = serializers.IntegerField()
    is_read = serializers.BooleanField()


class FeedCustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = ("username",)


class FollowerSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = Follower
        fields = "__all__"


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = PostReaction
        fields = "__all__"


class PostUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = ("username", "profile_picture", "approved_ai_usage")


class CrosspostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = Crosspost
        fields = "__all__"


class CreateOrUpdateBlogPostSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(allow_null=True, required=False)
    post_type = serializers.CharField(allow_null=True, required=False)
    crosspost = CrosspostSerializer(required=False, allow_null=True)

    class Meta:  # type:ignore
        model = BlogPost
        fields = ("user", "title", "content", "thumbnail", "post_type", "crosspost")


class BlogPostSerializer(serializers.Serializer):
    user = PostUserSerializer()
    crosspost = CrosspostSerializer(required=False, allow_null=True)
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


class CommentSerializer(serializers.ModelSerializer):
    post = BlogPostSerializer(required=False)
    crosspost = CrosspostSerializer(required=False)

    class Meta:  # type:ignore
        model = PostComment
        fields = "__all__"


class CreateOrUpdateCommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = PostComment
        fields = "__all__"


class CommentAndUserSerializer(serializers.Serializer):
    user = PostUserSerializer()
    reply_to = CommentSerializer()
    content = serializers.CharField()
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()
    id = serializers.IntegerField()
    flagged = serializers.BooleanField()


class GetFollowerSerializer(serializers.ModelSerializer):
    user = PostUserSerializer()
    follower = PostUserSerializer()

    class Meta:  # type: ignore
        model = Follower
        fields = "__all__"
