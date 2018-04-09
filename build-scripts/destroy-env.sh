#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "Destroying ENV '$ENV'"; fi

TERRAFORM_STATE_BUCKET="www.$ENV.digitize.benyon.io.terraform"

set +e
eval "aws s3api head-bucket --bucket '$TERRAFORM_STATE_BUCKET' 2>/dev/null"
TF_STATE_BUCKET_LOOKUP_RESULT=$?
set -e

if [ "$TF_STATE_BUCKET_LOOKUP_RESULT" -ne 0 ]
then
    echo "Error: Terraform remote state store doesn't exist for environment '$ENV'"
    exit 2
fi

if [ "$ENV" != "prod" ]; then
  APP_BUCKET_ENV_URL_PART="$ENV."
fi

APP_DEPLOYMENT_BUCKET=www.${APP_BUCKET_ENV_URL_PART}digitize.benyon.io

(
    cd infra
    echo -e "\nInitialising Terraform for environment '$ENV'..."
    terraform init \
        -backend-config="bucket=$TERRAFORM_STATE_BUCKET"

    echo -e "\nDeleting contents of app deployment bucket..."
    aws s3 rm "s3://$APP_DEPLOYMENT_BUCKET" --recursive

    echo -e "\nDeleting infra..."
    terraform destroy \
        -var "environment=$ENV" \
        -var "latest_ssl_cert_arn="
)

echo -e "\nDeleting terraform state..."
aws s3 rb "s3://$TERRAFORM_STATE_BUCKET" --force
