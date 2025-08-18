#!/bin/bash

echo "🚀 Setting up Pineder..."
echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
  echo "# Environment variables for Pineder" > .env.local
  echo "NEXT_PUBLIC_APP_NAME=Pineder" >> .env.local
  echo "✅ Created .env.local file"
else
  echo "⚠️  .env.local already exists, skipping creation"
fi

echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

echo "🚀 Starting development server..."
npm run dev 