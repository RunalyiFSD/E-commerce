# Architecture Decision Record

## ADR-001 — React + JavaScript

**Status:** Accepted

### Decision

Use React with JavaScript and Vite.

### Why

The project goal is to strengthen practical React and JavaScript skills while maintaining a modern development workflow.

---

## ADR-002 — JWT Authentication

**Status:** Accepted

### Decision

Use JWT-based authentication.

### Why

JWT works well for a separate React frontend and Express API and demonstrates practical authentication concepts.

### Constraint

JWT does not replace authorization. Every protected backend operation still requires role/ownership checks.

---

## ADR-003 — bcrypt for Password Hashing

**Status:** Accepted

### Decision

Use bcrypt for password hashing.

### Why

Passwords must never be stored in plain text.

---

## ADR-004 — Backend Authorization

**Status:** Accepted

### Decision

Authorization is enforced on the backend.

### Why

Frontend guards can be bypassed. The API must independently enforce roles and ownership.

---

## ADR-005 — One Dashboard Shell

**Status:** Accepted

### Decision

Use one shared `/dashboard` shell with role-driven navigation and content.

### Why

This reduces duplication and demonstrates reusable component architecture.

---

## ADR-006 — Database-Backed Tracking History

**Status:** Accepted

### Decision

Persist order tracking events instead of rendering a hardcoded progress bar.

### Why

Customers need historical truth about their order.

### Consequence

Status transitions become business events and require validation.

---

## ADR-007 — Controlled Order State Transitions

**Status:** Accepted

### Decision

Order statuses may only move through valid transitions.

### Why

It prevents impossible states such as an order moving directly from PLACED to DELIVERED.

---

## ADR-008 — Admin Owns Platform Categories

**Status:** Accepted

### Decision

Only ADMIN can create/manage platform-level categories.

### Why

Categories are platform taxonomy, not seller-owned content.

---

## ADR-009 — Reusable Components

**Status:** Accepted

### Decision

Prefer shared components with props over role-specific duplicates.

### Why

The application is intended to demonstrate maintainable frontend architecture.

---

## ADR-010 — Simulated Delivery First

**Status:** Accepted

### Decision

Implement delivery tracking using application-controlled status events first.

### Why

A real courier integration adds external dependency and complexity. The architecture should allow a logistics API later without blocking the core project.


---

## ADR-011 — GitHub Actions for CI/CD

**Status:** Accepted

### Decision

Use GitHub Actions for continuous integration and release/deployment orchestration.

### Why

The source code is hosted on GitHub, so GitHub Actions provides an integrated way to run linting, tests, builds, security checks, and controlled release workflows.

### Consequence

The repository should treat CI as a merge-quality gate and CD as a separate release process.

Production secrets must be stored outside source code.
