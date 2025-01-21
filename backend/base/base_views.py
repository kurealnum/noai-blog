# This file contains a lot of the "base" views for certain functionality that other files can inherit from. For instance, BaseReactionView is the base view for ReactionViews for both Lists and BlogPosts

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import BlogPost
from blogs.serializers import (
    BlogPostSerializer,
)


class BaseSearchView(APIView):
    permission_classes = (AllowAny,)
    main_model = BlogPost
    posts_per_page = 50
    serializer_for_get = BlogPostSerializer

    def get(self, request, post_type, search=None, page=1):
        page = int(page)
        if not search:
            queryset = self.main_model.objects.filter(post_type=post_type)[:50]
            short_queryset = queryset[
                self.posts_per_page * (page - 1) : self.posts_per_page * page
            ]
            serializer = self.serializer_for_get(short_queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        queryset = self.main_model.objects.filter(
            title__search=search, post_type=post_type
        )
        short_queryset = queryset[
            self.posts_per_page * (page - 1) : self.posts_per_page * page
        ]
        serializer = self.serializer_for_get(short_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
