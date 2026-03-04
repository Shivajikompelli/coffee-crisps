"""Coffee & Crisps — Cafe App URL Routes"""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),

    # Menu
    path('menu/', views.MenuItemListView.as_view(), name='menu-list'),
    path('menu/<slug:slug>/', views.MenuItemDetailView.as_view(), name='menu-detail'),
    path('menu/categories/', views.MenuCategoryListView.as_view(), name='menu-categories'),
    path('menu/admin/create/', views.MenuItemCreateView.as_view(), name='menu-create'),
    path('menu/admin/<int:pk>/update/', views.MenuItemUpdateView.as_view(), name='menu-update'),
    path('menu/admin/<int:pk>/toggle/', views.MenuItemToggleAvailability.as_view(), name='menu-toggle'),

    # Orders
    path('orders/', views.CreateOrderView.as_view(), name='order-create'),
    path('orders/<uuid:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('orders/<uuid:pk>/verify/', views.VerifyPaymentView.as_view(), name='order-verify'),
    path('orders/history/', views.OrderHistoryView.as_view(), name='order-history'),

    # Reservations
    path('reservations/', views.ReservationCreateView.as_view(), name='reservation-create'),
    path('admin/reservations/', views.ReservationListView.as_view(), name='reservation-list'),

    # Loyalty
    path('loyalty/', views.LoyaltyDashboardView.as_view(), name='loyalty'),
    path('loyalty/redeem/', views.RedeemPointsView.as_view(), name='loyalty-redeem'),

    # Coupons
    path('coupons/validate/', views.ValidateCouponView.as_view(), name='coupon-validate'),

    # Events
    path('events/', views.EventListView.as_view(), name='event-list'),
    path('events/book/', views.EventBookingCreateView.as_view(), name='event-book'),

    # Admin Analytics
    path('admin/analytics/', views.AdminAnalyticsView.as_view(), name='analytics'),

    # Webhook
    path('webhook/razorpay/', views.RazorpayWebhookView.as_view(), name='webhook-razorpay'),
]
