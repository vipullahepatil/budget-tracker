#!/usr/bin/env bash
echo "🚀 Starting Django server with Gunicorn..."

set -o errexit

# Start using Gunicorn (Render expects process to listen on $PORT)
gunicorn budget_backend.wsgi:application --bind 0.0.0.0:$PORT
