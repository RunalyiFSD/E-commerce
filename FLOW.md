# Execution and Data Flow

## 1. Authentication Flow

```text
Login Form
 ↓
Auth Service
 ↓
POST /api/auth/login
 ↓
Express Route
 ↓
Auth Controller
 ↓
User lookup
 ↓
bcrypt.compare()
 ↓
JWT creation
 ↓
Frontend auth state
 ↓
Protected application
```

## 2. Product Flow

```text
Product Page
 ↓
GET /api/products/:id
 ↓
Product Controller
 ↓
Product Service
 ↓
MongoDB
 ↓
Product response
 ↓
Product UI
```

## 3. Add to Cart

```text
ProductCard
 ↓
Add to Cart
 ↓
Cart Context
 ↓
Cart persistence/API
 ↓
Cart UI
```

## 4. Checkout

```text
Cart
 ↓
Checkout Page
 ↓
Address
 ↓
Shipping
 ↓
Payment
 ↓
Order API
 ↓
Order Service
 ↓
Validate inventory
 ↓
Create Order
 ↓
Persist Order
 ↓
Return Order
 ↓
Clear Cart
 ↓
Order Confirmation
```

## 5. Seller Fulfillment

```text
Seller Dashboard
 ↓
Seller Order List
 ↓
Order Details
 ↓
Confirm Order
 ↓
PATCH /api/orders/:id/status
 ↓
Auth Middleware
 ↓
Role Middleware
 ↓
Ownership Check
 ↓
Order Service
 ↓
Validate transition
 ↓
Update order
 ↓
Append tracking event
 ↓
Notification
 ↓
Seller UI refresh
```

## 6. Customer Tracking

```text
Customer Dashboard
 ↓
Active Order
 ↓
Track Order
 ↓
GET /api/orders/:orderId/tracking
 ↓
Authentication
 ↓
Customer Ownership Check
 ↓
Tracking Service
 ↓
Order + Tracking Events
 ↓
Tracking Timeline
```

## 7. Delivery Completion

```text
Shipment
 ↓
IN_TRANSIT
 ↓
OUT_FOR_DELIVERY
 ↓
DELIVERED
 ↓
Append final tracking event
 ↓
Update order
 ↓
Create customer notification
 ↓
Customer sees completed timeline
```

## 8. Failure Flow

```text
API request
 ↓
Validation/Business Rule failure
 ↓
Central error handler
 ↓
Standard error response
 ↓
Frontend ErrorState/Toast
```

## 9. Authorization Flow

```text
Request
 ↓
JWT validation
 ↓
Authenticated user
 ↓
Role check
 ↓
Permission check
 ↓
Ownership check
 ↓
Controller
```

No protected operation should bypass this sequence.
