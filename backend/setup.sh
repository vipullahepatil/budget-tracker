#!/bin/bash
echo "Setting up backend environment..."

# Create venv if not exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

# Activate venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt && python manage.py collectstatic --noinput


# Apply migrations
python3 manage.py migrate

echo "Backend setup complete."
