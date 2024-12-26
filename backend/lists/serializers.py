from blogs.serializers import PostUserSerializer
from rest_framework import serializers


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
