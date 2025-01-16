from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from base.base_views import (
    BaseCommentView,
    BasePostListView,
    BasePostView,
    BaseReactionView,
)
from crossposts.models import Crosspost, CrosspostComment, CrosspostReaction
from crossposts.serializers import (
    CreateOrUpdateCrosspostCommentSerializer,
    CreateOrUpdateCrosspostSerializer,
    CrosspostCommentAndUserSerializer,
    CrosspostReactionSerializer,
    CrosspostSerializer,
)


# Create your views here.
class CrosspostListView(BasePostListView):
    main_model = Crosspost
    serializer_for_get = CrosspostSerializer


class CrosspostView(BasePostView):
    main_model = Crosspost
    reaction_model_string = "crosspostreaction"
    serializer_for_get = CrosspostSerializer

    def post(self, request):
        data = request.data

        # post specific data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        post_type = data["post_type"]

        serializer_data = {"title": title, "post_type": post_type, "user": user}

        serializer = CreateOrUpdateCrosspostSerializer(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data
        user = self.request.user.id  # type: ignore
        title = data["title"]
        post_type = data["post_type"]
        title_slug = data["title_slug"]
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

        serializer_data = {"title": title, "post_type": post_type, "user": user}
        instance = get_object_or_404(
            self.main_model, user=user, slug_field=original_slug
        )
        serializer = CreateOrUpdateCrosspostSerializer(
            data=serializer_data, instance=instance
        )
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CrosspostReactionView(BaseReactionView):
    main_model = Crosspost
    reaction_model = CrosspostReaction
    reaction_serializer_for_get = CrosspostReactionSerializer
    reaction_serializer_for_post = CrosspostReactionSerializer


class CrosspostCommentView(BaseCommentView):
    main_model = CrosspostComment
    post_model = Crosspost
    serializer_for_get = CrosspostCommentAndUserSerializer
    serializer_for_post = CreateOrUpdateCrosspostCommentSerializer
    serializer_for_put = CreateOrUpdateCrosspostCommentSerializer
