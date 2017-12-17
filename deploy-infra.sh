#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then
    echo "Warning: ENV not set. Defaulting to dev environment"
    ENV="dev"
fi

if [ $ENV == "dev" ]; then
    TERRAFORM_ENV="default"
elif [ $ENV == "prod" ]; then
    TERRAFORM_ENV="prod"
else
    echo "Error: Unknown ENV value: '$ENV'"
    exit 1
fi

terraform env select $TERRAFORM_ENV
terraform apply \
    -var "environment=$ENV"
