#!/usr/bin/env bash

set -eo pipefail

apt-get update
apt-get install -y -qq software-properties-common
apt-add-repository --yes ppa:ansible/ansible
apt-get update
apt-get install -y -qq ansible
