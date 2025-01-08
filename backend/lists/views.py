from django.db.models import F, Case, Count, ExpressionWrapper, FloatField, When
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.base_views import BaseCommentView, BasePostListView, BaseReactionView
from blogs.models import Follower
from lists.models import List, ListComment, ListReaction
from lists.serializers import (
    CreateOrUpdateListCommentSerializer,
    CreateOrUpdateListSerializer,
    ListCommentSerializer,
    ListReactionSerializer,
    ListSerializer,
)


class ListCommentView(BaseCommentView):
    main_model = ListComment
    post_model = List
    serializer_for_get = ListCommentSerializer
    serializer_for_post = CreateOrUpdateListCommentSerializer
    serializer_for_put = CreateOrUpdateListCommentSerializer


class ListReactionView(BaseReactionView):
    main_model = List
    reaction_model = ListReaction
    reaction_serializer_for_get = ListReactionSerializer
    reaction_serializer_for_post = ListReactionSerializer


class List_ListView(BasePostListView):
    main_model = List
    serializer_for_get = ListSerializer


class ListView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    # this function assumes that either username and slug will be none or title will be none
    def get(self, request, username=None, slug=None, title=None):
        if title:
            _list = (
                List.objects.select_related("user")
                .annotate(likes=Count("listreaction"))
                .get(user__username=username, slug_field=slug)
            )
            serializer = ListSerializer(_list)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if username and slug:
            _list = (
                List.objects.select_related("user")
                .annotate(likes=Count("listreaction"))
                .get(user__username=username, slug_field=slug)
            )
            serializer = ListSerializer(_list)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        content = data["content"]
        thumbnail = data["thumbnail"]
        if thumbnail == "undefined":
            thumbnail = None
        serializer_data = {
            "user": user,
            "title": title,
            "content": content,
            "thumbnail": thumbnail,
        }

        serializer = CreateOrUpdateListSerializer(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data

        # blog post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        title_slug = data["title_slug"]
        content = data["content"]
        thumbnail = data["thumbnail"]
        original_slug = data["original_slug"]

        try:
            is_original_post = List.objects.get(
                user=self.request.user, slug_field=title_slug
            )
        except List.DoesNotExist:
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

        instance = get_object_or_404(List, user=user, slug_field=original_slug)
        serializer = CreateOrUpdateListSerializer(
            data=serializer_data, instance=instance
        )
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        data = request.data
        user = self.request.user
        to_delete = get_object_or_404(List, user=user, slug_field=data["slug"])
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListFeed(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, index):
        index = int(index)
        posts_per_page = 50

        # id like to change this to a multiplier at some point
        follower_addition = 50
        comment_score = 5
        reaction_score = 3

        # initial query
        all_posts = (
            List.objects.all()
            .annotate(
                reactions=Count("listreaction"),
                comments=Count("listcomment"),
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

        serializer = ListSerializer(all_posts, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
