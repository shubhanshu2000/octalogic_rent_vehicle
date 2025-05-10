# Vehicle Rental System

A full-stack application for managing vehicle rentals built with React, Node.js, and PostgreSQL.

## Project Structure

```
octalogic_rent_vehicle/
├── fe/                 # Frontend application
├── be/                 # Backend application
└── README.md          # This file
```

## Prerequisites

- Node.js (v16 or higher)
- Docker
- pnpm (package manager)

## Database Setup

1. Start PostgreSQL using Docker:

```bash
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=rentals \
  -p 5432:5432 \
  -d postgres
```

2. Verify the container is running:

```bash
docker ps
```

3. Database Connection Details:

- Host: localhost
- Port: 5432
- Database: rentals
- Username: postgres
- Password: root

## Backend Setup

1. Navigate to backend directory:

```bash
cd be
```

2. Install dependencies:

```bash
pnpm install
```

3. Create .env file:

```
DATABASE_URL="postgresql://postgres:root@localhost:5432/rentals"
```

4. Seed the database:

```bash
pnpm run db:seed
```

5. Start the server:

```bash
pnpm run dev
```

The backend will start on http://localhost:3001

## Frontend Setup

1. Navigate to frontend directory:

```bash
cd fe
```

2. Install dependencies:

```bash
pnpm install
```

3. Create .env file:

```
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:

```bash
pnpm run dev
```

The frontend will start on http://localhost:5173

## Features

- Multi-step booking form
- Vehicle type and model selection
- Date range selection
- Form validation
- Persistent form data using localStorage
- Responsive design

## API Endpoints

- GET `/api/vehicle/:wheels/type` - Get vehicle types by wheels
- GET `/api/vehicle/:vehicleTypeId/model` - Get vehicle models by type
- POST `/api/vehicle/book` - Book a vehicle

## Technologies Used

### Frontend

- React with TypeScript
- Vite
- Material-UI
- Date-fns

### Backend

- Node.js with Express
- Prisma ORM
- PostgreSQL
- TypeScript

### Development Tools

- Docker for database
- pnpm for package management
- ESLint for code linting

## Troubleshooting

1. If PostgreSQL container fails to start:

```bash
# Remove existing container
docker rm postgres

# Run the container creation command again
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rentals -p 5432:5432 -d postgres
```

2. If database connection fails:

- Verify PostgreSQL container is running
- Check if port 5432 is available
- Verify environment variables in .env files
