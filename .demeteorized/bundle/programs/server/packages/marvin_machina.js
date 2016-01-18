(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var lodash = Package['stevezhu:lodash'].lodash;
var _ = Package['stevezhu:lodash']._;

/* Package-scope variables */
var machina;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/marvin_machina/machina-server.js                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
machina = Npm.require('machina');                                    // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['marvin:machina'] = {
  machina: machina
};

})();

//# sourceMappingURL=marvin_machina.js.map
