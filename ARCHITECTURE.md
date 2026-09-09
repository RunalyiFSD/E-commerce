# Architecture

## System Map

```text
                         ┌─────────────────────┐
                         │     Customer        │
                         └──────────┬──────────┘
                                    │
                         React + JavaScript
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     React App       │
                         │ Pages / Components  │
                         │ Context / Hooks     │
                         └──────────┬──────────┘
                                    │ Axios
                                    ▼
                         ┌─────────────────────┐
                         │   Express REST API  │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       Authentication             RBAC              Ownership
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │      Services       │
                         │ Business Rules      │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ MongoDB / Mongoose  │
                         └─────────────────────┘

Additional services:
- Cloudinary → product images
- Payment Gateway → checkout
- Delivery Provider → future real tracking
- Email/SMS → future notifications
```

## Frontend

```text
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── routes/
    ├── context/
    ├── hooks/
    ├── services/
    ├── constants/
    └── utils/
```

## Backend

```text
backend/
├── config/
├── routes/
├── middleware/
├── controllers/
├── services/
├── models/
└── utils/
```

## Dashboard

One route:

```text
/dashboard
```

Shared:

```text
DashboardLayout
DashboardHeader
DashboardSidebar
```

Role-specific configuration:

```text
ADMIN    → admin navigation/widgets
SELLER   → seller navigation/widgets
CUSTOMER → customer navigation/widgets
```

## Order Flow

```text
Checkout
 ↓
POST /api/orders
 ↓
Order Service
 ↓
Order Model
 ↓
Seller Queue
 ↓
Fulfillment
 ↓
Shipment
 ↓
Tracking Events
 ↓
Customer Tracking Page
```

## Tracking Flow

```text
Seller/Admin/System action
 ↓
Authorize actor
 ↓
Validate status transition
 ↓
Update currentStatus
 ↓
Append tracking event
 ↓
Persist
 ↓
Notify customer
 ↓
Customer GET /tracking
 ↓
Timeline rendered
```

## Data Ownership

```text
Customer → own orders/profile/cart
Seller → own products/store + relevant order items
Admin → platform resources
```


## CI/CD Architecture

```text
GitHub Repository
      │
      ├── Pull Request
      │      ↓
      │   PR Checks
      │
      ├── Push
      │      ↓
      │   CI
      │      ├── Frontend
      │      └── Backend
      │
      ├── Schedule
      │      ↓
      │   Security Audit
      │
      └── Release Tag
             ↓
        Deployment Gate
             ↓
       Hosting Provider
```

Workflows live under `.github/workflows/`.
