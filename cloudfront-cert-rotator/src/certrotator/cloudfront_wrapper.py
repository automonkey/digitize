import boto3


class CloudfrontWrapper:
    def __init__(self):
        self.cloudfront_client = boto3.client("cloudfront")

    def get_distribution_config(self, distribution_id):
        return self.cloudfront_client.get_distribution_config(Id=distribution_id)

    def update_distribution_config(self, distribution_id, if_etag_matches, distribution_configuration):
        self.cloudfront_client.update_distribution(
            Id=distribution_id, IfMatch=if_etag_matches, DistributionConfig=distribution_configuration
        )
