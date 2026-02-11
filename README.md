# Zignute_task

## Overview

This project is a Node.js + Express based REST API that implements user and admin functionality along with security features such as IP rate limiting, dynamic user-based throttling, and Redis-backed abuse protection.

The system supports authentication, profile management, product management, and subscription-based rate limits.

---

## Setup Instructions

1. Install dependencies

npm install

2. Configure environment variables

Create `.env` file with:

PORT=6000
DB_URL=<mongodb_connection_string>

# Admin credentials

ADMIN_EMAIL=<value>
ADMIN_PASSWORD=<value>

# Rate Limiting Configuration

FREE_USER_MAX_REQUESTS=100
PREMIUM_USER_MAX_REQUESTS=1000
MAX_REQUESTS_PER_IP=200
LOGIN_RETRY_LIMIT=10

3. Start Redis (required for rate limiting)

redis-server

4. Run the application

npm start

When the app starts:

- Admin account is initialized automatically
- Static folders are created
- Database seeds are applied

---

## Features Implemented

### Authentication

- User Signup
- User Login
- Logout
- Change Password
- Update Profile
- Get Profile

### Admin Capabilities

- View user list
- View product list
- Create/manage products

Admin credentials are defined in the `.env` file.

---

### User Capabilities

- Profile management
- Product list access
- Subscription purchase
- Dynamic rate-limited API usage

---

## Rate Limiting & Security

### 1️⃣ IP Based Rate Limiting

Configured in `app.js`

- Applied globally before routes
- Uses Redis-backed limiter
- Prevents abuse at network level

Logic:

- Whitelisted IPs bypass limits
- Blacklisted IPs are blocked
- Admin routes bypass IP throttling

---

### 2️⃣ Dynamic User Rate Limiting

Applied on authenticated routes.

Based on subscription:

| User Type | Limit        |
| --------- | ------------ |
| Free User | 100 req/min  |
| Paid User | 1000 req/min |

### 3️⃣ Login Protection

- Separate limiter for:

/signup
/login

---

### 4️⃣ Abuse Blocking

Inside limiter logic:

- Violations tracked in Redis
- After threshold exceeded:
  - IP temporarily blocked
  - Block state stored in Redis
  - Auto-expiry applied

---

### 5️⃣ Whitelist / Blacklist

Configured in constants file.

- Whitelist → skip limits
- Blacklist → immediate access denied

---

## Logging

Custom Winston loggers:

- Activity logs
- Error logs

Supports metadata like:

- userId
- route
- timestamp

---

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Redis
- rate-limiter-flexible
- Winston
- Multer
- JWT/Auth Middleware

---

## Architecture Highlights

- Middleware-first security
- Redis-backed distributed throttling
- Tier-based dynamic rate limiting
- Separation of concerns (helpers/middlewares/routes)
- Scalable limiter factory pattern

## Sample API Usage

Below is an example request demonstrating how to call authenticated endpoints.

Get User Profile

- Request
- POST localhost:3000/api/v1/user/login
- GET http://localhost:3000/api/v1/user/get-profile
- POST localhost:3000/api/v1/admin/user-list
- POST localhost:3000/api/v1/admin/sign-in

## Headers

- Authorization: Bearer <JWT_TOKEN>
- Content-Type: application/json
