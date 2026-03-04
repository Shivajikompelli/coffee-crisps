"""Management command to seed initial coupons"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from cafe.models import Cafe, Coupon

class Command(BaseCommand):
    help = 'Seed initial coupon codes'

    def handle(self, *args, **options):
        cafe = Cafe.objects.get(slug='coffee-crisps')
        coupons = [
            {'code': 'FIRST20', 'description': '20% off your first order', 'discount_type': 'percentage', 'discount_value': 20, 'max_discount': 150, 'min_order_amount': 200},
            {'code': 'CRISPS10', 'description': '10% off any order', 'discount_type': 'percentage', 'discount_value': 10, 'max_discount': 100, 'min_order_amount': 0},
            {'code': 'WEEKEND15', 'description': '15% off weekends', 'discount_type': 'percentage', 'discount_value': 15, 'max_discount': 120, 'min_order_amount': 300},
            {'code': 'FLAT50', 'description': 'Flat ₹50 off', 'discount_type': 'fixed', 'discount_value': 50, 'max_discount': None, 'min_order_amount': 250},
        ]
        now = timezone.now()
        end = now.replace(year=now.year + 1)
        for c in coupons:
            Coupon.objects.get_or_create(
                code=c['code'], cafe=cafe,
                defaults={**c, 'valid_from': now, 'valid_until': end, 'usage_limit': 500}
            )
            self.stdout.write(self.style.SUCCESS(f"✓ Coupon {c['code']} ready"))
