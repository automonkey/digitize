#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.15.5/terraform_0.15.5_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="3b144499e08c245a8039027eb2b84c0495e119f57d79e8fb605864bb48897a7d"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
