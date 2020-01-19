#!/usr/bin/env bash

set -eo pipefail

pip install --user awscli

(
    cd cloudfront-cert-rotator;
    make install;
    echo "export PATH=$PATH:$(make getbinpath)" >> $BASH_ENV
)
