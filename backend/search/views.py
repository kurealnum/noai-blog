from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from blogs.models import BlogPost
from blogs.serializers import BlogPostSerializer


class BlogPostSearch(APIView):
    def get(self, request, search=None, page=1):
        page = int(page)
        posts_per_page = 50
        if not search:
            queryset = BlogPost.objects.all()[:50]
            short_queryset = queryset[
                posts_per_page * (page - 1) : posts_per_page * page
            ]
            serializer = BlogPostSerializer(short_queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        queryset = BlogPost.objects.filter(title__search=search)
        short_queryset = queryset[posts_per_page * (page - 1) : posts_per_page * page]
        serializer = BlogPostSerializer(short_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
