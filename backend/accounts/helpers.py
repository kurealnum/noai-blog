from typing import Any
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsModerator(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True

        if request.user.is_mod or request.user.is_admin:
            return True

        return False
