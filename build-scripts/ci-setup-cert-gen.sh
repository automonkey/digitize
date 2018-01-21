#!/usr/bin/env bash

set -eo pipefail

./build-scripts/ci-install-awscli.sh
./build-scripts/ci-install-ansible.sh

pip install virtualenv
virtualenv python-virtualenv-ci-cert-gen
source python-virtualenv-ci-cert-gen/bin/activate
pip install pyopenssl
