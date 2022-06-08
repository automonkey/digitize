#!/usr/bin/env bash

set -eo pipefail

TERRAFORM_ZIP_URL="https://releases.hashicorp.com/terraform/0.14.11/terraform_0.14.11_linux_amd64.zip"
TERRAFORM_ZIP_SHA_256="171ef5a4691b6f86eab524feaf9a52d5221c875478bd63dd7e55fef3939f7fd4"

echo -e "\n\n### Installing Terraform..."
apt-get update
apt-get install -y -qq unzip
curl -o terraform.zip -sSL "$TERRAFORM_ZIP_URL"
./build-scripts/check-sha-256.sh terraform.zip "$TERRAFORM_ZIP_SHA_256"
unzip terraform.zip -d /usr/local/bin
