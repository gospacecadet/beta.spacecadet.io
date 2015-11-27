SpaceCadet
==========

This is the primary repository for [SpaceCadet](https://spacecadet.io). This also serves as the initial proof of concept app for the Meteor plugin [Mart](https://github.com/marvinmarnold/meteor-mart).

**WARNING: This is a very early work in progress**

Installation
------------

### Install Mart plugin

**DEVELOPMENT** (current):

```
[/beta.spacecadet.io]$ mkdir packages
[/]$ cd ..
[/]$ git clone git@github.com:marvinmarnold/mart.git
[/]$ ln -s mart beta.spacecadet.io/packages
```

**STABLE** (eventually): `meteor add marvin:mart`

### Configure Mart

Run `cp settings_example.json settings.json`

Change settings.json to match values given by Stripe:

```
{
  "MartStripePublicKey": "PK_KEY",
  "MartStripeSecretKey": "SK_KEY"
}
```

Usage
-----

Run `meteor --settings settings.json`
