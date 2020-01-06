#!/usr/bin/env bash

set -eo pipefail

./build-scripts/ci-install-awscli.sh
./build-scripts/ci-install-ansible.sh

apt-get update
apt-get install --assume-yes python3.5-venv build-essential libssl-dev python3-dev
python3.5 -m venv python-virtualenv-ci-cert-gen
source python-virtualenv-ci-cert-gen/bin/activate
pip install pyopenssl
