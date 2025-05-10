#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until pnpm prisma db push --accept-data-loss; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - setting up database"

# Reset database (clear all data and apply migrations)
echo "Resetting database..."
pnpm prisma migrate reset --force

echo "Running seeds..."
pnpm db:seed

echo "Database setup completed"

# Execute the main command without array syntax
exec pnpm dev