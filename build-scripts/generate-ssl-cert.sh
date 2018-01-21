if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi
if [ -z ${GANDI_API_KEY+x} ]; then echo "GANDI_API_KEY is unset"; exit 1; else echo "GANDI_API_KEY is set"; fi
if [ -z ${GANDI_DNS_ZONE_ID+x} ]; then echo "GANDI_DNS_ZONE_ID is unset"; exit 1; else echo "GANDI_DNS_ZONE_ID is set"; fi

source python-virtualenv-ci-cert-gen/bin/activate

ansible-playbook -c local \
  -e ansible_python_interpreter=$(which python) \
  -i localhost, \
  -e env="'${ENV}'" \
  -e gandi_api_key="'${GANDI_API_KEY}'" \
  -e gandi_dns_zone_id="'${GANDI_DNS_ZONE_ID}'" \
  build-scripts/generate-ssl-cert.yml
