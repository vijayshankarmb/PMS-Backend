# System Architecture

## Overview
This backend application serves as the core of the Project Management System. It is designed as a RESTful API using a layered architecture to ensure separation of concerns, maintainability, and scalability.

## Technology Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 engine.
- **Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strictly typed superset of JavaScript.
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for storing application data.
- **ODM**: [Mongoose](https://mongoosejs.com/) - Elegant mongodb object modeling for node.js.
- **Authentication**: JWT (JSON Web Tokens) for stateless authentication.
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation library.

## Project Structure

The project follows a standard MVC-like structure (without Views, as it's an API):

```
backend/
├── src/
│   ├── config/         # Database and other configuration files
│   ├── controllers/    # Request handlers (business logic)
│   ├── middlewares/    # Custom middlewares (Auth, Validation, Admin check)
│   ├── models/         # Mongoose Data Models (Schemas)
│   ├── routes/         # API Route definitions
│   ├── types/          # Custom TypeScript type definitions
│   ├── utils/          # Utility functions (JWT helpers, etc.)
│   ├── validators/     # Zod schemas for input validation
│   ├── app.ts          # App configuration and middleware setup
│   └── server.ts       # Entry point, server startup
├── .env.example        # Example environment variables
├── package.json        # Project metadata and dependencies
└── tsconfig.json       # TypeScript configuration
```

## core Components

### 1. Controllers
Controllers handle the incoming requests, interact with the database via Models, and send responses. They contain the core business logic.

### 2. Models
Defined using Mongoose, models represent the data structure in MongoDB. They enforce schema constraints (though Zod is used for input validation).

### 3. Middlewares
- **auth.middleware**: Verifies JWT tokens to protect routes.
- **admin.middleware**: restricts access to admin-only routes.
- **validate**: Generic middleware to validate request body against Zod schemas.

### 4. Routes
Route files define the API endpoints and map them to specific controllers and middlewares.
