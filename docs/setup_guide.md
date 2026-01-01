# Setup Guide

Follow these steps to set up and run the Project Management System Backend.

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud Atlas instance)

## Installation

1. **Clone the Repository**
   (If you haven't already)
   ```bash
   git clone <repository_url>
   cd backend
   ```

2. **Install Dependencies**
   Install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory by copying the example file:
   ```bash
   cp .env.example .env
   # OR on Windows Command Prompt
   copy .env.example .env
   ```
   
   Open `.env` and fill in your specific configurations:
   - `PORT`: Port server will run on (default 5000).
   - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/pms_db`).
   - `JWT_SECRET`: A strong secret string for signing tokens.

## Running the Application

### Development Mode
To run the server with hot-reloading (server restarts on file changes):
```bash
npm run dev
```

### Production Build
To build the TypeScript code into JavaScript and run it:
```bash
npm run build
npm start
```

## Troubleshooting

- **MongoDB Connection Error**: Ensure your MongoDB service is running locally (`mongod` command) or your Atlas URI is correct and your IP is whitelisted.
- **Port In Use**: If port 5000 is taken, change the `PORT` variable in your `.env` file.
