# PrimeTrade AI - Task Management System

A Scalable REST API with Authentication & Role-Based Access, featuring a Next.js (App Router) full-stack application and MongoDB.

## Features
- **Backend (Next.js Application API routes)**
  - Registration & Login APIs
  - Custom JWT Authentication & Password Hashing via `bcryptjs`
  - Granular Role-Based Access Control (Admins vs. Users)
  - Full CRUD operations for "Tasks" Entity
  - Swagger JSON API documentation
- **Frontend (React)**
  - Beautiful, dynamic, modern UI built with vanilla CSS
  - Role-protected Dashboard route
  - Custom UI notifications & success states

## Getting Started

### Prerequisites
- Node.js > 18.x
- MongoDB (Local or MongoDB Atlas)

### Installation
1. Clone this repository
2. Run `npm install`
3. Make sure `.env` is configured correctly:
```env
MONGODB_URI=XXXXXX
JWT_SECRET=XXXXXXX
```

### Running the application
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Testing API Reference

Navigate to `http://localhost:3000/docs` to view the interactive Swagger Documentation UI for the API.
