#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.11.6/terraform_0.11.6_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="aed5c7388a3c54dc816986903d4dea32e182a002d746295e1016f6db741f472d"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
