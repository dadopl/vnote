FROM node:20-alpine

# Install netcat for database connection check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy and build frontend first
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend ./
RUN npm run build

# Copy backend package files
WORKDIR /app
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend application files
COPY backend ./

# Make entrypoint executable
RUN chmod +x ./docker-entrypoint.sh

# Create recordings directory
RUN mkdir -p /app/recordings

# Expose port
EXPOSE 7776

# Start the backend server with migrations
WORKDIR /app/backend
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
