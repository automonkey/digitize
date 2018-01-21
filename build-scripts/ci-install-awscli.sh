#!/usr/bin/env bash

set -eo pipefail

echo -e "\n\n### Installing AWS CLI..."
apt-get update
apt-get install -y -qq python-pip python-dev
pip install awscli
