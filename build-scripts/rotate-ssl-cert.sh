#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi

LATEST_SSL_CERT=$(aws ssm get-parameter --region eu-west-2 --name digitize-$ENV-latest-ssl-cert --query 'Parameter.Value' --output text)

echo "Rotating cert for env '$ENV' (Latest cert: '$LATEST_SSL_CERT')"
rotate-cf-cert "$ENV" "$LATEST_SSL_CERT"
