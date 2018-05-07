#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="6b8ce67647a59b2a3f70199c304abca0ddec0e49fd060944c26f666298e23418"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
