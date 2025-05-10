# Vehicle Rental System

A full-stack application for managing vehicle rentals built with React, Node.js, and PostgreSQL.

## Project Structure

```
octalogic_rent_vehicle/
├── fe/                 # Frontend application
├── be/                 # Backend application
└── README.md          # This file
```

## Setup Options

You can run this application in two ways:
1. [Docker Setup](#docker-setup) - Quick start with Docker
2. [Manual Setup](#manual-setup) - Step by step manual setup

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Quick Start
1. Clone the repository
2. Navigate to root directory
3. Run:
```bash
docker-compose up --build
```

The applications will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: localhost:5432

### Docker Commands
```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove volumes (clean state)
docker-compose down -v

# View logs
docker-compose logs -f
```

## Manual Setup

### Prerequisites
- Node.js (v16 or higher)
- pnpm (package manager)
- Docker (for PostgreSQL database)

### Database Setup

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

### Backend Setup

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

4. Run migrations:

```bash
pnpm prisma migrate dev
```

5. Seed the database:

```bash
pnpm run db:seed
```

6. Start the server:

```bash
pnpm run dev
```

The backend will start on http://localhost:3001

### Frontend Setup

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

## Development

### Running Tests
```bash
# Backend tests
cd be && pnpm test

# Frontend tests
cd fe && pnpm test
```

### Database Management
```bash
# Access PostgreSQL CLI
docker exec -it postgres psql -U postgres -d rentals

# View Prisma Studio
cd be && pnpm prisma studio
```

## Troubleshooting

### Docker Issues
1. If containers fail to start:
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

2. To check container logs:
```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Other Issues
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
