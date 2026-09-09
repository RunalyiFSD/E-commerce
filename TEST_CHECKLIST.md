# Test Checklist

## Authentication

- [x] Valid registration works
- [x] Duplicate email is rejected
- [x] Weak/invalid input is rejected
- [x] Password is hashed
- [x] Valid login works
- [x] Invalid password fails
- [x] Invalid token fails
- [x] Logout works
- [x] `/me` returns authenticated user without secrets

## RBAC

### Admin

- [x] Admin can access admin dashboard
- [x] Admin can create category
- [x] Admin can manage sellers
- [x] Admin can view all orders
- [x] Admin can monitor deliveries

### Seller

- [x] Seller can access seller dashboard
- [x] Seller can create product
- [x] Seller can edit own product
- [x] Seller cannot edit another seller's product
- [x] Seller can view relevant orders
- [x] Seller can fulfill relevant orders
- [x] Seller cannot create platform categories

### Customer

- [x] Customer can access customer dashboard
- [x] Customer can view own orders
- [x] Customer cannot view another customer's order
- [x] Customer can track own order
- [x] Customer cannot access admin endpoints
- [x] Customer cannot access seller management

## Products

- [x] Product creation
- [x] Product update
- [x] Product deactivation
- [x] Product search
- [x] Product filtering
- [x] Product details
- [x] Image upload

## Categories

- [x] Admin creates category
- [x] Admin edits category
- [x] Admin deactivates category
- [x] Non-admin category creation rejected

## Cart

- [x] Add product
- [x] Remove product
- [x] Increase quantity
- [x] Decrease quantity
- [x] Clear cart
- [x] Correct total

## Checkout

- [x] Address validation
- [x] Order summary
- [x] Payment success path
- [x] Payment failure path
- [x] Inventory validation
- [x] Order creation
- [x] Cart clearing

## Order Lifecycle

- [x] PLACED
- [x] CONFIRMED
- [x] PROCESSING
- [x] PACKED
- [x] SHIPPED
- [x] IN_TRANSIT
- [x] OUT_FOR_DELIVERY
- [x] DELIVERED

## Invalid Transitions

- [x] PLACED → DELIVERED rejected
- [x] DELIVERED → PACKED rejected
- [x] Unauthorized seller transition rejected
- [x] Unauthorized customer transition rejected

## Tracking

- [x] Tracking number appears
- [x] Courier appears
- [x] Current location appears
- [x] Expected delivery appears
- [x] Timeline shows historical events
- [x] New status appends event
- [x] Last updated changes
- [x] Customer sees only their tracking data

## Delivery Exceptions

- [x] DELIVERY_FAILED
- [x] Customer sees failure
- [x] Admin sees failed delivery
- [x] Retry/recovery action is controlled

## Returns/Refunds

- [x] Eligible customer can request return
- [x] Ineligible request rejected
- [x] Admin/seller can review according to permission
- [x] Refund state is visible
- [x] Refund transition is audited

## UI

- [x] Mobile
- [x] Tablet
- [x] Desktop
- [x] Loading states
- [x] Empty states
- [x] Error states
- [x] Unauthorized state
- [x] Not found state
- [x] Tracking timeline readable

## Security & Production

- [x] Audit logging active
- [x] API rate limiting active
- [x] Security headers (Helmet) active
- [x] Environment variables configured
- [x] CORS configured
- [x] Build succeeds
- [x] API health check works
- [x] Frontend can communicate with production API
- [x] No secrets committed
