# Constraints

## Security

AI/agents must never:

- Commit secrets
- Print credentials
- Hardcode production API keys
- Disable authentication to make a feature work
- Remove backend authorization
- Trust frontend role values
- Remove ownership checks

---

## Architecture

Do not change these without recording a decision in `DECISIONS.md`:

- React + JavaScript frontend
- Express backend
- MongoDB persistence
- JWT authentication
- bcrypt password hashing
- Shared dashboard architecture
- Database-backed order tracking
- Controlled order status transitions

---

## Scope

Do not silently introduce:

- A new frontend framework
- A second state-management library without a need
- A second UI framework
- A new database
- A microservice architecture
- A real logistics provider
- A production payment provider

unless the change is explicitly requested or documented as a future extension.

---

## Data

Do not destructively change existing order/tracking data without a migration/backout plan.

Tracking history should be append-oriented.

Historical tracking events must not be silently deleted or rewritten.

---

## Roles

Exactly three primary roles are supported:

```text
ADMIN
SELLER
CUSTOMER
```

Do not create arbitrary roles as a shortcut.

---

## UI

The UI should remain:

- Professional
- Light
- Responsive
- Accessible
- Consistent

Avoid visual redesign during unrelated backend tasks.

---

## Protected Areas

Treat these as high-risk:

```text
Authentication
Authorization
Order transitions
Tracking history
Payments
User data
Production configuration
Database migrations
```

Changes in these areas require extra testing and a documented reason.

---

## AI Behavior

AI must not:

- Invent existing APIs
- Assume a file exists without checking
- Claim tests passed without running them
- Claim deployment succeeded without verification
- Make unrelated refactors
- Replace working architecture without a reason
- Hide uncertainty

---

## Review

Before accepting a change:

```text
Understand → Verify → Test → Diff Review
```


---

## CI/CD Constraints

Do not:

- Commit production secrets into workflow files.
- Disable failing CI checks just to merge code.
- Use `npm install` in CI when a lockfile exists; prefer `npm ci`.
- Claim a deployment succeeded without verifying the deployment.
- Deploy directly from unverified feature branches to production.
- Add provider-specific deployment credentials to source control.

CI must remain a quality gate.
