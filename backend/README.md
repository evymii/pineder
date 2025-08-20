# Backend API for Pineder

This is the backend API server for the Pineder mentoring platform, built with Express.js, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB running locally or accessible via connection string

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=5555
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mentoring_platform
ZOOM_API_KEY=your_zoom_api_key_here
ZOOM_API_SECRET=your_zoom_api_secret_here
ZOOM_ACCOUNT_ID=your_zoom_account_id_here
```

### Running the Backend

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

## 🔗 Frontend Integration

The backend is configured to work seamlessly with the Next.js frontend:

- **API Base URL**: `http://localhost:5555`
- **CORS**: Configured to allow frontend at `http://localhost:3000`
- **Health Check**: Available at `/health`

## 📡 API Endpoints

### Core Routes

- `/api/users` - User management
- `/api/mentors` - Mentor profiles and search
- `/api/students` - Student management
- `/api/sessions` - 1-on-1 sessions
- `/api/group-sessions` - Group session management
- `/api/communities` - Community features
- `/api/payments` - Payment processing

### Health & Status

- `/` - API info
- `/health` - Health check

## 🧪 Testing Connection

Test if your backend is running:

```bash
node test-connection.js
```

## 🔧 Development

The backend uses:

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📱 Frontend Connection

Your frontend is already configured to connect to this backend via:

- `frontend/src/core/lib/constants/index.ts` - API base URL
- `frontend/src/core/lib/api/backendService.ts` - Backend service
- `frontend/src/core/lib/api/index.ts` - API client

The frontend will automatically connect to `http://localhost:5555` when you run both services.
