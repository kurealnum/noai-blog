from rest_framework import serializers

from accounts.models import CustomUser
from .models import BlogPost, Comment


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = BlogPost
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = Comment
        fields = "__all__"


class FeedCustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = ("first_name",)


class FeedBlogPostSerializer(serializers.Serializer):
    user = FeedCustomUserSerializer()
    score = serializers.IntegerField()
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(max_length=10000)
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()
