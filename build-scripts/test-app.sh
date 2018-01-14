#!/usr/bin/env bash

set -eo pipefail

(
    cd app
    CI=true npm test
)
