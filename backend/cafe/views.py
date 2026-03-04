"""
Coffee & Crisps Café — DRF API Views
Complete REST API with JWT auth, Razorpay integration, and admin endpoints
"""
import hashlib
import hmac
import json
from decimal import Decimal

import razorpay
from django.conf import settings
from django.db import transaction
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Cafe, MenuItem, MenuCategory, Order, OrderItem,
    Reservation, LoyaltyTransaction, Coupon, Event, EventBooking,
    DailySalesReport, User
)
from .serializers import (
    MenuItemSerializer, MenuCategorySerializer, OrderSerializer,
    OrderCreateSerializer, ReservationSerializer, LoyaltySerializer,
    UserSerializer, CouponSerializer, EventSerializer, EventBookingSerializer,
    AnalyticsSerializer
)
from .permissions import IsCafeAdmin
from .utils import send_confirmation_email, send_sms, award_loyalty_points


# ─────────────────────────────────────────────
# MENU
# ─────────────────────────────────────────────
class MenuCategoryListView(generics.ListAPIView):
    """GET /api/menu/categories/ — All categories for a cafe"""
    serializer_class = MenuCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        cafe_slug = self.kwargs.get('cafe_slug', 'coffee-crisps')
        return MenuCategory.objects.filter(
            cafe__slug=cafe_slug, is_active=True
        ).prefetch_related('items')


class MenuItemListView(generics.ListAPIView):
    """GET /api/menu/ — Full menu with filters"""
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = MenuItem.objects.filter(
            cafe__slug=self.get_cafe_slug(), is_available=True
        ).select_related('category')

        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category__slug=category)

        search = self.request.query_params.get('q')
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(description__icontains=search)

        veg_only = self.request.query_params.get('veg')
        if veg_only == 'true':
            qs = qs.filter(is_veg=True)

        featured = self.request.query_params.get('featured')
        if featured == 'true':
            qs = qs.filter(is_featured=True)

        return qs.order_by('display_order', '-is_featured')

    def get_cafe_slug(self):
        return self.request.query_params.get('cafe', 'coffee-crisps')


class MenuItemDetailView(generics.RetrieveAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = MenuItem.objects.filter(is_available=True)


# Admin CRUD
class MenuItemCreateView(generics.CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsCafeAdmin]


class MenuItemUpdateView(generics.UpdateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsCafeAdmin]
    queryset = MenuItem.objects.all()


class MenuItemToggleAvailability(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCafeAdmin]

    def patch(self, request, pk):
        item = MenuItem.objects.get(pk=pk)
        item.is_available = not item.is_available
        item.save()
        return Response({'is_available': item.is_available, 'name': item.name})


# ─────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────
class CreateOrderView(APIView):
    """
    POST /api/orders/
    Creates order + Razorpay order, returns razorpay_order_id for frontend
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cafe = Cafe.objects.get(slug=data.get('cafe_slug', 'coffee-crisps'))

        # Calculate totals
        subtotal = Decimal(0)
        order_items_data = data['items']
        menu_items = {str(i.id): i for i in
                      MenuItem.objects.filter(id__in=[x['menu_item_id'] for x in order_items_data])}

        for item_data in order_items_data:
            mi = menu_items[str(item_data['menu_item_id'])]
            subtotal += mi.price * item_data['quantity']

        # Apply coupon
        discount_amount = Decimal(0)
        coupon = None
        if data.get('coupon_code'):
            try:
                coupon = Coupon.objects.get(code=data['coupon_code'].upper(), cafe=cafe)
                if coupon.is_valid() and subtotal >= coupon.min_order_amount:
                    if coupon.discount_type == 'percentage':
                        discount_amount = subtotal * (coupon.discount_value / 100)
                        if coupon.max_discount:
                            discount_amount = min(discount_amount, coupon.max_discount)
                    else:
                        discount_amount = coupon.discount_value
                    coupon.usage_count += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass

        # Loyalty points redemption (100 pts = ₹10)
        points_discount = Decimal(0)
        loyalty_points_used = 0
        if request.user.is_authenticated and data.get('redeem_points', 0):
            pts = min(data['redeem_points'], request.user.loyalty_points)
            pts_discount = Decimal(pts) / 10
            points_discount = min(pts_discount, subtotal * Decimal('0.20'))  # max 20% via points
            loyalty_points_used = int(points_discount * 10)

        taxable = subtotal - discount_amount - points_discount
        tax_amount = taxable * (cafe.tax_rate / 100)
        total_amount = taxable + tax_amount

        # Create Order
        order = Order.objects.create(
            cafe=cafe,
            user=request.user if request.user.is_authenticated else None,
            guest_name=data.get('guest_name', ''),
            guest_phone=data.get('guest_phone', ''),
            guest_email=data.get('guest_email', ''),
            order_type=data.get('order_type', 'dine_in'),
            subtotal=subtotal,
            discount_amount=discount_amount + points_discount,
            tax_amount=tax_amount,
            total_amount=total_amount,
            coupon=coupon,
            loyalty_points_used=loyalty_points_used,
            special_instructions=data.get('special_instructions', ''),
        )

        # Create OrderItems
        for item_data in order_items_data:
            mi = menu_items[str(item_data['menu_item_id'])]
            OrderItem.objects.create(
                order=order, menu_item=mi,
                name=mi.name, price=mi.price,
                quantity=item_data['quantity'],
                customizations=item_data.get('customizations', {}),
            )
            mi.total_orders += item_data['quantity']
            mi.save(update_fields=['total_orders'])

        # Create Razorpay Order
        rz_client = razorpay.Client(auth=(cafe.razorpay_key_id, cafe.razorpay_key_secret))
        rz_order = rz_client.order.create({
            'amount': int(total_amount * 100),  # in paise
            'currency': cafe.currency,
            'receipt': str(order.id),
            'notes': {
                'order_number': order.order_number,
                'cafe': cafe.name,
            }
        })

        order.razorpay_order_id = rz_order['id']
        order.save(update_fields=['razorpay_order_id'])

        return Response({
            'order_id': str(order.id),
            'order_number': order.order_number,
            'razorpay_order_id': rz_order['id'],
            'razorpay_key_id': cafe.razorpay_key_id,
            'amount': int(total_amount * 100),
            'currency': cafe.currency,
            'prefill': {
                'name': order.guest_name or (request.user.get_full_name() if request.user.is_authenticated else ''),
                'email': order.guest_email or (request.user.email if request.user.is_authenticated else ''),
                'contact': order.guest_phone or (request.user.phone if request.user.is_authenticated else ''),
            }
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """POST /api/orders/{id}/verify/ — Verify Razorpay payment signature"""

    @transaction.atomic
    def post(self, request, pk):
        order = Order.objects.select_for_update().get(pk=pk)
        rp_payment_id = request.data.get('razorpay_payment_id')
        rp_signature = request.data.get('razorpay_signature')

        cafe = order.cafe
        key_secret = cafe.razorpay_key_secret.encode()
        msg = f"{order.razorpay_order_id}|{rp_payment_id}".encode()
        expected = hmac.new(key_secret, msg, hashlib.sha256).hexdigest()

        if not hmac.compare_digest(expected, rp_signature):
            order.payment_status = 'failed'
            order.save()
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        order.razorpay_payment_id = rp_payment_id
        order.razorpay_signature = rp_signature
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save()

        # Award loyalty points (1 point per ₹10)
        if order.user:
            pts_earned = int(order.total_amount / 10)
            award_loyalty_points(order.user, pts_earned, order, 'earn_order')
            order.loyalty_points_earned = pts_earned
            order.save(update_fields=['loyalty_points_earned'])

        # Send confirmation
        send_confirmation_email(order)
        send_sms(order.guest_phone or order.user.phone, f"Order {order.order_number} confirmed! See you soon ☕ — Coffee & Crisps")

        return Response({
            'success': True,
            'order_number': order.order_number,
            'status': order.status,
            'points_earned': order.loyalty_points_earned,
        })


class RazorpayWebhookView(APIView):
    """POST /api/webhook/razorpay/ — Backup payment confirmation"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        received_sig = request.headers.get('X-Razorpay-Signature')
        payload = request.body

        expected = hmac.new(webhook_secret.encode(), payload, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, received_sig):
            return Response({'error': 'Invalid webhook signature'}, status=400)

        event = json.loads(payload)
        if event.get('event') == 'payment.captured':
            payment = event['payload']['payment']['entity']
            receipt = payment.get('order_id')
            try:
                order = Order.objects.get(razorpay_order_id=receipt)
                if order.payment_status != 'paid':
                    order.payment_status = 'paid'
                    order.status = 'confirmed'
                    order.razorpay_payment_id = payment['id']
                    order.save()
            except Order.DoesNotExist:
                pass

        return Response({'status': 'ok'})


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderHistoryView(generics.ListAPIView):
    """GET /api/orders/history/ — User's order history"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


# ─────────────────────────────────────────────
# RESERVATIONS
# ─────────────────────────────────────────────
class ReservationCreateView(generics.CreateAPIView):
    """POST /api/reservations/ — Book a table"""
    serializer_class = ReservationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        reservation = serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None
        )
        send_confirmation_email(reservation)
        send_sms(reservation.phone,
                 f"Your table at Coffee & Crisps is confirmed for {reservation.date} at {reservation.time}. Code: {reservation.confirmation_code} 🗓")


class ReservationListView(generics.ListAPIView):
    """GET /api/admin/reservations/ — Admin: all reservations"""
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCafeAdmin]

    def get_queryset(self):
        date = self.request.query_params.get('date', timezone.now().date())
        return Reservation.objects.filter(date=date).order_by('time')


# ─────────────────────────────────────────────
# LOYALTY
# ─────────────────────────────────────────────
class LoyaltyDashboardView(APIView):
    """GET /api/loyalty/ — Current user's loyalty data"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = LoyaltyTransaction.objects.filter(user=user).order_by('-created_at')[:20]
        total_earned = LoyaltyTransaction.objects.filter(user=user, points__gt=0).aggregate(s=Sum('points'))['s'] or 0
        return Response({
            'points': user.loyalty_points,
            'tier': user.tier,
            'points_to_next_tier': self.get_next_tier_gap(user),
            'total_earned': total_earned,
            'wallet_value': user.loyalty_points // 10,  # 100pts = ₹10
            'transactions': LoyaltySerializer(transactions, many=True).data,
        })

    def get_next_tier_gap(self, user):
        thresholds = {'bronze': 500, 'silver': 2000, 'gold': 5000, 'platinum': 99999}
        return max(0, thresholds.get(user.tier, 99999) - user.loyalty_points)


class RedeemPointsView(APIView):
    """POST /api/loyalty/redeem/ — Preview redemption (actual applied at checkout)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        points = int(request.data.get('points', 0))
        if points > request.user.loyalty_points:
            return Response({'error': 'Insufficient points'}, status=400)
        discount = points // 10  # 100pts = ₹10, so 1pt = ₹0.10
        return Response({
            'points_requested': points,
            'discount_amount': discount,
            'remaining_points': request.user.loyalty_points - points,
        })


# ─────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        token = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(token.access_token),
            'refresh': str(token),
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────
# COUPONS
# ─────────────────────────────────────────────
class ValidateCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        order_amount = Decimal(request.data.get('order_amount', 0))
        cafe_slug = request.data.get('cafe_slug', 'coffee-crisps')

        try:
            coupon = Coupon.objects.get(code=code, cafe__slug=cafe_slug)
            if not coupon.is_valid():
                return Response({'valid': False, 'message': 'Coupon expired or limit reached'})
            if order_amount < coupon.min_order_amount:
                return Response({'valid': False, 'message': f'Min order ₹{coupon.min_order_amount} required'})

            if coupon.discount_type == 'percentage':
                discount = order_amount * (coupon.discount_value / 100)
                if coupon.max_discount:
                    discount = min(discount, coupon.max_discount)
            else:
                discount = coupon.discount_value

            return Response({
                'valid': True,
                'discount_amount': float(discount),
                'description': coupon.description,
            })
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid coupon code'})


# ─────────────────────────────────────────────
# EVENTS
# ─────────────────────────────────────────────
class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Event.objects.filter(is_active=True).order_by('display_order')


class EventBookingCreateView(generics.CreateAPIView):
    serializer_class = EventBookingSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        booking = serializer.save()
        send_confirmation_email(booking)


# ─────────────────────────────────────────────
# ADMIN ANALYTICS
# ─────────────────────────────────────────────
class AdminAnalyticsView(APIView):
    """GET /api/admin/analytics/ — Dashboard stats"""
    permission_classes = [permissions.IsAuthenticated, IsCafeAdmin]

    def get(self, request):
        cafe_slug = request.query_params.get('cafe', 'coffee-crisps')
        today = timezone.now().date()
        week_ago = today - timezone.timedelta(days=7)

        orders_today = Order.objects.filter(cafe__slug=cafe_slug, created_at__date=today, payment_status='paid')
        orders_week = Order.objects.filter(cafe__slug=cafe_slug, created_at__date__gte=week_ago, payment_status='paid')

        return Response({
            'today': {
                'revenue': float(orders_today.aggregate(s=Sum('total_amount'))['s'] or 0),
                'orders': orders_today.count(),
                'avg_order_value': float(orders_today.aggregate(a=Avg('total_amount'))['a'] or 0),
                'new_reservations': Reservation.objects.filter(cafe__slug=cafe_slug, created_at__date=today).count(),
            },
            'week': {
                'revenue': float(orders_week.aggregate(s=Sum('total_amount'))['s'] or 0),
                'orders': orders_week.count(),
            },
            'top_items': list(
                MenuItem.objects.filter(cafe__slug=cafe_slug)
                .order_by('-total_orders')[:5]
                .values('name', 'total_orders', 'price')
            ),
            'loyalty_members': User.objects.filter(cafe__slug=cafe_slug).count(),
            'pending_orders': Order.objects.filter(cafe__slug=cafe_slug, status__in=['confirmed', 'preparing']).count(),
            'todays_reservations': list(
                Reservation.objects.filter(cafe__slug=cafe_slug, date=today)
                .values('name', 'time', 'guests', 'occasion', 'status')
                .order_by('time')
            ),
        })
