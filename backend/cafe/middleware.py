"""Tenant middleware — resolves cafe from request"""
from django.utils.deprecation import MiddlewareMixin

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Resolve tenant by subdomain or header
        host = request.META.get('HTTP_HOST', '')
        request.cafe_slug = host.split('.')[0] if '.' in host else 'coffee-crisps'
