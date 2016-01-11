Package.describe({
  name: 'migrations.beta.spacecadet.io',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'underscore', 'mongo', 'random', 'email']);

  api.use('marvin:mart')

  api.addFiles([
    'lib/email.js',
    'lib/spacecadet-migrator.js',
    'lib/imported-collections.js',
    'lib/migrations.beta.spacecadet.io.js'
  ], 'server');

  api.export('Migrator', 'server')
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest'
  ]);

  api.use('marvin:mart')
  api.use('migrations.beta.spacecadet.io');

  api.addFiles('migration-tests.js', 'server');
});
