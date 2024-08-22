from django.db.models import Subquery
from rest_framework import generics
from rest_framework.permissions import AllowAny

from blogs.models import BlogPost, Comment, ReplyTo
from blogs.serializers import BlogPostSerializer, CommentSerializer


class BlogPostList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogPostSerializer

    def get_queryset(self):  # type: ignore
        user = self.request.user
        return BlogPost.objects.filter(user=user)


class CommentReplyList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        replyto_query = ReplyTo.objects.values_list("reply", flat=True)
        return Comment.objects.filter(user=user).filter(id__in=Subquery(replyto_query))
