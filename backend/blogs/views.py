from rest_framework import generics
from rest_framework.permissions import AllowAny

from blogs.models import BlogPost
from blogs.serializers import BlogPostSerializer
from accounts.models import CustomUser


class PostList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogPostSerializer

    def get_queryset(self):  # type: ignore
        username = self.request.GET.get("username")
        if username is not None:
            user = CustomUser.objects.filter(username=username)
            return BlogPost.objects.filter(user=user)
        else:
            return BlogPost.objects.none()
