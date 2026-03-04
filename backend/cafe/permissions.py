"""Custom DRF Permissions"""
from rest_framework.permissions import BasePermission

class IsCafeAdmin(BasePermission):
    """Allow access only to staff or superusers"""
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_staff or request.user.is_superuser))
