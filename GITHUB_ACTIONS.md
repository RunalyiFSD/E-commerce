# GitHub Actions CI/CD

## Purpose

GitHub Actions automates quality checks before code is merged and provides a controlled path toward production deployment.

## Workflow Structure

```text
Developer
   ↓
Git Push / Pull Request
   ↓
PR Checks
   ↓
CI
   ├── Frontend lint
   ├── Frontend tests
   ├── Frontend build
   ├── Backend lint
   ├── Backend tests
   └── Backend build
   ↓
Security Checks
   ↓
Merge to main
   ↓
Release tag / deployment trigger
   ↓
Production deployment
```

## Workflows

### `.github/workflows/pr-checks.yml`

Runs on pull requests.

Checks:

- No tracked real `.env` files
- Basic scan for obvious secret patterns

Purpose:

Prevent common repository hygiene and secret-leak mistakes before merge.

### `.github/workflows/ci.yml`

Runs on pushes and pull requests targeting `main` or `develop`.

Frontend:

```text
npm ci
→ npm run lint
→ npm test -- --run
→ npm run build
```

Backend:

```text
npm ci
→ npm run lint
→ npm test
→ npm run build --if-present
```

The exact test scripts must exist in the respective `package.json` files before the workflow is enabled for the project.

### `.github/workflows/security.yml`

Runs on pushes, pull requests, and weekly.

It executes:

```text
npm audit --audit-level=high
```

against frontend and backend dependencies.

Security findings should be investigated rather than automatically ignored.

### `.github/workflows/deploy.yml`

Provides a production release gate.

It is triggered by:

- Version tags such as `v1.0.0`
- Manual workflow dispatch

The current file intentionally does not hardcode a deployment provider. Once the actual Vercel/Render/Railway deployment strategy is selected, provider-specific deployment can be added using repository secrets.

---

## Branch Strategy

Recommended:

```text
main
 ↑
develop
 ↑
feature/*
bugfix/*
```

### Feature

```text
feature/order-tracking
```

### Bug

```text
bugfix/customer-order-access
```

Open a pull request into `develop`.

After validation:

```text
develop → main
```

Production releases should be tagged:

```text
v1.0.0
v1.1.0
v1.1.1
```

---

## GitHub Secrets

Never put secrets in workflow YAML.

Production secrets should be stored using GitHub Actions Secrets/Variables where needed.

Potential secrets:

```text
MONGODB_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
PAYMENT_SECRET
EMAIL_API_KEY
```

Only expose a secret to the job that actually requires it.

---

## Required package scripts

### Frontend

The final frontend `package.json` should provide:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  }
}
```

### Backend

The final backend `package.json` should provide equivalents for:

```json
{
  "scripts": {
    "dev": "...",
    "start": "...",
    "lint": "...",
    "test": "..."
  }
}
```

Adapt commands to the actual implementation rather than inventing scripts.

---

## CI Rules

A pull request should not be considered merge-ready when:

- Lint fails
- Tests fail
- Production build fails
- High-severity dependency audit fails
- A real environment file is committed
- Obvious credentials are detected

---

## Deployment Principle

CI proves that the application can be built and tested.

CD deploys a verified release.

Keep these responsibilities separate:

```text
CI = quality gate
CD = delivery
```

Do not deploy every unverified development change directly to production.

---

## Future Improvements

After the core application is stable, consider:

- Playwright end-to-end tests
- MongoDB service/container for integration tests
- Code coverage thresholds
- Dependabot
- Artifact uploads
- Preview deployments
- Staging environment
- Deployment smoke tests
- Automatic rollback/health checks
