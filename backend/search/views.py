from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from blogs.models import BlogPost
from blogs.serializers import BlogPostSerializer


class BlogPostSearch(APIView):
    def get(self, request, search):
        queryset = BlogPost.objects.filter(title__search=search)
        serializer = BlogPostSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
