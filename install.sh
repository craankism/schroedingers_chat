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

# Setup Skript ausfuehren (interaktiv, stdin vom Terminal)
chmod +x setup.sh
./setup.sh </dev/tty

# Docker Compose start
echo ""
echo "Starte Schroedingers Chat..."
docker compose up -d --build

# SSL Zertifikat beantragen wenn nicht localhost
DOMAIN=$(grep '^DOMAIN=' .env | cut -d= -f2)
ADMIN_EMAIL=$(grep '^SUPERADMIN_EMAIL=' .env | cut -d= -f2)

if [ "$DOMAIN" != "localhost" ] && [ -n "$DOMAIN" ]; then
    echo ""
    echo "Beantrage SSL Zertifikat fuer $DOMAIN..."

    # Warten bis Nginx verfuegbar ist (mit Timeout)
    echo "Warte auf Nginx..."
    MAX_WAIT=60
    WAITED=0
    until curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null | grep -qE '^(200|301|302)$'; do
        sleep 2
        WAITED=$((WAITED + 2))
        if [ "$WAITED" -ge "$MAX_WAIT" ]; then
            echo "FEHLER: Nginx nicht erreichbar nach $MAX_WAIT Sekunden."
            echo "Pruefe mit: docker compose logs nginx"
            echo "SSL wird uebersprungen. Self-Signed Cert bleibt aktiv."
            echo ""
            echo "========================================="
            echo "  Installation abgeschlossen (ohne SSL)!"
            echo "========================================="
            docker compose ps
            exit 1
        fi
    done
    echo "Nginx ist bereit."

    # Certbot initial ausfuehren (entrypoint ueberschreiben)
    echo "Beantrage Zertifikat..."
    if docker compose run --rm --entrypoint "certbot" certbot certonly \
        --webroot -w /var/www/certbot \
        -d "$DOMAIN" \
        --non-interactive \
        --agree-tos \
        -m "$ADMIN_EMAIL"; then

        # Nginx neustarten damit entrypoint.sh die Symlinks setzt
        echo "Neustart von Nginx fuer Zertifikatsuebernahme..."
        docker compose restart nginx
        echo "SSL Zertifikat fuer $DOMAIN aktiviert."
    else
        echo "WARNUNG: Certbot konnte kein Zertifikat besorgen."
        echo "Moegliche Ursachen: DNS noch nicht propagiert, Rate Limit, falsche Domain."
        echo "Self-Signed Cert bleibt aktiv. Du kannst es spaeter manuell erneut versuchen."
        echo ""
        echo "Manueller Versuch spaeter:"
        echo "  docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --non-interactive --agree-tos -m $ADMIN_EMAIL"
        echo "  docker compose restart nginx"
    fi
else
    echo "Keine Domain gesetzt, ueberspringe SSL. Self-Signed Cert wird verwendet."
fi

echo ""
echo "========================================="
echo "  Installation abgeschlossen!"
echo "========================================="
echo "Container Status:"
docker compose ps