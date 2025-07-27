#!/bin/bash

echo "🚀 Starting Remult Auth System..."

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please create it first."
    exit 1
fi

# Проверяем установлены ли зависимости
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔍 Testing connections..."
npm run test-connections

if [ $? -ne 0 ]; then
    echo "❌ Connection test failed. Please check your configuration."
    exit 1
fi

echo "🗄️  Running database migration..."
npm run migrate

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check your database setup."
    exit 1
fi

echo "✅ All checks passed! Starting development server..."
npm run dev