#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/1.2.2/terraform_1.2.2_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="2934a0e8824925beb956b2edb5fef212a6141c089d29d8568150a43f95b3a626"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
