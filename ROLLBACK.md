# Rollback Plans

## General Rule

Every risky change should have a known way back.

For normal feature changes:

```text
Identify commit
 ↓
Revert commit if required
 ↓
Run tests
 ↓
Verify affected flow
```

---

## Authentication Changes

Before changing authentication:

- Run authentication tests.
- Keep the previous implementation available in Git.
- Avoid changing token format without documenting impact.

Rollback:

```text
Revert auth commit
Run auth tests
Verify login/logout/me
```

---

## Database Changes

Before destructive schema/data changes:

- Back up or snapshot the development data when appropriate.
- Record the affected collections.
- Document migration steps.
- Prefer additive changes first.

Never delete tracking history as part of a convenience migration.

---

## Order Status Changes

If a status transition implementation causes invalid orders:

1. Stop further status updates.
2. Revert the transition logic.
3. Identify affected records.
4. Repair records with an explicit script/migration.
5. Re-run order transition tests.

---

## Tracking Changes

Tracking history is high-value data.

Do not solve tracking bugs by deleting historical events.

If tracking logic is wrong:

```text
Fix transition logic
 ↓
Preserve existing events
 ↓
Add corrective event if needed
```

---

## Frontend Refactors

If a reusable component breaks multiple pages:

- Revert the refactor.
- Restore previous component behavior.
- Re-run affected page tests.
- Reintroduce the refactor in smaller steps.

---

## Deployment Rollback

If production deployment fails:

```text
Identify failing release
 ↓
Rollback to previous known-good deployment
 ↓
Verify health endpoint
 ↓
Verify login
 ↓
Verify product browsing
 ↓
Verify order/tracking access
```

Do not make emergency production edits without documenting the reason afterward.
