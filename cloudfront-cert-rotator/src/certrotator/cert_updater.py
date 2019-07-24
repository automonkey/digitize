class CertUpdater:
    def __init__(self, cloudfront_wrapper):
        self.cloudfront_wrapper = cloudfront_wrapper

    def update_cert(self, cf_distribution_id, cert_arn):
        distribution_config_response = self.cloudfront_wrapper.get_distribution_config(cf_distribution_id)
        distribution_config = distribution_config_response["DistributionConfig"]
        distribution_config["ViewerCertificate"]["ACMCertificateArn"] = cert_arn
        del distribution_config["ViewerCertificate"]["Certificate"]

        self.cloudfront_wrapper.update_distribution_config(
            distribution_id=cf_distribution_id,
            if_etag_matches=distribution_config_response["ETag"],
            distribution_configuration=distribution_config,
        )
