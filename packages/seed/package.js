Package.describe({
  name: 'seed',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Seed Mart project with SpaceCadet data',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/marvinmarnold/beta.spacecadet.io',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'random', 'underscore']);

  api.use('marvin:lorem-ipsum@0.0.1')
  api.use('marvin:mart')

  api.addFiles('seed.js', 'server');

  api.export('Seed');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('seed');
  api.use('marvin:mart')
  api.addFiles('seed-tests.js', 'server');
});
