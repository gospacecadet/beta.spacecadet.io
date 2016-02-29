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

````

Scripts are available to perform this in bulk.
They have been moved out of source control.
If interested, please contact marvin@unplugged.im

````

cd packages/
// Development - link to local versions of packages
ln -s /PATH_TO_PROJECT/mart-vibe-spacecadet/packages/
ln -s /PATH_TO_PROJECT/mart
ln -s /PATH_TO_PROJECT/bootstrap
ln -s /PATH_TO_PROJECT/talk
ln -s /PATH_TO_PROJECT/lorem-ipsum

// Change to spacecadet branch of bootstrap
cd bootstrap
git checkout spacecadet

// Go back to root
cd ..

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

// Deploy!
modulus deploy

//http://stackoverflow.com/questions/28585818/meteor-android-apps-does-not-install-on-4-1-1/29562922#29562922
android
meteor build ~/MEGA/spacecadet/deploy/dist --server https://galaxy.spacecadet.io

keytool -genkey -alias beta-spacecadet-io -keyalg RSA -keysize 2048 -validity 10000 -keystore spacecadet.keystore

jarsigner -keystore spacecadet.keystore -digestalg SHA1 -sigalg MD5withRSA -tsa http://timestamp.digicert.com  release-unsigned.apk beta-spacecadet-io
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

Video
-----
1) Upload to youtube
2) download compressed mp4 version from there
3) convert to webm

ffmpeg -i spacecadet.mp4 -s 480x360 -vpre libvpx-720p -b 3900k -pass 1 -an -f webm -y spacecadet.webm
ffmpeg -i spacecadet.mp4 -s 480x360 -vpre libvpx-720p -b 3900k -pass 2 -acodec libvorbis -ab 100k -f webm -y spacecadet.webm

4) convert to ogv
ffmpeg -i kideatsdirt.mp4 -acodec vorbis -vcodec libtheora kideatsdirt.ogv
