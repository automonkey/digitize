#!/usr/bin/env bash

set -eo pipefail

./build-scripts/ci-install-awscli.sh
./build-scripts/ci-install-nvm.sh
