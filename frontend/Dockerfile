# Multi-stage Dockerfile for E Mart Frontend (React + Vite)

# ==========================================
# Stage 1: Build production static bundles
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker caching
COPY package*.json ./
RUN npm ci

# Copy application source files
COPY . .

# Build the production bundle into /app/dist
RUN npm run build

# ==========================================
# Stage 2: Serve using ultra-light Nginx
# ==========================================
FROM nginx:1.27-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set default backend URL (can be overridden on Render via environment variable)
ENV BACKEND_URL=http://backend:5000

# Copy custom Nginx configuration template (Nginx automatically processes .template files with envsubst)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
