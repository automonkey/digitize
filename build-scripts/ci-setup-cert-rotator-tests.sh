#!/usr/bin/env bash

set -eo pipefail


(
    cd cloudfront-cert-rotator;
    python3 -m venv --prompt cloudfront-cert-rotator-tests venv;
    source venv/bin/activate;
    make deps;
    deactivate
)
