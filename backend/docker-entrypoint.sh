#!/bin/sh
set -e

echo "Waiting for database to be ready..."

echo "Checking connection to $DB_HOST:$DB_PORT"

# Czekaj aż port MySQL będzie dostępny
until nc -z "$DB_HOST" "$DB_PORT"
do
  echo "Database not ready yet, waiting 2 seconds..."
  sleep 2
done

echo "Database connection available!"

# Dodatkowe oczekiwanie na pełną inicjalizację
sleep 5

echo "Running database migrations..."
npx sequelize-cli db:migrate

echo "Starting application..."
exec node server.js

