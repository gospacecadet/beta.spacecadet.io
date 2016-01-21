SpaceCadet
==========

````
// Download all packages
git clone git@github.com:marvinmarnold/beta.spacecadet.io.git
git clone git@github.com:marvinmarnold/mart-vibe-spacecadet.git
git clone git@github.com:marvinmarnold/mart.git
git clone git@github.com:marvinmarnold/bootstrap.git
git clone git@github.com:marvinmarnold/talk.git
git clone git@github.com:marvinmarnold/lorem-ipsum.git

// Should look like
// ~/PATH_TO_PROJECT/beta.spacecadet.io
// ~/PATH_TO_PROJECT/mart-vibe-spacecadet
// ~/PATH_TO_PROJECT/mart
// ~/PATH_TO_PROJECT/bootstrap
// ~/PATH_TO_PROJECT/talk
// ~/PATH_TO_PROJECT/lorem-ipsum

cd beta.spacecadet.io
mkdir scripts

// Development - setup git processes
mv example_git_fetch_script.sh fetch.sh
chmod +x scripts/fetch.sh

// Usage `./scripts/fetch.sh` to get updates from bootstrap, beta, mart, mart-vibe

mv example_git_push_script.sh push.sh
chmod +x scripts/push.sh

// Usage `./scripts/push.sh 'COMMIT COMMAND'` to add ALL CHANGES to

// Development - link to local versions of packages
ln -s ~/PATH_TO_PROJECT/mart-vibe-spacecadet
ln -s ~/PATH_TO_PROJECT/mart
ln -s ~/PATH_TO_PROJECT/bootstrap
ln -s ~/PATH_TO_PROJECT/talk
ln -s ~/PATH_TO_PROJECT/lorem-ipsum

// Set environment variables
mkdir settings
mv settings_example.json settings/dev_settings.json
// INPUT ENVIRONMENT VARIABLES

// Start
meteor --settings settings/dev_settings.json

// Deployment
mv settings_example.json settings/staging_settings.json
// INPUT ENVIRONMENT VARIABLES

// Send environment variables to Modulus
modulus env set METEOR_SETTINGS "$(cat settings/staging_settings.json)"

````




This is the primary repository for [SpaceCadet](https://spacecadet.io). This also serves as the initial proof of concept app for the Meteor plugin [Mart](https://github.com/marvinmarnold/mart).

**WARNING: This is a very early work in progress**

Installation
------------

### Install Mart plugin

**DEVELOPMENT** (current):

```
mkdir packages && cd packages
git clone git@github.com:marvinmarnold/mart.git packages/mart
git clone git@github.com:marvinmarnold/mart-vibe-spacecadet.git
```

**STABLE** (eventually): `meteor add marvin:mart`
**STABLE** (eventually): `meteor add marvin:mart-vibe-spacecadet`

### Configure Mart

Run `cp settings_example.json settings.json`

Change settings.json to match values given by Stripe:

```
{
  "MartStripePublicKey": "PK_KEY",
  "MartStripeSecretKey": "SK_KEY",
  "AWSAccessKeyId": "KEY",
  "AWSSecretAccessKey": "KEY"
}
```

Setup CORS on AWS for [Slingshot](https://github.com/CulturalMe/meteor-slingshot).

Usage
-----

Run `meteor --settings settings.json`

Deploy
------

Modulus
=====
modulus env set METEOR_SETTINGS "$(cat settings/staging_settings.json)"

Galaxy
=====
DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy galaxy.spacecadet.io --settings settings/galaxy_settings.json

Development
-----------

Line count: cloc . --exclude-dir .meteor,packages


SSL
---
https://certsimple.com/blog/openssl-csr-command
https://nicolas.perriault.net/code/2012/gandi-standard-ssl-certificate-nginx/
