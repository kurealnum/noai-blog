# This file contains a lot of the "base" views for certain functionality that other files can inherit from. For instance, BaseReactionView is the base view for ReactionViews for both Lists and BlogPosts

from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import BlogPost, PostReaction
from blogs.serializers import ReactionSerializer


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
