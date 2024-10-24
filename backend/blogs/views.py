from django.db.models import (
    F,
    Case,
    Count,
    ExpressionWrapper,
    FloatField,
    When,
)
from django.http.response import Http404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.helpers import IsAdmin, IsModerator
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer
from blogs.models import BlogPost, Comment, Follower, PostReaction
from blogs.serializers import (
    BlogPostSerializer,
    CommentAndUserSerializer,
    CommentSerializer,
    FeedBlogPostSerializer,
    FollowerSerializer,
    GetFollowerSerializer,
    PostSingleBlogPostSerializer,
    ReactionSerializer,
    SingleBlogPostSerializer,
)


class CommentListUserView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):  # type: ignore
        user = self.request.user.id  # type: ignore
        return Comment.objects.filter(user=user)


# this is the view for a *single* blog post
class BlogPostView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

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

    def post(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        content = data["content"]
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
        }

        serializer = PostSingleBlogPostSerializer(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer_data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        content = data["content"]
        slug = data["slug"]
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
        }

        instance = generics.get_object_or_404(BlogPost, user=user, slug_field=slug)
        serializer = PostSingleBlogPostSerializer(
            data=serializer_data, instance=instance
        )
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        data = request.data
        user = self.request.user
        to_delete = generics.get_object_or_404(
            BlogPost, user=user, slug_field=data["slug"]
        )
        to_delete.delete()
        return Response(status=status.HTTP_200_OK)


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
    permission_classes = (IsAuthenticated,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user).exclude(reply_to=None)


# This view handles getting all comments for a BlogPost, creating a comment, editing a comment, and deletingr a comment
class CommentListView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    def get(self, request, username, slug):
        post = generics.get_object_or_404(
            BlogPost, slug_field=slug, user__username=username
        )
        queryset = Comment.objects.filter(post=post).select_related("user", "reply_to")
        serializer = CommentAndUserSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        # this is mainly for the frontend, because it is being a pain.
        if "reply_to" not in data.keys():
            reply_to = None
        else:
            reply_to = data["reply_to"]

        new_comment = {
            "user": self.request.user.id,  # type:ignore
            "post": generics.get_object_or_404(
                BlogPost, slug_field=data["slug"], user=self.request.user
            ).pk,
            "content": data["content"],
            "is_read": False,
            "reply_to": reply_to,
        }
        serializer = CommentSerializer(data=new_comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # in this case, updating a comment only involves changing the content
    def patch(self, request, id):
        data = request.data
        user = self.request.user
        comment = generics.get_object_or_404(Comment, pk=id, user=user)
        serializer = CommentSerializer(
            instance=comment, data={"content": data["content"], "user": user.id}  # type: ignore
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = self.request.user
        comment = generics.get_object_or_404(Comment, user=user, pk=id)
        comment.delete()
        return Response(status=status.HTTP_200_OK)


# This view returns replies to *posts* that a user has made
class PostReplyListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user, reply_to=None)


class FeedListView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, index):
        index = int(index)
        posts_per_page = 50

        # id like to change this to a multiplier at some point
        follower_addition = 50
        listicle_debuff = 30
        comment_score = 5
        reaction_score = 3

        # initial query
        all_posts = (
            BlogPost.objects.all()
            .annotate(
                reactions=Count("postreaction"),
                comments=Count("comment"),
                score=ExpressionWrapper(
                    (F("reactions") * reaction_score) + (F("comments") * comment_score),
                    output_field=FloatField(),
                ),
            )
            .select_related("user")
            .order_by("-score")
        )

        # paginating list
        all_posts = all_posts[posts_per_page * (index - 1) : posts_per_page * index]

        # adding listicle "debuff"
        all_posts = all_posts.annotate(
            score=Case(
                When(
                    is_listicle=True,
                    then=ExpressionWrapper(
                        F("score") - listicle_debuff, output_field=FloatField()
                    ),
                ),
                default=ExpressionWrapper(F("score"), output_field=FloatField()),
            )
        )

        # adding follower "boosts"
        if request.user.id:
            following = (
                Follower.objects.filter(follower=request.user.id)
                .select_related("user")
                .values("user__username")
            )

            all_posts = all_posts.annotate(
                score=Case(
                    When(
                        user__username__in=following,
                        then=ExpressionWrapper(
                            F("score") + follower_addition, output_field=FloatField()
                        ),
                    ),
                    default=ExpressionWrapper(F("score"), output_field=FloatField()),
                ),
            )

        serializer = FeedBlogPostSerializer(all_posts, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class FollowerView(APIView):
    permission_classes = (IsAuthenticated,)

    # this is the equivalent of viewing all the people that are following you
    def get(self, request):
        user = self.request.user.id  # type: ignore
        data = Follower.objects.filter(user=user).select_related("user", "follower")
        serializer = GetFollowerSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # this is the equivalent of unfollowing someone
    def delete(self, request):
        username = request.data["followee"]
        followee = CustomUser.objects.get(username=username).id  # type: ignore
        follower = self.request.user
        to_delete = Follower.objects.filter(user=followee, follower=follower)
        to_delete.delete()
        return Response(status=status.HTTP_200_OK)


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
                return Http404
            serializer = GetFollowerSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type: ignore
            data = Follower.objects.filter(follower=user).select_related(
                "user", "follower"
            )
            serializer = GetFollowerSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


# both methods takes in user (self.request.user) and the post slug (its unique)
class ReactionView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, slug):
        user = self.request.user
        blog_post = generics.get_object_or_404(BlogPost, slug_field=slug, user=user)
        reaction = generics.get_object_or_404(PostReaction, post=blog_post, user=user)
        serializer = ReactionSerializer(reaction)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = self.request.user.id  # type: ignore
        slug = request.data["slug"]
        blog_post = generics.get_object_or_404(BlogPost, slug_field=slug).pk
        data = {"user": user, "post": blog_post}
        serializer = ReactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = self.request.user
        slug = request.data["slug"]
        blog_post = generics.get_object_or_404(BlogPost, slug_field=slug, user=user)
        reaction = generics.get_object_or_404(PostReaction, post=blog_post, user=user)
        reaction.delete()
        return Response(status=status.HTTP_200_OK)


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
        comment = generics.get_object_or_404(Comment, pk=id)
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
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminGetAllFlaggedCommentsView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        queryset = Comment.objects.filter(flagged=True).select_related("user")
        serializer = CommentAndUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminGetAllFlaggedUsersView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        queryset = CustomUser.objects.filter(flagged=True)
        serializer = CustomUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        comment = generics.get_object_or_404(Comment, pk=id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminManagerUserView(APIView):
    permission_classes = (IsAdmin,)

    def delete(self, request, username):
        user = generics.get_object_or_404(CustomUser, username=username)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
