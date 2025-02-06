from django.db.models import F, Q, Case, Count, ExpressionWrapper, FloatField, When
from django.http.response import Http404
from django.template.defaultfilters import slugify
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.helpers import IsAdmin, IsModerator
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer
from base.base_helpers import filter_blog_post_by_post_type
from blogs.models import BlogPost, Crosspost, PostComment, PostReaction
from blogs.serializers import (
    BlogPostSerializer,
    CommentAndUserSerializer,
    CommentSerializer,
    CreateOrUpdateBlogPostSerializer,
    CreateOrUpdateCommentSerializer,
    CrosspostSerializer,
    ReactionSerializer,
)
from followers.models import Follower


class CommentListUserView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, post_type):
        user = self.request.user.id  # type: ignore
        query = PostComment.objects.filter(
            user=user, post_type=post_type
        ).select_related("post")
        serializer = CommentSerializer(query, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


# this is the view for a *single* blog post
class BlogPostView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

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
            serializer = BlogPostSerializer(res)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except BlogPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        content = data["content"]
        thumbnail = data["thumbnail"]
        post_type = data["post_type"]

        if thumbnail == "undefined":
            thumbnail = None
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
            "thumbnail": thumbnail,
            "post_type": post_type,
        }

        blog_post_serializer = CreateOrUpdateBlogPostSerializer(data=serializer_data)
        if blog_post_serializer.is_valid():
            blog_post_serializer.save()
            res = blog_post_serializer.data

            url = data.get("url")

            # this is not the security measure to end all security measures, but it's just a nice little safety feature
            if url is not None and url[:8] == "https://":
                blog_post = BlogPost.objects.get(slug_field=slugify(title), user=user)
                crosspost_serializer_data = {
                    "blog_post": blog_post.pk,  # type: ignore
                    "url": url,
                    "post_type": post_type,
                }
                crosspost_serializer = CrosspostSerializer(
                    data=crosspost_serializer_data
                )

                if crosspost_serializer.is_valid():
                    crosspost_serializer.save()
                    return Response(data=res, status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        data=crosspost_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response(data=res, status=status.HTTP_201_CREATED)

        return Response(
            data=blog_post_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request):
        data = request.data

        # Data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        title_slug = data["title_slug"]
        content = data["content"]
        thumbnail = data["thumbnail"]
        original_slug = data["original_slug"]
        url = data.get("url")  # url is not gauranteed to exist

        # Title logic
        try:
            is_original_post = BlogPost.objects.get(
                user=self.request.user, slug_field=title_slug
            )
        except BlogPost.DoesNotExist:
            is_original_post = None

        # Weird conditional, just means that if the title has changed and theres a post with the title "title_slug", then return a 400
        if title_slug != original_slug and is_original_post:
            return Response(
                data={"error": "A post with this title already exists!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Thumbnail logic
        if thumbnail == "undefined" and is_original_post:
            thumbnail = is_original_post.thumbnail
            if not thumbnail:
                thumbnail = None
        elif thumbnail == "undefined":
            thumbnail = None

        # Serializers/Saving/Responses
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
            "thumbnail": thumbnail,
        }

        instance = generics.get_object_or_404(
            BlogPost, user=user, slug_field=original_slug
        )
        serializer = CreateOrUpdateBlogPostSerializer(
            data=serializer_data, instance=instance
        )

        # If URL does exist, save it to its corresponding Crosspost
        if url is not None:
            crosspost_instance = Crosspost.objects.get(blog_post=instance)
            crosspost_data = {"url": url}
            crosspost_serializer = CrosspostSerializer(
                instance=crosspost_instance, partial=True, data=crosspost_data
            )

            # If crosspost serializer is valid, save it, but don't return a response. We still need to save the main BlogPost serializer.
            if crosspost_serializer.is_valid():
                crosspost_serializer.save()
            else:
                return Response(
                    data=crosspost_serializer.errors, status=status.HTTP_400_BAD_REQUEST
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
        return Response(status=status.HTTP_204_NO_CONTENT)


# this is the view for *multiple* blog posts
class BlogPostListView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, post_type, username=None):
        if username:
            try:
                res = filter_blog_post_by_post_type(
                    post_type=post_type, user__username=username
                )
                if len(res) == 0:
                    raise BlogPost.DoesNotExist
                serializer = BlogPostSerializer(res, many=True)
            except BlogPost.DoesNotExist:
                raise Http404
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type:ignore
            res = filter_blog_post_by_post_type(
                post_type=post_type, user=user
            ).select_related("user")
            serializer = BlogPostSerializer(res, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


# This view returns replies to *comments* that a user has made
class CommentReplyListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return PostComment.objects.filter(user=user).exclude(reply_to=None)


class BlogPostCommentView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    def get(self, request, username, slug):
        post = generics.get_object_or_404(
            BlogPost, slug_field=slug, user__username=username
        )
        queryset = PostComment.objects.filter(post=post).select_related(
            "user", "reply_to"
        )
        serializer = CommentAndUserSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        # this is mainly for the frontend, because it is being a pain.
        if "reply_to" not in data.keys():
            reply_to = None
        else:
            reply_to = data["reply_to"]

        if reply_to == "":
            reply_to = None

        new_comment = {
            "user": self.request.user.id,  # type:ignore
            "post": generics.get_object_or_404(
                BlogPost,
                slug_field=data["slug"],
                user__username=data["username"],
            ).pk,
            "content": data["content"],
            "is_read": False,
            "reply_to": reply_to,
        }
        serializer = CreateOrUpdateCommentSerializer(data=new_comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # in this case, updating a comment only involves changing the content
    def patch(self, request, id):
        data = request.data
        user = self.request.user
        comment = generics.get_object_or_404(PostComment, pk=id, user=user)
        serializer = CreateOrUpdateCommentSerializer(
            instance=comment, data={"content": data["content"], "user": user.id}  # type: ignore
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = self.request.user
        comment = generics.get_object_or_404(PostComment, user=user, pk=id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# This view returns replies to *posts* that a user has made
class PostReplyListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        return PostComment.objects.filter(user=user, reply_to=None)


class FeedListView(APIView):
    def get(self, request, index, post_type=None):
        index = int(index)
        posts_per_page = 50

        # id like to change this to a multiplier at some point
        follower_addition = 50
        listicle_debuff = 30
        comment_score = 5
        reaction_score = 3

        # initial query
        if not post_type:
            filter_query = BlogPost.objects.filter(enabled=True)
        else:
            # we also want to get crossposts of type post_type
            filter_query = filter_blog_post_by_post_type(post_type, enabled=True)

        # score and rank posts
        all_posts = (
            filter_query.annotate(
                reactions=Count("postreaction"),
                comments=Count("postcomment"),
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

        serializer = BlogPostSerializer(all_posts, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


# defaults for basereactionview are correct for PostReactionView
class PostReactionView(APIView):
    permission_classes = (IsAuthenticated,)

    # methods takes in user (self.request.user) and the post slug (its unique)
    def get(self, request, slug, username):
        # here, user refers to the authenticated user making the request, and username refers to the username of the user that published the article
        user = self.request.user
        blog_post = generics.get_object_or_404(
            BlogPost, slug_field=slug, user__username=username
        )
        reaction = generics.get_object_or_404(PostReaction, post=blog_post, user=user)
        serializer = ReactionSerializer(reaction)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = self.request.user.id  # type: ignore
        slug = request.data["slug"]
        username = request.data["username"]
        blog_post = generics.get_object_or_404(
            BlogPost, slug_field=slug, user__username=username
        ).pk
        data = {"user": user, "post": blog_post}
        serializer = ReactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = self.request.user
        slug = request.data["slug"]
        blog_post = generics.get_object_or_404(BlogPost, slug_field=slug)
        reaction = generics.get_object_or_404(PostReaction, post=blog_post, user=user)
        reaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
