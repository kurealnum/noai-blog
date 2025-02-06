from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import CustomUser
from followers.models import Follower
from followers.serializers import FollowerSerializer, GetFollowerSerializer


class FollowerView(APIView):
    permission_classes = (IsAuthenticated,)

    # this is the equivalent of viewing all the people that are following you
    def get(self, request):
        user = self.request.user.id  # type: ignore
        data = Follower.objects.filter(user=user).select_related("user", "follower")
        serializer = GetFollowerSerializer(data, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    # this is the equivalent of following someone
    def post(self, request):
        # this is the user that is doing the following
        follower = self.request.user.id  # type: ignore
        # this is the user to be followed
        username = request.data["followee"]
        followee = CustomUser.objects.get(username=username).id  # type: ignore
        data = {"user": followee, "follower": follower}
        serializer = FollowerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # this is the equivalent of unfollowing someone
    def delete(self, request):
        username = request.data["followee"]
        followee = CustomUser.objects.get(username=username).id  # type: ignore
        follower = self.request.user
        to_delete = Follower.objects.filter(user=followee, follower=follower)
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Literally a copy and paste of the above `FollowerView`, but for getting the people that you're following instead
class FollowingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, username=None):
        if username:
            user = self.request.user.id  # type: ignore
            try:
                data = Follower.objects.select_related("user", "follower").get(
                    follower=user, user__username=username
                )
            except Follower.DoesNotExist:
                return Response(
                    data={"error": "This user does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = GetFollowerSerializer(data)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type: ignore
            data = Follower.objects.filter(follower=user).select_related(
                "user", "follower"
            )
            serializer = GetFollowerSerializer(data, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
