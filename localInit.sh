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

# Array of files to check and create if necessary
files=("server.ts" ".env.local" ".env.secrets.local" ".env.dev" ".env.secrets.dev")

# Loop through the files array
for file in "${files[@]}"; do
  # Check if the file exists
  if [ ! -f "$file" ]; then
    # Create a copy of the example file without the ".example" extension
    cp "$file.example" "$file"
    echo "$file created"
  fi
done

# Check if key.pem and cert.pem files exist, if not, generate a self-signed SSL/TLS certificate
if [ ! -f key.pem ] || [ ! -f cert.pem ]; then
  echo "Creating a self-signed certificate:"
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -subj "/CN=localhost" -addext "subjectAltName = DNS:localhost" -out cert.pem -days 365 -nodes
  echo "Self-signed certificate is created"
fi

# Set NODE_ENV to development
export NODE_ENV=development

echo "Remember to update your configuration in the .env.local file."