from django.shortcuts import render

from base.base_views import BasePostListView
from crossposts.models import Crosspost
from crossposts.serializers import CrosspostSerializer


# Create your views here.
class CrosspostListView(BasePostListView):
    main_model = Crosspost
    serializer_for_get = CrosspostSerializer
