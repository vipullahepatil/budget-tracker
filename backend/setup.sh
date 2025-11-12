#!/usr/bin/env bash
echo "🔧 Setting up backend environment..."

set -o errexit  # exit on first error

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
echo "🗃️ Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "📂 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Backend setup complete."
