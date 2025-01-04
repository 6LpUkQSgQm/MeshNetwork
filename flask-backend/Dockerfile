# Base image with Python 3.9
FROM python:3.9-slim-buster

# Install essential dependencies for gevent and libev
RUN apt-get update && apt-get install -y \
    build-essential \
    libev-dev \
    libpq-dev \
    libssl-dev \
    python3-dev \
    libffi-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /flask-backend/
RUN pip install --no-cache-dir -r /flask-backend/requirements.txt

# Copy the application files into the container
COPY . /flask-backend/

# Set the working directory to /flask-backend
WORKDIR /flask-backend

# Expose Flask's port
EXPOSE 5003

# Command to run Flask with SSL
CMD ["gunicorn", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "-w", "1", "-b", "0.0.0.0:5003", "run:app", "--certfile=/flask-backend/certs/cert.pem", "--keyfile=/flask-backend/certs/key.pem"]