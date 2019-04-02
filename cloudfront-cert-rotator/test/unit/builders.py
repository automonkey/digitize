NOT_PASSED = object()


def a_boto3_cloudfront_get_distribution_response(with_acm_certificate_arn=NOT_PASSED, with_etag=NOT_PASSED):
    certificate_arn = (
        with_acm_certificate_arn
        if with_acm_certificate_arn != NOT_PASSED
        else "arn:aws:acm:us-east-1:123456789012:certificate/4f9202ad-acff-4849-85e5-6a4f2d2b7ba6"
    )
    etag = with_etag if with_etag != NOT_PASSED else "E3F2583355C3ED"

    return {
        "DistributionConfig": {
            "OtherStuff": "Would be here",
            "ViewerCertificate": {
                "ACMCertificateArn": certificate_arn,
                "SSLSupportMethod": "sni-only",
                "MinimumProtocolVersion": "TLSv1.2_2018",
                "Certificate": certificate_arn,
                "CertificateSource": "acm",
            },
        },
        "ETag": etag,
    }
