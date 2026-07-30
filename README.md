```markdown
# 🚀 MyApp Backend API

A production-ready, secure REST API backend built with Node.js, Express, and PostgreSQL on Supabase. Features JWT authentication, email verification, password reset, audit logging, and more.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Email](#email)
  - [Health](#health)
- [API Testing](#-api-testing)
- [Project Structure](#-project-structure)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- ✅ **User Authentication** - Register, Login, Logout
- ✅ **JWT Tokens** - Access tokens (15min) + Refresh tokens (7 days)
- ✅ **Email Verification** - Verify email addresses with secure tokens
- ✅ **Password Reset** - Forgot password flow with email
- ✅ **Profile Management** - Update user details and password
- ✅ **Session Management** - Track and manage user sessions
- ✅ **Audit Logging** - Track all user actions

### Security
- 🔒 **Password Hashing** - Bcrypt with configurable rounds
- 🔒 **Rate Limiting** - Prevent brute force attacks
- 🔒 **Helmet.js** - Secure HTTP headers
- 🔒 **CORS Protection** - Configurable origins
- 🔒 **Input Validation** - Joi schema validation
- 🔒 **SQL Injection Protection** - Parameterized queries
- 🔒 **Refresh Token Rotation** - Secure token lifecycle

### Quality of Life
- 📝 **Swagger/OpenAPI** - Interactive API documentation
- 📊 **Health Checks** - Liveness, readiness, and detailed health
- 📈 **Request Logging** - Winston + Morgan logging
- 🎯 **Error Handling** - Global error handler with specific errors
- 🔍 **Request Correlation** - Request IDs for tracing
- 📦 **Database Migrations** - Version controlled schema

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15 (Supabase)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Bcrypt
- **Validation**: Joi
- **Logging**: Winston + Morgan
- **Email**: Nodemailer
- **Documentation**: Swagger UI + OpenAPI

### Development
- **Testing**: Jest + Supertest
- **Linting**: ESLint
- **Hot Reload**: Nodemon
- **Process Manager**: PM2 (production)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 15 or higher (or Supabase account)
- npm 8.x or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/myapp-backend.git
cd myapp-backend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Set up database (Supabase recommended)
   · Create a Supabase project
   · Get your database credentials
   · Update .env with your Supabase details
5. Run database migrations

```bash
npm run migrate
```

Environment Setup

Create a .env file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Database (Supabase)
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com

# Frontend URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3000
```

Database Setup

1. Create migrations directory (if not exists)

```bash
mkdir -p migrations
```

2. Create initial migration

```bash
# Copy the schema from sql/schema.sql to migrations/001_initial_schema.sql
cp sql/schema.sql migrations/001_initial_schema.sql
```

3. Run migrations

```bash
npm run migrate
```

4. Verify database connection

```bash
curl http://localhost:3000/health
```

Running the Server

Development Mode

```bash
# With hot reload
npm run dev

# Without hot reload
npm start
```

Production Mode

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name myapp-backend

# View logs
pm2 logs myapp-backend

# Stop server
pm2 stop myapp-backend
```

📚 API Documentation

Base URL

```
http://localhost:3000
```

Response Format

All endpoints return a consistent response format:

Success Response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }  // Optional
}
```

Error Response:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [  // Optional validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Authentication

Method Endpoint Description Auth Required
POST /api/auth/register Register new user ❌
POST /api/auth/login Login user ❌
POST /api/auth/refresh Refresh access token ✅
POST /api/auth/logout Logout user ✅
POST /api/auth/logout-all Logout from all devices ✅

Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Refresh Token

```http
POST /api/auth/refresh
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "{refreshToken}"
}
```

Response:

```json
{
  "success": true,
  "message": "Tokens refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Users

Method Endpoint Description Auth Required
GET /api/users/me Get current user profile ✅
PATCH /api/users/me Update user profile ✅
DELETE /api/users/me Delete user account ✅

Get Profile

```http
GET /api/users/me
Authorization: Bearer {accessToken}
```

Response:

```json
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_email_verified": false,
      "is_active": true,
      "last_login": "2026-07-31T00:40:00.000Z",
      "created_at": "2026-07-31T00:35:00.000Z",
      "updated_at": "2026-07-31T00:40:00.000Z"
    }
  }
}
```

Update Profile

```http
PATCH /api/users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "currentPassword": "Secure@123456",  // Required for password change
  "newPassword": "NewSecure@789"       // Optional
}
```

Email

Method Endpoint Description Auth Required
POST /api/email/verify-email/request Request verification email ✅
POST /api/email/verify-email Verify email with token ❌
POST /api/email/forgot-password Request password reset ❌
POST /api/email/reset-password Reset password with token ❌

Request Email Verification

```http
POST /api/email/verify-email/request
Authorization: Bearer {accessToken}
```

Verify Email

```http
POST /api/email/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

Forgot Password

```http
POST /api/email/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Reset Password

```http
POST /api/email/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewSecure@123"
}
```

Health Checks

Method Endpoint Description
GET /health Detailed health status
GET /health/live Liveness probe
GET /health/ready Readiness probe

Health Check

```http
GET /health
```

Response:

```json
{
  "success": true,
  "message": "Health check",
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-31T00:40:00.000Z",
    "uptime": 123.45,
    "version": "1.0.0",
    "services": {
      "database": "connected"
    },
    "system": {
      "memory": {
        "total": 17179869184,
        "free": 8589934592,
        "usage": "50.00%"
      },
      "cpu": 8,
      "load": [1.2, 0.8, 0.5]
    }
  }
}
```

API Documentation (Swagger)

Access the interactive API documentation:

```
http://localhost:3000/api-docs
```

🧪 API Testing

Quick Test Script

Create test-api.sh:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Testing MyApp Backend API ===${NC}"

# 1. Health Check
echo -e "\n${YELLOW}Testing Health Check...${NC}"
curl -s -X GET $BASE_URL/health | jq '.'

# 2. Register
echo -e "\n${YELLOW}Testing Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "ApiTest@123",
    "firstName": "API",
    "lastName": "Tester"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 3. Login
echo -e "\n${YELLOW}Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "ApiTest@123"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo $LOGIN_RESPONSE | jq '.'

# 4. Get Profile
echo -e "\n${YELLOW}Testing Get Profile...${NC}"
curl -s -X GET $BASE_URL/api/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

# 5. Update Profile
echo -e "\n${YELLOW}Testing Update Profile...${NC}"
curl -s -X PATCH $BASE_URL/api/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Tester"
  }' | jq '.'

echo -e "\n${GREEN}✅ All tests completed!${NC}"
```

Run the tests:

```bash
chmod +x test-api.sh
./test-api.sh
```

Testing with Postman

1. Import the Postman collection (create from the API docs)
2. Set environment variables:
   · base_url: http://localhost:3000
   · access_token: (auto-filled from login)
   · refresh_token: (auto-filled from login)

📁 Project Structure

```
MyAppBackend/
│
├── server.js                 # Application entry point
├── app.js                    # Express app configuration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .env.example              # Environment variables template
│
├── config/                   # Configuration files
│   ├── database.js           # Database connection
│   ├── cors.js               # CORS configuration
│   ├── swagger.js            # Swagger/OpenAPI config
│   └── env.js               # Environment validation
│
├── controllers/              # Request handlers
│   ├── authController.js     # Authentication endpoints
│   ├── userController.js     # User management
│   └── emailController.js    # Email endpoints
│
├── services/                 # Business logic
│   ├── authService.js        # Authentication logic
│   ├── tokenService.js       # JWT token management
│   ├── passwordService.js    # Password hashing
│   └── emailService.js       # Email sending
│
├── models/                   # Database models
│   └── userModel.js          # User database operations
│
├── routes/                   # API routes
│   ├── auth.js               # Authentication routes
│   ├── users.js              # User routes
│   ├── email.js              # Email routes
│   ├── health.js             # Health check routes
│   └── docs.js               # Swagger documentation routes
│
├── middleware/               # Custom middleware
│   ├── auth.js               # JWT authentication
│   ├── validate.js           # Request validation
│   ├── errorHandler.js       # Global error handling
│   ├── audit.js              # Audit logging
│   ├── requestId.js          # Request ID generation
│   └── security.js           # Security headers
│
├── validations/              # Joi validation schemas
│   ├── authValidation.js     # Auth validations
│   ├── userValidation.js     # User validations
│   └── emailValidation.js    # Email validations
│
├── utils/                    # Utility functions
│   ├── response.js           # Standardized responses
│   ├── logger.js             # Winston logger
│   └── migration.js          # Database migrations
│
├── sql/                      # SQL files
│   └── schema.sql            # Database schema
│
├── migrations/               # Migration files
│   └── 001_initial_schema.sql # Initial schema
│
├── scripts/                  # Utility scripts
│   └── run-migrations.js     # Run migrations script
│
├── logs/                     # Application logs (gitignored)
│   ├── error.log
│   └── all.log
│
├── test/                     # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── README.md                 # This file
```

🔒 Security Features

Password Requirements

· Minimum 8 characters
· At least one uppercase letter
· At least one lowercase letter
· At least one number
· At least one special character (@$!%*?&)

Token Strategy

· Access Token: Short-lived (15 minutes)
· Refresh Token: Long-lived (7 days)
· Refresh Token Rotation: New refresh token on each refresh
· One-Time Use: Refresh tokens invalidated after use

Protection Against

· ✅ SQL Injection (Parameterized queries)
· ✅ XSS Attacks (Helmet.js)
· ✅ CSRF (SameSite cookies)
· ✅ Brute Force (Rate limiting)
· ✅ Session Fixation (JWT rotation)
· ✅ MITM (HTTPS/SSL enforced)
· ✅ Replay Attacks (Token expiry)

Rate Limiting

· Default: 100 requests per 15 minutes per IP
· Configurable: Via environment variables
· Response: 429 Too Many Requests

Security Headers

```http
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

🚢 Deployment

Docker Deployment

1. Build Docker image

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run migrate

EXPOSE 3000
CMD ["node", "server.js"]
```

2. Build and run

```bash
docker build -t myapp-backend .
docker run -p 3000:3000 --env-file .env myapp-backend
```

Supabase Deployment

1. Deploy to Supabase
   · Use Supabase for database hosting
   · Deploy Node.js app to Railway or Vercel
   · Update environment variables
2. Environment Variables

```env
# Production
NODE_ENV=production
PORT=3000

# Supabase connection
DB_HOST=your-project.supabase.co
DB_PASSWORD=your-password

# Email (production)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

Render.com Deployment

1. Create render.yaml

```yaml
services:
  - type: web
    name: myapp-backend
    env: node
    buildCommand: npm install && npm run migrate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: myapp-db
          property: connectionString
```

2. Deploy

```bash
# Push to GitHub
git push origin main

# Connect repository to Render
# Automatic deployment on push
```

📊 Database Schema

Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);
```

Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  changes JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Email Verification Table

```sql
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Password Reset Table

```sql
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

🤝 Contributing

1. Fork the repository

```bash
git clone https://github.com/yourusername/myapp-backend.git
cd myapp-backend
```

2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes

```bash
# Install dependencies
npm install

# Run tests
npm test

# Lint your code
npm run lint

# Fix linting issues
npm run lint:fix
```

4. Commit your changes

```bash
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

5. Open a Pull Request

Code Style

· Use ESLint configuration
· Follow REST API conventions
· Write meaningful commit messages
· Add tests for new features
· Update documentation

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments

· Express.js - Web framework
· Supabase - PostgreSQL hosting
· JWT - Authentication
· Winston - Logging
· All other open-source packages used

📧 Contact

· Author: Your Name
· Email: your.email@example.com
· GitHub: @yourusername

---

⭐ Support

If you find this project helpful, please give it a ⭐ on GitHub!

🗺️ Roadmap

· Two-factor authentication
· OAuth providers (Google, GitHub)
· WebSocket support
· File uploads
· Email templates
· Admin dashboard
· User roles and permissions
· Advanced search and filtering
· Caching with Redis
· Job queues (BullMQ)
· Performance monitoring
· Mobile push notifications

📚 Additional Resources

· API Documentation
· Postman Collection
· Supabase Documentation
· JWT Best Practices

---

Made with ❤️ by [Your Name]

https://img.shields.io/github/stars/yourusername/myapp-backend?style=social
https://img.shields.io/github/forks/yourusername/myapp-backend?style=social

```

This README provides:
- Complete project overview
- Detailed setup instructions
- Full API documentation
- Security features
- Deployment guides
- Database schema
- Contributing guidelines
- Roadmap and future plansv
It's formatted for GitHub with proper markdown, badges, and sections that make it easy to navigate.
