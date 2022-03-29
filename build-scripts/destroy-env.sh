#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "Destroying ENV '$ENV'"; fi

TERRAFORM_STATE_BUCKET="io.benyon.digitize.$ENV.terraform"

set +e
eval "aws s3api head-bucket --bucket '$TERRAFORM_STATE_BUCKET' 2>/dev/null"
TF_STATE_BUCKET_LOOKUP_RESULT=$?
set -e

if [ "$TF_STATE_BUCKET_LOOKUP_RESULT" -ne 0 ]
then
    echo "Error: Terraform remote state store doesn't exist for environment '$ENV'"
    exit 2
fi

AWS_DEPLOYMENT_BUCKET="io.benyon.digitize.$ENV.www"

(
    cd infra
    echo -e "\nInitialising Terraform for environment '$ENV'..."
    terraform init \
        -backend-config="bucket=$TERRAFORM_STATE_BUCKET"

    echo -e "\nDeleting contents of app deployment bucket..."
    aws s3 rm "s3://$APP_DEPLOYMENT_BUCKET" --recursive

    echo -e "\nDeleting infra..."
    terraform destroy \
        -var "environment=$ENV"
)

echo -e "\nDeleting terraform state..."
aws s3 rb "s3://$TERRAFORM_STATE_BUCKET" --force
