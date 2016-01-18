(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/email/email.js                                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.startup(function () {                                           // 1
  smtp = {                                                             // 2
    username: Meteor.settings.SMTP_USERNAME, // eg: server@gentlenode.com
    password: Meteor.settings.SMTP_PASSWORD, // eg: 3eeP1gtizk5eziohfervU
    server: Meteor.settings.SMTP_HOST, // eg: smtp.mailgun.org         // 5
    port: Meteor.settings.SMTP_PORT                                    // 6
  };                                                                   //
                                                                       //
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
                                                                       //
  Accounts.emailTemplates.siteName = "SpaceCadet";                     // 11
  Accounts.emailTemplates.from = "SpaceCadet <hello@spacecadet.io>";   // 12
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=email.js.map
