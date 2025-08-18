# Backend API - MVC Architecture

Simple Express.js backend with MVC (Model-View-Controller) structure.

## Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Authentication & validation
├── models/          # Database schemas
├── routes/          # API endpoints
└── index.ts         # Main server file
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Features

- ✅ Express.js server
- ✅ TypeScript support
- ✅ MVC architecture
- ✅ MongoDB integration (optional)
- ✅ CORS enabled
- ✅ Environment configuration 