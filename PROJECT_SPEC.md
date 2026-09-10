# Amazon-Like E-Commerce Application — Project Specification
.
## 1. Purpose

Build a professional, production-oriented e-commerce application inspired by large marketplaces such as Amazon.

The application must support three roles:

- ADMIN
- SELLER / MERCHANT
- CUSTOMER

The project uses React + JavaScript on the frontend and Node.js + Express + MongoDB on the backend.

The defining feature of this project is the **post-purchase experience**: seller fulfillment, shipment processing, delivery tracking, customer notifications, delivery exceptions, returns, and refunds.

---

## 2. Technology Stack

### Frontend

- React
- JavaScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API
- React Hook Form
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary

### Engineering

- Git
- GitHub
- GitHub Actions
- ESLint
- Prettier
- Postman

### Deployment

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- Images: Cloudinary

---

## 3. Roles and Permissions

### ADMIN

Admin has platform-wide authority.

Admin can:

- Manage customers
- Manage sellers
- Approve/suspend sellers
- Manage products
- Manage all orders
- Create, edit, deactivate and manage selling categories
- Monitor active deliveries
- Monitor delayed/failed deliveries
- View analytics
- View audit logs
- Manage platform settings

Only ADMIN can create platform categories.

### SELLER / MERCHANT

Seller can:

- Manage their seller profile/store
- Create products
- Edit their own products
- Deactivate their own products
- Manage inventory
- View orders containing their products
- Confirm orders
- Process orders
- Pack orders
- Mark orders as shipped
- Add courier/tracking information
- View sales and fulfillment analytics

Seller cannot:

- Manage platform categories
- Manage other sellers
- Manage global users
- Access admin-only operations
- Modify another seller's products

### CUSTOMER

Customer can:

- Register/login
- Browse products
- Search/filter/sort products
- View product details
- Add products to cart
- Checkout
- Place orders
- View order history
- Track their own orders
- Manage addresses
- Manage wishlist
- Request eligible cancellations
- Request returns/refunds
- Review products

Customer cannot:

- Access admin functionality
- Access seller management
- Modify products
- Access another customer's orders

---

## 4. Authentication

Authentication uses JWT and bcrypt.

Registration:

```text
Customer/Seller
    ↓
Validate input
    ↓
Hash password with bcrypt
    ↓
Create user
```

Login:

```text
Email + Password
    ↓
Validate credentials
    ↓
bcrypt.compare()
    ↓
Generate JWT
    ↓
Authenticated session
```

The JWT should contain minimal identity information such as:

```js
{
  userId,
  role
}
```

Passwords, secrets, and sensitive data must never be returned to the frontend.

Admin accounts should preferably be provisioned through a secure seed/admin setup instead of unrestricted public registration.

---

## 5. Authorization and RBAC

Authentication determines identity.

Authorization determines permission.

Backend authorization is the security boundary.

Required middleware concepts:

```text
requireAuth
requireRole
requireOwnership
requirePermission
```

Every protected request must verify:

1. The user is authenticated.
2. The user has the required role/permission.
3. The user owns the resource where ownership is required.

Never trust a role supplied by the frontend.

---

## 6. Reusable Component Architecture

Create reusable components instead of role-specific duplicates.

Core components:

```text
Button
Input
Select
Modal
Dialog
Dropdown
Badge
Card
Table
Toast
LoadingState
EmptyState
ErrorState
ConfirmDialog
Navbar
Sidebar
Footer
Breadcrumb
```

Product components:

```text
ProductCard
ProductGrid
ProductImageGallery
ProductPrice
QuantitySelector
ProductRating
```

Order components:

```text
OrderCard
OrderStatusBadge
OrderTimeline
TrackingTimeline
DeliveryStatus
AddressCard
```

Dashboard components:

```text
DashboardLayout
DashboardHeader
DashboardSidebar
StatCard
DashboardWidget
```

Components should follow single responsibility, clear props, accessibility, and responsive design.

---

## 7. Landing Page

The landing page must contain:

- Responsive navbar
- Search
- Categories
- Hero section
- Featured products
- Best sellers
- Deals
- Recommended products
- Benefits
- Footer

The public shopping experience should work without requiring login until a protected action such as checkout is attempted.

---

## 8. Product System

Product fields should include:

```text
name
slug
description
price
discountPrice
images
category
seller
inventory
SKU
rating
reviewCount
specifications
status
createdAt
updatedAt
```

Seller ownership must be enforced at the API level.

---

## 9. Category System

Category fields:

```text
name
slug
description
image
parentCategory
status
createdBy
createdAt
updatedAt
```

Only ADMIN can create or manage platform categories.

---

## 10. Cart and Checkout

Cart:

- Add product
- Remove product
- Increase/decrease quantity
- Clear cart
- Calculate subtotal
- Calculate discounts
- Calculate shipping
- Calculate total

Checkout:

```text
Cart
 ↓
Address
 ↓
Shipping method
 ↓
Order summary
 ↓
Payment
 ↓
Order creation
 ↓
Confirmation
```

Payment integration should be abstracted so a gateway such as Razorpay or Stripe can be added without redesigning the order system.

---

## 11. Order Model

Orders are central to the application.

Recommended structure:

```text
Order
 ├── orderNumber
 ├── customer
 ├── items
 ├── shippingAddress
 ├── payment
 ├── pricing
 ├── status
 ├── tracking
 ├── sellerInformation
 ├── deliveryInformation
 ├── timeline
 ├── cancellation
 ├── return
 ├── refund
 ├── createdAt
 └── updatedAt
```

---

## 12. Order Lifecycle

Normal lifecycle:

```text
PLACED
  ↓
CONFIRMED
  ↓
PROCESSING
  ↓
PACKED
  ↓
SHIPPED
  ↓
IN_TRANSIT
  ↓
OUT_FOR_DELIVERY
  ↓
DELIVERED
```

Exception states:

```text
CANCELLED
DELIVERY_FAILED
RETURN_REQUESTED
RETURNED
REFUND_INITIATED
REFUNDED
```

Status transitions must be validated on the backend.

Do not allow arbitrary jumps such as:

```text
PLACED → DELIVERED
```

without explicit business logic.

---

## 13. Order Tracking — Core Feature

Tracking is the primary differentiator of the application.

Each important order status transition creates an immutable tracking event.

Example:

```js
{
  status: "SHIPPED",
  message: "Package handed to delivery partner",
  timestamp: "...",
  location: "Pune",
  source: "SELLER"
}
```

The system should preserve tracking history rather than overwrite it.

Customer tracking page:

```text
/orders/:orderId/track
```

It should show:

- Order number
- Product(s)
- Seller
- Delivery address
- Current status
- Expected delivery
- Courier
- Tracking number
- Last updated time
- Complete status timeline
- Delivery exceptions
- Available customer actions

---

## 14. Delivery Tracking

Tracking information:

```text
trackingNumber
courier
currentLocation
estimatedDeliveryDate
shipmentStatus
lastUpdated
```

Initial implementation may simulate courier/location updates through application-controlled status events.

The architecture should leave room for a real logistics provider API later.

---

## 15. Seller Fulfillment

Seller workflow:

```text
New Order
 ↓
Confirm
 ↓
Processing
 ↓
Packed
 ↓
Shipped
 ↓
Tracking Information
```

The seller should not normally mark an order as DELIVERED. Delivery completion should be controlled by the delivery/admin/system workflow.

---

## 16. Admin Delivery Management

Admin dashboard should provide:

- All orders
- Active deliveries
- Delayed deliveries
- Failed deliveries
- Shipment search
- Tracking number search
- Customer/seller visibility
- Delivery status monitoring
- Audit history

---

## 17. Role-Based Dashboard

Use one shared dashboard route:

```text
/dashboard
```

The dashboard shell is shared while navigation, statistics, widgets, and actions change according to the authenticated role.

### Admin

```text
Users
Sellers
Products
Categories
Orders
Active Deliveries
Delayed Deliveries
Revenue
Analytics
Audit Logs
```

### Seller

```text
Sales
Products
Inventory
Pending Orders
Processing
Packed
Shipped
Delivered
Store Settings
```

### Customer

```text
Recent Orders
Active Deliveries
Track Order
Delivered Orders
Wishlist
Addresses
Profile
```

---

## 18. Notifications

Generate in-app notifications for:

- Order placed
- Order confirmed
- Order packed
- Order shipped
- Order in transit
- Out for delivery
- Delivered
- Delivery failed
- Return approved
- Refund initiated

Email/SMS/push can be added later.

---

## 19. Returns and Refunds

Customer may request a return for eligible orders.

Return states:

```text
RETURN_REQUESTED
RETURN_APPROVED
RETURN_REJECTED
RETURNED
```

Refund states:

```text
REFUND_INITIATED
REFUNDED
REFUND_FAILED
```

All return/refund transitions must be authorized and audited.

---

## 20. Audit Logging

Important administrative actions should be logged:

```text
actor
action
resource
resourceId
timestamp
metadata
```

Examples:

- Admin created category
- Admin suspended seller
- Admin changed delivery status
- Admin changed platform settings

---

## 21. Security

Required:

- bcrypt password hashing
- JWT validation
- RBAC
- Resource ownership checks
- Input validation
- Rate limiting
- CORS
- Security headers
- Centralized error handling
- Environment variables
- Audit logging

Never commit:

```text
.env
database credentials
JWT secrets
API keys
Cloudinary secrets
payment secrets
```

---

## 22. API Structure

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Products:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Categories:

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Orders:

```text
POST  /api/orders
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
```

Tracking:

```text
GET  /api/orders/:orderId/tracking
POST /api/orders/:orderId/tracking/events
```

---

## 23. Database Collections

Recommended:

```text
users
products
categories
orders
carts
addresses
wishlists
reviews
notifications
trackingEvents
auditLogs
```

---

## 24. Frontend Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── tracking/
│   ├── dashboard/
│   └── forms/
├── context/
├── hooks/
├── layouts/
├── pages/
│   ├── public/
│   ├── auth/
│   ├── customer/
│   ├── seller/
│   └── admin/
├── routes/
├── services/
├── constants/
├── utils/
└── App.jsx
```

---

## 25. Backend Structure

```text
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── server.js
```

Use:

```text
Routes → Controllers → Services → Models
```

---

## 26. Deployment

Frontend:

```text
Vercel
```

Backend:

```text
Render / Railway
```

Database:

```text
MongoDB Atlas
```

Images:

```text
Cloudinary
```

CI/CD:

```text
Pull Request
  ↓
PR Checks
  ↓
GitHub Actions CI
  ├── Frontend lint
  ├── Frontend test
  ├── Frontend build
  ├── Backend lint
  ├── Backend test
  └── Backend build
  ↓
Security Audit
  ↓
Merge
  ↓
Release Tag
  ↓
Deployment Gate
  ↓
Production
```

Required workflow files:

```text
.github/workflows/
├── ci.yml
├── pr-checks.yml
├── security.yml
└── deploy.yml
```

Production secrets must be stored in GitHub Secrets/Variables and never committed.

---

## 27. Definition of Done

A feature is complete only when:

- UI is implemented
- API is implemented where required
- Database integration works
- Validation exists
- Authorization exists
- Error handling exists
- Loading/empty states exist
- Responsive UI works
- Tests are added where applicable
- Documentation is updated
- Manual verification is complete

---

## 28. Primary Acceptance Journey

```text
Customer registers
 ↓
Logs in
 ↓
Browses products
 ↓
Adds product to cart
 ↓
Checks out
 ↓
Places order
 ↓
Seller receives order
 ↓
Seller confirms
 ↓
Processing
 ↓
Packed
 ↓
Shipped
 ↓
Tracking number added
 ↓
In Transit
 ↓
Out for Delivery
 ↓
Delivered
 ↓
Customer sees completed tracking history
```
