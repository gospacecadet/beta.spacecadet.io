(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var loremIpsum;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/marvin_lorem-ipsum/lorem-ipsum.js                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
loremIpsum = Npm.require('lorem-ipsum');                             // 1
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['marvin:lorem-ipsum'] = {
  loremIpsum: loremIpsum
};

})();

//# sourceMappingURL=marvin_lorem-ipsum.js.map
