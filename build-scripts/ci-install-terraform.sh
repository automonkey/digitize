#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/1.0.11/terraform_1.0.11_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="eeb46091a42dc303c3a3c300640c7774ab25cbee5083dafa5fd83b54c8aca664"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
