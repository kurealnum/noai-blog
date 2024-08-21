from rest_framework import generics
from rest_framework.permissions import AllowAny

from blogs.models import BlogPost
from blogs.serializers import BlogPostSerializer


class BlogPostList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogPostSerializer

    def get_queryset(self):  # type: ignore
        user = self.request.user
        return BlogPost.objects.filter(user=user)
