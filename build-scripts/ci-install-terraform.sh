#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.9.11/terraform_0.9.11_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="804d31cfa5fee5c2b1bff7816b64f0e26b1d766ac347c67091adccc2626e16f3"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
