import unittest
from unittest.mock import MagicMock, Mock, DEFAULT

from hamcrest import assert_that, is_, contains
import io

from src.certrotator.cert_rotater import CertRotater
from src.certrotator.cert_updater import CertUpdater
from src.certrotator.distribution_id_finder import DistributionIdFinder, DistributionNotFoundError


def test_cert_rotater_looks_up_distribution_and_updates_cert():
    dist_id_finder = DistributionIdFinder(cloudfront_wrapper=object())
    cert_updater = CertUpdater(cloudfront_wrapper=object())

    the_env = 'some-env'
    the_envs_distribution_id = 'the-distribution-id'

    dist_id_finder.get_distribution_id = Mock(
        return_value=the_envs_distribution_id,
        side_effect=error_if_env_not(the_env)
    )

    cert_updater.update_cert = MagicMock()

    # When
    new_cert_arn = "new:certificate:arn"
    CertRotater(distribution_id_finder=dist_id_finder, cert_updater=cert_updater)\
        .rotate_cert(env=the_env, cert_arn=new_cert_arn)

    cert_updater.update_cert.assert_called_once
    update_call_args = cert_updater.update_cert.call_args_list[0][1]

    assert_that(update_call_args["cf_distribution_id"], is_(the_envs_distribution_id))
    assert_that(update_call_args["cert_arn"], is_(new_cert_arn))


@unittest.mock.patch('sys.stdout', new_callable=io.StringIO)
def test_cert_rotater_reports_error_if_distribution_does_not_exist(std_out):
    dist_id_finder = DistributionIdFinder(cloudfront_wrapper=object())
    cert_updater = CertUpdater(cloudfront_wrapper=object())

    dist_id_finder.get_distribution_id = Mock(
        side_effect=DistributionNotFoundError("Testing where dist not found")
    )

    cert_updater.update_cert = MagicMock()

    CertRotater(distribution_id_finder=dist_id_finder, cert_updater=cert_updater) \
        .rotate_cert(env="some-env", cert_arn="something-that-doesnt-exist")

    output = std_out.getvalue().splitlines()
    assert_that(output, contains("No distribution to update"))


def error_if_env_not(env):
    def fn(supplied_env):
        if supplied_env != env:
            raise Exception(
                "Fetched distribution id for the wrong env. "
                + "Requested '{got}' when you should have been attempting to update '{expected}'".format(
                    got=supplied_env, expected=id
                )
            )

        return DEFAULT

    return fn