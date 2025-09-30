# Backend Architecture

This document outlines the restructured backend architecture following modern Node.js best practices.

## Directory Structure

```
src/
├── config/                 # Configuration management
│   ├── index.js            # Main configuration
│   └── logger.js           # Logging configuration
├── constants/              # Application constants and enums
│   └── index.js            # Constants definitions
├── db/                     # Database related files
│   ├── connection.js       # Database connection
│   ├── migrations/         # Database migrations
│   └── seeds/              # Database seeds
├── errors/                 # Error handling
│   ├── AppError.js         # Custom error classes
│   ├── asyncErrorBoundary.js
│   ├── errorHandler.js     # Global error handler
│   ├── methodNotAllowed.js
│   └── notFound.js
├── middleware/             # Express middleware
│   └── index.js            # Common middleware setup
├── reservations/           # Reservations module
│   ├── reservations.controller.js
│   ├── reservations.router.js
│   └── reservations.service.js
├── tables/                 # Tables module
│   ├── tables.controller.js
│   ├── tables.router.js
│   └── tables.service.js
├── utils/                  # Utility functions
│   ├── dateTime.js         # Date/time utilities
│   ├── phoneNumber.js      # Phone number utilities
│   └── index.js            # Utils exports
├── validators/             # Input validation
│   ├── reservationValidator.js
│   └── tableValidator.js
├── app.js                  # Express app setup
└── server.js               # Server startup
```

## API Endpoints

### Health Check

- `GET /health` - Application health status

### Reservations

- `GET /reservations` - List reservations
- `POST /reservations` - Create reservation
- `GET /reservations/:reservation_id` - Get reservation
- `PUT /reservations/:reservation_id` - Update reservation
- `PUT /reservations/:reservation_id/status` - Update status

### Tables

- `GET /tables` - List tables
- `POST /tables` - Create table
- `GET /tables/:table_id` - Get table
- `PUT /tables/:table_id/seat` - Seat reservation
- `DELETE /tables/:table_id/seat` - Finish table
- `DELETE /tables/:table_id` - Delete table

## Environment Variables

```env
# Server Configuration
PORT=5001
HOST=localhost
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/dbname

# Logging Configuration
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=*
```

## Scripts

### Development

- `npm run dev` - Start with debugging
- `npm run start:dev` - Start with nodemon
- `npm test:watch` - Run tests in watch mode

### Database

- `npm run migrate` - Run migrations
- `npm run seed` - Run seeds
- `npm run reset` - Reset database
- `npm run db:setup` - Setup database

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test:coverage` - Run tests with coverage
