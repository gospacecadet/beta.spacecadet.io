Meteor.startup(function () {
  smtp = {
    username: Meteor.settings.SMTP_USERNAME,   // eg: server@gentlenode.com
    password: Meteor.settings.SMTP_PASSWORD,   // eg: 3eeP1gtizk5eziohfervU
    server:   Meteor.settings.SMTP_HOST,  // eg: mail.gandi.net
    port: Meteor.settings.SMTP_PORT
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

  Accounts.emailTemplates.siteName = "SpaceCadet";
  Accounts.emailTemplates.from = "SpaceCadet <hello@spacecadet.io>";
});
