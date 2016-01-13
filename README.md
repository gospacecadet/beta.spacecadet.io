SpaceCadet
==========

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
modulus env set METEOR_SETTINGS "$(cat staging_settings.json)"

Galaxy
=====
DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy galaxy.spacecadet.io --settings galaxy_settings.json

Development
-----------

Line count: cloc . --exclude-dir .meteor,packages


SSL
---
https://certsimple.com/blog/openssl-csr-command
https://nicolas.perriault.net/code/2012/gandi-standard-ssl-certificate-nginx/
