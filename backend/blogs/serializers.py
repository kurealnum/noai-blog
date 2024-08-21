from rest_framework import serializers
from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = BlogPost
        fields = "__all__"
