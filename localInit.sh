#!/bin/bash

# Initialize cloud_provider variable
cloud_provider=""
env="local"

# Loop over all arguments
for arg in "$@"
do
  case $arg in
    --cloud-provider=*)
    cloud_provider="${arg#*=}"
    shift # Remove --cloud-provider= from processing
    ;;
    --env=*)
    env="${arg#*=}"
    shift # Remove --env= from processing
    ;;
    *)
    # Unknown option
    shift # Remove generic argument from processing
    ;;
  esac
done

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
files=("server.ts" ".env.local" ".env.secrets.local" "tach.config.local.js")

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

##### Helper Functions #####

# Function to setup AWS
setup_aws() {
    # Get the file name and keys from the function arguments
    local file=$1  # Get the first argument as the file name
    local keys=("${@:2}")  # Get all arguments starting from the second as the keys

    # Loop over the keys
    for key in "${keys[@]}"; do
        # Prompt the user for the value
        read -p "$key: " value

        # Replace the value in the file
        sed -i "s/^$key=.*/$key=$value/" $file
    done
}

##### AWS Setup #####

# Check if the cloud provider is AWS
if [ "$cloud_provider" == "aws" ]; then
    echo "Enter AWS settings:"

    # Call the setup_aws function with the file name and keys
    setup_aws ".env.${env}" "TACH_AWS_ACCESS_KEY_ID" "TACH_AWS_ACCOUNT_ID" "TACH_AWS_AMPLIFY_APP_ID" "TACH_AWS_BUCKET_NAME" "TACH_AWS_PROFILE" "TACH_AWS_REGION"
    
    setup_aws ".env.secrets.${env}" "TACH_AWS_SECRET_ACCESS_KEY"
else
    echo "Cloud provider is not AWS. Please pass '--cloud-provider=aws' to update settings."
fi

echo "Remember to update your configuration in the .env.local file."