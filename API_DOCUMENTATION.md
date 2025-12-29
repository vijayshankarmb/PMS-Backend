# Project Management System - Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Models](#database-models)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Endpoints](#api-endpoints)
7. [Request/Response Examples](#requestresponse-examples)
8. [Error Handling](#error-handling)
9. [Environment Variables](#environment-variables)
10. [Getting Started](#getting-started)

---

## Overview

This is a RESTful API backend for a Project Management System built with Node.js, Express, TypeScript, and MongoDB. The system supports role-based access control (RBAC) with two user roles: **Admin** and **User**.

### Key Features
- User authentication with JWT tokens
- Role-based access control (Admin/User)
- Project management (CRUD operations)
- Task management with assignment capabilities
- Task status tracking (pending, in-progress, completed)
- Secure password hashing with bcrypt
- Request validation using Zod schemas
- Cookie-based authentication

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime environment |
| **TypeScript** | ^5.9.3 | Type-safe JavaScript |
| **Express** | ^5.2.1 | Web framework |
| **MongoDB** | - | Database |
| **Mongoose** | ^9.0.2 | MongoDB ODM |
| **JWT** | ^9.0.3 | Authentication tokens |
| **Bcrypt.js** | ^3.0.3 | Password hashing |
| **Zod** | ^4.2.1 | Schema validation |
| **CORS** | ^2.8.5 | Cross-origin requests |
| **Cookie Parser** | ^1.4.7 | Cookie handling |
| **Dotenv** | ^17.2.3 | Environment variables |

---

## Architecture

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # Database connection
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── user.controller.ts    # User management
│   │   ├── project.controller.ts # Project CRUD
│   │   └── task.controller.ts    # Task CRUD
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── admin.middleware.ts   # Admin authorization
│   │   ├── taskAccess.middleware.ts # Task access control
│   │   └── validate.ts           # Request validation
│   ├── models/
│   │   ├── User.model.ts         # User schema
│   │   ├── Project.model.ts      # Project schema
│   │   └── Task.model.ts         # Task schema
│   ├── routes/
│   │   ├── auth.routes.ts        # Auth endpoints
│   │   ├── user.routes.ts        # User endpoints
│   │   ├── project.routes.ts     # Project endpoints
│   │   └── task.routes.ts        # Task endpoints
│   ├── types/
│   │   └── auth.ts               # TypeScript interfaces
│   ├── utils/
│   │   ├── hash.ts               # Password hashing utilities
│   │   └── jwt.ts                # JWT utilities
│   ├── validators/
│   │   ├── auth.schema.ts        # Auth validation schemas
│   │   ├── project.schema.ts     # Project validation schemas
│   │   └── task.schema.ts        # Task validation schemas
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── .env                          # Environment variables
├── package.json
└── tsconfig.json
```

### Middleware Flow
```
Request → CORS → JSON Parser → Cookie Parser → Route Handler → 
Auth Middleware → Role Middleware → Validation → Controller → Response
```

---

## Database Models

### 1. User Model
**Collection:** `users`

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `name` | String | Yes | No | - | User's full name (3-50 chars) |
| `email` | String | Yes | Yes | - | User's email address |
| `password` | String | Yes | No | - | Hashed password (select: false) |
| `role` | String | Yes | No | 'user' | User role: 'admin' or 'user' |
| `createdAt` | Date | Auto | No | - | Timestamp of creation |
| `updatedAt` | Date | Auto | No | - | Timestamp of last update |

**Indexes:** Unique index on `email`

---

### 2. Project Model
**Collection:** `projects`

| Field | Type | Required | Reference | Description |
|-------|------|----------|-----------|-------------|
| `projectName` | String | Yes | - | Name of the project |
| `projectDescription` | String | Yes | - | Detailed project description |
| `createdBy` | ObjectId | Yes | User | Admin who created the project |
| `createdAt` | Date | Auto | - | Timestamp of creation |
| `updatedAt` | Date | Auto | - | Timestamp of last update |

**Relationships:**
- `createdBy` references `User` model (Admin only)

---

### 3. Task Model
**Collection:** `tasks`

| Field | Type | Required | Reference | Default | Description |
|-------|------|----------|-----------|---------|-------------|
| `taskName` | String | Yes | - | - | Name of the task |
| `taskDescription` | String | Yes | - | - | Detailed task description |
| `projectId` | ObjectId | Yes | Project | - | Associated project |
| `assignedTo` | ObjectId | Yes | User | - | User assigned to the task |
| `status` | String | Yes | - | 'pending' | Task status: 'pending', 'in-progress', 'completed' |
| `createdBy` | ObjectId | Yes | User | - | Admin who created the task |
| `createdAt` | Date | Auto | - | - | Timestamp of creation |
| `updatedAt` | Date | Auto | - | - | Timestamp of last update |

**Relationships:**
- `projectId` references `Project` model
- `assignedTo` references `User` model
- `createdBy` references `User` model (Admin only)

---

## Authentication & Authorization

### Authentication Flow
1. User signs up or logs in with credentials
2. Server validates credentials and generates JWT token
3. Token is stored in HTTP-only cookie
4. Client sends cookie with subsequent requests
5. Server verifies token and extracts user info

### JWT Token Payload
```typescript
{
  userId: string,    // MongoDB ObjectId
  role: string,      // 'admin' or 'user'
  iat: number,       // Issued at timestamp
  exp: number        // Expiration timestamp (7 days)
}
```

### Cookie Configuration
```typescript
{
  httpOnly: true,    // Prevents XSS attacks
  secure: true,      // HTTPS only
  sameSite: 'strict' // CSRF protection
}
```

### Authorization Levels

| Role | Permissions |
|------|-------------|
| **Admin** | - Create/update/delete projects<br>- Create/update/delete tasks<br>- Assign tasks to users<br>- View all projects and tasks they created<br>- View all users |
| **User** | - View tasks assigned to them<br>- Update status of their assigned tasks<br>- View task details for their tasks |

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

### Authentication Endpoints

#### 1. User Signup
**POST** `/auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "name": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "role": "admin | user (optional, default: user)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email is already registered"
}
```

---

#### 2. User Login
**POST** `/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Note:** Sets HTTP-only cookie named `token` with JWT

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User
**GET** `/auth/me`

**Access:** Protected (Authenticated users)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "role": "string"
  }
}
```

---

### User Endpoints

#### 1. Get All Users
**GET** `/users/`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  ]
}
```

**Note:** Returns users sorted by creation date (newest first)

---

### Project Endpoints

#### 1. Create Project
**POST** `/projects/`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Request Body:**
```json
{
  "projectName": "string (required)",
  "projectDescription": "string (required)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "string",
    "projectName": "string",
    "projectDescription": "string",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

#### 2. Get All Projects
**GET** `/projects/`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": [
    {
      "_id": "string",
      "projectName": "string",
      "projectDescription": "string",
      "createdBy": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Note:** Returns only projects created by the authenticated admin, sorted by creation date (newest first)

---

#### 3. Get Project by ID
**GET** `/projects/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Project ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "projectName": "string",
    "projectDescription": "string",
    "createdBy": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

---

#### 4. Update Project
**PUT** `/projects/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Project ObjectId

**Request Body:**
```json
{
  "projectName": "string (optional)",
  "projectDescription": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "_id": "string",
    "projectName": "string",
    "projectDescription": "string",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Note:** Only the admin who created the project can update it

---

#### 5. Delete Project
**DELETE** `/projects/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Project ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

**Note:** Only the admin who created the project can delete it

---

### Task Endpoints

#### 1. Create Task
**POST** `/tasks/`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Request Body:**
```json
{
  "taskName": "string (min 3 chars)",
  "taskDescription": "string (min 5 chars)",
  "projectId": "string (valid ObjectId)",
  "assignedTo": "string (valid User ObjectId)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "taskName": "string",
    "taskDescription": "string",
    "projectId": "string",
    "assignedTo": "string",
    "status": "pending",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Note:** Admin can only create tasks for projects they created

---

#### 2. Get All Tasks
**GET** `/tasks/`

**Access:** Protected (All authenticated users)

**Headers:**
```
Cookie: token=<jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "taskName": "string",
      "taskDescription": "string",
      "projectId": {
        "_id": "string",
        "projectName": "string"
      },
      "assignedTo": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "status": "pending | in-progress | completed",
      "createdBy": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Behavior:**
- **Admin:** Returns all tasks they created
- **User:** Returns only tasks assigned to them

---

#### 3. Get Task by ID
**GET** `/tasks/:id`

**Access:** Protected (Admin or assigned user)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Task ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "taskName": "string",
    "taskDescription": "string",
    "projectId": {
      "_id": "string",
      "projectName": "string"
    },
    "assignedTo": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "status": "string",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Forbidden, not authorized to access this task"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 4. Update Task
**PUT** `/tasks/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Task ObjectId

**Request Body:**
```json
{
  "taskName": "string (min 3 chars, optional)",
  "taskDescription": "string (min 5 chars, optional)",
  "assignedTo": "string (valid User ObjectId, optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "taskName": "string",
    "taskDescription": "string",
    "projectId": "string",
    "assignedTo": "string",
    "status": "string",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Note:** Only the admin who created the task can update it

---

#### 5. Update Task Status
**PUT** `/tasks/status/:id`

**Access:** Protected (Admin or assigned user)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Task ObjectId

**Request Body:**
```json
{
  "status": "pending | in-progress | completed (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "taskName": "string",
    "taskDescription": "string",
    "projectId": "string",
    "assignedTo": "string",
    "status": "string",
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Note:** Both admin and assigned user can update task status

---

#### 6. Delete Task
**DELETE** `/tasks/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id` - Task ObjectId

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (404):**
```json
{
  "success": false
}
```

**Note:** Only the admin who created the task can delete it

---

## Request/Response Examples

### Example 1: Complete User Flow (Admin)

**Step 1: Signup as Admin**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Step 2: Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Step 3: Create Project**
```bash
POST /api/projects
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "projectName": "E-commerce Website",
  "projectDescription": "Build a full-stack e-commerce platform"
}
```

**Step 4: Create Task**
```bash
POST /api/tasks
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "taskName": "Design Homepage",
  "taskDescription": "Create wireframes and mockups for homepage",
  "projectId": "676f1234567890abcdef1234",
  "assignedTo": "676f1234567890abcdef5678"
}
```

---

### Example 2: Complete User Flow (Regular User)

**Step 1: Signup as User**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "jane123"
}
```

**Step 2: Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "jane123"
}
```

**Step 3: Get My Tasks**
```bash
GET /api/tasks
Cookie: token=<jwt_token>
```

**Step 4: Update Task Status**
```bash
PUT /api/tasks/status/676f1234567890abcdef9999
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error Response Format
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, invalid data |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side errors |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/project-management
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/project-management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Node Environment
NODE_ENV=development
```

### Environment Variable Descriptions

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port number | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/pms` |
| `JWT_SECRET` | Yes | Secret key for JWT signing | `my_secret_key_123` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

**1. Clone the repository**
```bash
cd backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment file**
```bash
# Create .env file and add required variables
cp .env.example .env
```

**4. Start MongoDB**
```bash
# If using local MongoDB
mongod
```

**5. Run the development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Starts dev server with hot reload |
| Build | `npm run build` | Compiles TypeScript to JavaScript |
| Production | `npm start` | Runs compiled JavaScript |

---

## Middleware Details

### 1. Authentication Middleware (`protect`)
**File:** `middlewares/auth.middleware.ts`

**Purpose:** Verifies JWT token from cookies

**Flow:**
1. Extracts token from `req.cookies.token`
2. Verifies token using JWT_SECRET
3. Decodes payload and attaches to `req.user`
4. Calls `next()` if valid
5. Returns 401 if invalid or missing

---

### 2. Admin Authorization Middleware (`authorizeAdmin`)
**File:** `middlewares/admin.middleware.ts`

**Purpose:** Ensures user has admin role

**Flow:**
1. Checks if `req.user.role === 'admin'`
2. Calls `next()` if admin
3. Returns 403 if not admin

---

### 3. Task Access Middleware (`taskAccess`)
**File:** `middlewares/taskAccess.middleware.ts`

**Purpose:** Validates user can access specific task

**Flow:**
1. Fetches task by ID from params
2. Returns 404 if task not found
3. Allows access if user is admin
4. Allows access if user is assigned to task
5. Returns 403 otherwise

---

### 4. Validation Middleware (`validate`)
**File:** `middlewares/validate.ts`

**Purpose:** Validates request body using Zod schemas

**Flow:**
1. Parses `req.body` with provided schema
2. Calls `next()` if valid
3. Returns 400 with formatted errors if invalid

---

## Validation Schemas

### Auth Schemas
```typescript
// Signup
{
  name: string (3-50 chars),
  email: valid email,
  password: string (min 6 chars),
  role: 'admin' | 'user' (optional, default: 'user')
}

// Login
{
  email: valid email,
  password: string (min 6 chars)
}
```

### Project Schemas
```typescript
// Create
{
  projectName: string (required),
  projectDescription: string (required)
}

// Update
{
  projectName: string (optional),
  projectDescription: string (optional)
}
```

### Task Schemas
```typescript
// Create
{
  taskName: string (min 3 chars),
  taskDescription: string (min 5 chars),
  projectId: string (ObjectId),
  assignedTo: string (ObjectId)
}

// Update
{
  taskName: string (min 3 chars, optional),
  taskDescription: string (min 5 chars, optional),
  assignedTo: string (ObjectId, optional)
}

// Update Status
{
  status: 'pending' | 'in-progress' | 'completed' (optional)
}
```

---

## Security Features

### 1. Password Security
- Passwords hashed using bcrypt with salt rounds of 10
- Passwords excluded from query results by default (`select: false`)
- Password comparison done using bcrypt's constant-time algorithm

### 2. JWT Security
- Tokens signed with secret key
- 7-day expiration
- Stored in HTTP-only cookies (prevents XSS)
- Secure flag enabled (HTTPS only)
- SameSite strict (prevents CSRF)

### 3. Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- Middleware chain for layered security

### 4. Input Validation
- All inputs validated using Zod schemas
- Type checking with TypeScript
- Sanitization through Mongoose schemas

---

## Common Frontend Integration Patterns

### 1. Setting up Axios with Credentials
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Important: sends cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### 2. Login Example
```javascript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    // Cookie is automatically stored by browser
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
};
```

### 3. Protected Request Example
```javascript
const getProjects = async () => {
  try {
    // Cookie is automatically sent
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      // Redirect to login
    }
  }
};
```

### 4. Handling Validation Errors
```javascript
const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    if (error.response.status === 400) {
      // Display validation errors
      const errors = error.response.data.errors;
      errors.forEach(err => {
        console.log(`${err.field}: ${err.message}`);
      });
    }
  }
};
```

---

## Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"admin"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Projects (with cookie):**
```bash
curl -X GET http://localhost:5000/api/projects \
  -b cookies.txt
```

### Using Postman

1. **Enable Cookie Handling:**
   - Settings → General → Enable "Automatically follow redirects"
   - Settings → General → Enable "Send cookies"

2. **Login Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body: raw JSON
   - Cookie will be automatically saved

3. **Subsequent Requests:**
   - Cookies are automatically sent
   - No need to manually add Authorization header

---

## Troubleshooting

### Common Issues

**1. "Unauthorized, token is missing"**
- Ensure cookies are being sent with requests
- Check `withCredentials: true` in frontend
- Verify CORS configuration allows credentials

**2. "Email is already registered"**
- User with that email already exists
- Use different email or login instead

**3. "Forbidden, admin access required"**
- Endpoint requires admin role
- Check user role in database
- Ensure you're logged in as admin

**4. "Project not found"**
- Invalid project ID
- Project doesn't belong to current admin
- Project may have been deleted

**5. "Task not found" or "Forbidden"**
- Task doesn't exist
- User not assigned to task (for regular users)
- Task doesn't belong to admin (for admins)

**6. MongoDB Connection Error**
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check network connectivity (for Atlas)

---

## API Response Patterns

### Success Pattern
All successful responses follow this structure:
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* Response data */ }
}
```

### Error Pattern
All error responses follow this structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* Optional validation errors */ ]
}
```

---

## Future Enhancements (Suggestions)

1. **Pagination:** Add pagination to GET endpoints
2. **Search & Filters:** Add query parameters for filtering
3. **File Uploads:** Support for project/task attachments
4. **Comments:** Add commenting system for tasks
5. **Notifications:** Real-time notifications for task updates
6. **Email:** Email notifications for task assignments
7. **Audit Logs:** Track all changes to projects/tasks
8. **Soft Delete:** Implement soft delete instead of hard delete
9. **Task Dependencies:** Link tasks with dependencies
10. **Time Tracking:** Add time tracking for tasks

---

## Contact & Support

For questions or issues related to this backend API, please contact the development team.

**Last Updated:** December 29, 2025
**Version:** 1.0.0
**Author:** Vijay

---

## Appendix

### Quick Reference: All Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/users` | Admin | Get all users |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects` | Admin | Get all projects |
| GET | `/api/projects/:id` | Admin | Get project by ID |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks` | Protected | Get tasks |
| GET | `/api/tasks/:id` | Protected | Get task by ID |
| PUT | `/api/tasks/:id` | Admin | Update task |
| PUT | `/api/tasks/status/:id` | Protected | Update task status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

---

**End of Documentation**
