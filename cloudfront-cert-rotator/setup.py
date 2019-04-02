#!/usr/bin/env python
from glob import glob

from setuptools import find_packages, setup

setup(name='cloudfront-cert-rotator',
      description="Update existing CloudFront distribution with new TLS viewer certificate",
      url='https://github.com/automonkey/digitize',
      author='Will Benyon',
      author_email='git@benyon.io',
      install_requires=[r.strip() for r in open("requirements.txt").readlines()],
      extras_require={
          'test': [r.strip() for r in open("test_requirements.txt").readlines()],
      },
      packages=find_packages(exclude=['test*']),
      zip_safe=False,
      entry_points={
          'console_scripts': [
              'rotate-cf-cert = src.cli:main',
          ]
      }
)
