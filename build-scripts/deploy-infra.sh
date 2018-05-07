#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi

TERRAFORM_STATE_BUCKET="io.benyon.digitize.$ENV.terraform"

set +e
eval "aws s3api head-bucket --bucket '$TERRAFORM_STATE_BUCKET' 2>/dev/null"
TF_STATE_BUCKET_LOOKUP_RESULT=$?
set -e

if [ "$TF_STATE_BUCKET_LOOKUP_RESULT" -ne 0 ]
then
    echo "Terraform remote state store doesn't exist. Creating..."
    aws s3api create-bucket --region eu-west-2 --bucket $TERRAFORM_STATE_BUCKET --create-bucket-configuration LocationConstraint=eu-west-2
fi

LATEST_SSL_CERT=$(aws ssm get-parameter --region eu-west-2 --name digitize-$ENV-latest-ssl-cert --query 'Parameter.Value' --output text)

(
    cd infra
    terraform init \
        -backend-config="bucket=$TERRAFORM_STATE_BUCKET"
    terraform apply \
        -auto-approve \
        -var "environment=$ENV" \
        -var "latest_ssl_cert_arn=$LATEST_SSL_CERT"
)