from django.db.models import Count, Subquery
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


# This view returns replies to *comments* that a user has made
class CommentReplyList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        replyto_query = ReplyTo.objects.values_list("reply", flat=True)
        return Comment.objects.filter(user=user).filter(id__in=Subquery(replyto_query))


# This view returns replies to *posts* that a user has made
class PostReplyList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        replyto_query = ReplyTo.objects.values_list("reply", flat=True)
        return Comment.objects.filter(user=user).exclude(id__in=Subquery(replyto_query))


# This view returns a feed of the top seven posts over the last day as well as the top 3 newest posts
class FeedList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        top_subquery = BlogPost.objects.annotate(
            reactions=Count("PostReaction")
        ).order_by("reactions")
        top_posts = BlogPost.objects.filter(id__in=Subquery(top_subquery)).order_by(
            "-created_date"
        )
        return top_posts
