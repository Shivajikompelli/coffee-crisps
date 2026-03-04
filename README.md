# ☕ Coffee & Crisps Café — Full-Stack Digital Platform

> **Premium café ordering + reservation + loyalty platform** built for Coffee & Crisps Café, Saroornagar, Hyderabad.  
> Multi-tenant architecture · Razorpay payments · JWT auth · Admin dashboard

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, ShadCN UI |
| **Backend** | Django 5, Django REST Framework, PostgreSQL, Redis, Celery |
| **Auth** | JWT (SimpleJWT) |
| **Payments** | Razorpay |
| **Email/SMS** | Twilio + SendGrid |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Railway / Render |
| **Cache** | Redis (Upstash on Vercel) |

---

## 📂 Project Structure

```
coffee-crisps/
├── frontend/                  # Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── menu/page.tsx          # Full menu
│   │   │   ├── order/page.tsx         # Online ordering
│   │   │   ├── reserve/page.tsx       # Table reservation
│   │   │   ├── loyalty/page.tsx       # Loyalty dashboard
│   │   │   ├── events/page.tsx        # Events & collabs
│   │   │   └── admin/page.tsx         # Admin dashboard
│   │   ├── components/
│   │   │   ├── layout/                # Navbar, Footer
│   │   │   ├── menu/                  # MenuGrid, MenuCard, Cart
│   │   │   ├── booking/               # ReservationForm, DatePicker
│   │   │   └── loyalty/               # LoyaltyCard, PointsWidget
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client (Axios)
│   │   │   ├── razorpay.ts            # Razorpay integration
│   │   │   └── auth.ts                # JWT utils
│   │   └── types/index.ts             # TypeScript types
│   ├── public/
│   ├── .env.local.example
│   ├── next.config.ts
│   └── tailwind.config.ts
│
├── backend/                   # Django DRF API
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── cafe/
│   │   ├── models.py          # All DB models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── requirements.txt
│   ├── Procfile               # For Railway/Render
│   └── manage.py
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

---

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/coffee-crisps.git
cd coffee-crisps
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy and configure env
cp .env.local.example .env.local
# Edit .env.local with your values
```

**`.env.local`**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
NEXT_PUBLIC_CAFE_PHONE=+919876543210
NEXT_PUBLIC_CAFE_NAME=Coffee & Crisps Café
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

```bash
npm run dev     # Development
npm run build   # Production build
npm run start   # Production server
```

---

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

**`.env`**
```env
DEBUG=False
SECRET_KEY=your-super-secret-key-50-chars+

DATABASE_URL=postgresql://user:pass@host:5432/coffeecrisps
REDIS_URL=redis://localhost:6379/0

RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

SENDGRID_API_KEY=SG.xxxxxxxxxxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=+1234567890

CAFE_EMAIL=hello@coffeeandcrisps.in
CAFE_PHONE=+919876543210
ALLOWED_HOSTS=your-backend.railway.app,localhost
CORS_ALLOWED_ORIGINS=https://coffeeandcrisps.in,https://www.coffeeandcrisps.in

# Multi-tenant
TENANT_ID=coffee-crisps-hyd-001
```

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata cafe/fixtures/initial_menu.json
python manage.py runserver
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set environment variables in Vercel dashboard
```

### Backend → Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

railway login
railway init
railway add postgresql
railway add redis
railway up
```

**`Procfile`** (included in project):
```
web: gunicorn config.wsgi --workers 4 --bind 0.0.0.0:$PORT
worker: celery -A config worker --loglevel=info
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu/` | List all menu items | — |
| GET | `/api/menu/?category=coffee` | Filter by category | — |
| POST | `/api/orders/` | Create order | JWT |
| GET | `/api/orders/{id}/` | Order details | JWT |
| POST | `/api/reservations/` | Book table | — |
| GET | `/api/loyalty/balance/` | Points balance | JWT |
| POST | `/api/loyalty/redeem/` | Redeem points | JWT |
| POST | `/api/auth/login/` | Login → JWT | — |
| POST | `/api/auth/register/` | Register user | — |
| POST | `/api/webhook/razorpay/` | Payment webhook | Sig |
| GET | `/api/admin/analytics/` | Dashboard data | Admin |

Full API docs at `/api/docs/` (Swagger UI)

---

## 💳 Razorpay Flow

1. **Client**: POST `/api/orders/` → receives `razorpay_order_id`
2. **Client**: Opens Razorpay checkout widget
3. **Client**: Payment success → POST `/api/orders/{id}/verify/` with signature
4. **Server**: Validates HMAC signature → marks order paid
5. **Webhook**: Razorpay sends webhook → `/api/webhook/razorpay/` as backup

---

## 🔐 Security

- CSRF protection on all state-changing endpoints
- Razorpay webhook signature validation (HMAC-SHA256)
- JWT tokens with 15min access + 7d refresh rotation
- Rate limiting: 100 req/min per IP (django-ratelimit)
- Input sanitization with DRF serializers
- SQL injection protection (Django ORM)
- CORS whitelist only

---

## 🎯 SEO Targets

| Keyword | Strategy |
|---------|----------|
| "Best cafe in Saroor Nagar" | Local schema markup + Google Business |
| "Aesthetic cafe Hyderabad" | OG tags + rich snippets |
| "Coffee shop near LB Nagar" | Location pages + sitemap |
| "Korean fried chicken Hyderabad" | Dish-specific pages |

---

## 📊 Admin Dashboard Features

- 📦 Menu CRUD (add/edit/delete dishes, toggle availability)
- 📋 Live order tracking with status updates
- 🗓 Reservation calendar with SMS reminders
- 👥 Loyalty member management + manual point adjustments
- 📈 Revenue analytics (daily/weekly/monthly)
- 📉 Customer repeat rate metrics
- 📄 Daily sales PDF export

---

## 🧪 Testing

```bash
# Backend
cd backend && python manage.py test

# Frontend
cd frontend && npm run test
```

---

*Built for Coffee & Crisps Café · Saroornagar, Hyderabad · © 2025*
