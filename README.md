# Digitize

Storing paper documents is annoying. Even with online billing and communications there are still some things that end up being received in hardcopy. This is a web front end that allows for quickly creating digital copies of those paper docs.

Workflow is something like:

* Receive letter in post
* Use phone to take picture and archive in Dropbox
* Shred letter and recycle

## Running the app

In the `app` directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

## Deploying the app

Note, all commands support the AWS_PROFILE environment variable. It is encouraged to use this environment variable rather than relying on default configured profile.

### Initialising

```bash
AWS_ACCESS_KEY_ID=<your_access_key_id> AWS_SECRET_ACCESS_KEY=<your-access-key> terraform init
```

## Deploy to AWS

For all deploy jobs the environment variable `ENV` is used to determine where to deploy to (which AWS resources are created/replaced/deleted).

### Setup

Running deploy scripts will require [Terraform](https://www.terraform.io/). For macOS, suggest installing with [homebrew](https://brew.sh/). For explicit version of Terraform used on CI see version downloaded in script `build-scripts/ci-install-terraform.sh`.

For instance:

`brew install terraform`

Deploy scripts also require the [AWS CLI](https://aws.amazon.com/cli/). Suggested way to install is with Python package from pip. Suggest installing in a [Python venv](https://docs.python.org/3/tutorial/venv.html) to create a dedicated operating environment for the project.

From root dir of the project run:

```
python3 -m venv digitize-venv
source digitize-venv/bin/activate
pip install awscli
```

Then, to enable that environment before running deploy scrips you can do:

`source digitize-venv/bin/activate`

### Step 1: Generate SSL Cert

Requests SSL cert from certificate authority and uploads to AWS.

```bash
[AWS_PROFILE=profile-name] [ENV=dev|prod] [GANDI_API_KEY=key] [GANDI_DNS_ZONE_ID=id] ./build-scripts/generate-ssl-cert.sh
```

GANDI\_API\_KEY: API Key for Gandi LiveDNS (authoritative name server).
GANDI\_DNS\_ZONE\_ID: Id for zone containing digitize.benyon.io DNS zone entries.

### Step 2: Update infra

Requires SSL cert has been generated using above step.

Creates (and maintains) the AWS S3 bucket and infra required to host site.

```bash
[AWS_PROFILE=profile-name] [ENV=dev|prod] ./build-scripts/deploy-infra.sh
```

### Step 3: Deploy app

Creates a production build and uploads to S3 bucket.

```bash
[AWS_PROFILE=profile-name] [ENV=dev|prod] ./build-scripts/deploy-app.sh
```