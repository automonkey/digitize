#!/usr/bin/env bash

set -eo pipefail

./build-scripts/ci-install-awscli.sh

apt-get update
apt-get install --assume-yes python3 python3-pip
pip3 install --upgrade setuptools

(
    cd cloudfront-cert-rotator;
    make install;
    echo "export PATH=$PATH:$(make getbinpath)" >> $BASH_ENV
)

