from rest_framework import serializers

from accounts.models import CustomUser
from .models import BlogPost, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = Comment
        fields = "__all__"


class FeedCustomUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = ("username",)


class SingleBlogPostUserSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = CustomUser
        fields = ("username", "profile_picture")


class FeedBlogPostSerializer(serializers.Serializer):
    user = FeedCustomUserSerializer()
    score = serializers.IntegerField()
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(max_length=101)  # see blog post serializer
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()


# for get requests
class SingleBlogPostSerializer(serializers.Serializer):
    user = SingleBlogPostUserSerializer()
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(
        max_length=101
    )  # length of 101 so frontend can easily check to see if it needs to add a "..." to the end
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()


# for post, patch, etc.
class PostSingleBlogPostSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = BlogPost
        fields = ("user", "title", "content")


class BlogPostSerializer(serializers.Serializer):
    user = FeedCustomUserSerializer()
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(
        max_length=101
    )  # length of 101 so frontend can easily check to see if it needs to add a "..." to the end
    created_date = serializers.DateTimeField()
    updated_date = serializers.DateTimeField()
