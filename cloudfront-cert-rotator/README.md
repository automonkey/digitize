# CloudFront Cert Rotator

## Installing & Running CLI app

For if you just want to run the app.

Ensure you are not in a virtual env, and run:
```
make install
```

Add bin location to path with:
```
export PATH="`make getbinpath`:$PATH"
```

Run using:
```
rotate-cf-cert <distribution_id> <certificate_arn>
```

## Developing

### One time setup - Virtual env

Set up the virtual environment (just once, after checking out the repo).

From the cloudfront-cert-rotator directory run:

```
python3 -m venv --prompt cloudfront-cert-rotator venv
```

### When developing

Every time you start a new terminal session:
```
source venv/bin/activate
```

To install dependencies:
```
make deps
```

To run locally (dev run):
```
python3 app.py
```

### Tools

The following tools are used by commands in the Makefile and should be installed:

[Black](https://black.readthedocs.io/en/stable/installation_and_usage.html) (e.g. `pip3 install black``)