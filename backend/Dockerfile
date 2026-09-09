# Production Dockerfile for E Mart Backend
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Change ownership of app directory to non-root node user
RUN chown -R node:node /usr/src/app

# Run as non-root user for security
USER node

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
