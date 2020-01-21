#!/usr/bin/env bash

set -eo pipefail

(
    cd cloudfront-cert-rotator;
    source venv/bin/activate;
    make test
)
