import pytest
from hamcrest import assert_that, is_

from unittest.mock import MagicMock, Mock, DEFAULT

from src.certrotator.cloudfront_wrapper import CloudfrontWrapper
from src.certrotator.distribution_id_finder import DistributionIdFinder, dist_has_origin_id, \
    DistributionNotFoundError
from test.unit.builders import a_boto3_cloudfront_list_distributions_response, \
    a_boto3_cloudfront_list_distributions_response_item, list_distributions_response_origins_item


def test_gets_distribution_id_for_env():
    # Given
    cf_wrapper = CloudfrontWrapper()

    the_env = "ggg"
    the_existing_distribution_id = "some-distribution-id"

    cf_wrapper.list_distributions = Mock(
        return_value=a_boto3_cloudfront_list_distributions_response(
            with_items=[
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['io.benyon.digitize.prod']),
                a_boto3_cloudfront_list_distributions_response_item(
                    with_origins=['io.benyon.digitize.{env}'.format(env=the_env)],
                    with_id=the_existing_distribution_id
                ),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['io.benyon.digitize.test']),
                a_boto3_cloudfront_list_distributions_response_item()
            ]
        )
    )
    cf_wrapper.update_distribution_config = MagicMock()

    # When
    returned_id = DistributionIdFinder(cf_wrapper).get_distribution_id(the_env)

    # Then
    assert_that(returned_id, is_(the_existing_distribution_id))


def test_gets_distribution_id_for_env_throws_error_when_no_match():
    # Given
    cf_wrapper = CloudfrontWrapper()

    the_env = "ggg"

    cf_wrapper.list_distributions = Mock(
        return_value=a_boto3_cloudfront_list_distributions_response(
            with_items=[
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['no']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['dist']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['with']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['correct']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['origin']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['id']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['for']),
                a_boto3_cloudfront_list_distributions_response_item(with_origins=['env']),
            ]
        )
    )
    cf_wrapper.update_distribution_config = MagicMock()

    # When
    # Then
    with pytest.raises(DistributionNotFoundError):
        DistributionIdFinder(cf_wrapper).get_distribution_id(the_env)


def test_dist_has_origin_id_reports_true_if_origin_id_matches():
    dist = a_boto3_cloudfront_list_distributions_response_item(with_origins=['another-id', 'the-id', 'some-other-id'])
    assert_that(dist_has_origin_id(dist, 'the-id'), is_(True))


def test_dist_has_origin_id_reports_false_if_no_origin_id_match():
    dist = a_boto3_cloudfront_list_distributions_response_item(with_origins=['some-id'])
    assert_that(dist_has_origin_id(dist, 'different-id'), is_(False))


def test_dist_has_origin_id_reports_false_if_no_origins_exist():
    dist = a_boto3_cloudfront_list_distributions_response_item(with_origins=[])
    assert_that(dist_has_origin_id(dist, 'different-id'), is_(False))
