# This file contains a lot of the "base" views for certain functionality that other files can inherit from. For instance, BaseReactionView is the base view for ReactionViews for both Lists and BlogPosts

from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import BlogPost, PostComment, PostReaction
from blogs.serializers import (
    CommentAndUserSerializer,
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
