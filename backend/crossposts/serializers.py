from rest_framework import serializers

from crossposts.models import Crosspost


class CrosspostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        fields = "__all__"
        model = Crosspost


class CreateOrUpdateCrosspostSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        fields = ("title", "post_type", "user")
        model = Crosspost
