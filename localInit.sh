#!/bin/bash

# Check if openssl is installed
if ! command -v openssl &> /dev/null
then
    echo "Error: OpenSSL is not installed. Please install OpenSSL and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
  echo "Error: pnpm is not installed. Please install pnpm and try again."
  exit 1
fi

# Install dependencies using pnpm
pnpm install

# Check if server.js file exists, if not, create it from server.js.example
if [ ! -f server.ts ]; then
  cp server.ts.example server.ts
  echo "server.js created"
fi

# Check if .env.local file exists, if not, create it from .env.local.example
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo ".env.local created"
fi

# Check if .env.local file exists, if not, create it from .env.local.example
if [ ! -f .env.secrets.local ]; then
  cp .env.secrets.local.example .env.secrets.local
  echo ".env.secrets.local created"
fi

# Check if .env.local file exists, if not, create it from .env.local.example
if [ ! -f .env.dev ]; then
  cp .env.dev.example .env.dev
  echo ".env.dev created"
fi

# Check if .env.local file exists, if not, create it from .env.local.example
if [ ! -f .env.secrets.local ]; then
  cp .env.secrets.dev.example .env.secrets.dev
  echo ".env.secrets.dev created"
fi

# Check if key.pem and cert.pem files exist, if not, generate a self-signed SSL/TLS certificate
if [ ! -f key.pem ] || [ ! -f cert.pem ]; then
  echo "Creating a self-signed certificate:"
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -subj "/CN=localhost" -addext "subjectAltName = DNS:localhost" -out cert.pem -days 365 -nodes
  echo "Self-signed certificate is created"
fi

# Set NODE_ENV to development
export NODE_ENV=development

echo "Remember to update your configuration in the .env.local file."