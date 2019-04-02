from hamcrest import has_entry, assert_that, has_key, not_, is_

from src.certrotator.cert_rotator import CertRotator
from unittest.mock import MagicMock, Mock, DEFAULT

from src.certrotator.cloudfront_wrapper import CloudfrontWrapper
from test.unit.builders import a_boto3_cloudfront_get_distribution_response


def test_updates_cert_arn_for_supplied_distribution_id():
    # Given
    cf_wrapper = CloudfrontWrapper()

    the_existing_distribution_id = "some-distribution-id"
    initial_distribution_config_etag = "GetRequestEtag"

    cf_wrapper.get_distribution_config = Mock(
        return_value=a_boto3_cloudfront_get_distribution_response(
            with_acm_certificate_arn="old:certificate:arn", with_etag=initial_distribution_config_etag
        ),
        side_effect=error_if_distribution_id_not(the_existing_distribution_id),
    )
    cf_wrapper.update_distribution_config = MagicMock()

    # When
    new_cert_arn = "new:certificate:arn"
    CertRotator(cf_wrapper).rotate_cert(the_existing_distribution_id, new_cert_arn)

    # Then

    # Updates distribution
    cf_wrapper.update_distribution_config.assert_called_once
    update_call_args = cf_wrapper.update_distribution_config.call_args_list[0][1]

    # updates correct distribution id
    assert_that(update_call_args["distribution_id"], is_(the_existing_distribution_id))

    # includes the etag from the latest fetched config
    assert_that(update_call_args["if_etag_matches"], is_(initial_distribution_config_etag))

    # distribution config supplied includes viewer certificate info
    distribution_config = update_call_args["distribution_configuration"]
    viewer_certificate = distribution_config["ViewerCertificate"]

    # ... with new cert
    assert_that(viewer_certificate["ACMCertificateArn"], is_(new_cert_arn))

    # ... but without deprecated 'Certificate' field which is present in the get distribution config response
    assert_that(viewer_certificate, not_(has_key("Certificate")))


def error_if_distribution_id_not(id):
    def fn(supplied_id):
        if supplied_id != id:
            raise Exception(
                "Fetched config for wrong distribution Id. "
                + "Requested '{got}' when you should have been attempting to update '{expected}'".format(
                    got=supplied_id, expected=id
                )
            )

        return DEFAULT

    return fn
