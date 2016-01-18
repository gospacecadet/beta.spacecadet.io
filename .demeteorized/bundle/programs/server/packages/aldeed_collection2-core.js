(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;

/* Package-scope variables */
var Collection2, Mongo;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/aldeed_collection2-core/lib/collection2.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Exported only for listening to events                                                                             // 1
Collection2 = new EventEmitter();                                                                                    // 2
                                                                                                                     // 3
// backwards compatibility                                                                                           // 4
if (typeof Mongo === "undefined") {                                                                                  // 5
  Mongo = {};                                                                                                        // 6
  Mongo.Collection = Meteor.Collection;                                                                              // 7
}                                                                                                                    // 8
                                                                                                                     // 9
/**                                                                                                                  // 10
 * Mongo.Collection.prototype.attachSchema                                                                           // 11
 * @param {SimpleSchema|Object} ss - SimpleSchema instance or a schema definition object                             // 12
 *    from which to create a new SimpleSchema instance                                                               // 13
 * @param {Object} [options]                                                                                         // 14
 * @param {Boolean} [options.transform=false] Set to `true` if your document must be passed                          // 15
 *    through the collection's transform to properly validate.                                                       // 16
 * @param {Boolean} [options.replace=false] Set to `true` to replace any existing schema instead of combining        // 17
 * @return {undefined}                                                                                               // 18
 *                                                                                                                   // 19
 * Use this method to attach a schema to a collection created by another package,                                    // 20
 * such as Meteor.users. It is most likely unsafe to call this method more than                                      // 21
 * once for a single collection, or to call this for a collection that had a                                         // 22
 * schema object passed to its constructor.                                                                          // 23
 */                                                                                                                  // 24
Mongo.Collection.prototype.attachSchema = function c2AttachSchema(ss, options) {                                     // 25
  var self = this;                                                                                                   // 26
  options = options || {};                                                                                           // 27
                                                                                                                     // 28
  // Allow passing just the schema object                                                                            // 29
  if (!(ss instanceof SimpleSchema)) {                                                                               // 30
    ss = new SimpleSchema(ss);                                                                                       // 31
  }                                                                                                                  // 32
                                                                                                                     // 33
  self._c2 = self._c2 || {};                                                                                         // 34
                                                                                                                     // 35
  // If we've already attached one schema, we combine both into a new schema unless options.replace is `true`        // 36
  if (self._c2._simpleSchema && options.replace !== true) {                                                          // 37
    ss = new SimpleSchema([self._c2._simpleSchema, ss]);                                                             // 38
  }                                                                                                                  // 39
                                                                                                                     // 40
  // Track the schema in the collection                                                                              // 41
  self._c2._simpleSchema = ss;                                                                                       // 42
                                                                                                                     // 43
  // Attach the schema to the underlying LocalCollection, too                                                        // 44
  if (self._collection instanceof LocalCollection) {                                                                 // 45
    self._collection._c2 = self._collection._c2 || {};                                                               // 46
    self._collection._c2._simpleSchema = ss;                                                                         // 47
  }                                                                                                                  // 48
                                                                                                                     // 49
  defineDeny(self, options);                                                                                         // 50
  keepInsecure(self);                                                                                                // 51
                                                                                                                     // 52
  Collection2.emit('schema.attached', self, ss, options);                                                            // 53
};                                                                                                                   // 54
                                                                                                                     // 55
_.each([Mongo.Collection, LocalCollection], function (obj) {                                                         // 56
  obj.prototype.simpleSchema = function () {                                                                         // 57
    var self = this;                                                                                                 // 58
    return self._c2 ? self._c2._simpleSchema : null;                                                                 // 59
  };                                                                                                                 // 60
});                                                                                                                  // 61
                                                                                                                     // 62
// Wrap DB write operation methods                                                                                   // 63
_.each(['insert', 'update'], function(methodName) {                                                                  // 64
  var _super = Mongo.Collection.prototype[methodName];                                                               // 65
  Mongo.Collection.prototype[methodName] = function() {                                                              // 66
    var self = this, options,                                                                                        // 67
        args = _.toArray(arguments);                                                                                 // 68
                                                                                                                     // 69
    options = (methodName === "insert") ? args[1] : args[2];                                                         // 70
                                                                                                                     // 71
    // Support missing options arg                                                                                   // 72
    if (!options || typeof options === "function") {                                                                 // 73
      options = {};                                                                                                  // 74
    }                                                                                                                // 75
                                                                                                                     // 76
    if (self._c2 && options.bypassCollection2 !== true) {                                                            // 77
      var userId = null;                                                                                             // 78
      try { // https://github.com/aldeed/meteor-collection2/issues/175                                               // 79
        userId = Meteor.userId();                                                                                    // 80
      } catch (err) {}                                                                                               // 81
                                                                                                                     // 82
      args = doValidate.call(                                                                                        // 83
        self,                                                                                                        // 84
        methodName,                                                                                                  // 85
        args,                                                                                                        // 86
        true, // getAutoValues                                                                                       // 87
        userId,                                                                                                      // 88
        Meteor.isServer // isFromTrustedCode                                                                         // 89
      );                                                                                                             // 90
      if (!args) {                                                                                                   // 91
        // doValidate already called the callback or threw the error so we're done.                                  // 92
        // But insert should always return an ID to match core behavior.                                             // 93
        return methodName === "insert" ? self._makeNewID() : undefined;                                              // 94
      }                                                                                                              // 95
    } else {                                                                                                         // 96
      // We still need to adjust args because insert does not take options                                           // 97
      if (methodName === "insert" && typeof args[1] !== 'function') args.splice(1, 1);                               // 98
    }                                                                                                                // 99
                                                                                                                     // 100
    return _super.apply(self, args);                                                                                 // 101
  };                                                                                                                 // 102
});                                                                                                                  // 103
                                                                                                                     // 104
/*                                                                                                                   // 105
 * Private                                                                                                           // 106
 */                                                                                                                  // 107
                                                                                                                     // 108
function doValidate(type, args, getAutoValues, userId, isFromTrustedCode) {                                          // 109
  var self = this, doc, callback, error, options, isUpsert, selector, last, hasCallback;                             // 110
                                                                                                                     // 111
  var schema = self.simpleSchema();                                                                                  // 112
  var isLocalCollection = (self._connection === null);                                                               // 113
                                                                                                                     // 114
  if (!args.length) {                                                                                                // 115
    throw new Error(type + " requires an argument");                                                                 // 116
  }                                                                                                                  // 117
                                                                                                                     // 118
  // Gather arguments and cache the selector                                                                         // 119
  if (type === "insert") {                                                                                           // 120
    doc = args[0];                                                                                                   // 121
    options = args[1];                                                                                               // 122
    callback = args[2];                                                                                              // 123
                                                                                                                     // 124
    // The real insert doesn't take options                                                                          // 125
    if (typeof options === "function") {                                                                             // 126
      args = [doc, options];                                                                                         // 127
    } else if (typeof callback === "function") {                                                                     // 128
      args = [doc, callback];                                                                                        // 129
    } else {                                                                                                         // 130
      args = [doc];                                                                                                  // 131
    }                                                                                                                // 132
  } else if (type === "update") {                                                                                    // 133
    selector = args[0];                                                                                              // 134
    doc = args[1];                                                                                                   // 135
    options = args[2];                                                                                               // 136
    callback = args[3];                                                                                              // 137
  } else {                                                                                                           // 138
    throw new Error("invalid type argument");                                                                        // 139
  }                                                                                                                  // 140
                                                                                                                     // 141
  var validatedObjectWasInitiallyEmpty = _.isEmpty(doc);                                                             // 142
                                                                                                                     // 143
  // Support missing options arg                                                                                     // 144
  if (!callback && typeof options === "function") {                                                                  // 145
    callback = options;                                                                                              // 146
    options = {};                                                                                                    // 147
  }                                                                                                                  // 148
  options = options || {};                                                                                           // 149
                                                                                                                     // 150
  last = args.length - 1;                                                                                            // 151
                                                                                                                     // 152
  hasCallback = (typeof args[last] === 'function');                                                                  // 153
                                                                                                                     // 154
  // If update was called with upsert:true, flag as an upsert                                                        // 155
  isUpsert = (type === "update" && options.upsert === true);                                                         // 156
                                                                                                                     // 157
  // On the server and for local collections, we allow passing `getAutoValues: false` to disable autoValue functions
  if ((Meteor.isServer || isLocalCollection) && options.getAutoValues === false) {                                   // 159
    getAutoValues = false;                                                                                           // 160
  }                                                                                                                  // 161
                                                                                                                     // 162
  // Determine validation context                                                                                    // 163
  var validationContext = options.validationContext;                                                                 // 164
  if (validationContext) {                                                                                           // 165
    if (typeof validationContext === 'string') {                                                                     // 166
      validationContext = schema.namedContext(validationContext);                                                    // 167
    }                                                                                                                // 168
  } else {                                                                                                           // 169
    validationContext = schema.namedContext();                                                                       // 170
  }                                                                                                                  // 171
                                                                                                                     // 172
  // Add a default callback function if we're on the client and no callback was given                                // 173
  if (Meteor.isClient && !callback) {                                                                                // 174
    // Client can't block, so it can't report errors by exception,                                                   // 175
    // only by callback. If they forget the callback, give them a                                                    // 176
    // default one that logs the error, so they aren't totally                                                       // 177
    // baffled if their writes don't work because their database is                                                  // 178
    // down.                                                                                                         // 179
    callback = function(err) {                                                                                       // 180
      if (err) {                                                                                                     // 181
        Meteor._debug(type + " failed: " + (err.reason || err.stack));                                               // 182
      }                                                                                                              // 183
    };                                                                                                               // 184
  }                                                                                                                  // 185
                                                                                                                     // 186
  // If client validation is fine or is skipped but then something                                                   // 187
  // is found to be invalid on the server, we get that error back                                                    // 188
  // as a special Meteor.Error that we need to parse.                                                                // 189
  if (Meteor.isClient && hasCallback) {                                                                              // 190
    callback = args[last] = wrapCallbackForParsingServerErrors(validationContext, callback);                         // 191
  }                                                                                                                  // 192
                                                                                                                     // 193
  var schemaAllowsId = schema.allowsKey("_id");                                                                      // 194
  if (type === "insert" && !doc._id && schemaAllowsId) {                                                             // 195
    doc._id = self._makeNewID();                                                                                     // 196
  }                                                                                                                  // 197
                                                                                                                     // 198
  // Get the docId for passing in the autoValue/custom context                                                       // 199
  var docId;                                                                                                         // 200
  if (type === 'insert') {                                                                                           // 201
    docId = doc._id; // might be undefined                                                                           // 202
  } else if (type === "update" && selector) {                                                                        // 203
    docId = typeof selector === 'string' || selector instanceof Mongo.ObjectID ? selector : selector._id;            // 204
  }                                                                                                                  // 205
                                                                                                                     // 206
  // If _id has already been added, remove it temporarily if it's                                                    // 207
  // not explicitly defined in the schema.                                                                           // 208
  var cachedId;                                                                                                      // 209
  if (doc._id && !schemaAllowsId) {                                                                                  // 210
    cachedId = doc._id;                                                                                              // 211
    delete doc._id;                                                                                                  // 212
  }                                                                                                                  // 213
                                                                                                                     // 214
  function doClean(docToClean, getAutoValues, filter, autoConvert, removeEmptyStrings, trimStrings) {                // 215
    // Clean the doc/modifier in place                                                                               // 216
    schema.clean(docToClean, {                                                                                       // 217
      filter: filter,                                                                                                // 218
      autoConvert: autoConvert,                                                                                      // 219
      getAutoValues: getAutoValues,                                                                                  // 220
      isModifier: (type !== "insert"),                                                                               // 221
      removeEmptyStrings: removeEmptyStrings,                                                                        // 222
      trimStrings: trimStrings,                                                                                      // 223
      extendAutoValueContext: _.extend({                                                                             // 224
        isInsert: (type === "insert"),                                                                               // 225
        isUpdate: (type === "update" && options.upsert !== true),                                                    // 226
        isUpsert: isUpsert,                                                                                          // 227
        userId: userId,                                                                                              // 228
        isFromTrustedCode: isFromTrustedCode,                                                                        // 229
        docId: docId,                                                                                                // 230
        isLocalCollection: isLocalCollection                                                                         // 231
      }, options.extendAutoValueContext || {})                                                                       // 232
    });                                                                                                              // 233
  }                                                                                                                  // 234
                                                                                                                     // 235
  // Preliminary cleaning on both client and server. On the server and for local                                     // 236
  // collections, automatic values will also be set at this point.                                                   // 237
  doClean(                                                                                                           // 238
    doc,                                                                                                             // 239
    getAutoValues,                                                                                                   // 240
    options.filter !== false,                                                                                        // 241
    options.autoConvert !== false,                                                                                   // 242
    options.removeEmptyStrings !== false,                                                                            // 243
    options.trimStrings !== false                                                                                    // 244
  );                                                                                                                 // 245
                                                                                                                     // 246
  // We clone before validating because in some cases we need to adjust the                                          // 247
  // object a bit before validating it. If we adjusted `doc` itself, our                                             // 248
  // changes would persist into the database.                                                                        // 249
  var docToValidate = {};                                                                                            // 250
  for (var prop in doc) {                                                                                            // 251
    // We omit prototype properties when cloning because they will not be valid                                      // 252
    // and mongo omits them when saving to the database anyway.                                                      // 253
    if (doc.hasOwnProperty(prop)) {                                                                                  // 254
      docToValidate[prop] = doc[prop];                                                                               // 255
    }                                                                                                                // 256
  }                                                                                                                  // 257
                                                                                                                     // 258
  // On the server, upserts are possible; SimpleSchema handles upserts pretty                                        // 259
  // well by default, but it will not know about the fields in the selector,                                         // 260
  // which are also stored in the database if an insert is performed. So we                                          // 261
  // will allow these fields to be considered for validation by adding them                                          // 262
  // to the $set in the modifier. This is no doubt prone to errors, but there                                        // 263
  // probably isn't any better way right now.                                                                        // 264
  if (Meteor.isServer && isUpsert && _.isObject(selector)) {                                                         // 265
    var set = docToValidate.$set || {};                                                                              // 266
    docToValidate.$set = _.clone(selector);                                                                          // 267
    if (!schemaAllowsId) delete docToValidate.$set._id;                                                              // 268
    _.extend(docToValidate.$set, set);                                                                               // 269
  }                                                                                                                  // 270
                                                                                                                     // 271
  // Set automatic values for validation on the client.                                                              // 272
  // On the server, we already updated doc with auto values, but on the client,                                      // 273
  // we will add them to docToValidate for validation purposes only.                                                 // 274
  // This is because we want all actual values generated on the server.                                              // 275
  if (Meteor.isClient && !isLocalCollection) {                                                                       // 276
    doClean(docToValidate, true, false, false, false, false);                                                        // 277
  }                                                                                                                  // 278
                                                                                                                     // 279
  // XXX Maybe move this into SimpleSchema                                                                           // 280
  if (!validatedObjectWasInitiallyEmpty && _.isEmpty(docToValidate)) {                                               // 281
    throw new Error('After filtering out keys not in the schema, your ' +                                            // 282
      (type === 'update' ? 'modifier' : 'object') +                                                                  // 283
      ' is now empty');                                                                                              // 284
  }                                                                                                                  // 285
                                                                                                                     // 286
  // Validate doc                                                                                                    // 287
  var isValid;                                                                                                       // 288
  if (options.validate === false) {                                                                                  // 289
    isValid = true;                                                                                                  // 290
  } else {                                                                                                           // 291
    isValid = validationContext.validate(docToValidate, {                                                            // 292
      modifier: (type === "update" || type === "upsert"),                                                            // 293
      upsert: isUpsert,                                                                                              // 294
      extendedCustomContext: _.extend({                                                                              // 295
        isInsert: (type === "insert"),                                                                               // 296
        isUpdate: (type === "update" && options.upsert !== true),                                                    // 297
        isUpsert: isUpsert,                                                                                          // 298
        userId: userId,                                                                                              // 299
        isFromTrustedCode: isFromTrustedCode,                                                                        // 300
        docId: docId,                                                                                                // 301
        isLocalCollection: isLocalCollection                                                                         // 302
      }, options.extendedCustomContext || {})                                                                        // 303
    });                                                                                                              // 304
  }                                                                                                                  // 305
                                                                                                                     // 306
  if (isValid) {                                                                                                     // 307
    // Add the ID back                                                                                               // 308
    if (cachedId) {                                                                                                  // 309
      doc._id = cachedId;                                                                                            // 310
    }                                                                                                                // 311
                                                                                                                     // 312
    // Update the args to reflect the cleaned doc                                                                    // 313
    // XXX not sure this is necessary since we mutate                                                                // 314
    if (type === "insert") {                                                                                         // 315
      args[0] = doc;                                                                                                 // 316
    } else {                                                                                                         // 317
      args[1] = doc;                                                                                                 // 318
    }                                                                                                                // 319
                                                                                                                     // 320
    // If callback, set invalidKey when we get a mongo unique error                                                  // 321
    if (Meteor.isServer && hasCallback) {                                                                            // 322
      args[last] = wrapCallbackForParsingMongoValidationErrors(validationContext, args[last]);                       // 323
    }                                                                                                                // 324
                                                                                                                     // 325
    return args;                                                                                                     // 326
  } else {                                                                                                           // 327
    error = getErrorObject(validationContext);                                                                       // 328
    if (callback) {                                                                                                  // 329
      // insert/update/upsert pass `false` when there's an error, so we do that                                      // 330
      callback(error, false);                                                                                        // 331
    } else {                                                                                                         // 332
      throw error;                                                                                                   // 333
    }                                                                                                                // 334
  }                                                                                                                  // 335
}                                                                                                                    // 336
                                                                                                                     // 337
function getErrorObject(context) {                                                                                   // 338
  var message, invalidKeys = context.invalidKeys();                                                                  // 339
  if (invalidKeys.length) {                                                                                          // 340
    message = context.keyErrorMessage(invalidKeys[0].name);                                                          // 341
  } else {                                                                                                           // 342
    message = "Failed validation";                                                                                   // 343
  }                                                                                                                  // 344
  var error = new Error(message);                                                                                    // 345
  error.invalidKeys = invalidKeys;                                                                                   // 346
  error.validationContext = context;                                                                                 // 347
  // If on the server, we add a sanitized error, too, in case we're                                                  // 348
  // called from a method.                                                                                           // 349
  if (Meteor.isServer) {                                                                                             // 350
    error.sanitizedError = new Meteor.Error(400, message, EJSON.stringify(error.invalidKeys));                       // 351
  }                                                                                                                  // 352
  return error;                                                                                                      // 353
}                                                                                                                    // 354
                                                                                                                     // 355
function addUniqueError(context, errorMessage) {                                                                     // 356
  var name = errorMessage.split('c2_')[1].split(' ')[0];                                                             // 357
  var val = errorMessage.split('dup key:')[1].split('"')[1];                                                         // 358
  context.addInvalidKeys([{                                                                                          // 359
    name: name,                                                                                                      // 360
    type: 'notUnique',                                                                                               // 361
    value: val                                                                                                       // 362
  }]);                                                                                                               // 363
}                                                                                                                    // 364
                                                                                                                     // 365
function wrapCallbackForParsingMongoValidationErrors(validationContext, cb) {                                        // 366
  return function wrappedCallbackForParsingMongoValidationErrors(error) {                                            // 367
    var args = _.toArray(arguments);                                                                                 // 368
    if (error &&                                                                                                     // 369
        ((error.name === "MongoError" && error.code === 11001) || error.message.indexOf('MongoError: E11000' !== -1)) &&
        error.message.indexOf('c2_') !== -1) {                                                                       // 371
      addUniqueError(validationContext, error.message);                                                              // 372
      args[0] = getErrorObject(validationContext);                                                                   // 373
    }                                                                                                                // 374
    return cb.apply(this, args);                                                                                     // 375
  };                                                                                                                 // 376
}                                                                                                                    // 377
                                                                                                                     // 378
function wrapCallbackForParsingServerErrors(validationContext, cb) {                                                 // 379
  return function wrappedCallbackForParsingServerErrors(error) {                                                     // 380
    var args = _.toArray(arguments);                                                                                 // 381
    // Handle our own validation errors                                                                              // 382
    if (error instanceof Meteor.Error &&                                                                             // 383
        error.error === 400 &&                                                                                       // 384
        error.reason === "INVALID" &&                                                                                // 385
        typeof error.details === "string") {                                                                         // 386
      var invalidKeysFromServer = EJSON.parse(error.details);                                                        // 387
      validationContext.addInvalidKeys(invalidKeysFromServer);                                                       // 388
      args[0] = getErrorObject(validationContext);                                                                   // 389
    }                                                                                                                // 390
    // Handle Mongo unique index errors, which are forwarded to the client as 409 errors                             // 391
    else if (error instanceof Meteor.Error &&                                                                        // 392
             error.error === 409 &&                                                                                  // 393
             error.reason &&                                                                                         // 394
             error.reason.indexOf('E11000') !== -1 &&                                                                // 395
             error.reason.indexOf('c2_') !== -1) {                                                                   // 396
      addUniqueError(validationContext, error.reason);                                                               // 397
      args[0] = getErrorObject(validationContext);                                                                   // 398
    }                                                                                                                // 399
    return cb.apply(this, args);                                                                                     // 400
  };                                                                                                                 // 401
}                                                                                                                    // 402
                                                                                                                     // 403
var alreadyInsecured = {};                                                                                           // 404
function keepInsecure(c) {                                                                                           // 405
  // If insecure package is in use, we need to add allow rules that return                                           // 406
  // true. Otherwise, it would seemingly turn off insecure mode.                                                     // 407
  if (Package && Package.insecure && !alreadyInsecured[c._name]) {                                                   // 408
    c.allow({                                                                                                        // 409
      insert: function() {                                                                                           // 410
        return true;                                                                                                 // 411
      },                                                                                                             // 412
      update: function() {                                                                                           // 413
        return true;                                                                                                 // 414
      },                                                                                                             // 415
      remove: function () {                                                                                          // 416
        return true;                                                                                                 // 417
      },                                                                                                             // 418
      fetch: [],                                                                                                     // 419
      transform: null                                                                                                // 420
    });                                                                                                              // 421
    alreadyInsecured[c._name] = true;                                                                                // 422
  }                                                                                                                  // 423
  // If insecure package is NOT in use, then adding the two deny functions                                           // 424
  // does not have any effect on the main app's security paradigm. The                                               // 425
  // user will still be required to add at least one allow function of her                                           // 426
  // own for each operation for this collection. And the user may still add                                          // 427
  // additional deny functions, but does not have to.                                                                // 428
}                                                                                                                    // 429
                                                                                                                     // 430
var alreadyDefined = {};                                                                                             // 431
function defineDeny(c, options) {                                                                                    // 432
  if (!alreadyDefined[c._name]) {                                                                                    // 433
                                                                                                                     // 434
    var isLocalCollection = (c._connection === null);                                                                // 435
                                                                                                                     // 436
    // First define deny functions to extend doc with the results of clean                                           // 437
    // and autovalues. This must be done with "transform: null" or we would be                                       // 438
    // extending a clone of doc and therefore have no effect.                                                        // 439
    c.deny({                                                                                                         // 440
      insert: function(userId, doc) {                                                                                // 441
        // Referenced doc is cleaned in place                                                                        // 442
        c.simpleSchema().clean(doc, {                                                                                // 443
          isModifier: false,                                                                                         // 444
          // We don't do these here because they are done on the client if desired                                   // 445
          filter: false,                                                                                             // 446
          autoConvert: false,                                                                                        // 447
          removeEmptyStrings: false,                                                                                 // 448
          trimStrings: false,                                                                                        // 449
          extendAutoValueContext: {                                                                                  // 450
            isInsert: true,                                                                                          // 451
            isUpdate: false,                                                                                         // 452
            isUpsert: false,                                                                                         // 453
            userId: userId,                                                                                          // 454
            isFromTrustedCode: false,                                                                                // 455
            docId: doc._id,                                                                                          // 456
            isLocalCollection: isLocalCollection                                                                     // 457
          }                                                                                                          // 458
        });                                                                                                          // 459
                                                                                                                     // 460
        return false;                                                                                                // 461
      },                                                                                                             // 462
      update: function(userId, doc, fields, modifier) {                                                              // 463
        // Referenced modifier is cleaned in place                                                                   // 464
        c.simpleSchema().clean(modifier, {                                                                           // 465
          isModifier: true,                                                                                          // 466
          // We don't do these here because they are done on the client if desired                                   // 467
          filter: false,                                                                                             // 468
          autoConvert: false,                                                                                        // 469
          removeEmptyStrings: false,                                                                                 // 470
          trimStrings: false,                                                                                        // 471
          extendAutoValueContext: {                                                                                  // 472
            isInsert: false,                                                                                         // 473
            isUpdate: true,                                                                                          // 474
            isUpsert: false,                                                                                         // 475
            userId: userId,                                                                                          // 476
            isFromTrustedCode: false,                                                                                // 477
            docId: doc && doc._id,                                                                                   // 478
            isLocalCollection: isLocalCollection                                                                     // 479
          }                                                                                                          // 480
        });                                                                                                          // 481
                                                                                                                     // 482
        return false;                                                                                                // 483
      },                                                                                                             // 484
      fetch: ['_id'],                                                                                                // 485
      transform: null                                                                                                // 486
    });                                                                                                              // 487
                                                                                                                     // 488
    // Second define deny functions to validate again on the server                                                  // 489
    // for client-initiated inserts and updates. These should be                                                     // 490
    // called after the clean/autovalue functions since we're adding                                                 // 491
    // them after. These must *not* have "transform: null" if options.transform is true because                      // 492
    // we need to pass the doc through any transforms to be sure                                                     // 493
    // that custom types are properly recognized for type validation.                                                // 494
    c.deny(_.extend({                                                                                                // 495
      insert: function(userId, doc) {                                                                                // 496
        // We pass the false options because we will have done them on client if desired                             // 497
        doValidate.call(                                                                                             // 498
          c,                                                                                                         // 499
          "insert",                                                                                                  // 500
          [                                                                                                          // 501
            doc,                                                                                                     // 502
            {                                                                                                        // 503
              trimStrings: false,                                                                                    // 504
              removeEmptyStrings: false,                                                                             // 505
              filter: false,                                                                                         // 506
              autoConvert: false                                                                                     // 507
            },                                                                                                       // 508
            function(error) {                                                                                        // 509
              if (error) {                                                                                           // 510
                throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));                          // 511
              }                                                                                                      // 512
            }                                                                                                        // 513
          ],                                                                                                         // 514
          false, // getAutoValues                                                                                    // 515
          userId,                                                                                                    // 516
          false // isFromTrustedCode                                                                                 // 517
        );                                                                                                           // 518
                                                                                                                     // 519
        return false;                                                                                                // 520
      },                                                                                                             // 521
      update: function(userId, doc, fields, modifier) {                                                              // 522
        // NOTE: This will never be an upsert because client-side upserts                                            // 523
        // are not allowed once you define allow/deny functions.                                                     // 524
        // We pass the false options because we will have done them on client if desired                             // 525
        doValidate.call(                                                                                             // 526
          c,                                                                                                         // 527
          "update",                                                                                                  // 528
          [                                                                                                          // 529
            {_id: doc && doc._id},                                                                                   // 530
            modifier,                                                                                                // 531
            {                                                                                                        // 532
              trimStrings: false,                                                                                    // 533
              removeEmptyStrings: false,                                                                             // 534
              filter: false,                                                                                         // 535
              autoConvert: false                                                                                     // 536
            },                                                                                                       // 537
            function(error) {                                                                                        // 538
              if (error) {                                                                                           // 539
                throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));                          // 540
              }                                                                                                      // 541
            }                                                                                                        // 542
          ],                                                                                                         // 543
          false, // getAutoValues                                                                                    // 544
          userId,                                                                                                    // 545
          false // isFromTrustedCode                                                                                 // 546
        );                                                                                                           // 547
                                                                                                                     // 548
        return false;                                                                                                // 549
      },                                                                                                             // 550
      fetch: ['_id']                                                                                                 // 551
    }, options.transform === true ? {} : {transform: null}));                                                        // 552
                                                                                                                     // 553
    // note that we've already done this collection so that we don't do it again                                     // 554
    // if attachSchema is called again                                                                               // 555
    alreadyDefined[c._name] = true;                                                                                  // 556
  }                                                                                                                  // 557
}                                                                                                                    // 558
                                                                                                                     // 559
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:collection2-core'] = {
  Collection2: Collection2
};

})();

//# sourceMappingURL=aldeed_collection2-core.js.map
