"""
Coffee & Crisps Café — Django Models (Database Schema)
Multi-tenant ready · PostgreSQL optimized
"""
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


# ─────────────────────────────────────────────
# MULTI-TENANT
# ─────────────────────────────────────────────
class Cafe(models.Model):
    """One record per cafe branch — multi-tenant root"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=300, blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    instagram_handle = models.CharField(max_length=100, blank=True)
    google_maps_url = models.URLField(blank=True)
    razorpay_key_id = models.CharField(max_length=100, blank=True)
    razorpay_key_secret = models.CharField(max_length=100, blank=True)  # encrypted in prod
    currency = models.CharField(max_length=3, default='INR')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    opening_time = models.TimeField(default='11:00')
    closing_time = models.TimeField(default='22:30')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cafes'

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────
# USER / AUTH
# ─────────────────────────────────────────────
class User(AbstractUser):
    """Extended user with loyalty fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    birthday = models.DateField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    loyalty_points = models.IntegerField(default=0)
    tier = models.CharField(max_length=20, choices=[
        ('bronze', 'Bronze'), ('silver', 'Silver'),
        ('gold', 'Gold'), ('platinum', 'Platinum')
    ], default='bronze')
    marketing_consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'


# ─────────────────────────────────────────────
# MENU
# ─────────────────────────────────────────────
class MenuCategory(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    icon = models.CharField(max_length=10, blank=True)  # emoji
    display_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'menu_categories'
        ordering = ['display_order']
        unique_together = ['cafe', 'slug']

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    SPICE_LEVELS = [('none', 'None'), ('mild', 'Mild'), ('medium', 'Medium'), ('hot', 'Hot')]

    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='menu_items')
    category = models.ForeignKey(MenuCategory, on_delete=models.SET_NULL, null=True, related_name='items')
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='menu/', null=True, blank=True)
    image_url = models.URLField(blank=True)  # CDN fallback
    is_veg = models.BooleanField(default=True)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    spice_level = models.CharField(max_length=10, choices=SPICE_LEVELS, default='none')
    prep_time_minutes = models.PositiveSmallIntegerField(default=15)
    calories = models.PositiveSmallIntegerField(null=True, blank=True)
    allergens = models.CharField(max_length=300, blank=True)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    badge_text = models.CharField(max_length=30, blank=True)  # e.g. "Chef's Pick"
    display_order = models.PositiveSmallIntegerField(default=0)
    total_orders = models.PositiveIntegerField(default=0)  # denormalized for perf
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'menu_items'
        ordering = ['display_order', '-is_featured']
        unique_together = ['cafe', 'slug']

    def __str__(self):
        return f"{self.name} – ₹{self.price}"


class MenuCombo(models.Model):
    """Pre-defined combo deals"""
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    items = models.ManyToManyField(MenuItem, through='ComboItem')
    original_price = models.DecimalField(max_digits=8, decimal_places=2)
    combo_price = models.DecimalField(max_digits=8, decimal_places=2)
    badge_text = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'menu_combos'


class ComboItem(models.Model):
    combo = models.ForeignKey(MenuCombo, on_delete=models.CASCADE)
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField(default=1)


# ─────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready for Pickup/Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    ORDER_TYPES = [('dine_in', 'Dine In'), ('takeaway', 'Takeaway'), ('delivery', 'Delivery')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=20, unique=True)  # e.g. CC-2025-0847
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    # Guest checkout fields
    guest_name = models.CharField(max_length=200, blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    guest_email = models.EmailField(blank=True)

    order_type = models.CharField(max_length=20, choices=ORDER_TYPES, default='dine_in')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    coupon = models.ForeignKey('Coupon', null=True, blank=True, on_delete=models.SET_NULL)
    loyalty_points_used = models.IntegerField(default=0)
    loyalty_points_earned = models.IntegerField(default=0)

    # Razorpay
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=200, blank=True)
    payment_status = models.CharField(max_length=20, default='unpaid')

    special_instructions = models.TextField(blank=True)
    estimated_ready_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['cafe', 'status']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['order_number']),
        ]

    def __str__(self):
        return f"Order {self.order_number} – {self.total_amount}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            prefix = 'CC'
            year = timezone.now().year
            count = Order.objects.filter(cafe=self.cafe).count() + 1
            self.order_number = f"{prefix}-{year}-{count:04d}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)  # snapshot
    price = models.DecimalField(max_digits=8, decimal_places=2)  # snapshot
    quantity = models.PositiveSmallIntegerField(default=1)
    customizations = models.JSONField(default=dict, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

    def save(self, *args, **kwargs):
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)


# ─────────────────────────────────────────────
# RESERVATIONS
# ─────────────────────────────────────────────
class Reservation(models.Model):
    STATUS = [
        ('pending', 'Pending'), ('confirmed', 'Confirmed'),
        ('seated', 'Seated'), ('completed', 'Completed'),
        ('no_show', 'No Show'), ('cancelled', 'Cancelled')
    ]
    OCCASIONS = [
        ('regular', 'Regular Visit'), ('birthday', 'Birthday'),
        ('anniversary', 'Anniversary'), ('date_night', 'Date Night'),
        ('business', 'Business Lunch'), ('proposal', 'Proposal'),
        ('private_event', 'Private Event'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    guests = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    occasion = models.CharField(max_length=30, choices=OCCASIONS, default='regular')
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    confirmation_code = models.CharField(max_length=10, unique=True)
    reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reservations'
        ordering = ['date', 'time']
        indexes = [models.Index(fields=['cafe', 'date', 'status'])]

    def save(self, *args, **kwargs):
        if not self.confirmation_code:
            import random, string
            self.confirmation_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)


# ─────────────────────────────────────────────
# LOYALTY
# ─────────────────────────────────────────────
class LoyaltyTransaction(models.Model):
    TYPES = [
        ('earn_order', 'Earned from Order'),
        ('earn_birthday', 'Birthday Bonus'),
        ('earn_referral', 'Referral Bonus'),
        ('redeem', 'Redeemed'),
        ('expire', 'Expired'),
        ('manual_add', 'Manual Add (Admin)'),
        ('manual_deduct', 'Manual Deduct (Admin)'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loyalty_transactions')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    transaction_type = models.CharField(max_length=30, choices=TYPES)
    points = models.IntegerField()  # positive = earn, negative = redeem/deduct
    balance_after = models.IntegerField()
    description = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'loyalty_transactions'
        ordering = ['-created_at']


class LoyaltyTier(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # Bronze, Silver, Gold, Platinum
    min_points = models.IntegerField()
    earn_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    perks_description = models.TextField()
    badge_color = models.CharField(max_length=20, default='#C4A882')

    class Meta:
        db_table = 'loyalty_tiers'
        ordering = ['min_points']


# ─────────────────────────────────────────────
# COUPONS
# ─────────────────────────────────────────────
class Coupon(models.Model):
    DISCOUNT_TYPES = [('percentage', 'Percentage'), ('fixed', 'Fixed Amount')]

    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    code = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=200)
    discount_type = models.CharField(max_length=15, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=8, decimal_places=2)
    max_discount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    min_order_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    usage_count = models.PositiveIntegerField(default=0)
    user_usage_limit = models.PositiveSmallIntegerField(default=1)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'coupons'

    def is_valid(self):
        now = timezone.now()
        return (self.is_active and self.valid_from <= now <= self.valid_until
                and (self.usage_limit is None or self.usage_count < self.usage_limit))


# ─────────────────────────────────────────────
# EVENTS
# ─────────────────────────────────────────────
class Event(models.Model):
    EVENT_TYPES = [
        ('private_party', 'Private Party'),
        ('influencer_collab', 'Influencer Collab'),
        ('catering', 'Catering'),
        ('date_night', 'Date Night Package'),
        ('workshop', 'Workshop'),
    ]

    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    description = models.TextField()
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'events'


class EventBooking(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    event_date = models.DateField()
    guests = models.PositiveSmallIntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requirements = models.TextField()
    status = models.CharField(max_length=20, default='enquiry')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_bookings'


# ─────────────────────────────────────────────
# ANALYTICS (denormalized for speed)
# ─────────────────────────────────────────────
class DailySalesReport(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    date = models.DateField()
    total_orders = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    dine_in_orders = models.PositiveIntegerField(default=0)
    online_orders = models.PositiveIntegerField(default=0)
    new_customers = models.PositiveIntegerField(default=0)
    repeat_customers = models.PositiveIntegerField(default=0)
    avg_order_value = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    top_item = models.ForeignKey(MenuItem, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daily_sales_reports'
        unique_together = ['cafe', 'date']
