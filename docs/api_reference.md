# API Reference

Base URL: `/api`

## Authentication (`/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/signup` | Register a new user | Public |
| POST | `/login` | Login user and get token | Public |
| POST | `/logout` | Logout user (clear cookies) | Private |
| GET | `/me` | Get current logged-in user details | Private |

## Users (`/users`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get list of all users | Admin Only |

## Projects (`/projects`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get all projects | Admin Only |
| GET | `/:id` | Get specific project details | Admin Only |
| POST | `/` | Create a new project | Admin Only |
| PUT | `/:id` | Update a project | Admin Only |
| DELETE | `/:id` | Delete a project | Admin Only |

## Tasks (`/tasks`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get list of tasks | Private |
| GET | `/:id` | Get specific task details | Private (Access Check) |
| POST | `/` | Create a new task | Admin Only |
| PUT | `/status/:id` | Update task status | Private (Access Check) |
| PUT | `/:id` | Update task details | Admin (Access Check) |
| DELETE | `/:id` | Delete a task | Admin (Access Check) |

### Notes
- **Private**: Requires a valid JWT token in cookies.
- **Admin Only**: User role must be 'admin'.
- **Access Check**: Additional checks (like whether the user is assigned to the task/project).
