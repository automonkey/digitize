#!/usr/bin/env bash

set -eo pipefail

aws s3api create-bucket --region eu-west-2 --bucket www.digitize.benyon.io.terraform --create-bucket-configuration LocationConstraint=eu-west-2

echo -e '\n\nIt will now be necessary to initialise the terraform backend. To do this run "terraform init" in the main project directory\n'
read -p 'Once done, press enter to continue...'

(
    cd infra
    terraform env new prod
    terraform env select default
)
