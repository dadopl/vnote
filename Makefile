# Voice Notes App - Makefile
# Usage: make [target]

.PHONY: setup stop restart logs clean rebuild help

# Default target
help:
	@echo "Available targets:"
	@echo "  setup   - Build and start all containers"
	@echo "  stop    - Stop all containers"
	@echo "  restart - Restart all containers"
	@echo "  logs    - Show container logs (follow mode)"
	@echo "  clean   - Stop containers and remove volumes"
	@echo "  rebuild - Force rebuild and start containers"
	@echo "  help    - Show this help message"

# Build and start all containers
setup:
	@echo "Building and starting containers..."
	docker-compose up --build -d
	@echo "Containers started successfully!"
	@echo "Application: https://localhost"
	@echo "phpMyAdmin: http://localhost:7778"

# Stop all containers
stop:
	@echo "Stopping containers..."
	docker-compose down
	@echo "Containers stopped."

# Restart all containers
restart: stop setup

# Show logs in follow mode
logs:
	docker-compose logs -f

# Stop containers and remove volumes
clean:
	@echo "Stopping containers and removing volumes..."
	docker-compose down -v
	@echo "Cleanup complete."

# Force rebuild without cache
rebuild:
	@echo "Force rebuilding containers..."
	docker-compose build --no-cache
	docker-compose up -d
	@echo "Containers rebuilt and started!"

