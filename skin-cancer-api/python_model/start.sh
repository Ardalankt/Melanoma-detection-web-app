#!/bin/bash

# Set port (default 5040)
export PYTHON_API_PORT=${PYTHON_API_PORT:-5040}

# virtual environment

if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

# dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Flask API server
echo "Starting API server on port $PYTHON_API_PORT..."
python3 app.py
