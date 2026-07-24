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

# Passwords (Standard - Minimum 8 characters, validation + confirmation)
echo "========================================="
echo "  Password Configuration (min. 8 characters)"
echo "========================================="

# DB Password
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
    read -rsp "Confirm DB Password: " db_confirm
    echo ""
    if [ "$db_password" != "$db_confirm" ]; then
        echo "ERROR: Passwords do not match!"
        continue
    fi
    break
done

# Admin Password
echo ""
echo "[REQUIRED] Enter Super Admin Password:"
while true; do
    read -rsp "Admin Password (at least 8 characters): " admin_password
    echo ""
    if [ -z "$admin_password" ]; then
        echo "ERROR: Admin Password must not be empty!"
        continue
    fi
    if [ ${#admin_password} -lt 8 ]; then
        echo "ERROR: Admin Password must be at least 8 characters long!"
        continue
    fi
    read -rsp "Confirm Admin Password: " admin_confirm
    echo ""
    if [ "$admin_password" != "$admin_confirm" ]; then
        echo "ERROR: Passwords do not match!"
        continue
    fi
    break
done

read -p "Super Admin E-Mail [super@admin.at]: " admin_email
admin_email=${admin_email:-super@admin.at}

# MinIO Password
echo ""
echo "[REQUIRED] Enter MinIO Credentials:"
read -p "MinIO Root User [minioadmin]: " minio_user
minio_user=${minio_user:-minioadmin}

while true; do
    read -rsp "MinIO Password (at least 8 characters): " minio_password
    echo ""
    if [ -z "$minio_password" ]; then
        echo "ERROR: MinIO Password must not be empty!"
        continue
    fi
    if [ ${#minio_password} -lt 8 ]; then
        echo "ERROR: MinIO Password must be at least 8 characters long!"
        continue
    fi
    read -rsp "Confirm MinIO Password: " minio_confirm
    echo ""
    if [ "$minio_password" != "$minio_confirm" ]; then
        echo "ERROR: Passwords do not match!"
        continue
    fi
    break
done

read -p "MinIO Bucket [schroedinger-files]: " minio_bucket
minio_bucket=${minio_bucket:-schroedinger-files}

# Secrets (Critical - Minimum 32 characters, no complexity validation)
echo ""
echo "========================================="
echo "  Critical Secrets (min. 32 characters)"
echo "========================================="

# JWT Secret
echo "[REQUIRED] Enter JWT Secret:"
while true; do
    read -r jwt_secret
    if [ -z "$jwt_secret" ]; then
        echo "ERROR: JWT Secret must not be empty!"
        continue
    fi
    if [ ${#jwt_secret} -lt 32 ]; then
        echo "ERROR: JWT Secret must be at least 32 characters long!"
        continue
    fi
    break
done

# Encryption Master Key
echo ""
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

# Hardware Detection and Model Selection
echo ""
echo "========================================="
echo "  Hardware Detection and Model Selection"
echo "========================================="

# Detect CPU cores
cpu_cores=$(nproc 2>/dev/null || grep -c processor /proc/cpuinfo 2>/dev/null || echo "1")

# Detect RAM in GB
ram_gb=$(free -g 2>/dev/null | awk '/^total/ {print $2}' || grep MemTotal /proc/meminfo | awk '{printf "%.0f", $2/1024}')
if [ -z "$ram_gb" ]; then
    ram_gb=8
fi

echo "Detected Hardware: $cpu_cores CPU Cores, $ram_gb GB RAM"

# Check for NVIDIA GPU
has_gpu="n"
if command -v nvidia-smi &>/dev/null; then
    if nvidia-smi &>/dev/null; then
        has_gpu="y"
        echo "NVIDIA GPU detected: GPU acceleration available"
    fi
fi

# Determine recommendations
echo ""
echo "AI Model Recommendations:"
echo "------------------------"

if [ "$has_gpu" = "y" ]; then
    echo "* 7B or 14B recommended (GPU acceleration available)"
elif [ "$ram_gb" -ge 16 ] && [ "$cpu_cores" -ge 8 ]; then
    echo "* 7B recommended (sufficient CPU/RAM resources detected)"
elif [ "$ram_gb" -ge 8 ] && [ "$cpu_cores" -ge 4 ]; then
    echo "* 3B recommended (adequate for this configuration)"
else
    echo "* 3B recommended (low-resource environment)"
fi

echo ""
echo "Select AI Model:"
echo "----------------"
echo "1) qwen2.5-coder:3b  - Fast, lower RAM usage, good for CPU"
echo "2) qwen2.5-coder:7b  - Balanced, requires ~8-12 GB RAM"
echo "3) qwen2.5-coder:14b - High quality, requires ~16+ GB RAM or GPU"
echo ""

while true; do
    read -p "Enter selection [1-3]: " model_choice
    case $model_choice in
        1)
            SELECTED_MODEL="qwen2.5-coder:3b"
            break
            ;;
        2)
            SELECTED_MODEL="qwen2.5-coder:7b"
            break
            ;;
        3)
            SELECTED_MODEL="qwen2.5-coder:14b"

            # Warn if selecting 14B on insufficient hardware
            if [ "$has_gpu" != "y" ] && [ "$ram_gb" -lt 16 ]; then
                echo "WARNING: 14B model requires significant RAM ($ram_gb GB detected)."
                read -p "This may cause slow performance or memory issues. Continue anyway? (y/N) " confirm
                [[ ! "$confirm" =~ ^[Yy]$ ]] && continue
            fi
            break
            ;;
        *)
            echo "Invalid selection. Please enter 1, 2, or 3."
            ;;
    esac
done

# Create GPU compose file if GPU is available
if [ "$has_gpu" = "y" ]; then
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
    echo ""
    echo "compose.gpu.yaml (GPU driver) has been created."
else
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

# JWT Auth (CRITICAL: Must be at least 32 characters!)
JWT_SECRET=$jwt_secret

# Super Admin
SUPERADMIN_EMAIL=$admin_email
SUPERADMIN_PASSWORD=$admin_password

# MinIO Object Storage
MINIO_ROOT_USER=$minio_user
MINIO_ROOT_PASSWORD=$minio_password
MINIO_BUCKET=$minio_bucket

# AES Encryption Key (CRITICAL: Must be at least 32 characters!)
ENCRYPTION_MASTER_KEY=$enc_master_key

# AI Model Configuration
OLLAMA_MODEL=$SELECTED_MODEL
OLLAMA_EMBEDDING_MODEL=nomic-embed-text:latest

EOF

echo ""
echo ".env file has been created successfully."
echo "Selected AI Model: $SELECTED_MODEL"
echo ""
echo "Start with: docker compose up -d --build"
if [ "$has_gpu" = "y" ]; then
    echo "Or with GPU support: docker compose -f compose.yml -f compose.gpu.yaml up -d --build"
fi