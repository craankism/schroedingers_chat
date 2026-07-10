# Schroedinger's Chat

![Logo for Schroedinger's Chat](./frontend/public/LogoTransparent.png)

## Overview

Schroedinger's Chat is a self-hosted, privacy-focused chat and collaboration platform with built-in local AI capabilities. It combines real-time collaborative document editing, secure file storage, role-based access control, and AI-powered assistance, all running entirely on your own infrastructure.

Key characteristics:

- Fully self-hosted, no external cloud dependencies
- Local AI model (Ollama) for intelligent assistance, running on your hardware
- Real-time collaborative editing powered by Hocuspocus (Yjs)
- Role-based access control with Super Admin provisioning
- AES encryption for sensitive data at rest
- JWT-based authentication with refresh token support

## Features

- Real-time chat with collaborative document editing
- AI assistant powered by Ollama (qwen2.5-coder, GPU or CPU mode)
- Secure object storage via MinIO
- Document sharing with per-user membership management
- JWT-based authentication with access and refresh tokens
- Super Admin provisioning with automated database seeding
- Automatic GPU detection with model selection (7B on GPU, 3B on CPU)
- HTTPS termination through Nginx reverse proxy
- Fully containerized with Docker Compose

## Tech Stack

| Component          | Technology                              |
|--------------------|-----------------------------------------|
| Frontend           | React (TypeScript), Material UI (MUI), Zustand |
| Backend            | Spring Boot 4.1 (Java), Hibernate, JPA  |
| Collaboration      | Hocuspocus v2.15.3 (Yjs), Node.js v22   |
| Database           | PostgreSQL                               |
| Object Storage     | MinIO                                    |
| AI Model           | Ollama (qwen2.5-coder:7b or :3b)         |
| Reverse Proxy      | Nginx                                   |
| Orchestration      | Docker Compose                          |

## Prerequisites

Before installing Schroedinger's Chat, ensure your environment meets the following requirements:

- At least 8 GB of RAM
- At least 4 CPU cores
- Ports 80 and 443 forwarded to the target host
- Working network configuration with URL forwarding
- A registered domain pointing to your server (or use localhost for development)
- (Optional) NVIDIA GPU with up-to-date drivers for GPU-accelerated AI inference

## Installation

### Quick Start (Linux)

```bash
apt-get update && apt-get upgrade -y && apt-get install -y curl
curl -fsSL https://gitlab.com/final-project5855325/schroedingers_chat/-/raw/dev/install.sh?ref_type=heads | bash
```

The interactive setup script will guide you through configuration. During setup you will be prompted for the following values:

| Value                    | Required | Notes                                        |
|--------------------------|----------|----------------------------------------------|
| Domain                   | No       | Leave empty for localhost (development mode) |
| JWT Secret               | Yes      | Minimum 64 characters (256 bits)             |
| DB Password              | Yes      | Minimum 8 characters                         |
| Super Admin Password     | Yes      | Minimum 8 characters, confirmed on input     |
| Super Admin E-Mail       | No       | Defaults to super@admin.at                   |
| MinIO Root Password      | Yes      | Minimum 6 characters                         |
| Encryption Master Key    | Yes      | Minimum 64 characters (256 bits)             |

### Manual Setup

If you prefer to run the setup manually:

1. Clone the repository:

```bash
git clone https://gitlab.com/final-project5855325/schroedingers_chat.git
cd schroedingers_chat
```

2. Run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

3. Start the application:

```bash
docker compose up -d --build
```

### GPU Configuration

The setup script asks whether an NVIDIA GPU is present and selects the appropriate AI model:

- GPU: Uses qwen2.5-coder:7b with GPU acceleration via a generated `compose.override.yaml`
- No GPU: Uses qwen2.5-coder:3b in CPU-only mode

To switch modes manually, re-run `setup.sh` or adjust `compose.override.yaml` accordingly.

## Configuration

All configuration is managed through a generated `.env` file in the project root. The setup script creates this file automatically. Review its contents before deploying to production.

```env
DOMAIN=localhost
DB_USER=postgresql
DB_PASSWORD=<your-password>
DB_NAME=schroedingers_chat
JWT_SECRET=<your-secret>
SUPERADMIN_EMAIL=super@admin.at
SUPERADMIN_PASSWORD=<your-password>
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=<your-password>
MINIO_BUCKET=schroedinger-files
ENCRYPTION_MASTER_KEY=<your-key>
```





## Services Overview

| Service            | Port  | Description                                    |
|--------------------|-------|------------------------------------------------|
| Nginx (entrypoint) | 80/443| Reverse proxy, TLS termination                 |
| Frontend           | -     | Served by Nginx, React SPA                     |
| Backend            | 8080  | Spring Boot REST API, JWT auth, JPA/Hibernate  |
| Hocuspocus Server  | 3001  | WebSocket-based collaborative editing (Yjs)    |
| PostgreSQL         | 5432  | Primary database                               |
| MinIO              | 9000  | Object storage for file uploads                |
| Ollama             | 11434 | Local AI model inference                       |

## Security Notes

- All sensitive configuration values (JWT secret, DB password, encryption master key) must be manually entered during setup and are never auto-generated.
- The encryption master key is used for AES encryption of sensitive data at rest. Losing this key will make encrypted data unrecoverable.
- The Super Admin account is created automatically on first startup using the credentials provided during setup.


## License

This project currently does not specify a license. All rights reserved by the repository owner.