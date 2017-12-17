variable "environment" {
  type    = "string"
}

provider "aws" {
  region  = "eu-west-2"
}

terraform {
  backend "s3" {
    bucket  = "www.digitize.benyon.io.terraform"
    key     = "network/terraform-dev.tfstate"
    region  = "eu-west-2"
  }
}

resource "aws_s3_bucket" "web_bucket" {
  bucket = "www.${var.environment == "prod" ? "" : "${var.environment}."}digitize.benyon.io"
  acl    = "public-read"

  policy = <<EOF
{
"Id": "bucket_policy_site",
"Version": "2012-10-17",
"Statement": [
  {
    "Sid": "bucket_policy_site_main",
    "Action": [
      "s3:GetObject"
    ],
    "Effect": "Allow",
    "Resource": "arn:aws:s3:::www.${var.environment == "prod" ? "" : "${var.environment}."}digitize.benyon.io/*",
    "Principal": "*"
  }
]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

