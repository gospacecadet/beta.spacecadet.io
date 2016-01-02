Package.describe({
  name: 'marvin:tether',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'tether':'1.1.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript'], 'client')
  api.use(['cosmos:browserify@0.9.2'], 'client');
  api.addFiles('tether.browserify.js', 'client');

  api.export('Tether', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('marvin:tether');
  api.addFiles('tether-tests.js', 'client');
});
