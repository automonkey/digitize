#!/usr/bin/env bash

set -eo pipefail

export AWS_PAGER=""

if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi

TERRAFORM_STATE_BUCKET="io.benyon.digitize.$ENV.terraform"

echo "Ensuring Terraform remote state store exists..."
CREATE_OUTPUT=$(aws s3api create-bucket --region eu-west-2 --bucket $TERRAFORM_STATE_BUCKET --create-bucket-configuration LocationConstraint=eu-west-2 2>&1) || {
    if [[ "$CREATE_OUTPUT" == *"BucketAlreadyOwnedByYou"* ]]; then
        echo "Bucket already exists, continuing..."
    else
        echo "$CREATE_OUTPUT"
        exit 1
    fi
}

(
    cd infra
    terraform init \
        -backend-config="bucket=$TERRAFORM_STATE_BUCKET"
    terraform apply \
        -auto-approve \
        -var "environment=$ENV"
)
