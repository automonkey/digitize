variable "environment" {
  type = "string"
}

variable "latest_ssl_cert_arn" {
  type = "string"
}

provider "aws" {
  version = "~> 1.14"
  region = "eu-west-2"
}

terraform {
  backend "s3" {
    key     = "digitize.tfstate"
    region  = "eu-west-2"
  }
}

resource "aws_s3_bucket" "web_bucket" {
  bucket = "io.benyon.digitize.${var.environment}.www"
  acl    = "private"

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
    "Resource": "arn:aws:s3:::io.benyon.digitize.${var.environment}.www/*",
    "Principal": {
      "AWS": "${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"
    }
  }
]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {

  aliases = ["www.${var.environment != "prod" ? "${var.environment}." : ""}digitize.benyon.io"]

  origin {
    domain_name = "${aws_s3_bucket.web_bucket.bucket_domain_name}"
    origin_id   = "io.benyon.digitize.${var.environment}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.environment}.digitize.benyon.io web bucket distribution"
  default_root_object = "index.html"
  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "io.benyon.digitize.${var.environment}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${var.latest_ssl_cert_arn}"
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "${var.environment}.digitize.benyon.io origin access identity"
}
