from django.db.models import F, Case, Count, ExpressionWrapper, FloatField, When
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import Follower
from lists.models import List
from lists.serializers import CreateOrUpdateListSerializer, ListSerializer


class ListView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    # this function assumes that either username and slug will be none or title will be none
    def get(self, request, username=None, slug=None, title=None):
        if title:
            list_post = get_object_or_404(List, title=title)
            serializer = ListSerializer(list_post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if username and slug:
            list_post = get_object_or_404(
                List, user__username=username, slug_field=slug
            )
            serializer = ListSerializer(list_post)
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
