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

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
