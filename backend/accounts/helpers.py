from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsModerator(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if not request.user:
            return False

        if bool(
            request.user.is_authenticated
            and (request.user.is_mod or request.user.is_admin)
        ):
            return True

        if request.user.is_superuser:
            return True

        return False
