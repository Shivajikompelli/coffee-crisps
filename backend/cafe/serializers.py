"""DRF Serializers for Coffee & Crisps Café"""
from rest_framework import serializers
from .models import (
    MenuItem, MenuCategory, Order, OrderItem, Reservation,
    LoyaltyTransaction, Coupon, Event, EventBooking, User
)

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'slug', 'icon', 'display_order']

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'image_url',
            'category', 'category_name', 'is_veg', 'is_vegan', 'is_gluten_free',
            'spice_level', 'prep_time_minutes', 'calories', 'allergens',
            'is_available', 'is_featured', 'is_bestseller', 'badge_text',
            'display_order', 'total_orders',
        ]
        read_only_fields = ['total_orders']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'subtotal', 'customizations']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'order_type', 'items',
            'subtotal', 'discount_amount', 'tax_amount', 'total_amount',
            'payment_status', 'razorpay_order_id', 'loyalty_points_earned',
            'special_instructions', 'created_at',
        ]

class OrderCreateSerializer(serializers.Serializer):
    cafe_slug = serializers.CharField(default='coffee-crisps')
    items = serializers.ListField(child=serializers.DictField())
    order_type = serializers.ChoiceField(choices=['dine_in', 'takeaway', 'delivery'])
    guest_name = serializers.CharField(required=False, allow_blank=True)
    guest_phone = serializers.CharField(required=False, allow_blank=True)
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    redeem_points = serializers.IntegerField(required=False, default=0)
    special_instructions = serializers.CharField(required=False, allow_blank=True)

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = [
            'id', 'name', 'phone', 'email', 'date', 'time',
            'guests', 'occasion', 'special_requests', 'status',
            'confirmation_code', 'created_at',
        ]
        read_only_fields = ['confirmation_code', 'status']

class LoyaltySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyTransaction
        fields = ['transaction_type', 'points', 'balance_after', 'description', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'birthday', 'loyalty_points', 'tier', 'marketing_consent',
        ]
        extra_kwargs = {'password': {'write_only': True}}

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'description', 'discount_type', 'discount_value', 'min_order_amount']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_type', 'description', 'starting_price', 'display_order']

class EventBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventBooking
        fields = ['event', 'name', 'phone', 'email', 'event_date', 'guests', 'budget', 'requirements']

class AnalyticsSerializer(serializers.Serializer):
    today = serializers.DictField()
    week = serializers.DictField()
    top_items = serializers.ListField()
    loyalty_members = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    todays_reservations = serializers.ListField()
