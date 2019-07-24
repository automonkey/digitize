import argparse
import logging
import sys
import warnings

from src.certrotator.cert_updater import CertUpdater
from src.certrotator.cloudfront_wrapper import CloudfrontWrapper

logger = logging.getLogger(__name__)


def main():
    args = parse_args()
    CertUpdater(CloudfrontWrapper()).update_cert(cf_distribution_id=args.distribution_id, cert_arn=args.certificate_arn)


def parse_args():
    args = create_parser().parse_args()
    init_logging(args.verbosity)
    logger.debug("args: %s", args)

    return args


def create_parser():
    parser = argparse.ArgumentParser(
        description="Update existing CloudFront distribution with new TLS viewer certificate."
    )

    parser.add_argument("env", help="Environment to rotate the cert of")
    parser.add_argument("certificate_arn", help="New certificate to use")

    parser.add_argument("-d", "--dry-run", action="store_true", help="Dry run - don't actually rename anything")

    parser.add_argument(
        "-v",
        "--verbosity",
        action="count",
        default=0,
        help="Specify up to three times to increase verbosity, "
        "i.e. -v to see warnings, -vv for information messages, "
        "or -vvv for debug messages.",
    )
    parser.add_argument("-V", "--version", action="version", version="0.1")

    return parser


def init_logging(verbosity, stream=sys.stdout, silence_packages=()):
    LOG_LEVELS = [logging.ERROR, logging.WARNING, logging.INFO, logging.DEBUG]
    level = LOG_LEVELS[min(verbosity, len(LOG_LEVELS) - 1)]
    msg_format = "%(message)s"
    if level == logging.DEBUG:
        warnings.filterwarnings("ignore")
        msg_format = "%(asctime)s %(levelname)-8s %(name)s " "%(module)s.py:%(funcName)s():%(lineno)d %(message)s"
    logging.basicConfig(level=level, format=msg_format, stream=stream)

    for package in silence_packages:
        logging.getLogger(package).setLevel(max([level, logging.WARNING]))
