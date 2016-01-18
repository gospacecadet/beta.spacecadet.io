(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var STRIPEMETEOR;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/mrgalaxy_stripe/stripe_server.js                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
this.StripeAPI = Npm.require('stripe');                              // 1
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrgalaxy:stripe'] = {
  STRIPEMETEOR: STRIPEMETEOR
};

})();

//# sourceMappingURL=mrgalaxy_stripe.js.map
