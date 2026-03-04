# ═══════════════════════════════════════════════════
# FILE: backend/Procfile (Railway / Render)
# ═══════════════════════════════════════════════════
web: gunicorn config.wsgi --workers 4 --worker-class gthread --threads 2 --bind 0.0.0.0:$PORT --log-level=info
worker: celery -A config worker --loglevel=info --concurrency=4
beat: celery -A config beat --loglevel=info


# ═══════════════════════════════════════════════════
# FILE: backend/railway.toml
# ═══════════════════════════════════════════════════
[build]
builder = "nixpacks"
buildCommand = "pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate"

[deploy]
startCommand = "gunicorn config.wsgi --workers 4 --bind 0.0.0.0:$PORT"
healthcheckPath = "/api/menu/"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3


# ═══════════════════════════════════════════════════
# FILE: frontend/vercel.json
# ═══════════════════════════════════════════════════
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, max-age=0" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" }
  ]
}


# ═══════════════════════════════════════════════════
# FILE: frontend/.env.local.example
# ═══════════════════════════════════════════════════
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
NEXT_PUBLIC_CAFE_PHONE=+919876543210
NEXT_PUBLIC_CAFE_NAME=Coffee & Crisps Café
NEXT_PUBLIC_CAFE_WHATSAPP=+919876543210
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_key


# ═══════════════════════════════════════════════════
# FILE: backend/.env.example
# ═══════════════════════════════════════════════════
DEBUG=False
SECRET_KEY=your-super-secret-django-key-min-50-chars!!!
DATABASE_URL=postgresql://user:pass@host:5432/coffeecrisps
REDIS_URL=redis://localhost:6379/0
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=+1234567890
ALLOWED_HOSTS=your-backend.railway.app,localhost
CORS_ALLOWED_ORIGINS=https://coffeeandcrisps.in,https://www.coffeeandcrisps.in
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TENANT_ID=coffee-crisps-hyd-001
