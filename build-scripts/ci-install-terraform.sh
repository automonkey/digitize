#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.13.7/terraform_0.13.7_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="4a52886e019b4fdad2439da5ff43388bbcc6cce9784fde32c53dcd0e28ca9957"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
