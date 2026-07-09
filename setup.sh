#!/bin/bash

# Schroedingers Chat - Environment Setup Script
# Zwingt manuelle Eingabe für sensible Werte ohne Default.

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    echo "Es existiert bereits eine .env Datei."
    read -p "Überschreiben? (y/N) " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "Abgebrochen. Bestehende .env wird beibehalten."
        exit 0
    fi
fi

echo ""
echo "========================================="
echo "  Schroedingers Chat - Setup"
echo "========================================="
echo "Bitte gib die folgenden Werte ein."
echo "Nicht sensible Werte haben Defaults (Enter = übernehmen)."
echo ""

# Domain Konfiguration (Optional - mit Default fuer Entwicklung)
read -p "Domain fuer HTTPS (leer = localhost fuer Development): " domain_input
domain=${domain_input:-localhost}

if [ "$domain" != "localhost" ]; then
    echo "ACHTUNG: Fuer Production Deployment wird $domain verwendet."
    echo "Stelle sicher, dass diese Domain auf Server IP zeigt!"
fi

# Datenbank (Nicht sensitiv - kann Default haben)
read -p "DB User [postgresql]: " db_user
db_user=${db_user:-postgresql}

read -p "DB Name [schroedingers_chat]: " db_name
db_name=${db_name:-schroedingers_chat}

# JWT SECRET (Sensitive - KEIN DEFAULT!)
echo "[REQUIRED] JWT Secret eingeben:"
while true; do
    read -r jwt_secret
    if [ -z "$jwt_secret" ]; then
        echo "FEHLER: JWT Secret darf nicht leer sein!"
        continue
    fi
    if [ ${#jwt_secret} -lt 32 ]; then
        echo "WARNUNG: JWT Secret sollte mindestens 32 Zeichen lang sein."
        read -p "Trotzdem fortfahren? (y/N) " confirm
        [[ "$confirm" =~ ^[Yy]$ ]] && break || continue
    fi
    break
done

# Datenbank Passwort (Sensitive - KEIN DEFAULT!)
echo "[REQUIRED] DB Password eingeben:"
while true; do
    read -rsp "DB Password (mindestens 8 Zeichen): " db_password
    echo ""
    if [ -z "$db_password" ]; then
        echo "FEHLER: DB Password darf nicht leer sein!"
        continue
    fi
    if [ ${#db_password} -lt 8 ]; then
        echo "FEHLER: DB Password muss mindestens 8 Zeichen lang sein!"
        continue
    fi
    break
done

# Super Admin Passwort (Sensitive - KEIN DEFAULT!)
echo "[REQUIRED] Super Admin Password eingeben:"
while true; do
    read -rsp "Super Admin Password: " admin_password
    echo ""
    if [ -z "$admin_password" ]; then
        echo "FEHLER: Super Admin Password darf nicht leer sein!"
        continue
    fi
    if [ ${#admin_password} -lt 8 ]; then
        echo "FEHLER: Password muss mindestens 8 Zeichen lang sein!"
        continue
    fi
    # Bestätigung abfragen
    read -rsp "Bestätigen: " admin_confirm
    echo ""
    if [ "$admin_password" != "$admin_confirm" ]; then
        echo "FEHLER: Passwords stimmen nicht überein!"
        continue
    fi
    break
done

read -p "Super Admin E-Mail [super@admin.at]: " admin_email
admin_email=${admin_email:-super@admin.at}

# MinIO credentials (Sensitive - KEIN DEFAULT!)
read -p "MinIO Root User [minioadmin]: " minio_user
minio_user=${minio_user:-minioadmin}

echo "[REQUIRED] MinIO Root Password eingeben:"
while true; do
    read -rsp "MinIO Password (mindestens 6 Zeichen): " minio_password
    echo ""
    if [ -z "$minio_password" ]; then
        echo "FEHLER: MinIO Password darf nicht leer sein!"
        continue
    fi
    if [ ${#minio_password} -lt 6 ]; then
        echo "FEHLER: MinIO Password muss mindestens 6 Zeichen lang sein!"
        continue
    fi
    break
done

read -p "MinIO Bucket [schroedinger-files]: " minio_bucket
minio_bucket=${minio_bucket:-schroedinger-files}

# AI API Key (Optional - aber wenn gesetzt, nicht leer)
# read -p "OpenAI API Key (leer lassen, falls nicht benötigt): " ai_key

echo "[REQUIRED] Encryption Master Key eingeben:"
while true; do
    read -rsp "Master Key (mindestens 32 Zeichen): " enc_master_key
    echo ""
    if [ -z "$enc_master_key" ]; then
        echo "FEHLER: Master Key darf nicht leer sein!"
        continue
    fi
    if [ ${#enc_master_key} -lt 32 ]; then
        echo "FEHLER: Master Key muss mindestens 32 Zeichen lang sein!"
        continue
    fi
    break
done

# GPU Abfrage
echo ""
echo "========================================="
echo "  GPU Konfiguration"
echo "========================================="
read -p "Ist eine NVIDIA GPU vorhanden? (y/N) " has_gpu

if [[ "$has_gpu" =~ ^[Yy]$ ]]; then
    echo "GPU Modus: 7B Modell mit GPU-Beschleunigung"
    cat > "compose.override.yaml" << 'EOF'
services:
  ollama:
    environment:
      - OLLAMA_MODEL=qwen2.5-coder:7b
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
EOF
    echo "compose.override.yaml wurde erstellt."
else
    echo "CPU Modus: 3B Modell ohne GPU"
    rm -f "compose.override.yaml"
    echo "Kein GPU-Override aktiv."
fi

echo ""
echo "Schreibe $ENV_FILE ..."

cat > "$ENV_FILE" << EOF
# Schroedingers Chat - Environment Configuration
# Auto-generated by setup.sh - SECURITY WARNING: Review before deploying!

# Domain Configuration
DOMAIN=$domain

# Database
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_NAME=$db_name

# JWT Auth (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=$jwt_secret

# Super Admin
SUPERADMIN_EMAIL=$admin_email
SUPERADMIN_PASSWORD=$admin_password

# MinIO Object Storage
MINIO_ROOT_USER=$minio_user
MINIO_ROOT_PASSWORD=$minio_password
MINIO_BUCKET=$minio_bucket

# AES Encryption Key
ENCRYPTION_MASTER_KEY=$enc_master_key

EOF

# AI (optional)
#OPENAI_API_KEY=$ai_key

echo ""
echo ".env Datei wurde erfolgreich erstellt."
echo ""
echo "Jetzt starten mit: docker compose up -d --build"