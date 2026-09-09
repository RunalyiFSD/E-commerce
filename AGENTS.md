# AGENTS.md

## 1. Mission

Build the e-commerce application as a maintainable production-oriented system, not as a collection of disconnected CRUD pages.

The primary business flow is:

```text
Customer → Order → Seller Fulfillment → Shipment → Tracking → Delivery
```

Every implementation decision should preserve security, traceability, testability, and clear ownership.

---

## 2. Mandatory Context Files

Before changing code, read:

1. `PROJECT_SPEC.md`
2. `TASKS.md`
3. `progress.md`
4. `ARCHITECTURE.md`
5. `CONSTRAINTS.md`
6. `DECISIONS.md` when changing architecture
7. `FLOW.md` when changing execution/data flow

For an existing bug or feature, also read the corresponding file under:

```text
docs/bugs/
docs/features/
```

---

## 3. Development Loop

Use this loop:

```text
Understand
  ↓
Inspect
  ↓
Explain why
  ↓
Plan one small change
  ↓
Implement
  ↓
Test
  ↓
Read diff
  ↓
Update documentation
  ↓
Commit
```

Do not blindly accept generated code.

---

## 4. One Change Per Request

Prefer small, traceable changes.

Example:

```text
Request: Add seller order confirmation

Allowed:
- seller order action
- backend status transition
- related UI state
- related tests
- documentation

Avoid:
- redesigning the dashboard
- changing authentication
- replacing the database layer
```

If another issue is discovered, record it instead of silently expanding scope.

---

## 5. Why Before What

Before implementing a non-trivial change, establish:

- What problem is being solved?
- Why is this location appropriate?
- Which role needs it?
- Which data does it affect?
- What security boundary applies?
- What existing behavior could break?
- How will it be tested?

Document architectural decisions in `DECISIONS.md`.

---

## 6. Authentication Rules

Use JWT and bcrypt.

Never:

- Store plain-text passwords
- Return password hashes
- Put secrets in frontend code
- Trust a frontend-only login state as authorization
- Commit `.env`

Backend authentication is authoritative.

---

## 7. Authorization Rules

Always distinguish:

```text
Authentication = Who is the user?
Authorization = What can the user do?
Ownership = Does the resource belong to the user?
```

Every protected resource must enforce the appropriate checks on the backend.

Examples:

```text
CUSTOMER → own order only
SELLER → own products/orders only
ADMIN → platform-wide access
```

---

## 8. Role Rules

### ADMIN

Can manage:

- Users
- Sellers
- Products
- Categories
- Orders
- Deliveries
- Platform settings
- Audit logs

Only ADMIN can create platform categories.

### SELLER

Can manage:

- Own products
- Own inventory
- Orders containing their products
- Fulfillment
- Shipment information
- Store settings

Cannot manage global categories or other sellers.

### CUSTOMER

Can manage:

- Own profile
- Own addresses
- Own cart
- Own orders
- Own wishlist
- Eligible returns/refunds

Cannot modify products, categories, or other users' resources.

---

## 9. Order State Rules

Never use arbitrary strings throughout the application.

Centralize status constants.

Normal lifecycle:

```text
PLACED
→ CONFIRMED
→ PROCESSING
→ PACKED
→ SHIPPED
→ IN_TRANSIT
→ OUT_FOR_DELIVERY
→ DELIVERED
```

Exception lifecycle:

```text
CANCELLED
DELIVERY_FAILED
RETURN_REQUESTED
RETURNED
REFUND_INITIATED
REFUNDED
```

Validate transitions on the backend.

---

## 10. Tracking Rules

Tracking history is append-oriented.

When a status changes:

1. Validate current status.
2. Validate actor permission.
3. Change current status.
4. Append a tracking event.
5. Store timestamp.
6. Store source/actor.
7. Store optional location/courier data.
8. Notify affected user where applicable.
9. Write audit information for sensitive operations.

Do not silently rewrite historical tracking events.

---

## 11. Reusable Components

Prefer shared components.

Do not create:

```text
AdminOrderCard
SellerOrderCard
CustomerOrderCard
```

when a reusable:

```text
OrderCard
```

can accept role-specific actions.

Keep business logic out of generic UI components whenever possible.

---

## 12. Frontend Architecture

Use:

```text
Pages
 ↓
Feature Components
 ↓
Shared Components
 ↓
Hooks/Context
 ↓
Services/API
```

API communication belongs in service modules rather than being scattered across unrelated components.

---

## 13. Backend Architecture

Use:

```text
Routes
 ↓
Middleware
 ↓
Controllers
 ↓
Services
 ↓
Models
```

Controllers should coordinate requests.

Services should contain business rules.

Models should describe persistence.

---

## 14. Validation

Validate on:

- Frontend for user experience
- Backend for security/data integrity

Never assume frontend validation is sufficient.

---

## 15. Error Handling

Every asynchronous UI operation must represent:

```text
Loading
Success
Error
Empty
```

Backend errors should pass through centralized error handling.

Use meaningful HTTP status codes.

---

## 16. Security

Required:

- bcrypt
- JWT validation
- RBAC
- Ownership checks
- Input validation
- Rate limiting
- CORS
- Secure headers
- Environment variables
- Audit logging

Never expose secrets.

---

## 17. Git

Use meaningful commits:

```text
feat: add customer order tracking
feat: add seller shipment workflow
fix: prevent cross-user order access
refactor: extract reusable tracking timeline
test: add order transition tests
docs: update delivery flow
```

Avoid vague commits such as:

```text
update
changes
final
new
fix
```

---

## 18. Diff Review

Before finishing a task:

- Read every changed file.
- Confirm no unrelated changes exist.
- Confirm no secrets were introduced.
- Confirm authorization was not weakened.
- Confirm API contracts remain consistent.
- Confirm tests match the change.

---

## 19. Rollback Awareness

Every risky change should have a rollback strategy.

Before database schema changes or broad refactors:

- Identify affected files.
- Identify affected data.
- Record migration/backout approach.
- Avoid destructive migrations during early development.

See `ROLLBACK.md`.

---

## 20. AI-Assisted Development Rules

AI-generated code is a proposal, not proof.

The developer/agent must:

- Understand the code before accepting it.
- Verify assumptions.
- Test behavior.
- Read the diff.
- Update documentation.
- Avoid inventing APIs or files.
- Avoid changing protected architecture without a decision record.

---

## 21. End-of-Session Handoff

Before ending a development session:

Update `SESSION_HANDOFF.md` with:

- What was completed
- What is currently in progress
- What remains
- Files changed
- Tests run
- Known issues
- Next recommended action

This prevents the next session from starting from zero.

---

## 22. Context Versioning

When using AI-assisted development, record:

- Date/session
- Model/tool when known
- Request/task
- Files changed
- Important assumptions
- Verification performed

See `CONTEXT_LOG.md`.

The purpose is traceability, not blind trust.

---

## 23. Final Rule

The agent must optimize for:

```text
Correctness
Security
Traceability
Maintainability
Testability
Small changes
Clear reasoning
```

Speed is secondary to reliable implementation.
