# E-Commerce Application — Task Plan

## Execution Rules

- Work sequentially through phases.
- Complete and test the current task before moving to dependent work.
- Keep one logical change per request/commit.
- Update `progress.md` after meaningful work.
- Record architectural decisions in `DECISIONS.md`.
- Record important file/function flows in `FLOW.md`.
- Check `CONSTRAINTS.md` before modifying protected areas.
- Every bug and feature should have a traceable start-to-finish record.
- Read the diff before considering a task complete.

---

# Phase 1 — Foundation

- [x] Initialize React + Vite
- [x] Configure JavaScript
- [x] Configure Tailwind CSS
- [x] Install React Router
- [x] Install Axios
- [x] Install Lucide React
- [x] Configure ESLint/Prettier
- [x] Create frontend structure
- [x] Initialize Express backend
- [x] Configure MongoDB/Mongoose
- [x] Configure environment variables
- [x] Create `.env.example`
- [x] Create health-check endpoint
- [x] Initialize Git/GitHub
- [x] Establish branch strategy

**Exit criteria:** frontend starts, backend starts, database connects, repository is cleanly initialized.

---

# Phase 2 — Design System and Reusable Components

- [x] Define design tokens (`src/constants/theme.js`)
- [x] Create Button (`src/components/common/Button.jsx`)
- [x] Create Input (`src/components/common/Input.jsx`)
- [x] Create Select (`src/components/common/Select.jsx`)
- [x] Create Modal/Dialog (`src/components/common/Modal.jsx`)
- [x] Create Card (`src/components/common/Card.jsx`)
- [x] Create Badge (`src/components/common/Badge.jsx`)
- [x] Create Table (`src/components/common/Table.jsx`)
- [x] Create Toast (`src/components/common/Toast.jsx`)
- [x] Create LoadingState (`src/components/common/LoadingState.jsx`)
- [x] Create EmptyState (`src/components/common/EmptyState.jsx`)
- [x] Create ErrorState (`src/components/common/ErrorState.jsx`)
- [x] Create Navbar (`src/components/layout/Navbar.jsx`)
- [x] Create Sidebar (`src/components/layout/Sidebar.jsx`)
- [x] Create Footer (`src/components/layout/Footer.jsx`)
- [x] Create ProductCard (`src/components/product/ProductCard.jsx`)
- [x] Create OrderCard (`src/components/order/OrderCard.jsx`)
- [x] Create OrderStatusBadge (`src/components/order/OrderStatusBadge.jsx`)
- [x] Create TrackingTimeline (`src/components/tracking/TrackingTimeline.jsx`)
- [x] Create DashboardLayout (`src/layouts/DashboardLayout.jsx`)

**Exit criteria:** common UI patterns use shared components rather than duplicated markup.

---

# Phase 3 — Landing Page and Product Discovery

- [x] Landing page (`src/pages/public/LandingPage.jsx`)
- [x] Navbar (`src/components/layout/Navbar.jsx`)
- [x] Hero (`src/components/landing/Hero.jsx`)
- [x] Category section (`src/components/landing/CategorySection.jsx`)
- [x] Featured products (`src/components/landing/FeaturedProducts.jsx`)
- [x] Best sellers (`src/components/landing/BestSellers.jsx`)
- [x] Deals (`src/components/landing/Deals.jsx`)
- [x] Benefits (`src/components/landing/Benefits.jsx`)
- [x] Footer (`src/components/layout/Footer.jsx`)
- [x] Product listing (`src/pages/public/ProductListingPage.jsx`)
- [x] Product details (`src/pages/public/ProductDetailPage.jsx`)
- [x] Search
- [x] Filtering
- [x] Sorting
- [x] Pagination

**Exit criteria:** visitor can discover and inspect products without authentication.

---

# Phase 4 — Authentication

- [x] User model (`server/models/user.model.js`)
- [x] Registration API (`POST /api/auth/register`)
- [x] Login API (`POST /api/auth/login`)
- [x] Logout flow (`POST /api/auth/logout`)
- [x] `/me` (`GET /api/auth/me`)
- [x] bcrypt password hashing
- [x] JWT token generation & verification
- [x] Auth middleware (`server/middleware/auth.middleware.js`)
- [x] Auth context (`src/context/AuthContext.jsx`)
- [x] Login page (`src/pages/auth/LoginPage.jsx`)
- [x] Registration page (`src/pages/auth/RegisterPage.jsx`)
- [x] Protected routes (`src/routes/ProtectedRoute.jsx`)
- [x] Unauthorized page (`src/pages/public/UnauthorizedPage.jsx`)
- [x] Session restoration

**Exit criteria:** users can securely register/login and protected pages require authentication.

---

# Phase 5 — RBAC and Authorization

- [x] Define role constants (`src/constants/theme.js`)
- [x] Add ADMIN/SELLER/CUSTOMER roles
- [x] Backend role middleware (`server/middleware/role.middleware.js`)
- [x] Permission middleware (`server/middleware/ownership.middleware.js`)
- [x] Frontend route guards (`src/routes/ProtectedRoute.jsx`)
- [x] Resource ownership checks
- [x] Admin routes authorization protected
- [x] Seller routes authorization protected
- [x] Customer routes authorization protected
- [x] Unauthorized API security tests executed (100% pass)

**Exit criteria:** each role can only perform permitted operations, and backend checks cannot be bypassed through the frontend.

---

# Phase 6 — Categories and Products

## Categories

- [x] Category model (`server/models/category.model.js`)
- [x] Category CRUD API (`server/controllers/category.controller.js` & `server/routes/category.routes.js`)
- [x] Admin category creation guard enforced (Rule 8)
- [x] Create category
- [x] Edit category
- [x] Deactivate category
- [x] Category image
- [x] Parent category

## Products

- [x] Product model (`server/models/product.model.js`)
- [x] Product CRUD (`server/controllers/product.controller.js` & `server/routes/product.routes.js`)
- [x] Seller ownership enforcement
- [x] Admin product management
- [x] Inventory management
- [x] SKU unique validation
- [x] Image upload & URL management

**Exit criteria:** admin can manage categories and sellers can manage their own products.

---

# Phase 7 — Cart and Checkout

- [x] Cart context (`src/context/CartContext.jsx`)
- [x] Add/remove products
- [x] Quantity changes
- [x] Price calculation
- [x] Address management
- [x] Shipping method
- [x] Order summary
- [x] Payment abstraction (`src/services/paymentService.js`)
- [x] Payment success/failure states
- [x] Create order
- [x] Clear cart after successful order

**Exit criteria:** a customer can place a valid order.

---

# Phase 8 — Order Management

- [x] Order model (`server/models/order.model.js`)
- [x] Create order API (`POST /api/orders`)
- [x] Customer order history (`GET /api/orders`)
- [x] Seller order queue (`GET /api/orders`)
- [x] Admin order management (`GET /api/orders`)
- [x] Order details (`GET /api/orders/:id`)
- [x] Status constants & valid status transitions validator (`server/utils/orderStatusMachine.js`)
- [x] Illegal jump rejection (Rule 9)
- [x] Ownership checks per role

**Exit criteria:** order ownership and role-specific access are fully enforced.

---

# Phase 9 — Order Tracking and Delivery

## Priority: CRITICAL

- [x] Tracking model/embedded structure
- [x] Tracking event model
- [x] Current status
- [x] Status timestamps
- [x] Tracking number
- [x] Courier
- [x] Current location
- [x] Estimated delivery date
- [x] Last updated
- [x] Seller fulfillment actions
- [x] Shipment update API
- [x] Customer tracking page
- [x] Visual tracking timeline
- [x] Delivery exception states
- [x] Admin active-delivery view
- [x] Admin delayed-delivery view
- [x] Admin failed-delivery view

## Required status flow

- [x] PLACED
- [x] CONFIRMED
- [x] PROCESSING
- [x] PACKED
- [x] SHIPPED
- [x] IN_TRANSIT
- [x] OUT_FOR_DELIVERY
- [x] DELIVERED

**Exit criteria:** a real database-backed order can progress through fulfillment and the customer can see the complete history.

---

# Phase 10 — Role-Based Dashboard

- [x] Shared DashboardLayout
- [x] Dynamic navigation
- [x] Dynamic widgets
- [x] Dynamic statistics
- [x] Admin dashboard
- [x] Seller dashboard
- [x] Customer dashboard
- [x] Active delivery widget
- [x] Recent orders widget
- [x] Revenue/statistics widgets

**Exit criteria:** `/dashboard` changes meaningfully according to authenticated role without duplicating the dashboard shell.

---

# Phase 11 — Notifications, Returns, Refunds

- [x] Notification model
- [x] In-app notifications
- [x] Order status notifications
- [x] Delivery notifications
- [x] Return request
- [x] Return approval/rejection
- [x] Refund lifecycle
- [x] Customer notification center

**Exit criteria:** post-delivery support lifecycle is represented in the application.

---

# Phase 12 — Testing and Security

- [x] Authentication tests
- [x] RBAC tests
- [x] Ownership tests
- [x] Product tests
- [x] Category tests
- [x] Cart tests
- [x] Checkout tests
- [x] Order tests
- [x] Tracking tests
- [x] API validation
- [x] Rate limiting
- [x] CORS
- [x] Security headers
- [x] Audit logs
- [x] Error handling

**Exit criteria:** critical flows are testable and security controls are verified.

---

# Phase 13 — CI/CD and Deployment

## GitHub Actions

- [x] Create `.github/workflows/ci.yml`
- [x] Frontend lint job
- [x] Frontend test job
- [x] Frontend build job
- [x] Backend lint job
- [x] Backend test job
- [x] Backend build job
- [x] Create `.github/workflows/pr-checks.yml`
- [x] Add environment-file protection
- [x] Add basic secret-pattern protection
- [x] Create `.github/workflows/security.yml`
- [x] Add dependency audit
- [x] Configure scheduled security checks
- [x] Create `.github/workflows/deploy.yml`
- [x] Configure release/tag deployment gate
- [x] Configure GitHub Secrets/Variables
- [x] Document branch strategy
- [x] Document deployment rollback

## Deployment

- [x] Frontend deployment
- [x] Backend deployment
- [x] MongoDB Atlas production database
- [x] Cloudinary production setup
- [x] Production environment variables
- [x] Production CORS
- [x] Smoke tests

**Exit criteria:** production build can be deployed reproducibly.

---

# Phase 14 — Final QA

- [x] Customer journey
- [x] Seller journey
- [x] Admin journey
- [x] Authentication
- [x] Authorization
- [x] Order lifecycle
- [x] Delivery tracking
- [x] Returns/refunds
- [x] Mobile
- [x] Tablet
- [x] Desktop
- [x] Error states
- [x] Empty states
- [x] Accessibility checks
- [x] Final documentation

**Exit criteria:** application passes the complete end-to-end acceptance journey.
