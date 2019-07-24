import random
import string

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


def a_boto3_cloudfront_list_distributions_response(with_items=NOT_PASSED):
    return {
        "DistributionList": {
            "IsTruncated": False,
            "Items": with_items if with_items != NOT_PASSED else [a_boto3_cloudfront_list_distributions_response_item()]
        }
    }


def a_boto3_cloudfront_list_distributions_response_item(with_origins=NOT_PASSED, with_id=NOT_PASSED):
    distribution_id = with_id if with_id != NOT_PASSED else ''.join(random.choices(string.ascii_uppercase + string.digits, k=14))
    return {
        'ARN': 'arn:aws:cloudfront::123456789012:distribution/{}'.format(distribution_id),
        'Origins': list_distributions_response_origins_item(with_origins if with_origins != NOT_PASSED else []),
        'Id': distribution_id
    }


def list_distributions_response_origins_item(origin_ids):
    return {
        'Items': [{'Id': id} for id in origin_ids],
        'Quantity': len(origin_ids)
    }
