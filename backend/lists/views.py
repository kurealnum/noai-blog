from django.db.models import F, Case, Count, ExpressionWrapper, FloatField, When
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from base.base_views import (
    BaseCommentView,
    BaseFeedListView,
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


class ListFeed(BaseFeedListView):
    main_model = List
    reaction_model_string = "listreaction"
    comments_model_string = "listcomment"
    serializer_for_get = ListSerializer
    debuff_listicles = False
