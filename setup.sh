#!/bin/bash

# Schroedingers Chat - Environment Setup Script
# Requires manual input for sensitive values, no defaults.

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    echo "A .env file already exists."
    read -p "Overwrite? (y/N) " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "Aborted. Existing .env will be kept."
        exit 0
    fi
fi

echo ""
echo "========================================="
echo "  Schroedingers Chat - Setup"
echo "========================================="
echo "Please enter the following values."
echo "Non-sensitive values have defaults (press Enter to accept)."
echo ""

# Domain Configuration (Optional - with default for development)
read -p "Domain for HTTPS (leave empty for localhost development): " domain_input
domain=${domain_input:-localhost}

if [ "$domain" != "localhost" ]; then
    echo "WARNING: $domain will be used for production deployment."
    echo "Make sure this domain points to the server IP!"
fi

# Database (Non-sensitive - can have defaults)
read -p "DB User [postgresql]: " db_user
db_user=${db_user:-postgresql}

read -p "DB Name [schroedingers_chat]: " db_name
db_name=${db_name:-schroedingers_chat}

# JWT SECRET (Sensitive - NO DEFAULT!)
echo "[REQUIRED] Enter JWT Secret:"
while true; do
    read -r jwt_secret
    if [ -z "$jwt_secret" ]; then
        echo "ERROR: JWT Secret must not be empty!"
        continue
    fi
    if [ ${#jwt_secret} -lt 32 ]; then
        echo "WARNING: JWT Secret should be at least 32 characters long."
        read -p "Continue anyway? (y/N) " confirm
        [[ "$confirm" =~ ^[Yy]$ ]] && break || continue
    fi
    break
done

# Database Password (Sensitive - NO DEFAULT!)
echo "[REQUIRED] Enter DB Password:"
while true; do
    read -rsp "DB Password (at least 8 characters): " db_password
    echo ""
    if [ -z "$db_password" ]; then
        echo "ERROR: DB Password must not be empty!"
        continue
    fi
    if [ ${#db_password} -lt 8 ]; then
        echo "ERROR: DB Password must be at least 8 characters long!"
        continue
    fi
    break
done

# Super Admin Password (Sensitive - NO DEFAULT!)
echo "[REQUIRED] Enter Super Admin Password:"
while true; do
    read -rsp "Super Admin Password: " admin_password
    echo ""
    if [ -z "$admin_password" ]; then
        echo "ERROR: Super Admin Password must not be empty!"
        continue
    fi
    if [ ${#admin_password} -lt 8 ]; then
        echo "ERROR: Password must be at least 8 characters long!"
        continue
    fi
    # Confirmation
    read -rsp "Confirm: " admin_confirm
    echo ""
    if [ "$admin_password" != "$admin_confirm" ]; then
        echo "ERROR: Passwords do not match!"
        continue
    fi
    break
done

read -p "Super Admin E-Mail [super@admin.at]: " admin_email
admin_email=${admin_email:-super@admin.at}

# MinIO credentials (Sensitive - NO DEFAULT!)
read -p "MinIO Root User [minioadmin]: " minio_user
minio_user=${minio_user:-minioadmin}

echo "[REQUIRED] Enter MinIO Root Password:"
while true; do
    read -rsp "MinIO Password (at least 6 characters): " minio_password
    echo ""
    if [ -z "$minio_password" ]; then
        echo "ERROR: MinIO Password must not be empty!"
        continue
    fi
    if [ ${#minio_password} -lt 6 ]; then
        echo "ERROR: MinIO Password must be at least 6 characters long!"
        continue
    fi
    break
done

read -p "MinIO Bucket [schroedinger-files]: " minio_bucket
minio_bucket=${minio_bucket:-schroedinger-files}

# Mailtrap credentials (Optional - for email delivery)
echo ""
echo "[OPTIONAL] Mailtrap credentials for email delivery (leave empty if not needed):"
read -p "Mailtrap Username: " mailtrap_username
read -sp "Mailtrap Password: " mailtrap_password
echo ""

# Encryption Master Key (Sensitive - NO DEFAULT!)
echo "[REQUIRED] Enter Encryption Master Key:"
while true; do
    read -rsp "Master Key (at least 32 characters): " enc_master_key
    echo ""
    if [ -z "$enc_master_key" ]; then
        echo "ERROR: Master Key must not be empty!"
        continue
    fi
    if [ ${#enc_master_key} -lt 32 ]; then
        echo "ERROR: Master Key must be at least 32 characters long!"
        continue
    fi
    break
done

# GPU Configuration
echo ""
echo "========================================="
echo "  GPU Configuration"
echo "========================================="
read -p "Is an NVIDIA GPU available? (y/N) " has_gpu

if [[ "$has_gpu" =~ ^[Yy]$ ]]; then
    SELECTED_MODEL="qwen2.5-coder:7b"
    echo "GPU Mode: 7B model with GPU acceleration"
    cat > "compose.gpu.yaml" << 'EOF'
services:
  ollama:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
EOF
    echo "compose.gpu.yaml (GPU driver) has been created."
else
    SELECTED_MODEL="qwen2.5-coder:3b"
    echo "CPU Mode: 3B model without GPU"
    rm -f "compose.gpu.yaml"
fi

echo ""
echo "Writing $ENV_FILE ..."

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

# Mailtrap Email Service (Optional)
MAILTRAP_USERNAME=$mailtrap_username
MAILTRAP_PASSWORD=$mailtrap_password

# AI Model Configuration
OLLAMA_MODEL=$SELECTED_MODEL
OLLAMA_EMBEDDING_MODEL=nomic-embed-text:latest

EOF

echo ""
echo ".env file has been created successfully."
echo ""
echo "Start with: docker compose up -d --build"