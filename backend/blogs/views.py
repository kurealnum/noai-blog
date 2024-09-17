from django.db.models import F, Count, Subquery
from django.http.response import Http404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import BlogPost, Comment, PostReaction, ReplyTo
from blogs.serializers import (
    BlogPostSerializer,
    CommentSerializer,
    FeedBlogPostSerializer,
    SingleBlogPostSerializer,
)


class CommentListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):  # type: ignore
        user = self.request.user.id  # type: ignore
        return Comment.objects.filter(user=user)


# this is the view for a *single* blog post
class BlogPostView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, username, slug):
        try:
            res = (
                BlogPost.objects.select_related("user")
                .annotate(likes=Count("postreaction"))
                .get(user__username=username, slug_field=slug)
            )
            serializer = SingleBlogPostSerializer(res)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except BlogPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# this is the view for *multiple* blog posts
class BlogPostListView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, username=None):
        if username:
            try:
                res = BlogPost.objects.filter(user__username=username)
                if len(res) == 0:
                    raise BlogPost.DoesNotExist
                serializer = BlogPostSerializer(res, many=True)
            except BlogPost.DoesNotExist:
                raise Http404
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type:ignore
            res = BlogPost.objects.filter(user=user).select_related("user")
            serializer = BlogPostSerializer(res, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


# This view returns replies to *comments* that a user has made
class CommentReplyListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        replyto_query = ReplyTo.objects.values_list("reply", flat=True)
        return Comment.objects.filter(user=user).filter(id__in=Subquery(replyto_query))


# This view returns replies to *posts* that a user has made
class PostReplyListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        replyto_query = ReplyTo.objects.values_list("reply", flat=True)
        return Comment.objects.filter(user=user).exclude(id__in=Subquery(replyto_query))


# This view returns a feed of the top posts mixed in with new posts and posts sorted by number of comments
# 60% of returned posts will be sorted by # of reactions, 30% will be sorted by newest, and 10% will be sorted by # of comments
class FeedListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = FeedBlogPostSerializer

    def get_queryset(self):
        comment_score = 5
        reaction_score = 3

        all_posts = (
            BlogPost.objects.all()
            .annotate(
                reactions=Count("postreaction"),
                comments=Count("comment"),
                score=(F("reactions") * reaction_score)
                + (F("comments") * comment_score),
            )
            .select_related("user")
            .order_by("-score")
        )

        return all_posts
