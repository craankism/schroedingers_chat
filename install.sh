#!/bin/bash
set -e

REPO_URL="https://gitlab.com/final-project5855325/schroedingers_chat.git"
INSTALL_DIR="/opt/schroedingers-chat"

echo "========================================="
echo "  Schroedingers Chat - Installer"
echo "========================================="

# Check if root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo bash install.sh"
    exit 1
fi

# Updates
apt-get update && apt-get upgrade -y

# Dependencies
apt-get install -y curl git ca-certificates

# Check or install Docker
if ! command -v docker &> /dev/null; then
    echo "Docker not found, installing..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
else
    echo "Docker already installed."
fi

# Check Docker Compose Plugin
if ! docker compose version &> /dev/null; then
    echo "Docker Compose Plugin missing, installing..."
    apt-get install -y docker-compose-plugin
fi

# Clone or update repo
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "Repo already exists, pulling updates..."
    cd "$INSTALL_DIR"
    git pull
else
    echo "Cloning repo..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Run Setup Script (interactive, stdin from terminal)
chmod +x setup.sh
./setup.sh </dev/tty

# Docker Compose start
echo ""
echo "Starting Schroedingers Chat..."
docker compose up -d --build

# Request SSL Certificate if not localhost
DOMAIN=$(grep '^DOMAIN=' .env | cut -d= -f2)
ADMIN_EMAIL=$(grep '^SUPERADMIN_EMAIL=' .env | cut -d= -f2)

if [ "$DOMAIN" != "localhost" ] && [ -n "$DOMAIN" ]; then
    echo ""
    echo "Requesting SSL certificate for $DOMAIN..."

    # Wait until Nginx is available (with timeout)
    echo "Waiting for Nginx..."
    MAX_WAIT=60
    WAITED=0
    until curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null | grep -qE '^(200|301|302)$'; do
        sleep 2
        WAITED=$((WAITED + 2))
        if [ "$WAITED" -ge "$MAX_WAIT" ]; then
            echo "ERROR: Nginx not reachable after $MAX_WAIT seconds."
            echo "Check with: docker compose logs nginx"
            echo "SSL will be skipped. Self-Signed Cert remains active."
            echo ""
            echo "========================================="
            echo "  Installation completed (without SSL)!"
            echo "========================================="
            docker compose ps
            exit 1
        fi
    done
    echo "Nginx is ready."

    # Run Certbot initially (override entrypoint)
    echo "Requesting certificate..."
    if docker compose run --rm --entrypoint "certbot" certbot certonly \
        --webroot -w /var/www/certbot \
        -d "$DOMAIN" \
        --non-interactive \
        --agree-tos \
        -m "$ADMIN_EMAIL"; then

        # Restart Nginx so entrypoint.sh sets the symlinks
        echo "Restarting Nginx for certificate adoption..."
        docker compose restart nginx
        echo "SSL certificate for $DOMAIN activated."
    else
        echo "WARNING: Certbot could not obtain certificate."
        echo "Possible causes: DNS not yet propagated, rate limit, wrong domain."
        echo "Self-Signed Cert remains active. You can try manually later."
        echo ""
        echo "Manual attempt later:"
        echo "  docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --non-interactive --agree-tos -m $ADMIN_EMAIL"
        echo "  docker compose restart nginx"
    fi
else
    echo "No domain set, skipping SSL. Using Self-Signed Cert."
fi

echo ""
echo "========================================="
echo "  Installation completed!"
echo "========================================="
echo "Container Status:"
docker compose ps