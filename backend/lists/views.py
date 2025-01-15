from django.db.models import F, Case, Count, ExpressionWrapper, FloatField, When
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from base.base_views import (
    BaseCommentView,
    BasePostListView,
    BasePostView,
    BaseReactionView,
)
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


class ListView(BasePostView):
    main_model = List
    reaction_model_string = "listreaction"
    serializer_for_get = ListSerializer
    serializer_for_post = CreateOrUpdateListSerializer
    serializer_for_put = CreateOrUpdateListSerializer


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
