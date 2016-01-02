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
  api.use(['ecmascript', 'underscore']);

  api.use('marvin:mart')

  api.addFiles([
    'stations/00-stations.js',
    'stations/01-ten_eleven.js',
    'stations/02-geekdom.js',
    'stations/03-eastside_warehouse.js',
    'stations/04-outdoor_lot.js',
    // 'stations/05-ten_eleven.js',
    // 'stations/06-ten_eleven.js',
    // 'stations/07-ten_eleven.js',
    // 'stations/08-ten_eleven.js',
    // 'stations/09-ten_eleven.js',
  ], 'server');

  api.addFiles('migrations.beta.spacecadet.io.js', 'server');

  api.export('SpaceCadetMigration', 'server')
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest'
  ]);

  api.use('marvin:mart')
  api.use('migrations.beta.spacecadet.io');

  api.addFiles('migrations.beta.spacecadet.io-tests.js', 'server');
});
