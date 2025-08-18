#!/bin/bash

echo "🚀 Starting Backend Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please update .env with your configuration values"
fi

# Check if MongoDB is running (basic check)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't seem to be running"
    echo "   Please start MongoDB first:"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
    echo "   - Windows: net start MongoDB"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server
echo "🔥 Starting development server..."
npm run dev 