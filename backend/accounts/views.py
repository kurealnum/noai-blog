from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView

from accounts.models import CustomUser, Link
from accounts.serializers import (
    CustomUserSerializer,
    LinkSerializer,
)


@api_view(["POST"])
def login_user(request):
    data = request.data

    username = data["username"]
    password = data["password"]

    try:
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            res = Response({"success": "User authenticated"}, status=200)
            res.set_cookie("user_id", user.id)  # type: ignore
            return res
        else:
            return Response({"error": "Error Authenticating"}, status=401)
    except:
        return Response({"error": "Something went wrong when logging in"}, status=401)


@api_view(["GET"])
def check_is_authenticated(request):
    user = request.user

    try:
        isAuthenticated = user.is_authenticated

        if isAuthenticated:
            return Response({"isAuthenticated": "success"}, status=200)
        else:
            return Response({"isAuthenticated": "error"}, status=403)
    except:
        return Response(
            {"error": "Something went wrong when checking authentication status"},
            status=404,
        )


@api_view(["POST"])
def logout_user(request):
    try:
        logout(request)
        return Response({"success": "You have been logged out"}, status=200)
    except:
        return Response({"error": "Something went wrong"}, status=403)


class UserInfoView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = (AllowAny,)
    lookup_field = ""

    def get_queryset(self):
        user_id = self.request.user.id  # type:ignore
        return CustomUser.objects.filter(id=user_id)


class UserInfoByUsernameView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = (AllowAny,)
    lookup_field = "username"
    queryset = CustomUser.objects.all()


class Links(generics.ListAPIView):
    serializer_class = LinkSerializer
    permission_classes = (AllowAny,)
    lookup_field = ""

    def get_queryset(self):
        user_id = self.request.user.id  # type:ignore
        return Link.objects.filter(user__id=user_id)


class LinksByUsername(generics.ListAPIView):
    serializer_class = LinkSerializer
    permission_classes = (AllowAny,)
    lookup_field = "username"
    queryset = Link.objects.select_related("user")


class UpdateLinks(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user_id = self.request.user.id  # type:ignore
        initial_instances = Link.objects.filter(user=user_id)
        data = request.data
        print(data)
        for updated_data in data:
            try:
                instance = initial_instances.get(id=updated_data["id"])
                serializer = LinkSerializer(data=updated_data, instance=instance)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
            except Link.DoesNotExist:
                serializer = LinkSerializer(data=updated_data)
                if serializer.is_valid() and len(initial_instances) < 5:
                    serializer.save()
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
        return Response(status=status.HTTP_201_CREATED)


class UpdateUserInfo(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
