# Feature: Order Tracking and Delivery

## Status

Not Started

## Priority

CRITICAL

## Goal

Provide customers with a trustworthy, database-backed view of what happened to their order and what is happening now.

## User Story

As a customer, I want to track my order after purchase so that I know:

- Where my order is
- What has happened
- What is happening now
- What happens next
- When it is expected to arrive
- Who is handling delivery

## Actors

### Customer

Can:

- View own tracking
- See current status
- See historical events
- See expected delivery
- See courier/tracking information
- See delivery exceptions

### Seller

Can:

- Confirm
- Process
- Pack
- Ship
- Add shipment information
- Update allowed fulfillment status

### Admin

Can:

- View all deliveries
- Monitor delayed deliveries
- Monitor failed deliveries
- Correct/manage delivery information according to permission

## State Machine

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

Exceptions:

```text
CANCELLED
DELIVERY_FAILED
RETURN_REQUESTED
RETURNED
REFUND_INITIATED
REFUNDED
```

## Event Shape

```js
{
  status,
  message,
  timestamp,
  location,
  source,
  actor
}
```

## Example

```js
{
  status: "IN_TRANSIT",
  message: "Package is on the way to the delivery hub",
  timestamp: new Date(),
  location: "Pune",
  source: "SYSTEM"
}
```

## UI Requirements

The customer tracking page must show:

1. Current status
2. Expected delivery
3. Tracking number
4. Courier
5. Current location
6. Last update
7. Product information
8. Delivery address
9. Timeline
10. Exceptions/actions

## Acceptance Criteria

- [ ] Customer can open `/orders/:orderId/track`
- [ ] Customer cannot track another customer's order
- [ ] Status comes from backend
- [ ] Historical events are persisted
- [ ] Status changes append events
- [ ] Invalid transitions are rejected
- [ ] Timeline displays timestamps
- [ ] Delivery exceptions are visible
- [ ] Seller cannot bypass authorization
- [ ] Admin can monitor delivery
- [ ] Tracking remains correct after page refresh
