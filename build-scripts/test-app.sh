#!/usr/bin/env bash

set -eo pipefail

(
    cd app
    nvm install
    npm install
    CI=true npm test
)
