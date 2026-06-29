#!/bin/bash
set -euo pipefail

# Docker Deployment Script for Natours Web
# Run this script on your EC2 instance

echo "🐳 Starting Docker deployment of Natours Web..."

# Check Docker installation
echo "✅ Checking Docker installation..."
docker --version

# Check for docker-compose or docker compose (newer versions use 'docker compose')
if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose found"
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    echo "✅ docker compose found"
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Neither docker-compose nor docker compose found"
    echo "📥 Installing docker-compose..."
    # Install standalone docker-compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    DOCKER_COMPOSE="docker-compose"
fi

# Add user to docker group to avoid permission issues
if ! groups $USER | grep -q docker; then
    echo "🔧 Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and log back in, or run: newgrp docker"
    echo "   Then run this script again."
    exit 1
fi

# Check for environment variables
echo "🔍 Checking for environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    echo "📤 Exporting environment variables..."
    export $(cat .env | xargs)
    echo "✅ Environment variables exported"
elif [ -f ".env.local" ]; then
    echo "✅ .env.local file found, copying to .env..."
    cp .env.local .env
    echo "📤 Exporting environment variables..."
    export $(cat .env | xargs)
    echo "✅ Environment variables exported"
else
    echo "⚠️  No .env or .env.local file found"
    echo "📝 You may need to create .env with your environment variables"
    echo "   Example: NEXT_PUBLIC_API_BASE_URL, etc."
    exit 1
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE down

# Remove old images and stale build cache to avoid corrupted layer references
echo "🧹 Cleaning up old images and build cache..."
docker image prune -f
docker builder prune -f

# Build and start the application
echo "🔨 Building and starting the application..."
echo "🔍 Verifying environment variables are available..."
echo "NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:0:20}..."
$DOCKER_COMPOSE build --pull
$DOCKER_COMPOSE up -d

# Check if the container is running
echo "📊 Checking container status..."
sleep 5
$DOCKER_COMPOSE ps

if ! $DOCKER_COMPOSE ps --status running | grep -q "web"; then
    echo "❌ Deployment failed: web container is not running"
    echo "📋 Recent logs:"
    $DOCKER_COMPOSE logs --tail=50
    exit 1
fi

# Show logs
echo "📋 Recent logs:"
$DOCKER_COMPOSE logs --tail=20

echo "✅ Docker deployment completed!"
echo "📊 Check status with: $DOCKER_COMPOSE ps"
echo "📋 View logs with: $DOCKER_COMPOSE logs -f"
echo "🔄 Restart with: $DOCKER_COMPOSE restart"
echo "🛑 Stop with: $DOCKER_COMPOSE down" 