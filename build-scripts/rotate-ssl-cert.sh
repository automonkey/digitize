#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi

CLOUDFRONT_ORIGIN_ID="io.benyon.digitize.${ENV}"
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?contains(Origins.Items[*].Id, '$CLOUDFRONT_ORIGIN_ID')]|[0].Id" \
    --output text \
)

if [ ${CLOUDFRONT_DISTRIBUTION_ID} == "None" ]; then echo "No distribution to update"; exit 0; fi

LATEST_SSL_CERT=$(aws ssm get-parameter --region eu-west-2 --name digitize-$ENV-latest-ssl-cert --query 'Parameter.Value' --output text)

echo "Rotating cert for distribution '$CLOUDFRONT_DISTRIBUTION_ID' (Latest cert: '$LATEST_SSL_CERT')"
rotate-cf-cert "$CLOUDFRONT_DISTRIBUTION_ID" "$LATEST_SSL_CERT"
