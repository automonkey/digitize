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

LATEST_SSL_CERT=$(aws ssm get-parameter --name digitize-$ENV-latest-ssl-cert --query 'Parameter.Value' --output text)

(
    cd infra
    terraform env select $TERRAFORM_ENV
    terraform apply \
        -var "environment=$ENV" \
        -var "latest_ssl_cert_arn=$LATEST_SSL_CERT"
)
