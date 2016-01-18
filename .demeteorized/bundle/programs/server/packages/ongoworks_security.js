(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var rulesByCollection, addFuncForAll, ensureCreated, ensureDefaultAllow, getRulesForCollectionAndType, computeChangedFieldsFromModifier, getCollectionName, allRulesPass, ensureSecureDeny, Security;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks_security/lib/server/security-util.js                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/* global _, rulesByCollection:true, addFuncForAll:true, ensureCreated:true, ensureDefaultAllow:true */    // 1
                                                                                                           // 2
rulesByCollection = {};                                                                                    // 3
                                                                                                           // 4
var created = {                                                                                            // 5
  allow: {                                                                                                 // 6
    insert: {},                                                                                            // 7
    update: {},                                                                                            // 8
    remove: {},                                                                                            // 9
    download: {} // for use with CollectionFS packages                                                     // 10
  },                                                                                                       // 11
  deny: {                                                                                                  // 12
    insert: {},                                                                                            // 13
    update: {},                                                                                            // 14
    remove: {},                                                                                            // 15
    download: {} // for use with CollectionFS packages                                                     // 16
  }                                                                                                        // 17
};                                                                                                         // 18
                                                                                                           // 19
/**                                                                                                        // 20
 * Adds the given function as an allow or deny function for all specified collections and types.           // 21
 * @param {Array(Mongo.Collection)} collections Array of Mongo.Collection instances                        // 22
 * @param {String}                  allowOrDeny "allow" or "deny"                                          // 23
 * @param {Array(String)}           types       Array of types ("insert", "update", "remove")              // 24
 * @param {Array(String)|null}      fetch       `fetch` property to use                                    // 25
 * @param {Function}                func        The function                                               // 26
 */                                                                                                        // 27
addFuncForAll = function addFuncForAll(collections, allowOrDeny, types, fetch, func) {                     // 28
  // We always disable transformation, but we transform for specific                                       // 29
  // rules upon running our deny function if requested.                                                    // 30
  var rules = {transform: null};                                                                           // 31
  if (_.isArray(fetch)) {                                                                                  // 32
    rules.fetch = fetch;                                                                                   // 33
  }                                                                                                        // 34
  _.each(types, function (t) {                                                                             // 35
    rules[t] = func;                                                                                       // 36
  });                                                                                                      // 37
  _.each(collections, function (c) {                                                                       // 38
    c[allowOrDeny](rules);                                                                                 // 39
  });                                                                                                      // 40
};                                                                                                         // 41
                                                                                                           // 42
/**                                                                                                        // 43
 * Creates the allow or deny function for the given collections if not already created. This ensures that this package only ever creates up to one allow and one deny per collection.
 * @param   {String}                  allowOrDeny "allow" or "deny"                                        // 45
 * @param   {Array(Mongo.Collection)} collections An array of collections                                  // 46
 * @param   {Array(String)}           types       An array of types ("insert", "update", "remove")         // 47
 * @param   {Array(String)|null}      fetch       `fetch` property to use                                  // 48
 * @param   {Function}                func        The function                                             // 49
 */                                                                                                        // 50
ensureCreated = function ensureCreated(allowOrDeny, collections, types, fetch, func) {                     // 51
  _.each(types, function (t) {                                                                             // 52
    collections = _.reject(collections, function (c) {                                                     // 53
      return _.has(created[allowOrDeny][t], getCollectionName(c));                                         // 54
    });                                                                                                    // 55
    addFuncForAll(collections, allowOrDeny, [t], null, func);                                              // 56
    // mark that we've defined function for collection-type combo                                          // 57
    _.each(collections, function (c) {                                                                     // 58
      created[allowOrDeny][t][getCollectionName(c)] = true;                                                // 59
    });                                                                                                    // 60
  });                                                                                                      // 61
};                                                                                                         // 62
                                                                                                           // 63
/**                                                                                                        // 64
 * Sets up default allow functions for the collections and types.                                          // 65
 * @param   {Array(Mongo.Collection)} collections Array of Mongo.Collection instances                      // 66
 * @param   {Array(String)}           types       Array of types ("insert", "update", "remove")            // 67
 */                                                                                                        // 68
ensureDefaultAllow = function ensureDefaultAllow(collections, types) {                                     // 69
  ensureCreated("allow", collections, types, [], function () {                                             // 70
    return true;                                                                                           // 71
  });                                                                                                      // 72
};                                                                                                         // 73
                                                                                                           // 74
/**                                                                                                        // 75
 * Return only those rules that apply to the given collection and operation type                           // 76
 */                                                                                                        // 77
getRulesForCollectionAndType = function getRulesForCollectionAndType(collectionName, type) {               // 78
  var rules = rulesByCollection[collectionName] || [];                                                     // 79
  return _.select(rules, function (rule) {                                                                 // 80
    return _.contains(rule._types, type);                                                                  // 81
  });                                                                                                      // 82
};                                                                                                         // 83
                                                                                                           // 84
computeChangedFieldsFromModifier = function computeChangedFieldsFromModifier(modifier) {                   // 85
  var fields = [];                                                                                         // 86
  // This is the same logic Meteor's mongo package uses in                                                 // 87
  // https://github.com/meteor/meteor/blob/devel/packages/mongo/collection.js                              // 88
  _.each(modifier, function (params) {                                                                     // 89
    _.each(_.keys(params), function (field) {                                                              // 90
      // treat dotted fields as if they are replacing their                                                // 91
      // top-level part                                                                                    // 92
      if (field.indexOf('.') !== -1)                                                                       // 93
        field = field.substring(0, field.indexOf('.'));                                                    // 94
                                                                                                           // 95
      // record the field we are trying to change                                                          // 96
      if (!_.contains(fields, field))                                                                      // 97
        fields.push(field);                                                                                // 98
    });                                                                                                    // 99
  });                                                                                                      // 100
  return fields;                                                                                           // 101
};                                                                                                         // 102
                                                                                                           // 103
getCollectionName = function getCollectionName(collection) {                                               // 104
  // CollectionFS has underlying collection on `files` property                                            // 105
  return collection._name || (collection.files && collection.files._name);                                 // 106
};                                                                                                         // 107
                                                                                                           // 108
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks_security/lib/server/security-deny.js                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*                                                                                                         // 1
 * A single deny function runs all the deny functions registered by this package, allowing us to have      // 2
 * an OR relationship among multiple security rule chains.                                                 // 3
 */                                                                                                        // 4
                                                                                                           // 5
allRulesPass = function allRulesPass(collection, type, args) {                                             // 6
  // select only those rules that apply to this operation type                                             // 7
  var rules = getRulesForCollectionAndType(getCollectionName(collection), type);                           // 8
                                                                                                           // 9
  // Loop through all defined rules for this collection. There is an OR relationship among                 // 10
  // all rules for the collection, so if any do NOT return true, we allow.                                 // 11
  return !_.every(rules, function (rule) {                                                                 // 12
    return rule.deny(type, collection, args);                                                              // 13
  });                                                                                                      // 14
};                                                                                                         // 15
                                                                                                           // 16
ensureSecureDeny = function ensureSecureDeny(collections, types) {                                         // 17
  _.each(types, function (t) {                                                                             // 18
    _.each(collections, function (collection) {                                                            // 19
      ensureCreated("deny", [collection], [t], null, function () {                                         // 20
        return !allRulesPass(collection, t, _.toArray(arguments));                                         // 21
      });                                                                                                  // 22
    });                                                                                                    // 23
  });                                                                                                      // 24
};                                                                                                         // 25
                                                                                                           // 26
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks_security/lib/server/security-api.js                                                  //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
// The `Security` object is exported and provides the package API                                          // 1
Security = {                                                                                               // 2
  // Putting these on the exported object allows package users to override if necessary                    // 3
  errorMessages: {                                                                                         // 4
    multipleCan: 'You may not combine more than one insert, update, or remove on a Security.can chain',    // 5
    notAllowed: 'Action not allowed',                                                                      // 6
    requiresDeny: 'Security.defineMethod requires a "deny" function',                                      // 7
    collectionsArg: 'The collections argument must be a Mongo.Collection instance or an array of them',    // 8
    noCollectionOrType: 'At a minimum, you must call permit and collections methods for a security rule.',
    updateArgs: 'The update method for Security.can requires two arguments, id and modifier'               // 10
  },                                                                                                       // 11
  Rule: function SecurityRuleConstructor(types) {                                                          // 12
    var self = this;                                                                                       // 13
                                                                                                           // 14
    if (!_.isArray(types)) {                                                                               // 15
      types = [types];                                                                                     // 16
    }                                                                                                      // 17
    self._types = types;                                                                                   // 18
    self._restrictions = [];                                                                               // 19
  },                                                                                                       // 20
  // the starting point of the chain                                                                       // 21
  permit: function permit(types) {                                                                         // 22
    return new Security.Rule(types);                                                                       // 23
  },                                                                                                       // 24
  Check: function SecurityCheckConstructor(userId) {                                                       // 25
    this.userId = userId || null;                                                                          // 26
  },                                                                                                       // 27
  can: function can(userId) {                                                                              // 28
    return new Security.Check(userId);                                                                     // 29
  },                                                                                                       // 30
  defineMethod: function securityDefineMethod(name, definition) {                                          // 31
    // Check whether a rule with the given name already exists; can't overwrite                            // 32
    if (Security.Rule.prototype[name]) {                                                                   // 33
      throw new Error('A security method with the name "' + name + '" has already been defined');          // 34
    }                                                                                                      // 35
    // Make sure the definition argument is an object that has a `deny` property                           // 36
    if (!definition || !definition.deny) {                                                                 // 37
      throw new Error(Security.errorMessages.requiresDeny);                                                // 38
    }                                                                                                      // 39
    // Wrap transform, if provided                                                                         // 40
    if (definition.transform) {                                                                            // 41
      definition.transform = LocalCollection.wrapTransform(definition.transform);                          // 42
    }                                                                                                      // 43
    Security.Rule.prototype[name] = function (arg) {                                                       // 44
      var self = this;                                                                                     // 45
      self._restrictions.push({                                                                            // 46
        definition: definition,                                                                            // 47
        arg: arg                                                                                           // 48
      });                                                                                                  // 49
      return self;                                                                                         // 50
    };                                                                                                     // 51
  }                                                                                                        // 52
};                                                                                                         // 53
                                                                                                           // 54
// Security.Rule prototypes                                                                                // 55
Security.Rule.prototype.collections = function (collections) {                                             // 56
  var self = this;                                                                                         // 57
  // Make sure the `collections` argument is either a `Mongo.Collection` instance or                       // 58
  // an array of them. If it's a single collection, convert it to a one-item array.                        // 59
  if (!_.isArray(collections)) collections = [collections];                                                // 60
                                                                                                           // 61
  // Keep list keyed by collection name                                                                    // 62
  _.each(collections, function (collection) {                                                              // 63
    if (!(collection instanceof Mongo.Collection) &&                                                       // 64
        // CollectionFS has underlying collection on `files` property                                      // 65
       !(collection.files instanceof Mongo.Collection)) {                                                  // 66
      throw new Error(Security.errorMessages.collectionsArg);                                              // 67
    }                                                                                                      // 68
    // CollectionFS has underlying collection on `files` property                                          // 69
    var n = getCollectionName(collection);                                                                 // 70
    rulesByCollection[n] = rulesByCollection[n] || [];                                                     // 71
    rulesByCollection[n].push(self);                                                                       // 72
  });                                                                                                      // 73
                                                                                                           // 74
  self._collections = collections;                                                                         // 75
                                                                                                           // 76
  return self;                                                                                             // 77
};                                                                                                         // 78
                                                                                                           // 79
Security.Rule.prototype.apply = function () {                                                              // 80
  var self = this;                                                                                         // 81
                                                                                                           // 82
  if (!self._collections || !self._types) {                                                                // 83
    throw new Error(Security.errorMessages.noCollectionOrType);                                            // 84
  }                                                                                                        // 85
                                                                                                           // 86
  // If we haven't yet done so, set up a default, permissive `allow` function for all of                   // 87
  // the given collections and types. We control all security through `deny` functions only, but           // 88
  // there must first be at least one `allow` function for each collection or all writes                   // 89
  // will be denied.                                                                                       // 90
  ensureDefaultAllow(self._collections, self._types);                                                      // 91
                                                                                                           // 92
  // We need a combined `fetch` array. The `fetch` is optional and can be either an array                  // 93
  // or a function that takes the argument passed to the restriction method and returns an array.          // 94
  // TODO for now we can't set fetch accurately; maybe need to adjust API so that we "apply" only          // 95
  // after we've defined all rules                                                                         // 96
  //var fetch = [];                                                                                        // 97
  //_.each(self._restrictions, function (restriction) {                                                    // 98
  //  if (_.isArray(restriction.definition.fetch)) {                                                       // 99
  //    fetch = fetch.concat(restriction.definition.fetch);                                                // 100
  //  } else if (typeof restriction.definition.fetch === "function") {                                     // 101
  //    fetch = fetch.concat(restriction.definition.fetch(restriction.arg));                               // 102
  //  }                                                                                                    // 103
  //});                                                                                                    // 104
                                                                                                           // 105
  ensureSecureDeny(self._collections, self._types);                                                        // 106
                                                                                                           // 107
};                                                                                                         // 108
                                                                                                           // 109
Security.Rule.prototype.deny = function (type, collection, args) {                                         // 110
  var self = this;                                                                                         // 111
  // Loop through all defined restrictions. Restrictions are additive for this chained                     // 112
  // rule, so if any deny function returns true, this function should return true.                         // 113
  return _.any(self._restrictions, function (restriction) {                                                // 114
    var doc, transform = restriction.definition.transform;                                                 // 115
                                                                                                           // 116
    // If transform is a function, apply that                                                              // 117
    if (typeof transform === 'function') {                                                                 // 118
      if (type === 'insert') {                                                                             // 119
        doc = EJSON.clone(args[1]);                                                                        // 120
        // The wrapped transform requires an _id, but we                                                   // 121
        // don't have access to the generatedId from Meteor API,                                           // 122
        // so we'll fudge one and then remove it.                                                          // 123
        doc._id = Random.id();                                                                             // 124
      } else {                                                                                             // 125
        doc = args[1];                                                                                     // 126
      }                                                                                                    // 127
      args[1] = transform(doc);                                                                            // 128
      if (type === 'insert') {                                                                             // 129
        delete args[1]._id;                                                                                // 130
      }                                                                                                    // 131
    }                                                                                                      // 132
                                                                                                           // 133
    // If not transform: null, apply the collection transform                                              // 134
    else if (transform !== null && typeof collection._transform === 'function') {                          // 135
      if (type === 'insert') {                                                                             // 136
        doc = EJSON.clone(args[1]);                                                                        // 137
        // The wrapped transform requires an _id, but we                                                   // 138
        // don't have access to the generatedId from Meteor API,                                           // 139
        // so we'll fudge one and then remove it.                                                          // 140
        doc._id = Random.id();                                                                             // 141
      } else {                                                                                             // 142
        doc = args[1];                                                                                     // 143
      }                                                                                                    // 144
      args[1] = collection._transform(doc);                                                                // 145
      if (type === 'insert') {                                                                             // 146
        delete args[1]._id;                                                                                // 147
      }                                                                                                    // 148
    }                                                                                                      // 149
                                                                                                           // 150
    return restriction.definition.deny.apply(this, [type, restriction.arg].concat(args));                  // 151
  });                                                                                                      // 152
};                                                                                                         // 153
                                                                                                           // 154
Mongo.Collection.prototype.permit = function (types) {                                                     // 155
  return Security.permit(types).collections(this);                                                         // 156
};                                                                                                         // 157
                                                                                                           // 158
// Security.Check prototypes                                                                               // 159
Security.Check.prototype.for = function (collection) {                                                     // 160
  var self = this;                                                                                         // 161
  self.collection = collection;                                                                            // 162
  return self;                                                                                             // 163
};                                                                                                         // 164
                                                                                                           // 165
['insert', 'update', 'remove'].forEach(function (type) {                                                   // 166
  Security.Check.prototype[type] = function () {                                                           // 167
    var self = this;                                                                                       // 168
    if (self.type) throw new Error(Security.errorMessages.multipleCan);                                    // 169
    self.type = type;                                                                                      // 170
    self.args = _.toArray(arguments);                                                                      // 171
    // Compute and add fields argument for update type                                                     // 172
    if (type === 'update') {                                                                               // 173
      if (self.args.length !== 2) throw new Error(Security.errorMessages.updateArgs);                      // 174
      self.args = [                                                                                        // 175
        self.args[0],                                                                                      // 176
        computeChangedFieldsFromModifier(self.args[1]),                                                    // 177
        self.args[1]                                                                                       // 178
      ];                                                                                                   // 179
    }                                                                                                      // 180
    return self;                                                                                           // 181
  };                                                                                                       // 182
});                                                                                                        // 183
                                                                                                           // 184
// Security.can(userId).insert(doc).for(MyCollection).check()                                              // 185
// Security.can(userId).update(id, modifier).for(MyCollection).check()                                     // 186
// Security.can(userId).remove(id).for(MyCollection).check()                                               // 187
Security.Check.prototype.check = function () {                                                             // 188
  var self = this;                                                                                         // 189
  return allRulesPass(self.collection, self.type, [self.userId].concat(self.args));                        // 190
};                                                                                                         // 191
                                                                                                           // 192
// Security.can(userId).insert(doc).for(MyCollection).throw()                                              // 193
// Security.can(userId).update(id, modifier).for(MyCollection).throw()                                     // 194
// Security.can(userId).remove(id).for(MyCollection).throw()                                               // 195
Security.Check.prototype.throw = function () {                                                             // 196
  if (!this.check()) throw new Meteor.Error('access-denied', Security.errorMessages.notAllowed);           // 197
};                                                                                                         // 198
                                                                                                           // 199
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks_security/lib/security-rules.js                                                       //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*                                                                                                         // 1
 * This file defines built-in restriction methods                                                          // 2
 */                                                                                                        // 3
                                                                                                           // 4
/*                                                                                                         // 5
 * No one                                                                                                  // 6
 */                                                                                                        // 7
                                                                                                           // 8
Security.defineMethod("never", {                                                                           // 9
  fetch: [],                                                                                               // 10
  transform: null,                                                                                         // 11
  deny: function () {                                                                                      // 12
    return true;                                                                                           // 13
  }                                                                                                        // 14
});                                                                                                        // 15
                                                                                                           // 16
/*                                                                                                         // 17
 * Logged In                                                                                               // 18
 */                                                                                                        // 19
                                                                                                           // 20
Security.defineMethod("ifLoggedIn", {                                                                      // 21
  fetch: [],                                                                                               // 22
  transform: null,                                                                                         // 23
  deny: function (type, arg, userId) {                                                                     // 24
    return !userId;                                                                                        // 25
  }                                                                                                        // 26
});                                                                                                        // 27
                                                                                                           // 28
/*                                                                                                         // 29
 * Specific User ID                                                                                        // 30
 */                                                                                                        // 31
                                                                                                           // 32
Security.defineMethod("ifHasUserId", {                                                                     // 33
  fetch: [],                                                                                               // 34
  transform: null,                                                                                         // 35
  deny: function (type, arg, userId) {                                                                     // 36
    return userId !== arg;                                                                                 // 37
  }                                                                                                        // 38
});                                                                                                        // 39
                                                                                                           // 40
/*                                                                                                         // 41
 * Specific Roles                                                                                          // 42
 */                                                                                                        // 43
                                                                                                           // 44
/*                                                                                                         // 45
 * alanning:roles support                                                                                  // 46
 */                                                                                                        // 47
if (Package && Package["alanning:roles"]) {                                                                // 48
                                                                                                           // 49
  var Roles = Package["alanning:roles"].Roles;                                                             // 50
                                                                                                           // 51
  Security.defineMethod("ifHasRole", {                                                                     // 52
    fetch: [],                                                                                             // 53
    transform: null,                                                                                       // 54
    deny: function (type, arg, userId) {                                                                   // 55
      if (!arg) {                                                                                          // 56
        throw new Error('ifHasRole security rule method requires an argument');                            // 57
      }                                                                                                    // 58
      if (arg.role) {                                                                                      // 59
        return !Roles.userIsInRole(userId, arg.role, arg.group);                                           // 60
      } else {                                                                                             // 61
        return !Roles.userIsInRole(userId, arg);                                                           // 62
      }                                                                                                    // 63
    }                                                                                                      // 64
  });                                                                                                      // 65
                                                                                                           // 66
}                                                                                                          // 67
                                                                                                           // 68
/*                                                                                                         // 69
 * nicolaslopezj:roles support                                                                             // 70
 * Note: doesn't support groups                                                                            // 71
 */                                                                                                        // 72
if (Package && Package["nicolaslopezj:roles"]) {                                                           // 73
                                                                                                           // 74
  var Roles = Package["nicolaslopezj:roles"].Roles;                                                        // 75
                                                                                                           // 76
  Security.defineMethod("ifHasRole", {                                                                     // 77
    fetch: [],                                                                                             // 78
    transform: null,                                                                                       // 79
    deny: function (type, arg, userId) {                                                                   // 80
      if (!arg) {                                                                                          // 81
        throw new Error('ifHasRole security rule method requires an argument');                            // 82
      }                                                                                                    // 83
      return !Roles.userHasRole(userId, arg);                                                              // 84
    }                                                                                                      // 85
  });                                                                                                      // 86
                                                                                                           // 87
}                                                                                                          // 88
                                                                                                           // 89
/*                                                                                                         // 90
 * Specific Properties                                                                                     // 91
 */                                                                                                        // 92
                                                                                                           // 93
Security.defineMethod("onlyProps", {                                                                       // 94
  fetch: [],                                                                                               // 95
  transform: null,                                                                                         // 96
  deny: function (type, arg, userId, doc, fieldNames) {                                                    // 97
    if (!_.isArray(arg)) {                                                                                 // 98
      arg = [arg];                                                                                         // 99
    }                                                                                                      // 100
                                                                                                           // 101
    fieldNames = fieldNames || _.keys(doc);                                                                // 102
                                                                                                           // 103
    return !_.every(fieldNames, function (fieldName) {                                                     // 104
      return _.contains(arg, fieldName);                                                                   // 105
    });                                                                                                    // 106
  }                                                                                                        // 107
});                                                                                                        // 108
                                                                                                           // 109
Security.defineMethod("exceptProps", {                                                                     // 110
  fetch: [],                                                                                               // 111
  transform: null,                                                                                         // 112
  deny: function (type, arg, userId, doc, fieldNames) {                                                    // 113
    if (!_.isArray(arg)) {                                                                                 // 114
      arg = [arg];                                                                                         // 115
    }                                                                                                      // 116
                                                                                                           // 117
    fieldNames = fieldNames || _.keys(doc);                                                                // 118
                                                                                                           // 119
    return _.any(fieldNames, function (fieldName) {                                                        // 120
      return _.contains(arg, fieldName);                                                                   // 121
    });                                                                                                    // 122
  }                                                                                                        // 123
});                                                                                                        // 124
                                                                                                           // 125
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ongoworks:security'] = {
  Security: Security
};

})();

//# sourceMappingURL=ongoworks_security.js.map
