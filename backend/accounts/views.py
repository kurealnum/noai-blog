from django.http import Http404
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView

from accounts.models import CustomUser, Link
from accounts.serializers import (
    CustomUserSerializer,
    LinkSerializer,
    NewCustomUserSerializer,
    PutCustomUserSerializer,
)
from blogs.models import Comment
from blogs.serializers import NotificationCommentSerializer


class LoginUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data

        username = data["username"]
        password = data["password"]

        try:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                res = Response({"success": "User authenticated"}, status=200)
                res.set_cookie("user_id", user.id, samesite="Strict")  # type: ignore
                return res
            else:
                return Response({"error": "Error Authenticating"}, status=401)
        except Exception:
            return Response(
                {"error": "Something went wrong when logging in"}, status=401
            )


class CheckAuthenticatedView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        user = request.user

        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                res = Response({"isAuthenticated": "success"}, status=200)
                res.set_cookie("user_id", user.id, samesite="Strict")  # type: ignore
                return res
            else:
                return Response({"isAuthenticated": "error"}, status=403)
        except Exception:
            return Response(
                {"error": "Something went wrong when checking authentication status"},
                status=404,
            )


class LogoutUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            logout(request)
            return Response({"success": "You have been logged out"}, status=200)
        except Exception:
            return Response({"error": "Something went wrong"}, status=403)


class UserInfoView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, username=None):
        if username:
            try:
                res = CustomUser.objects.get(username=username)
                serializer = CustomUserSerializer(res)
            except CustomUser.DoesNotExist:
                raise Http404

            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user.id  # type: ignore
            res = generics.get_object_or_404(CustomUser, id=user)
            serializer = CustomUserSerializer(res)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


class ChangeProfilePictureView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    # the image field should look something like {profile-picture: imagehere}
    def patch(self, request):
        image_data = {"profile_picture": request.data["profile_picture"]}
        user = self.request.user.id  # type:ignore
        user_object = generics.get_object_or_404(CustomUser, id=user)
        serializer = CustomUserSerializer(
            data=image_data, instance=user_object, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class LinksView(APIView):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method.lower() != "get":  # type: ignore
            permissions.append(IsAuthenticated())  # type: ignore
        return permissions

    def put(self, request):
        user_id = self.request.user.id  # type:ignore
        initial_instances = Link.objects.filter(user=user_id)
        data = request.data
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
            # a KeyError could be caused by the instantiation of `instance`, same thing with Link.DoesNotExist
            except (KeyError, Link.DoesNotExist):
                serializer = LinkSerializer(data=updated_data)
                if serializer.is_valid() and len(initial_instances) < 5:
                    serializer.save()
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request):
        id = request.data["id"]
        try:
            link = Link.objects.get(id=id)
        except Link.DoesNotExist:
            raise Http404
        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        data = request.data
        user_id = self.request.user.id  # type:ignore
        data["user"] = user_id
        new_link = LinkSerializer(data=data)
        if new_link.is_valid():
            new_link.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(data=new_link.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, username=None):
        if username:
            try:
                res = Link.objects.filter(user__username=username)
                # scuffed? perhaps. but i want to go play battlebit
                if len(res) == 0:
                    raise Link.DoesNotExist
                serializer = LinkSerializer(instance=res, many=True)
            except Link.DoesNotExist:
                raise Http404
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            user = self.request.user
            res = Link.objects.filter(user=user)
            serializer = LinkSerializer(instance=res, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)


# updates all info except profile picture
class UpdateUserInfoView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PutCustomUserSerializer
    queryset = CustomUser.objects.all()


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data
        serializer = NewCustomUserSerializer(data=data)
        serializer.is_valid()
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)


# this view gets all notifications and changes the new ones to is_read=True
class NotificationView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = self.request.user.id  # type: ignore
        unread_comments = Comment.objects.filter(user=user).select_related("user")

        serializer = NotificationCommentSerializer(instance=unread_comments, many=True)

        # not sure why I have to update comments after I declare response, but I do
        response = Response(data=serializer.data, status=status.HTTP_200_OK)

        unread_comments.update(is_read=True)
        for comment in unread_comments:
            comment.save()

        return response


class NotificationCountView(APIView):
    def get(self, request):
        user = self.request.user.id  # type: ignore
        unread_comments = Comment.objects.filter(user=user, is_read=False).count()

        return Response(data={"count": unread_comments}, status=status.HTTP_200_OK)
