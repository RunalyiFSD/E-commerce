# Production Deployment Guide

This document outlines the step-by-step procedure for deploying the Amazon-like E-Commerce Application to production environments.

---

## Architecture Overview

```text
       [ Vercel / Netlify ] (React + Vite SPA Frontend)
                 │
                 │ HTTPS / API Requests
                 ▼
       [ Render / Railway ] (Node.js + Express REST API Backend)
           │           │
           ▼           ▼
   [ MongoDB Atlas ]  [ Cloudinary / S3 ]
  (Production Database) (Media Assets)
```

---

## 1. Environment Variables Configuration

### Frontend Variables (`frontend/.env.production`)
```ini
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Backend Variables (`backend/.env.production`)
```ini
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+sandbox+srv://<username>:<password>@cluster.mongodb.net/ecommerce_prod?retryWrites=true&w=majority
JWT_SECRET=prod_super_secret_jwt_key_987654321
CLIENT_URL=https://app.yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 2. Infrastructure Setup

### A. Database (MongoDB Atlas)
1. Create a production cluster on MongoDB Atlas.
2. Create a dedicated database user with `readWrite` permissions on `ecommerce_prod`.
3. Whitelist the backend server IP addresses (or `0.0.0.0/0` if hosting on serverless platforms like Render/Vercel).
4. Obtain the connection string and set `MONGODB_URI`.

### B. Backend Deployment (Render / Railway / AWS App Runner)
1. Link GitHub repository to your hosting provider.
2. Set Build Command: `cd backend && npm ci`
3. Set Start Command: `cd backend && node index.js`
4. Add environment variables: `PORT`, `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.

### C. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Link GitHub repository.
2. Set Root Directory: `frontend`
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=https://<your-backend-url>`.

---

## 3. GitHub Actions CI/CD Integration

The repository is equipped with automated workflows under `.github/workflows/`:
- **`ci.yml`**: Automatically runs linting, testing, and production builds on push/PR to `main` and `develop`.
- **`pr-checks.yml`**: Scans pull requests for unencrypted `.env` files or hardcoded API credentials.
- **`security.yml`**: Scans npm dependencies weekly for high-severity vulnerabilities.
- **`deploy.yml`**: Triggers release validation when a version tag (e.g. `v1.0.0`) is pushed to `main`.

---

## 4. Production Verification & Smoke Testing

After deployment, perform these smoke tests:
1. **Health Check:** Send `GET https://<api-url>/api/health`. Expected response: `HTTP 200 OK` (`{ status: "UP" }`).
2. **CORS Check:** Ensure requests from `CLIENT_URL` succeed while unauthorized origins receive CORS rejection.
3. **Auth Flow:** Register a test customer account, log in, and verify JWT session restoration (`GET /api/auth/me`).
4. **Order State Machine:** Test order creation, fulfillment transition, and timeline appending.
5. **Rate Limiting:** Verify `/api/auth/login` returns HTTP 429 after exceeding max attempt limit.

---

## 5. Rollback Procedure

If a deployment contains a critical bug:
1. Refer to [`ROLLBACK.md`](file:///c:/Users/salun/OneDrive/Desktop/E-Commerce/ROLLBACK.md).
2. Trigger static rollback on Vercel/Render by redeploying the previous successful release tag (e.g. `v1.0.0`).
3. Revert database migrations if schema changes occurred using migration scripts.
