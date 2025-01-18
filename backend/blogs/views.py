from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.helpers import IsAdmin, IsModerator
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer
from base.base_views import (
    BaseCommentView,
    BaseFeedListView,
    BasePostListView,
    BasePostView,
    BaseReactionView,
)
from blogs.models import BlogPost, PostComment, Follower
from blogs.serializers import (
    BlogPostSerializer,
    CommentSerializer,
    FollowerSerializer,
    GetFollowerSerializer,
)


class CommentListUserView(APIView):
    permission_classes = (AllowAny,)

    def get(self, post_type):
        user = self.request.user.id  # type: ignore
        query = PostComment.objects.filter(user=user, comment_type=type).select_related(
            "post"
        )
        serializer = CommentSerializer(query, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


# this is the view for a *single* blog post
class BlogPostView(BasePostView):
    pass


# this is the view for *multiple* blog posts
class BlogPostListView(BasePostListView):
    pass


# This view returns replies to *comments* that a user has made
class CommentReplyListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return PostComment.objects.filter(user=user).exclude(reply_to=None)


class BlogPostCommentView(BaseCommentView):
    pass


# This view returns replies to *posts* that a user has made
class PostReplyListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return PostComment.objects.filter(user=user, reply_to=None)


class FeedListView(BaseFeedListView):
    pass


class FollowerView(APIView):
    permission_classes = (IsAuthenticated,)

    # this is the equivalent of viewing all the people that are following you
    def get(self, request):
        user = self.request.user.id  # type: ignore
        data = Follower.objects.filter(user=user).select_related("user", "follower")
        serializer = GetFollowerSerializer(data, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    # this is the equivalent of following someone
    def post(self, request):
        # this is the user that is doing the following
        follower = self.request.user.id  # type: ignore
        # this is the user to be followed
        username = request.data["followee"]
        followee = CustomUser.objects.get(username=username).id  # type: ignore
        data = {"user": followee, "follower": follower}
        serializer = FollowerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # this is the equivalent of unfollowing someone
    def delete(self, request):
        username = request.data["followee"]
        followee = CustomUser.objects.get(username=username).id  # type: ignore
        follower = self.request.user
        to_delete = Follower.objects.filter(user=followee, follower=follower)
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Literally a copy and paste of the above `FollowerView`, but for getting the people that you're following instead
class FollowingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, username=None):
        if username:
            user = self.request.user.id  # type: ignore
            try:
                data = Follower.objects.select_related("user", "follower").get(
                    follower=user, user__username=username
                )
            except Follower.DoesNotExist:
                return Response(
                    data={"error": "This user does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = GetFollowerSerializer(data)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type: ignore
            data = Follower.objects.filter(follower=user).select_related(
                "user", "follower"
            )
            serializer = GetFollowerSerializer(data, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


# defaults for basereactionview are correct for PostReactionView
class PostReactionView(BaseReactionView):
    pass


class ModeratorModifyPostView(APIView):
    permission_classes = (IsModerator,)

    # this is a toggle: it will set blog_post.flagged to the opposite of blog_post.flagged
    def patch(self, request, slug, username):
        blog_post = generics.get_object_or_404(
            BlogPost, slug_field=slug, user__username=username
        )
        blog_post.toggle_flagged()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ModeratorModifyCommentView(APIView):
    permission_classes = (IsModerator,)

    def patch(self, request, id):
        comment = generics.get_object_or_404(PostComment, pk=id)
        comment.toggle_flagged()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ModeratorModifyUserView(APIView):
    permission_classes = (IsModerator,)

    def patch(self, request, username):
        user = generics.get_object_or_404(CustomUser, username=username)
        user.toggle_flagged()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminGetAllFlaggedPostsView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        queryset = BlogPost.objects.filter(flagged=True)
        serializer = BlogPostSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class AdminGetAllFlaggedCommentsView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        queryset = PostComment.objects.filter(flagged=True).select_related(
            "user", "post"
        )
        serializer = CommentSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class AdminGetAllFlaggedUsersView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        queryset = CustomUser.objects.filter(flagged=True)
        serializer = CustomUserSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class AdminManageListicleView(APIView):
    permission_classes = (IsAdmin,)

    def patch(self, request, username, slug):
        blog_post = generics.get_object_or_404(
            BlogPost, user__username=username, slug_field=slug
        )
        blog_post.toggle_listicle()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminManagePostView(APIView):
    permission_classes = (IsAdmin,)

    def delete(self, request, username, slug):
        blog_post = generics.get_object_or_404(
            BlogPost, user__username=username, slug_field=slug
        )
        blog_post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminManageCommentView(APIView):
    permission_classes = (IsAdmin,)

    def delete(self, request, id):
        comment = generics.get_object_or_404(PostComment, pk=id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminManagerUserView(APIView):
    permission_classes = (IsAdmin,)

    def delete(self, request, username):
        user = generics.get_object_or_404(CustomUser, username=username)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
