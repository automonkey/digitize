variable "environment" {
  type = string
}

provider "aws" {
  region  = "eu-west-2"
}

provider "aws" {
  alias   = "us-east-1"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    key    = "digitize.tfstate"
    region = "eu-west-2"
  }
}

locals {
  site_url = "www.${var.environment != "prod" ? "${var.environment}." : ""}digitize.benyon.io"
}

resource "aws_s3_bucket" "web_bucket" {
  bucket = "io.benyon.digitize.${var.environment}.www"
}

resource "aws_s3_bucket_acl" "example_bucket_acl" {
  bucket = aws_s3_bucket.web_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "cloudfront_web_bucket_access_policy" {
  bucket = aws_s3_bucket.web_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_web_bucket_access_doc.json
}

data "aws_iam_policy_document" "cloudfront_web_bucket_access_doc" {
  policy_id = "bucket_policy_site"

  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }

    actions = [
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.web_bucket.arn
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.web_bucket.arn}/*",
    ]
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  aliases = [local.site_url]

  origin {
    domain_name = aws_s3_bucket.web_bucket.bucket_domain_name
    origin_id   = "io.benyon.digitize.${var.environment}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.environment}.digitize.benyon.io web bucket distribution"
  default_root_object = "index.html"

  custom_error_response {
    error_code         = 404
    response_code      = 200
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
    acm_certificate_arn      = aws_acm_certificate.tls_certificate.arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "${var.environment}.digitize.benyon.io origin access identity"
}

resource "aws_acm_certificate" "tls_certificate" {
  provider          = aws.us-east-1
  domain_name       = local.site_url
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}
