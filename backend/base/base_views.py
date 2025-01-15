# This file contains a lot of the "base" views for certain functionality that other files can inherit from. For instance, BaseReactionView is the base view for ReactionViews for both Lists and BlogPosts

from django.db.models import Count
from django.http.response import Http404
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import BlogPost, PostComment, PostReaction
from blogs.serializers import (
    BlogPostSerializer,
    CommentAndUserSerializer,
    CreateOrUpdateBlogPostSerializer,
    CreateOrUpdateCommentSerializer,
    ReactionSerializer,
)


# Defaults to info for BlogPost
class BaseReactionView(APIView):
    permission_classes = (IsAuthenticated,)

    main_model = BlogPost
    reaction_model = PostReaction
    reaction_serializer_for_get = ReactionSerializer
    reaction_serializer_for_post = ReactionSerializer

    # methods takes in user (self.request.user) and the post slug (its unique)
    def get(self, request, slug, username):
        # here, user refers to the authenticated user making the request, and username refers to the username of the user that published the article
        user = self.request.user
        blog_post = get_object_or_404(
            self.main_model, slug_field=slug, user__username=username
        )
        reaction = get_object_or_404(self.reaction_model, post=blog_post, user=user)
        serializer = self.reaction_serializer_for_get(reaction)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = self.request.user.id  # type: ignore
        slug = request.data["slug"]
        username = request.data["username"]
        blog_post = get_object_or_404(
            self.main_model, slug_field=slug, user__username=username
        ).pk
        data = {"user": user, "post": blog_post}
        serializer = self.reaction_serializer_for_post(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = self.request.user
        slug = request.data["slug"]
        blog_post = get_object_or_404(self.main_model, slug_field=slug)
        reaction = get_object_or_404(self.reaction_model, post=blog_post, user=user)
        reaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# This view handles getting all comments for a TYPE_OF_POST, creating a comment, editing a comment, and deleting a comment
# Defaults to info for BlogPost
class BaseCommentView(APIView):
    main_model = PostComment
    post_model = BlogPost
    serializer_for_get = CommentAndUserSerializer
    serializer_for_post = CreateOrUpdateCommentSerializer
    serializer_for_put = CreateOrUpdateCommentSerializer

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    def get(self, request, username, slug):
        post = get_object_or_404(
            self.post_model, slug_field=slug, user__username=username
        )
        queryset = self.main_model.objects.filter(post=post).select_related(
            "user", "reply_to"
        )
        serializer = self.serializer_for_get(queryset, many=True)
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
            "post": get_object_or_404(
                self.post_model,
                slug_field=data["slug"],
                user__username=data["username"],
            ).pk,
            "content": data["content"],
            "is_read": False,
            "reply_to": reply_to,
        }
        serializer = self.serializer_for_post(data=new_comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # in this case, updating a comment only involves changing the content
    def patch(self, request, id):
        data = request.data
        user = self.request.user
        comment = get_object_or_404(self.main_model, pk=id, user=user)
        serializer = self.serializer_for_put(
            instance=comment, data={"content": data["content"], "user": user.id}  # type: ignore
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = self.request.user
        comment = get_object_or_404(self.main_model, user=user, pk=id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# this is the view for *multiple* blog posts
class BasePostListView(APIView):
    permission_classes = (AllowAny,)
    main_model = BlogPost
    serializer_for_get = BlogPostSerializer

    def get(self, request, username=None):
        if username:
            try:
                res = self.main_model.objects.filter(user__username=username)
                if len(res) == 0:
                    raise self.main_model.DoesNotExist
                serializer = self.serializer_for_get(res, many=True)
            except self.main_model.DoesNotExist:
                raise Http404
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type:ignore
            res = self.main_model.objects.filter(user=user).select_related("user")
            serializer = self.serializer_for_get(res, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


# this is the view for a *single* post
class BasePostView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    main_model = BlogPost
    reaction_model_string = "postreaction"
    serializer_for_get = BlogPostSerializer
    serializer_for_post = CreateOrUpdateBlogPostSerializer
    serializer_for_put = CreateOrUpdateBlogPostSerializer

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    def get(self, request, username, slug):
        try:
            res = (
                self.main_model.objects.select_related("user")
                .annotate(likes=Count(self.reaction_model_string))
                .get(user__username=username, slug_field=slug)
            )
            serializer = self.serializer_for_get(res)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except BlogPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        content = data["content"]

        # this is primarily for crossposts
        if "thumbnail" not in data.keys():
            thumbnail = None
        else:
            thumbnail = data["thumbnail"]

        if thumbnail == "undefined":
            thumbnail = None
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
            "thumbnail": thumbnail,
        }

        serializer = self.serializer_for_post(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data

        # post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        title_slug = data["title_slug"]
        content = data["content"]
        thumbnail = data["thumbnail"]
        original_slug = data["original_slug"]

        try:
            is_original_post = self.main_model.objects.get(
                user=self.request.user, slug_field=title_slug
            )
        except self.main_model.DoesNotExist:
            is_original_post = None

        # weird conditional, just means that if the title has changed and theres a post with the title "title_slug", then return a 400
        if title_slug != original_slug and is_original_post:
            return Response(
                data={"error": "A post with this title already exists!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if thumbnail == "undefined" and is_original_post:
            thumbnail = is_original_post.thumbnail
            if not thumbnail:
                thumbnail = None
        elif thumbnail == "undefined":
            thumbnail = None

        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
            "thumbnail": thumbnail,
        }

        instance = get_object_or_404(
            self.main_model, user=user, slug_field=original_slug
        )
        serializer = self.serializer_for_put(data=serializer_data, instance=instance)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        data = request.data
        user = self.request.user
        to_delete = get_object_or_404(
            self.main_model, user=user, slug_field=data["slug"]
        )
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
