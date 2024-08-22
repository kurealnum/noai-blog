from rest_framework import serializers
from .models import BlogPost, Comment


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = BlogPost
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:  # type:ignore
        model = Comment
        fields = "__all__"
