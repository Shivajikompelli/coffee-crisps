"""Django Admin config for Coffee & Crisps"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Cafe, User, MenuCategory, MenuItem, MenuCombo,
    Order, OrderItem, Reservation, LoyaltyTransaction,
    LoyaltyTier, Coupon, Event, EventBooking, DailySalesReport
)

admin.site.site_header = "Coffee & Crisps Admin"
admin.site.site_title = "Coffee & Crisps"
admin.site.index_title = "Café Management Dashboard"

@admin.register(Cafe)
class CafeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'city', 'is_active']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'tier', 'loyalty_points', 'is_verified']
    list_filter = ['tier', 'is_verified', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Loyalty', {'fields': ('phone', 'birthday', 'loyalty_points', 'tier', 'marketing_consent')}),
    )

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'is_featured', 'total_orders']
    list_filter = ['category', 'is_available', 'is_veg', 'is_featured']
    list_editable = ['is_available', 'is_featured', 'price']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'status', 'total_amount', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'order_type']
    search_fields = ['order_number', 'guest_name', 'guest_phone']
    readonly_fields = ['razorpay_order_id', 'razorpay_payment_id']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['name', 'date', 'time', 'guests', 'occasion', 'status']
    list_filter = ['status', 'occasion', 'date']
    search_fields = ['name', 'phone', 'confirmation_code']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'usage_count', 'is_active', 'valid_until']
    list_editable = ['is_active']

@admin.register(LoyaltyTransaction)
class LoyaltyTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'points', 'balance_after', 'created_at']
    list_filter = ['transaction_type']
    readonly_fields = ['created_at']

admin.site.register(MenuCategory)
admin.site.register(LoyaltyTier)
admin.site.register(Event)
admin.site.register(EventBooking)
admin.site.register(DailySalesReport)
