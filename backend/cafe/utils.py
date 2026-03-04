"""Utility functions: email, SMS, loyalty points"""
from django.conf import settings
from django.core.mail import send_mail
from .models import LoyaltyTransaction, User

def send_confirmation_email(obj):
    """Send confirmation email for orders and reservations"""
    try:
        from .models import Order, Reservation
        if isinstance(obj, Order):
            subject = f"Order Confirmed – {obj.order_number} | Coffee & Crisps"
            body = (
                f"Hi {obj.guest_name or (obj.user.first_name if obj.user else 'Guest')},\n\n"
                f"Your order #{obj.order_number} has been confirmed!\n"
                f"Total: ₹{obj.total_amount}\n\n"
                f"We'll have it ready shortly. Thank you for choosing Coffee & Crisps ☕\n\n"
                f"— Team Coffee & Crisps"
            )
            to = obj.guest_email or (obj.user.email if obj.user else None)
        elif isinstance(obj, Reservation):
            subject = f"Table Reserved – {obj.confirmation_code} | Coffee & Crisps"
            body = (
                f"Hi {obj.name},\n\n"
                f"Your table is confirmed!\n"
                f"Date: {obj.date} at {obj.time}\n"
                f"Guests: {obj.guests}\n"
                f"Confirmation Code: {obj.confirmation_code}\n\n"
                f"We look forward to seeing you 🗓\n\n"
                f"— Team Coffee & Crisps"
            )
            to = obj.email
        else:
            return
        if to:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to], fail_silently=True)
    except Exception:
        pass

def send_sms(phone, message):
    """Send SMS via Twilio"""
    try:
        from twilio.rest import Client
        if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, phone]):
            return
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(body=message, from_=settings.TWILIO_FROM_NUMBER, to=phone)
    except Exception:
        pass

def award_loyalty_points(user, points, order=None, transaction_type='earn_order'):
    """Award points to a user and log the transaction"""
    user.loyalty_points += points
    # Tier upgrade logic
    if user.loyalty_points >= 5000:
        user.tier = 'platinum'
    elif user.loyalty_points >= 2000:
        user.tier = 'gold'
    elif user.loyalty_points >= 500:
        user.tier = 'silver'
    user.save(update_fields=['loyalty_points', 'tier'])
    LoyaltyTransaction.objects.create(
        user=user, order=order,
        transaction_type=transaction_type,
        points=points,
        balance_after=user.loyalty_points,
        description=f"Earned {points} beans from order {order.order_number if order else ''}",
    )
