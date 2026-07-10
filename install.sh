#!/bin/bash
set -e

REPO_URL="https://gitlab.com/final-project5855325/schroedingers_chat.git"
INSTALL_DIR="/opt/schroedingers-chat"

echo "========================================="
echo "  Schroedingers Chat - Installer"
echo "========================================="

# Pruefen ob root
if [ "$EUID" -ne 0 ]; then
    echo "Bitte als root ausfuehren: sudo bash install.sh"
    exit 1
fi

# Updates
apt-get update && apt-get upgrade -y

# Dependencies
apt-get install -y curl git ca-certificates

# Docker pruefen oder installieren
if ! command -v docker &> /dev/null; then
    echo "Docker nicht gefunden, installiere..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
else
    echo "Docker bereits installiert."
fi

# Docker Compose Plugin pruefen
if ! docker compose version &> /dev/null; then
    echo "Docker Compose Plugin fehlt, installiere..."
    apt-get install -y docker-compose-plugin
fi

# Repo klonen oder aktualisieren
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "Repo existiert bereits, ziehe Updates..."
    cd "$INSTALL_DIR"
    git pull
else
    echo "Klone Repo..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Setup Skript ausfuehren (interaktiv fuer sensible Werte)
chmod +x setup.sh
./setup.sh

# Docker Compe start
echo ""
echo "Starte Schroedingers Chat..."
docker compose up -d --build

echo ""
echo "========================================="
echo "  Installation abgeschlossen!"
echo "========================================="
echo "Container Status:"
docker compose ps