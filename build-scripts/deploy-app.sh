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
echo "Deploying to bucket '$AWS_DEPLOYMENT_BUCKET'"

(
    cd app
    nvm install
    npm install
    npm run build
    aws s3 sync build s3://$AWS_DEPLOYMENT_BUCKET --delete
)

CLOUDFRONT_ORIGIN_ID=${ENV}.digitize.benyon.io
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?contains(Origins.Items[*].Id, '$CLOUDFRONT_ORIGIN_ID')]|[0].Id" \
    --output text \
)

echo "Invalidating CloudFront distribution with origin '$CLOUDFRONT_ORIGIN_ID' ($CLOUDFRONT_DISTRIBUTION_ID)"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
