class DistributionIdFinder:
    def __init__(self, cloudfront_wrapper):
        self.cloudfront_wrapper = cloudfront_wrapper

    def get_distribution_id(self, env):
        distributions = self.cloudfront_wrapper.list_distributions()['DistributionList']
        expected_origin_id = 'io.benyon.digitize.{env}'.format(env=env)
        matching_distributions = [distribution['Id'] for distribution in distributions['Items'] if dist_has_origin_id(distribution, expected_origin_id)]

        if not matching_distributions:
            raise DistributionNotFoundError(expected_origin_id)

        return matching_distributions[0]


def dist_has_origin_id(dist, origin_id):
    origin_items = dist.get('Origins', {}).get('Items', {})

    if not origin_items:
        return False

    origin_ids = [item['Id'] for item in origin_items]
    return any(this_id == origin_id for this_id in origin_ids)


class DistributionNotFoundError(Exception):
    def __init__(self, origin_id):
        Exception('No distribution for origin id \'{}\' found', origin_id)
