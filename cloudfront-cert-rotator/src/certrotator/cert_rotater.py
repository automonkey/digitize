from src.certrotator.distribution_id_finder import DistributionNotFoundError


class CertRotater:
    def __init__(self, distribution_id_finder, cert_updater):
        self.distribution_id_finder = distribution_id_finder
        self.cert_updater = cert_updater

    def rotate_cert(self, env, cert_arn):
        try:
            distribution_id = self.distribution_id_finder.get_distribution_id(env)
            self.cert_updater.update_cert(cf_distribution_id=distribution_id, cert_arn=cert_arn)
        except DistributionNotFoundError:
            print("No distribution to update")
