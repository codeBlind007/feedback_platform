# Customer Feedback Platform

A full-stack customer feedback management platform that allows users to submit feedback and enables administrators to manage, analyze, and respond to feedback through a dedicated dashboard.

---
## Demo Credentials

* For Admin (There is only one admin because "user" role assigned to new account by default. Use this admin credentials for demo) - 
    email : admin@gmail.com
    password : 123456

* For User - 
    email : test1@gmail.com
    password : 123456

---
## Features

### User Features

* User Registration
* User Login
* JWT Authentication (HTTP-only Cookies)
* Submit Feedback
* Select Feedback Category
* Add Comments

### Admin Features

* Admin Login
* Analytics Dashboard
* Total Feedback Count
* Category-wise Distribution
* Status-wise Distribution
* Recent Feedback Submissions
* Search Feedback
* Filter by Category
* Filter by Status
* Respond to Feedback
* Update Feedback Status

---

## Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI
* TanStack Query
* React Hook Form
* Zod
* Recharts

### Backend

* Node.js
* Express.js
* PostgreSQL
* Neon Database
* JWT Authentication
* Winston Logging

---

## Project Structure

### Frontend

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── feedback/
│   │   └── admin/
│   ├── providers/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── lib/
└── public/
```

### Backend

```text
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   └── feedback/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── routes/
├── logs/
└── database/
```

---

## Authentication Flow

* Users and Admins authenticate using email and password.
* JWT tokens are stored in HTTP-only cookies.
* Role-based access control is implemented.
* Frontend determines access using the authenticated user endpoint.

Roles:

* User
* Admin

---

## Feedback Categories

* bug_report
* feature_request
* general_feedback
* complaint
* suggestion

---

## Analytics

The admin dashboard provides:

* Total Feedback Count
* Category Distribution
* Status Distribution
* Recent Feedback Activity

Analytics are visualized using Recharts.

---

## API Overview

### Authentication

```http
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/user
```

### Feedback

```http
POST  /api/v1/feedback
GET   /api/v1/feedback/all-feedbacks
GET   /api/v1/feedback/analytics
PATCH /api/v1/feedback/:id/respond
```

---

## Environment Variables

### Backend

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=
```

### Frontend

Create a `.env.local` file inside the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:PORT/api/v1
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd customer-feedback-platform
```

---

### Backend Setup

```bash
cd backend

npm install
```

Configure environment variables.

Run database migrations and create required tables.

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Configure environment variables.

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Logging

Structured logging is implemented using Winston.

Logged events include:

* Authentication events
* Feedback creation
* Feedback responses
* Request logging
* Application errors

Log files:

```text
logs/app.log
logs/error.log
```

---

## Production Readiness

Implemented:

* Environment Variables
* Input Validation
* Error Handling
* JWT Authentication
* Role-Based Authorization
* Structured Logging
* Health Check Endpoint

Planned:

* Unit Tests
* Monitoring
* Observability
* Rate Limiting
* CI/CD Pipeline

---

## Future Improvements

* Notification System
* Multi-Admin Collaboration
* Response History
* Audit Logs
* Two-Factor Authentication
* Monitoring & Observability
* Automated Testing
* Rate Limiting
* CI/CD
* Advanced Analytics

---

## Author

Kartik
