if [ -z ${ENV+x} ]; then echo "ENV is unset"; exit 1; else echo "ENV is set ($ENV)"; fi
if [ -z ${GANDI_API_KEY+x} ]; then echo "GANDI_API_KEY is unset"; exit 1; else echo "GANDI_API_KEY is set"; fi

source python-virtualenv-ci-cert-gen/bin/activate

ansible-playbook -c local \
  -e ansible_python_interpreter=$(which python) \
  -i localhost, \
  -e env="'${ENV}'" \
  -e gandi_api_key="'${GANDI_API_KEY}'" \
  build-scripts/generate-ssl-cert.yml
