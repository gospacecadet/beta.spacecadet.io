App.info({
  id: 'io.spacecadet',
  name: 'SpaceCadet',
  description: 'StingWatch',
  author: 'Rent commercial space for one month or less from local landlords and businesses ',
  email: 'hello@spacecadet.io',
  website: 'https://spacecadet.io'
});

App.icons({
  iphone: 'public/apple-icon.png',
  iphone_2x: 'public/apple-icon-144x144.png',
  iphone_3x: 'public/apple-icon-180x180.png',
  ipad: 'public/apple-icon.png',
  ipad_2x: 'public/apple-icon-144x144.png',
  android_ldpi: 'public/android-icon-36x36.png',
  android_mdpi: 'public/android-icon-48x48.png',
  android_hdpi: 'public/android-icon-72x72.png',
  android_xhdpi: 'public/android-icon-192x192.png'
});

App.accessRule('https://*.amazonaws.com');
App.accessRule('https://*.spacecadet.io');
