# Digitize

Storing paper documents is annoying. Even with online billing and communications there are still some things that end up being received in hardcopy. This is a web front end that allows for quickly creating digital copies of those paper docs.

Workflow is something like:

* Receive letter in post
* Use phone to take picture and archive in Dropbox
* Shred letter and recycle

## Running the app

In the project directory, you can run:

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

### Bootstrap

The project uses an S3 backend to store the terraform state. To create the bucket required for this, execute:

```bash
[AWS_PROFILE=profile-name] ./bootstap-infra.sh
```

Requires [awscli](https://aws.amazon.com/cli/) to be installed.

### Initialising

```bash
AWS_ACCESS_KEY_ID=<your_access_key_id> AWS_SECRET_ACCESS_KEY=<your-access-key> terraform init
```

## Deploy to AWS

For all deploy jobs the environment variable `ENV` is used to determine where to deploy to (which AWS resources are created/replaced/deleted).

### Update infra

Creates (and maintains) the AWS S3 bucket and infra required to host site.

```bash
[AWS_PROFILE=profile-name] [ENV=dev|prod] ./deploy-infra.sh
```

### Deploy app

Creates a production build and uploads to S3 bucket.

```bash
[AWS_PROFILE=profile-name] [ENV=dev|prod] ./deploy-app.sh
```