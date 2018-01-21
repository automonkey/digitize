#!/usr/bin/env bash

set -eo pipefail

if [ -z ${ENV+x} ]; then
  echo "Warning: ENV not set. Defaulting to dev environment"
  ENV="dev"
fi


if [ "$ENV" != "prod" ]; then
  ENV_URL_PART="$ENV."
fi

AWS_DEPLOYMENT_BUCKET=www.${ENV_URL_PART}digitize.benyon.io

(
    cd app
    nvm install
    npm install
    npm run build
    aws s3 sync build s3://$AWS_DEPLOYMENT_BUCKET --delete
)
