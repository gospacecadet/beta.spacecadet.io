(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var moment;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/momentjs_moment/moment.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//! moment.js                                                                                                         // 1
//! version : 2.11.1                                                                                                  // 2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors                                                        // 3
//! license : MIT                                                                                                     // 4
//! momentjs.com                                                                                                      // 5
                                                                                                                      // 6
;(function (global, factory) {                                                                                        // 7
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :                       // 8
    typeof define === 'function' && define.amd ? define(factory) :                                                    // 9
    global.moment = factory()                                                                                         // 10
}(this, function () { 'use strict';                                                                                   // 11
                                                                                                                      // 12
    var hookCallback;                                                                                                 // 13
                                                                                                                      // 14
    function utils_hooks__hooks () {                                                                                  // 15
        return hookCallback.apply(null, arguments);                                                                   // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    // This is done to register the method called with moment()                                                       // 19
    // without creating circular dependencies.                                                                        // 20
    function setHookCallback (callback) {                                                                             // 21
        hookCallback = callback;                                                                                      // 22
    }                                                                                                                 // 23
                                                                                                                      // 24
    function isArray(input) {                                                                                         // 25
        return Object.prototype.toString.call(input) === '[object Array]';                                            // 26
    }                                                                                                                 // 27
                                                                                                                      // 28
    function isDate(input) {                                                                                          // 29
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';                    // 30
    }                                                                                                                 // 31
                                                                                                                      // 32
    function map(arr, fn) {                                                                                           // 33
        var res = [], i;                                                                                              // 34
        for (i = 0; i < arr.length; ++i) {                                                                            // 35
            res.push(fn(arr[i], i));                                                                                  // 36
        }                                                                                                             // 37
        return res;                                                                                                   // 38
    }                                                                                                                 // 39
                                                                                                                      // 40
    function hasOwnProp(a, b) {                                                                                       // 41
        return Object.prototype.hasOwnProperty.call(a, b);                                                            // 42
    }                                                                                                                 // 43
                                                                                                                      // 44
    function extend(a, b) {                                                                                           // 45
        for (var i in b) {                                                                                            // 46
            if (hasOwnProp(b, i)) {                                                                                   // 47
                a[i] = b[i];                                                                                          // 48
            }                                                                                                         // 49
        }                                                                                                             // 50
                                                                                                                      // 51
        if (hasOwnProp(b, 'toString')) {                                                                              // 52
            a.toString = b.toString;                                                                                  // 53
        }                                                                                                             // 54
                                                                                                                      // 55
        if (hasOwnProp(b, 'valueOf')) {                                                                               // 56
            a.valueOf = b.valueOf;                                                                                    // 57
        }                                                                                                             // 58
                                                                                                                      // 59
        return a;                                                                                                     // 60
    }                                                                                                                 // 61
                                                                                                                      // 62
    function create_utc__createUTC (input, format, locale, strict) {                                                  // 63
        return createLocalOrUTC(input, format, locale, strict, true).utc();                                           // 64
    }                                                                                                                 // 65
                                                                                                                      // 66
    function defaultParsingFlags() {                                                                                  // 67
        // We need to deep clone this object.                                                                         // 68
        return {                                                                                                      // 69
            empty           : false,                                                                                  // 70
            unusedTokens    : [],                                                                                     // 71
            unusedInput     : [],                                                                                     // 72
            overflow        : -2,                                                                                     // 73
            charsLeftOver   : 0,                                                                                      // 74
            nullInput       : false,                                                                                  // 75
            invalidMonth    : null,                                                                                   // 76
            invalidFormat   : false,                                                                                  // 77
            userInvalidated : false,                                                                                  // 78
            iso             : false                                                                                   // 79
        };                                                                                                            // 80
    }                                                                                                                 // 81
                                                                                                                      // 82
    function getParsingFlags(m) {                                                                                     // 83
        if (m._pf == null) {                                                                                          // 84
            m._pf = defaultParsingFlags();                                                                            // 85
        }                                                                                                             // 86
        return m._pf;                                                                                                 // 87
    }                                                                                                                 // 88
                                                                                                                      // 89
    function valid__isValid(m) {                                                                                      // 90
        if (m._isValid == null) {                                                                                     // 91
            var flags = getParsingFlags(m);                                                                           // 92
            m._isValid = !isNaN(m._d.getTime()) &&                                                                    // 93
                flags.overflow < 0 &&                                                                                 // 94
                !flags.empty &&                                                                                       // 95
                !flags.invalidMonth &&                                                                                // 96
                !flags.invalidWeekday &&                                                                              // 97
                !flags.nullInput &&                                                                                   // 98
                !flags.invalidFormat &&                                                                               // 99
                !flags.userInvalidated;                                                                               // 100
                                                                                                                      // 101
            if (m._strict) {                                                                                          // 102
                m._isValid = m._isValid &&                                                                            // 103
                    flags.charsLeftOver === 0 &&                                                                      // 104
                    flags.unusedTokens.length === 0 &&                                                                // 105
                    flags.bigHour === undefined;                                                                      // 106
            }                                                                                                         // 107
        }                                                                                                             // 108
        return m._isValid;                                                                                            // 109
    }                                                                                                                 // 110
                                                                                                                      // 111
    function valid__createInvalid (flags) {                                                                           // 112
        var m = create_utc__createUTC(NaN);                                                                           // 113
        if (flags != null) {                                                                                          // 114
            extend(getParsingFlags(m), flags);                                                                        // 115
        }                                                                                                             // 116
        else {                                                                                                        // 117
            getParsingFlags(m).userInvalidated = true;                                                                // 118
        }                                                                                                             // 119
                                                                                                                      // 120
        return m;                                                                                                     // 121
    }                                                                                                                 // 122
                                                                                                                      // 123
    function isUndefined(input) {                                                                                     // 124
        return input === void 0;                                                                                      // 125
    }                                                                                                                 // 126
                                                                                                                      // 127
    // Plugins that add properties should also add the key here (null value),                                         // 128
    // so we can properly clone ourselves.                                                                            // 129
    var momentProperties = utils_hooks__hooks.momentProperties = [];                                                  // 130
                                                                                                                      // 131
    function copyConfig(to, from) {                                                                                   // 132
        var i, prop, val;                                                                                             // 133
                                                                                                                      // 134
        if (!isUndefined(from._isAMomentObject)) {                                                                    // 135
            to._isAMomentObject = from._isAMomentObject;                                                              // 136
        }                                                                                                             // 137
        if (!isUndefined(from._i)) {                                                                                  // 138
            to._i = from._i;                                                                                          // 139
        }                                                                                                             // 140
        if (!isUndefined(from._f)) {                                                                                  // 141
            to._f = from._f;                                                                                          // 142
        }                                                                                                             // 143
        if (!isUndefined(from._l)) {                                                                                  // 144
            to._l = from._l;                                                                                          // 145
        }                                                                                                             // 146
        if (!isUndefined(from._strict)) {                                                                             // 147
            to._strict = from._strict;                                                                                // 148
        }                                                                                                             // 149
        if (!isUndefined(from._tzm)) {                                                                                // 150
            to._tzm = from._tzm;                                                                                      // 151
        }                                                                                                             // 152
        if (!isUndefined(from._isUTC)) {                                                                              // 153
            to._isUTC = from._isUTC;                                                                                  // 154
        }                                                                                                             // 155
        if (!isUndefined(from._offset)) {                                                                             // 156
            to._offset = from._offset;                                                                                // 157
        }                                                                                                             // 158
        if (!isUndefined(from._pf)) {                                                                                 // 159
            to._pf = getParsingFlags(from);                                                                           // 160
        }                                                                                                             // 161
        if (!isUndefined(from._locale)) {                                                                             // 162
            to._locale = from._locale;                                                                                // 163
        }                                                                                                             // 164
                                                                                                                      // 165
        if (momentProperties.length > 0) {                                                                            // 166
            for (i in momentProperties) {                                                                             // 167
                prop = momentProperties[i];                                                                           // 168
                val = from[prop];                                                                                     // 169
                if (!isUndefined(val)) {                                                                              // 170
                    to[prop] = val;                                                                                   // 171
                }                                                                                                     // 172
            }                                                                                                         // 173
        }                                                                                                             // 174
                                                                                                                      // 175
        return to;                                                                                                    // 176
    }                                                                                                                 // 177
                                                                                                                      // 178
    var updateInProgress = false;                                                                                     // 179
                                                                                                                      // 180
    // Moment prototype object                                                                                        // 181
    function Moment(config) {                                                                                         // 182
        copyConfig(this, config);                                                                                     // 183
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);                                            // 184
        // Prevent infinite loop in case updateOffset creates new moment                                              // 185
        // objects.                                                                                                   // 186
        if (updateInProgress === false) {                                                                             // 187
            updateInProgress = true;                                                                                  // 188
            utils_hooks__hooks.updateOffset(this);                                                                    // 189
            updateInProgress = false;                                                                                 // 190
        }                                                                                                             // 191
    }                                                                                                                 // 192
                                                                                                                      // 193
    function isMoment (obj) {                                                                                         // 194
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);                                // 195
    }                                                                                                                 // 196
                                                                                                                      // 197
    function absFloor (number) {                                                                                      // 198
        if (number < 0) {                                                                                             // 199
            return Math.ceil(number);                                                                                 // 200
        } else {                                                                                                      // 201
            return Math.floor(number);                                                                                // 202
        }                                                                                                             // 203
    }                                                                                                                 // 204
                                                                                                                      // 205
    function toInt(argumentForCoercion) {                                                                             // 206
        var coercedNumber = +argumentForCoercion,                                                                     // 207
            value = 0;                                                                                                // 208
                                                                                                                      // 209
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {                                                         // 210
            value = absFloor(coercedNumber);                                                                          // 211
        }                                                                                                             // 212
                                                                                                                      // 213
        return value;                                                                                                 // 214
    }                                                                                                                 // 215
                                                                                                                      // 216
    // compare two arrays, return the number of differences                                                           // 217
    function compareArrays(array1, array2, dontConvert) {                                                             // 218
        var len = Math.min(array1.length, array2.length),                                                             // 219
            lengthDiff = Math.abs(array1.length - array2.length),                                                     // 220
            diffs = 0,                                                                                                // 221
            i;                                                                                                        // 222
        for (i = 0; i < len; i++) {                                                                                   // 223
            if ((dontConvert && array1[i] !== array2[i]) ||                                                           // 224
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {                                            // 225
                diffs++;                                                                                              // 226
            }                                                                                                         // 227
        }                                                                                                             // 228
        return diffs + lengthDiff;                                                                                    // 229
    }                                                                                                                 // 230
                                                                                                                      // 231
    function Locale() {                                                                                               // 232
    }                                                                                                                 // 233
                                                                                                                      // 234
    // internal storage for locale config files                                                                       // 235
    var locales = {};                                                                                                 // 236
    var globalLocale;                                                                                                 // 237
                                                                                                                      // 238
    function normalizeLocale(key) {                                                                                   // 239
        return key ? key.toLowerCase().replace('_', '-') : key;                                                       // 240
    }                                                                                                                 // 241
                                                                                                                      // 242
    // pick the locale from the array                                                                                 // 243
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each                      // 244
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {                                                                                    // 246
        var i = 0, j, next, locale, split;                                                                            // 247
                                                                                                                      // 248
        while (i < names.length) {                                                                                    // 249
            split = normalizeLocale(names[i]).split('-');                                                             // 250
            j = split.length;                                                                                         // 251
            next = normalizeLocale(names[i + 1]);                                                                     // 252
            next = next ? next.split('-') : null;                                                                     // 253
            while (j > 0) {                                                                                           // 254
                locale = loadLocale(split.slice(0, j).join('-'));                                                     // 255
                if (locale) {                                                                                         // 256
                    return locale;                                                                                    // 257
                }                                                                                                     // 258
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {                          // 259
                    //the next array item is better than a shallower substring of this one                            // 260
                    break;                                                                                            // 261
                }                                                                                                     // 262
                j--;                                                                                                  // 263
            }                                                                                                         // 264
            i++;                                                                                                      // 265
        }                                                                                                             // 266
        return null;                                                                                                  // 267
    }                                                                                                                 // 268
                                                                                                                      // 269
    function loadLocale(name) {                                                                                       // 270
        var oldLocale = null;                                                                                         // 271
        // TODO: Find a better way to register and load all the locales in Node                                       // 272
        if (!locales[name] && (typeof module !== 'undefined') &&                                                      // 273
                module && module.exports) {                                                                           // 274
            try {                                                                                                     // 275
                oldLocale = globalLocale._abbr;                                                                       // 276
                require('./locale/' + name);                                                                          // 277
                // because defineLocale currently also sets the global locale, we                                     // 278
                // want to undo that for lazy loaded locales                                                          // 279
                locale_locales__getSetGlobalLocale(oldLocale);                                                        // 280
            } catch (e) { }                                                                                           // 281
        }                                                                                                             // 282
        return locales[name];                                                                                         // 283
    }                                                                                                                 // 284
                                                                                                                      // 285
    // This function will load locale and then set the global locale.  If                                             // 286
    // no arguments are passed in, it will simply return the current global                                           // 287
    // locale key.                                                                                                    // 288
    function locale_locales__getSetGlobalLocale (key, values) {                                                       // 289
        var data;                                                                                                     // 290
        if (key) {                                                                                                    // 291
            if (isUndefined(values)) {                                                                                // 292
                data = locale_locales__getLocale(key);                                                                // 293
            }                                                                                                         // 294
            else {                                                                                                    // 295
                data = defineLocale(key, values);                                                                     // 296
            }                                                                                                         // 297
                                                                                                                      // 298
            if (data) {                                                                                               // 299
                // moment.duration._locale = moment._locale = data;                                                   // 300
                globalLocale = data;                                                                                  // 301
            }                                                                                                         // 302
        }                                                                                                             // 303
                                                                                                                      // 304
        return globalLocale._abbr;                                                                                    // 305
    }                                                                                                                 // 306
                                                                                                                      // 307
    function defineLocale (name, values) {                                                                            // 308
        if (values !== null) {                                                                                        // 309
            values.abbr = name;                                                                                       // 310
            locales[name] = locales[name] || new Locale();                                                            // 311
            locales[name].set(values);                                                                                // 312
                                                                                                                      // 313
            // backwards compat for now: also set the locale                                                          // 314
            locale_locales__getSetGlobalLocale(name);                                                                 // 315
                                                                                                                      // 316
            return locales[name];                                                                                     // 317
        } else {                                                                                                      // 318
            // useful for testing                                                                                     // 319
            delete locales[name];                                                                                     // 320
            return null;                                                                                              // 321
        }                                                                                                             // 322
    }                                                                                                                 // 323
                                                                                                                      // 324
    // returns locale data                                                                                            // 325
    function locale_locales__getLocale (key) {                                                                        // 326
        var locale;                                                                                                   // 327
                                                                                                                      // 328
        if (key && key._locale && key._locale._abbr) {                                                                // 329
            key = key._locale._abbr;                                                                                  // 330
        }                                                                                                             // 331
                                                                                                                      // 332
        if (!key) {                                                                                                   // 333
            return globalLocale;                                                                                      // 334
        }                                                                                                             // 335
                                                                                                                      // 336
        if (!isArray(key)) {                                                                                          // 337
            //short-circuit everything else                                                                           // 338
            locale = loadLocale(key);                                                                                 // 339
            if (locale) {                                                                                             // 340
                return locale;                                                                                        // 341
            }                                                                                                         // 342
            key = [key];                                                                                              // 343
        }                                                                                                             // 344
                                                                                                                      // 345
        return chooseLocale(key);                                                                                     // 346
    }                                                                                                                 // 347
                                                                                                                      // 348
    var aliases = {};                                                                                                 // 349
                                                                                                                      // 350
    function addUnitAlias (unit, shorthand) {                                                                         // 351
        var lowerCase = unit.toLowerCase();                                                                           // 352
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;                                    // 353
    }                                                                                                                 // 354
                                                                                                                      // 355
    function normalizeUnits(units) {                                                                                  // 356
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;                // 357
    }                                                                                                                 // 358
                                                                                                                      // 359
    function normalizeObjectUnits(inputObject) {                                                                      // 360
        var normalizedInput = {},                                                                                     // 361
            normalizedProp,                                                                                           // 362
            prop;                                                                                                     // 363
                                                                                                                      // 364
        for (prop in inputObject) {                                                                                   // 365
            if (hasOwnProp(inputObject, prop)) {                                                                      // 366
                normalizedProp = normalizeUnits(prop);                                                                // 367
                if (normalizedProp) {                                                                                 // 368
                    normalizedInput[normalizedProp] = inputObject[prop];                                              // 369
                }                                                                                                     // 370
            }                                                                                                         // 371
        }                                                                                                             // 372
                                                                                                                      // 373
        return normalizedInput;                                                                                       // 374
    }                                                                                                                 // 375
                                                                                                                      // 376
    function isFunction(input) {                                                                                      // 377
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';            // 378
    }                                                                                                                 // 379
                                                                                                                      // 380
    function makeGetSet (unit, keepTime) {                                                                            // 381
        return function (value) {                                                                                     // 382
            if (value != null) {                                                                                      // 383
                get_set__set(this, unit, value);                                                                      // 384
                utils_hooks__hooks.updateOffset(this, keepTime);                                                      // 385
                return this;                                                                                          // 386
            } else {                                                                                                  // 387
                return get_set__get(this, unit);                                                                      // 388
            }                                                                                                         // 389
        };                                                                                                            // 390
    }                                                                                                                 // 391
                                                                                                                      // 392
    function get_set__get (mom, unit) {                                                                               // 393
        return mom.isValid() ?                                                                                        // 394
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;                                                 // 395
    }                                                                                                                 // 396
                                                                                                                      // 397
    function get_set__set (mom, unit, value) {                                                                        // 398
        if (mom.isValid()) {                                                                                          // 399
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);                                                  // 400
        }                                                                                                             // 401
    }                                                                                                                 // 402
                                                                                                                      // 403
    // MOMENTS                                                                                                        // 404
                                                                                                                      // 405
    function getSet (units, value) {                                                                                  // 406
        var unit;                                                                                                     // 407
        if (typeof units === 'object') {                                                                              // 408
            for (unit in units) {                                                                                     // 409
                this.set(unit, units[unit]);                                                                          // 410
            }                                                                                                         // 411
        } else {                                                                                                      // 412
            units = normalizeUnits(units);                                                                            // 413
            if (isFunction(this[units])) {                                                                            // 414
                return this[units](value);                                                                            // 415
            }                                                                                                         // 416
        }                                                                                                             // 417
        return this;                                                                                                  // 418
    }                                                                                                                 // 419
                                                                                                                      // 420
    function zeroFill(number, targetLength, forceSign) {                                                              // 421
        var absNumber = '' + Math.abs(number),                                                                        // 422
            zerosToFill = targetLength - absNumber.length,                                                            // 423
            sign = number >= 0;                                                                                       // 424
        return (sign ? (forceSign ? '+' : '') : '-') +                                                                // 425
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;                                  // 426
    }                                                                                                                 // 427
                                                                                                                      // 428
    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
                                                                                                                      // 430
    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;                                         // 431
                                                                                                                      // 432
    var formatFunctions = {};                                                                                         // 433
                                                                                                                      // 434
    var formatTokenFunctions = {};                                                                                    // 435
                                                                                                                      // 436
    // token:    'M'                                                                                                  // 437
    // padded:   ['MM', 2]                                                                                            // 438
    // ordinal:  'Mo'                                                                                                 // 439
    // callback: function () { this.month() + 1 }                                                                     // 440
    function addFormatToken (token, padded, ordinal, callback) {                                                      // 441
        var func = callback;                                                                                          // 442
        if (typeof callback === 'string') {                                                                           // 443
            func = function () {                                                                                      // 444
                return this[callback]();                                                                              // 445
            };                                                                                                        // 446
        }                                                                                                             // 447
        if (token) {                                                                                                  // 448
            formatTokenFunctions[token] = func;                                                                       // 449
        }                                                                                                             // 450
        if (padded) {                                                                                                 // 451
            formatTokenFunctions[padded[0]] = function () {                                                           // 452
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);                                   // 453
            };                                                                                                        // 454
        }                                                                                                             // 455
        if (ordinal) {                                                                                                // 456
            formatTokenFunctions[ordinal] = function () {                                                             // 457
                return this.localeData().ordinal(func.apply(this, arguments), token);                                 // 458
            };                                                                                                        // 459
        }                                                                                                             // 460
    }                                                                                                                 // 461
                                                                                                                      // 462
    function removeFormattingTokens(input) {                                                                          // 463
        if (input.match(/\[[\s\S]/)) {                                                                                // 464
            return input.replace(/^\[|\]$/g, '');                                                                     // 465
        }                                                                                                             // 466
        return input.replace(/\\/g, '');                                                                              // 467
    }                                                                                                                 // 468
                                                                                                                      // 469
    function makeFormatFunction(format) {                                                                             // 470
        var array = format.match(formattingTokens), i, length;                                                        // 471
                                                                                                                      // 472
        for (i = 0, length = array.length; i < length; i++) {                                                         // 473
            if (formatTokenFunctions[array[i]]) {                                                                     // 474
                array[i] = formatTokenFunctions[array[i]];                                                            // 475
            } else {                                                                                                  // 476
                array[i] = removeFormattingTokens(array[i]);                                                          // 477
            }                                                                                                         // 478
        }                                                                                                             // 479
                                                                                                                      // 480
        return function (mom) {                                                                                       // 481
            var output = '';                                                                                          // 482
            for (i = 0; i < length; i++) {                                                                            // 483
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];                       // 484
            }                                                                                                         // 485
            return output;                                                                                            // 486
        };                                                                                                            // 487
    }                                                                                                                 // 488
                                                                                                                      // 489
    // format date using native date object                                                                           // 490
    function formatMoment(m, format) {                                                                                // 491
        if (!m.isValid()) {                                                                                           // 492
            return m.localeData().invalidDate();                                                                      // 493
        }                                                                                                             // 494
                                                                                                                      // 495
        format = expandFormat(format, m.localeData());                                                                // 496
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);                              // 497
                                                                                                                      // 498
        return formatFunctions[format](m);                                                                            // 499
    }                                                                                                                 // 500
                                                                                                                      // 501
    function expandFormat(format, locale) {                                                                           // 502
        var i = 5;                                                                                                    // 503
                                                                                                                      // 504
        function replaceLongDateFormatTokens(input) {                                                                 // 505
            return locale.longDateFormat(input) || input;                                                             // 506
        }                                                                                                             // 507
                                                                                                                      // 508
        localFormattingTokens.lastIndex = 0;                                                                          // 509
        while (i >= 0 && localFormattingTokens.test(format)) {                                                        // 510
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);                              // 511
            localFormattingTokens.lastIndex = 0;                                                                      // 512
            i -= 1;                                                                                                   // 513
        }                                                                                                             // 514
                                                                                                                      // 515
        return format;                                                                                                // 516
    }                                                                                                                 // 517
                                                                                                                      // 518
    var match1         = /\d/;            //       0 - 9                                                              // 519
    var match2         = /\d\d/;          //      00 - 99                                                             // 520
    var match3         = /\d{3}/;         //     000 - 999                                                            // 521
    var match4         = /\d{4}/;         //    0000 - 9999                                                           // 522
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999                                                         // 523
    var match1to2      = /\d\d?/;         //       0 - 99                                                             // 524
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999                                                           // 525
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999                                                         // 526
    var match1to3      = /\d{1,3}/;       //       0 - 999                                                            // 527
    var match1to4      = /\d{1,4}/;       //       0 - 9999                                                           // 528
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999                                                         // 529
                                                                                                                      // 530
    var matchUnsigned  = /\d+/;           //       0 - inf                                                            // 531
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf                                                            // 532
                                                                                                                      // 533
    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z                                      // 534
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z                       // 535
                                                                                                                      // 536
    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123                                           // 537
                                                                                                                      // 538
    // any word (or two) characters or numbers including two/three word month in arabic.                              // 539
    // includes scottish gaelic two word and hyphenated months                                                        // 540
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
                                                                                                                      // 542
                                                                                                                      // 543
    var regexes = {};                                                                                                 // 544
                                                                                                                      // 545
    function addRegexToken (token, regex, strictRegex) {                                                              // 546
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {                                // 547
            return (isStrict && strictRegex) ? strictRegex : regex;                                                   // 548
        };                                                                                                            // 549
    }                                                                                                                 // 550
                                                                                                                      // 551
    function getParseRegexForToken (token, config) {                                                                  // 552
        if (!hasOwnProp(regexes, token)) {                                                                            // 553
            return new RegExp(unescapeFormat(token));                                                                 // 554
        }                                                                                                             // 555
                                                                                                                      // 556
        return regexes[token](config._strict, config._locale);                                                        // 557
    }                                                                                                                 // 558
                                                                                                                      // 559
    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript           // 560
    function unescapeFormat(s) {                                                                                      // 561
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;                                                                              // 563
        }));                                                                                                          // 564
    }                                                                                                                 // 565
                                                                                                                      // 566
    function regexEscape(s) {                                                                                         // 567
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                                                           // 568
    }                                                                                                                 // 569
                                                                                                                      // 570
    var tokens = {};                                                                                                  // 571
                                                                                                                      // 572
    function addParseToken (token, callback) {                                                                        // 573
        var i, func = callback;                                                                                       // 574
        if (typeof token === 'string') {                                                                              // 575
            token = [token];                                                                                          // 576
        }                                                                                                             // 577
        if (typeof callback === 'number') {                                                                           // 578
            func = function (input, array) {                                                                          // 579
                array[callback] = toInt(input);                                                                       // 580
            };                                                                                                        // 581
        }                                                                                                             // 582
        for (i = 0; i < token.length; i++) {                                                                          // 583
            tokens[token[i]] = func;                                                                                  // 584
        }                                                                                                             // 585
    }                                                                                                                 // 586
                                                                                                                      // 587
    function addWeekParseToken (token, callback) {                                                                    // 588
        addParseToken(token, function (input, array, config, token) {                                                 // 589
            config._w = config._w || {};                                                                              // 590
            callback(input, config._w, config, token);                                                                // 591
        });                                                                                                           // 592
    }                                                                                                                 // 593
                                                                                                                      // 594
    function addTimeToArrayFromToken(token, input, config) {                                                          // 595
        if (input != null && hasOwnProp(tokens, token)) {                                                             // 596
            tokens[token](input, config._a, config, token);                                                           // 597
        }                                                                                                             // 598
    }                                                                                                                 // 599
                                                                                                                      // 600
    var YEAR = 0;                                                                                                     // 601
    var MONTH = 1;                                                                                                    // 602
    var DATE = 2;                                                                                                     // 603
    var HOUR = 3;                                                                                                     // 604
    var MINUTE = 4;                                                                                                   // 605
    var SECOND = 5;                                                                                                   // 606
    var MILLISECOND = 6;                                                                                              // 607
    var WEEK = 7;                                                                                                     // 608
    var WEEKDAY = 8;                                                                                                  // 609
                                                                                                                      // 610
    function daysInMonth(year, month) {                                                                               // 611
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();                                                   // 612
    }                                                                                                                 // 613
                                                                                                                      // 614
    // FORMATTING                                                                                                     // 615
                                                                                                                      // 616
    addFormatToken('M', ['MM', 2], 'Mo', function () {                                                                // 617
        return this.month() + 1;                                                                                      // 618
    });                                                                                                               // 619
                                                                                                                      // 620
    addFormatToken('MMM', 0, 0, function (format) {                                                                   // 621
        return this.localeData().monthsShort(this, format);                                                           // 622
    });                                                                                                               // 623
                                                                                                                      // 624
    addFormatToken('MMMM', 0, 0, function (format) {                                                                  // 625
        return this.localeData().months(this, format);                                                                // 626
    });                                                                                                               // 627
                                                                                                                      // 628
    // ALIASES                                                                                                        // 629
                                                                                                                      // 630
    addUnitAlias('month', 'M');                                                                                       // 631
                                                                                                                      // 632
    // PARSING                                                                                                        // 633
                                                                                                                      // 634
    addRegexToken('M',    match1to2);                                                                                 // 635
    addRegexToken('MM',   match1to2, match2);                                                                         // 636
    addRegexToken('MMM',  function (isStrict, locale) {                                                               // 637
        return locale.monthsShortRegex(isStrict);                                                                     // 638
    });                                                                                                               // 639
    addRegexToken('MMMM', function (isStrict, locale) {                                                               // 640
        return locale.monthsRegex(isStrict);                                                                          // 641
    });                                                                                                               // 642
                                                                                                                      // 643
    addParseToken(['M', 'MM'], function (input, array) {                                                              // 644
        array[MONTH] = toInt(input) - 1;                                                                              // 645
    });                                                                                                               // 646
                                                                                                                      // 647
    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {                                           // 648
        var month = config._locale.monthsParse(input, token, config._strict);                                         // 649
        // if we didn't find a month name, mark the date as invalid.                                                  // 650
        if (month != null) {                                                                                          // 651
            array[MONTH] = month;                                                                                     // 652
        } else {                                                                                                      // 653
            getParsingFlags(config).invalidMonth = input;                                                             // 654
        }                                                                                                             // 655
    });                                                                                                               // 656
                                                                                                                      // 657
    // LOCALES                                                                                                        // 658
                                                                                                                      // 659
    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;                                                          // 660
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {                                                                               // 662
        return isArray(this._months) ? this._months[m.month()] :                                                      // 663
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];                         // 664
    }                                                                                                                 // 665
                                                                                                                      // 666
    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');                      // 667
    function localeMonthsShort (m, format) {                                                                          // 668
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :                                            // 669
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];                    // 670
    }                                                                                                                 // 671
                                                                                                                      // 672
    function localeMonthsParse (monthName, format, strict) {                                                          // 673
        var i, mom, regex;                                                                                            // 674
                                                                                                                      // 675
        if (!this._monthsParse) {                                                                                     // 676
            this._monthsParse = [];                                                                                   // 677
            this._longMonthsParse = [];                                                                               // 678
            this._shortMonthsParse = [];                                                                              // 679
        }                                                                                                             // 680
                                                                                                                      // 681
        for (i = 0; i < 12; i++) {                                                                                    // 682
            // make the regex if we don't have it already                                                             // 683
            mom = create_utc__createUTC([2000, i]);                                                                   // 684
            if (strict && !this._longMonthsParse[i]) {                                                                // 685
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');        // 686
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');  // 687
            }                                                                                                         // 688
            if (!strict && !this._monthsParse[i]) {                                                                   // 689
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');                                // 690
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');                                       // 691
            }                                                                                                         // 692
            // test the regex                                                                                         // 693
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {                            // 694
                return i;                                                                                             // 695
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {                     // 696
                return i;                                                                                             // 697
            } else if (!strict && this._monthsParse[i].test(monthName)) {                                             // 698
                return i;                                                                                             // 699
            }                                                                                                         // 700
        }                                                                                                             // 701
    }                                                                                                                 // 702
                                                                                                                      // 703
    // MOMENTS                                                                                                        // 704
                                                                                                                      // 705
    function setMonth (mom, value) {                                                                                  // 706
        var dayOfMonth;                                                                                               // 707
                                                                                                                      // 708
        if (!mom.isValid()) {                                                                                         // 709
            // No op                                                                                                  // 710
            return mom;                                                                                               // 711
        }                                                                                                             // 712
                                                                                                                      // 713
        // TODO: Move this out of here!                                                                               // 714
        if (typeof value === 'string') {                                                                              // 715
            value = mom.localeData().monthsParse(value);                                                              // 716
            // TODO: Another silent failure?                                                                          // 717
            if (typeof value !== 'number') {                                                                          // 718
                return mom;                                                                                           // 719
            }                                                                                                         // 720
        }                                                                                                             // 721
                                                                                                                      // 722
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));                                            // 723
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);                                       // 724
        return mom;                                                                                                   // 725
    }                                                                                                                 // 726
                                                                                                                      // 727
    function getSetMonth (value) {                                                                                    // 728
        if (value != null) {                                                                                          // 729
            setMonth(this, value);                                                                                    // 730
            utils_hooks__hooks.updateOffset(this, true);                                                              // 731
            return this;                                                                                              // 732
        } else {                                                                                                      // 733
            return get_set__get(this, 'Month');                                                                       // 734
        }                                                                                                             // 735
    }                                                                                                                 // 736
                                                                                                                      // 737
    function getDaysInMonth () {                                                                                      // 738
        return daysInMonth(this.year(), this.month());                                                                // 739
    }                                                                                                                 // 740
                                                                                                                      // 741
    var defaultMonthsShortRegex = matchWord;                                                                          // 742
    function monthsShortRegex (isStrict) {                                                                            // 743
        if (this._monthsParseExact) {                                                                                 // 744
            if (!hasOwnProp(this, '_monthsRegex')) {                                                                  // 745
                computeMonthsParse.call(this);                                                                        // 746
            }                                                                                                         // 747
            if (isStrict) {                                                                                           // 748
                return this._monthsShortStrictRegex;                                                                  // 749
            } else {                                                                                                  // 750
                return this._monthsShortRegex;                                                                        // 751
            }                                                                                                         // 752
        } else {                                                                                                      // 753
            return this._monthsShortStrictRegex && isStrict ?                                                         // 754
                this._monthsShortStrictRegex : this._monthsShortRegex;                                                // 755
        }                                                                                                             // 756
    }                                                                                                                 // 757
                                                                                                                      // 758
    var defaultMonthsRegex = matchWord;                                                                               // 759
    function monthsRegex (isStrict) {                                                                                 // 760
        if (this._monthsParseExact) {                                                                                 // 761
            if (!hasOwnProp(this, '_monthsRegex')) {                                                                  // 762
                computeMonthsParse.call(this);                                                                        // 763
            }                                                                                                         // 764
            if (isStrict) {                                                                                           // 765
                return this._monthsStrictRegex;                                                                       // 766
            } else {                                                                                                  // 767
                return this._monthsRegex;                                                                             // 768
            }                                                                                                         // 769
        } else {                                                                                                      // 770
            return this._monthsStrictRegex && isStrict ?                                                              // 771
                this._monthsStrictRegex : this._monthsRegex;                                                          // 772
        }                                                                                                             // 773
    }                                                                                                                 // 774
                                                                                                                      // 775
    function computeMonthsParse () {                                                                                  // 776
        function cmpLenRev(a, b) {                                                                                    // 777
            return b.length - a.length;                                                                               // 778
        }                                                                                                             // 779
                                                                                                                      // 780
        var shortPieces = [], longPieces = [], mixedPieces = [],                                                      // 781
            i, mom;                                                                                                   // 782
        for (i = 0; i < 12; i++) {                                                                                    // 783
            // make the regex if we don't have it already                                                             // 784
            mom = create_utc__createUTC([2000, i]);                                                                   // 785
            shortPieces.push(this.monthsShort(mom, ''));                                                              // 786
            longPieces.push(this.months(mom, ''));                                                                    // 787
            mixedPieces.push(this.months(mom, ''));                                                                   // 788
            mixedPieces.push(this.monthsShort(mom, ''));                                                              // 789
        }                                                                                                             // 790
        // Sorting makes sure if one month (or abbr) is a prefix of another it                                        // 791
        // will match the longer piece.                                                                               // 792
        shortPieces.sort(cmpLenRev);                                                                                  // 793
        longPieces.sort(cmpLenRev);                                                                                   // 794
        mixedPieces.sort(cmpLenRev);                                                                                  // 795
        for (i = 0; i < 12; i++) {                                                                                    // 796
            shortPieces[i] = regexEscape(shortPieces[i]);                                                             // 797
            longPieces[i] = regexEscape(longPieces[i]);                                                               // 798
            mixedPieces[i] = regexEscape(mixedPieces[i]);                                                             // 799
        }                                                                                                             // 800
                                                                                                                      // 801
        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');                                      // 802
        this._monthsShortRegex = this._monthsRegex;                                                                   // 803
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');                                // 804
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');                          // 805
    }                                                                                                                 // 806
                                                                                                                      // 807
    function checkOverflow (m) {                                                                                      // 808
        var overflow;                                                                                                 // 809
        var a = m._a;                                                                                                 // 810
                                                                                                                      // 811
        if (a && getParsingFlags(m).overflow === -2) {                                                                // 812
            overflow =                                                                                                // 813
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :                                                  // 814
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :                        // 815
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :                                                 // 817
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :                                                 // 818
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :                                            // 819
                -1;                                                                                                   // 820
                                                                                                                      // 821
            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {                      // 822
                overflow = DATE;                                                                                      // 823
            }                                                                                                         // 824
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {                                               // 825
                overflow = WEEK;                                                                                      // 826
            }                                                                                                         // 827
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {                                             // 828
                overflow = WEEKDAY;                                                                                   // 829
            }                                                                                                         // 830
                                                                                                                      // 831
            getParsingFlags(m).overflow = overflow;                                                                   // 832
        }                                                                                                             // 833
                                                                                                                      // 834
        return m;                                                                                                     // 835
    }                                                                                                                 // 836
                                                                                                                      // 837
    function warn(msg) {                                                                                              // 838
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&                                               // 839
                (typeof console !==  'undefined') && console.warn) {                                                  // 840
            console.warn('Deprecation warning: ' + msg);                                                              // 841
        }                                                                                                             // 842
    }                                                                                                                 // 843
                                                                                                                      // 844
    function deprecate(msg, fn) {                                                                                     // 845
        var firstTime = true;                                                                                         // 846
                                                                                                                      // 847
        return extend(function () {                                                                                   // 848
            if (firstTime) {                                                                                          // 849
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;                                                                                    // 851
            }                                                                                                         // 852
            return fn.apply(this, arguments);                                                                         // 853
        }, fn);                                                                                                       // 854
    }                                                                                                                 // 855
                                                                                                                      // 856
    var deprecations = {};                                                                                            // 857
                                                                                                                      // 858
    function deprecateSimple(name, msg) {                                                                             // 859
        if (!deprecations[name]) {                                                                                    // 860
            warn(msg);                                                                                                // 861
            deprecations[name] = true;                                                                                // 862
        }                                                                                                             // 863
    }                                                                                                                 // 864
                                                                                                                      // 865
    utils_hooks__hooks.suppressDeprecationWarnings = false;                                                           // 866
                                                                                                                      // 867
    // iso 8601 regex                                                                                                 // 868
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)      // 869
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                                                                                                                      // 872
    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;                                                                            // 873
                                                                                                                      // 874
    var isoDates = [                                                                                                  // 875
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],                                                                      // 876
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],                                                                            // 877
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],                                                                           // 878
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],                                                                         // 879
        ['YYYY-DDD', /\d{4}-\d{3}/],                                                                                  // 880
        ['YYYY-MM', /\d{4}-\d\d/, false],                                                                             // 881
        ['YYYYYYMMDD', /[+-]\d{10}/],                                                                                 // 882
        ['YYYYMMDD', /\d{8}/],                                                                                        // 883
        // YYYYMM is NOT allowed by the standard                                                                      // 884
        ['GGGG[W]WWE', /\d{4}W\d{3}/],                                                                                // 885
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],                                                                          // 886
        ['YYYYDDD', /\d{7}/]                                                                                          // 887
    ];                                                                                                                // 888
                                                                                                                      // 889
    // iso time formats and regexes                                                                                   // 890
    var isoTimes = [                                                                                                  // 891
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],                                                                     // 892
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],                                                                      // 893
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],                                                                               // 894
        ['HH:mm', /\d\d:\d\d/],                                                                                       // 895
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],                                                                         // 896
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],                                                                          // 897
        ['HHmmss', /\d\d\d\d\d\d/],                                                                                   // 898
        ['HHmm', /\d\d\d\d/],                                                                                         // 899
        ['HH', /\d\d/]                                                                                                // 900
    ];                                                                                                                // 901
                                                                                                                      // 902
    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;                                                                      // 903
                                                                                                                      // 904
    // date from iso format                                                                                           // 905
    function configFromISO(config) {                                                                                  // 906
        var i, l,                                                                                                     // 907
            string = config._i,                                                                                       // 908
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),                                      // 909
            allowTime, dateFormat, timeFormat, tzFormat;                                                              // 910
                                                                                                                      // 911
        if (match) {                                                                                                  // 912
            getParsingFlags(config).iso = true;                                                                       // 913
                                                                                                                      // 914
            for (i = 0, l = isoDates.length; i < l; i++) {                                                            // 915
                if (isoDates[i][1].exec(match[1])) {                                                                  // 916
                    dateFormat = isoDates[i][0];                                                                      // 917
                    allowTime = isoDates[i][2] !== false;                                                             // 918
                    break;                                                                                            // 919
                }                                                                                                     // 920
            }                                                                                                         // 921
            if (dateFormat == null) {                                                                                 // 922
                config._isValid = false;                                                                              // 923
                return;                                                                                               // 924
            }                                                                                                         // 925
            if (match[3]) {                                                                                           // 926
                for (i = 0, l = isoTimes.length; i < l; i++) {                                                        // 927
                    if (isoTimes[i][1].exec(match[3])) {                                                              // 928
                        // match[2] should be 'T' or space                                                            // 929
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];                                              // 930
                        break;                                                                                        // 931
                    }                                                                                                 // 932
                }                                                                                                     // 933
                if (timeFormat == null) {                                                                             // 934
                    config._isValid = false;                                                                          // 935
                    return;                                                                                           // 936
                }                                                                                                     // 937
            }                                                                                                         // 938
            if (!allowTime && timeFormat != null) {                                                                   // 939
                config._isValid = false;                                                                              // 940
                return;                                                                                               // 941
            }                                                                                                         // 942
            if (match[4]) {                                                                                           // 943
                if (tzRegex.exec(match[4])) {                                                                         // 944
                    tzFormat = 'Z';                                                                                   // 945
                } else {                                                                                              // 946
                    config._isValid = false;                                                                          // 947
                    return;                                                                                           // 948
                }                                                                                                     // 949
            }                                                                                                         // 950
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');                                           // 951
            configFromStringAndFormat(config);                                                                        // 952
        } else {                                                                                                      // 953
            config._isValid = false;                                                                                  // 954
        }                                                                                                             // 955
    }                                                                                                                 // 956
                                                                                                                      // 957
    // date from iso format or fallback                                                                               // 958
    function configFromString(config) {                                                                               // 959
        var matched = aspNetJsonRegex.exec(config._i);                                                                // 960
                                                                                                                      // 961
        if (matched !== null) {                                                                                       // 962
            config._d = new Date(+matched[1]);                                                                        // 963
            return;                                                                                                   // 964
        }                                                                                                             // 965
                                                                                                                      // 966
        configFromISO(config);                                                                                        // 967
        if (config._isValid === false) {                                                                              // 968
            delete config._isValid;                                                                                   // 969
            utils_hooks__hooks.createFromInputFallback(config);                                                       // 970
        }                                                                                                             // 971
    }                                                                                                                 // 972
                                                                                                                      // 973
    utils_hooks__hooks.createFromInputFallback = deprecate(                                                           // 974
        'moment construction falls back to js Date. This is ' +                                                       // 975
        'discouraged and will be removed in upcoming major ' +                                                        // 976
        'release. Please refer to ' +                                                                                 // 977
        'https://github.com/moment/moment/issues/1407 for more info.',                                                // 978
        function (config) {                                                                                           // 979
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));                                         // 980
        }                                                                                                             // 981
    );                                                                                                                // 982
                                                                                                                      // 983
    function createDate (y, m, d, h, M, s, ms) {                                                                      // 984
        //can't just apply() to create a date:                                                                        // 985
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);                                                                    // 987
                                                                                                                      // 988
        //the date constructor remaps years 0-99 to 1900-1999                                                         // 989
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {                                                      // 990
            date.setFullYear(y);                                                                                      // 991
        }                                                                                                             // 992
        return date;                                                                                                  // 993
    }                                                                                                                 // 994
                                                                                                                      // 995
    function createUTCDate (y) {                                                                                      // 996
        var date = new Date(Date.UTC.apply(null, arguments));                                                         // 997
                                                                                                                      // 998
        //the Date.UTC function remaps years 0-99 to 1900-1999                                                        // 999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {                                                   // 1000
            date.setUTCFullYear(y);                                                                                   // 1001
        }                                                                                                             // 1002
        return date;                                                                                                  // 1003
    }                                                                                                                 // 1004
                                                                                                                      // 1005
    // FORMATTING                                                                                                     // 1006
                                                                                                                      // 1007
    addFormatToken('Y', 0, 0, function () {                                                                           // 1008
        var y = this.year();                                                                                          // 1009
        return y <= 9999 ? '' + y : '+' + y;                                                                          // 1010
    });                                                                                                               // 1011
                                                                                                                      // 1012
    addFormatToken(0, ['YY', 2], 0, function () {                                                                     // 1013
        return this.year() % 100;                                                                                     // 1014
    });                                                                                                               // 1015
                                                                                                                      // 1016
    addFormatToken(0, ['YYYY',   4],       0, 'year');                                                                // 1017
    addFormatToken(0, ['YYYYY',  5],       0, 'year');                                                                // 1018
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');                                                                // 1019
                                                                                                                      // 1020
    // ALIASES                                                                                                        // 1021
                                                                                                                      // 1022
    addUnitAlias('year', 'y');                                                                                        // 1023
                                                                                                                      // 1024
    // PARSING                                                                                                        // 1025
                                                                                                                      // 1026
    addRegexToken('Y',      matchSigned);                                                                             // 1027
    addRegexToken('YY',     match1to2, match2);                                                                       // 1028
    addRegexToken('YYYY',   match1to4, match4);                                                                       // 1029
    addRegexToken('YYYYY',  match1to6, match6);                                                                       // 1030
    addRegexToken('YYYYYY', match1to6, match6);                                                                       // 1031
                                                                                                                      // 1032
    addParseToken(['YYYYY', 'YYYYYY'], YEAR);                                                                         // 1033
    addParseToken('YYYY', function (input, array) {                                                                   // 1034
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);                // 1035
    });                                                                                                               // 1036
    addParseToken('YY', function (input, array) {                                                                     // 1037
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);                                                    // 1038
    });                                                                                                               // 1039
    addParseToken('Y', function (input, array) {                                                                      // 1040
        array[YEAR] = parseInt(input, 10);                                                                            // 1041
    });                                                                                                               // 1042
                                                                                                                      // 1043
    // HELPERS                                                                                                        // 1044
                                                                                                                      // 1045
    function daysInYear(year) {                                                                                       // 1046
        return isLeapYear(year) ? 366 : 365;                                                                          // 1047
    }                                                                                                                 // 1048
                                                                                                                      // 1049
    function isLeapYear(year) {                                                                                       // 1050
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;                                              // 1051
    }                                                                                                                 // 1052
                                                                                                                      // 1053
    // HOOKS                                                                                                          // 1054
                                                                                                                      // 1055
    utils_hooks__hooks.parseTwoDigitYear = function (input) {                                                         // 1056
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);                                                      // 1057
    };                                                                                                                // 1058
                                                                                                                      // 1059
    // MOMENTS                                                                                                        // 1060
                                                                                                                      // 1061
    var getSetYear = makeGetSet('FullYear', false);                                                                   // 1062
                                                                                                                      // 1063
    function getIsLeapYear () {                                                                                       // 1064
        return isLeapYear(this.year());                                                                               // 1065
    }                                                                                                                 // 1066
                                                                                                                      // 1067
    // start-of-first-week - start-of-year                                                                            // 1068
    function firstWeekOffset(year, dow, doy) {                                                                        // 1069
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)                   // 1070
            fwd = 7 + dow - doy,                                                                                      // 1071
            // first-week day local weekday -- which local weekday is fwd                                             // 1072
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;                                          // 1073
                                                                                                                      // 1074
        return -fwdlw + fwd - 1;                                                                                      // 1075
    }                                                                                                                 // 1076
                                                                                                                      // 1077
    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday         // 1078
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {                                                      // 1079
        var localWeekday = (7 + weekday - dow) % 7,                                                                   // 1080
            weekOffset = firstWeekOffset(year, dow, doy),                                                             // 1081
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,                                               // 1082
            resYear, resDayOfYear;                                                                                    // 1083
                                                                                                                      // 1084
        if (dayOfYear <= 0) {                                                                                         // 1085
            resYear = year - 1;                                                                                       // 1086
            resDayOfYear = daysInYear(resYear) + dayOfYear;                                                           // 1087
        } else if (dayOfYear > daysInYear(year)) {                                                                    // 1088
            resYear = year + 1;                                                                                       // 1089
            resDayOfYear = dayOfYear - daysInYear(year);                                                              // 1090
        } else {                                                                                                      // 1091
            resYear = year;                                                                                           // 1092
            resDayOfYear = dayOfYear;                                                                                 // 1093
        }                                                                                                             // 1094
                                                                                                                      // 1095
        return {                                                                                                      // 1096
            year: resYear,                                                                                            // 1097
            dayOfYear: resDayOfYear                                                                                   // 1098
        };                                                                                                            // 1099
    }                                                                                                                 // 1100
                                                                                                                      // 1101
    function weekOfYear(mom, dow, doy) {                                                                              // 1102
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),                                                       // 1103
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,                                            // 1104
            resWeek, resYear;                                                                                         // 1105
                                                                                                                      // 1106
        if (week < 1) {                                                                                               // 1107
            resYear = mom.year() - 1;                                                                                 // 1108
            resWeek = week + weeksInYear(resYear, dow, doy);                                                          // 1109
        } else if (week > weeksInYear(mom.year(), dow, doy)) {                                                        // 1110
            resWeek = week - weeksInYear(mom.year(), dow, doy);                                                       // 1111
            resYear = mom.year() + 1;                                                                                 // 1112
        } else {                                                                                                      // 1113
            resYear = mom.year();                                                                                     // 1114
            resWeek = week;                                                                                           // 1115
        }                                                                                                             // 1116
                                                                                                                      // 1117
        return {                                                                                                      // 1118
            week: resWeek,                                                                                            // 1119
            year: resYear                                                                                             // 1120
        };                                                                                                            // 1121
    }                                                                                                                 // 1122
                                                                                                                      // 1123
    function weeksInYear(year, dow, doy) {                                                                            // 1124
        var weekOffset = firstWeekOffset(year, dow, doy),                                                             // 1125
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);                                                     // 1126
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;                                                  // 1127
    }                                                                                                                 // 1128
                                                                                                                      // 1129
    // Pick the first defined of two or three arguments.                                                              // 1130
    function defaults(a, b, c) {                                                                                      // 1131
        if (a != null) {                                                                                              // 1132
            return a;                                                                                                 // 1133
        }                                                                                                             // 1134
        if (b != null) {                                                                                              // 1135
            return b;                                                                                                 // 1136
        }                                                                                                             // 1137
        return c;                                                                                                     // 1138
    }                                                                                                                 // 1139
                                                                                                                      // 1140
    function currentDateArray(config) {                                                                               // 1141
        // hooks is actually the exported moment object                                                               // 1142
        var nowValue = new Date(utils_hooks__hooks.now());                                                            // 1143
        if (config._useUTC) {                                                                                         // 1144
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];                        // 1145
        }                                                                                                             // 1146
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];                                     // 1147
    }                                                                                                                 // 1148
                                                                                                                      // 1149
    // convert an array to a date.                                                                                    // 1150
    // the array should mirror the parameters below                                                                   // 1151
    // note: all values past the year are optional and will default to the lowest possible value.                     // 1152
    // [year, month, day , hour, minute, second, millisecond]                                                         // 1153
    function configFromArray (config) {                                                                               // 1154
        var i, date, input = [], currentDate, yearToUse;                                                              // 1155
                                                                                                                      // 1156
        if (config._d) {                                                                                              // 1157
            return;                                                                                                   // 1158
        }                                                                                                             // 1159
                                                                                                                      // 1160
        currentDate = currentDateArray(config);                                                                       // 1161
                                                                                                                      // 1162
        //compute day of the year from weeks and weekdays                                                             // 1163
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {                                       // 1164
            dayOfYearFromWeekInfo(config);                                                                            // 1165
        }                                                                                                             // 1166
                                                                                                                      // 1167
        //if the day of the year is set, figure out what it is                                                        // 1168
        if (config._dayOfYear) {                                                                                      // 1169
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);                                                 // 1170
                                                                                                                      // 1171
            if (config._dayOfYear > daysInYear(yearToUse)) {                                                          // 1172
                getParsingFlags(config)._overflowDayOfYear = true;                                                    // 1173
            }                                                                                                         // 1174
                                                                                                                      // 1175
            date = createUTCDate(yearToUse, 0, config._dayOfYear);                                                    // 1176
            config._a[MONTH] = date.getUTCMonth();                                                                    // 1177
            config._a[DATE] = date.getUTCDate();                                                                      // 1178
        }                                                                                                             // 1179
                                                                                                                      // 1180
        // Default to current date.                                                                                   // 1181
        // * if no year, month, day of month are given, default to today                                              // 1182
        // * if day of month is given, default month and year                                                         // 1183
        // * if month is given, default only year                                                                     // 1184
        // * if year is given, don't default anything                                                                 // 1185
        for (i = 0; i < 3 && config._a[i] == null; ++i) {                                                             // 1186
            config._a[i] = input[i] = currentDate[i];                                                                 // 1187
        }                                                                                                             // 1188
                                                                                                                      // 1189
        // Zero out whatever was not defaulted, including time                                                        // 1190
        for (; i < 7; i++) {                                                                                          // 1191
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];                      // 1192
        }                                                                                                             // 1193
                                                                                                                      // 1194
        // Check for 24:00:00.000                                                                                     // 1195
        if (config._a[HOUR] === 24 &&                                                                                 // 1196
                config._a[MINUTE] === 0 &&                                                                            // 1197
                config._a[SECOND] === 0 &&                                                                            // 1198
                config._a[MILLISECOND] === 0) {                                                                       // 1199
            config._nextDay = true;                                                                                   // 1200
            config._a[HOUR] = 0;                                                                                      // 1201
        }                                                                                                             // 1202
                                                                                                                      // 1203
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);                                 // 1204
        // Apply timezone offset from input. The actual utcOffset can be changed                                      // 1205
        // with parseZone.                                                                                            // 1206
        if (config._tzm != null) {                                                                                    // 1207
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);                                         // 1208
        }                                                                                                             // 1209
                                                                                                                      // 1210
        if (config._nextDay) {                                                                                        // 1211
            config._a[HOUR] = 24;                                                                                     // 1212
        }                                                                                                             // 1213
    }                                                                                                                 // 1214
                                                                                                                      // 1215
    function dayOfYearFromWeekInfo(config) {                                                                          // 1216
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;                                              // 1217
                                                                                                                      // 1218
        w = config._w;                                                                                                // 1219
        if (w.GG != null || w.W != null || w.E != null) {                                                             // 1220
            dow = 1;                                                                                                  // 1221
            doy = 4;                                                                                                  // 1222
                                                                                                                      // 1223
            // TODO: We need to take the current isoWeekYear, but that depends on                                     // 1224
            // how we interpret now (local, utc, fixed offset). So create                                             // 1225
            // a now version of current config (take local/utc/offset flags, and                                      // 1226
            // create now).                                                                                           // 1227
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);                  // 1228
            week = defaults(w.W, 1);                                                                                  // 1229
            weekday = defaults(w.E, 1);                                                                               // 1230
            if (weekday < 1 || weekday > 7) {                                                                         // 1231
                weekdayOverflow = true;                                                                               // 1232
            }                                                                                                         // 1233
        } else {                                                                                                      // 1234
            dow = config._locale._week.dow;                                                                           // 1235
            doy = config._locale._week.doy;                                                                           // 1236
                                                                                                                      // 1237
            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);              // 1238
            week = defaults(w.w, 1);                                                                                  // 1239
                                                                                                                      // 1240
            if (w.d != null) {                                                                                        // 1241
                // weekday -- low day numbers are considered next week                                                // 1242
                weekday = w.d;                                                                                        // 1243
                if (weekday < 0 || weekday > 6) {                                                                     // 1244
                    weekdayOverflow = true;                                                                           // 1245
                }                                                                                                     // 1246
            } else if (w.e != null) {                                                                                 // 1247
                // local weekday -- counting starts from begining of week                                             // 1248
                weekday = w.e + dow;                                                                                  // 1249
                if (w.e < 0 || w.e > 6) {                                                                             // 1250
                    weekdayOverflow = true;                                                                           // 1251
                }                                                                                                     // 1252
            } else {                                                                                                  // 1253
                // default to begining of week                                                                        // 1254
                weekday = dow;                                                                                        // 1255
            }                                                                                                         // 1256
        }                                                                                                             // 1257
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {                                                     // 1258
            getParsingFlags(config)._overflowWeeks = true;                                                            // 1259
        } else if (weekdayOverflow != null) {                                                                         // 1260
            getParsingFlags(config)._overflowWeekday = true;                                                          // 1261
        } else {                                                                                                      // 1262
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);                                             // 1263
            config._a[YEAR] = temp.year;                                                                              // 1264
            config._dayOfYear = temp.dayOfYear;                                                                       // 1265
        }                                                                                                             // 1266
    }                                                                                                                 // 1267
                                                                                                                      // 1268
    // constant that refers to the ISO standard                                                                       // 1269
    utils_hooks__hooks.ISO_8601 = function () {};                                                                     // 1270
                                                                                                                      // 1271
    // date from string and format string                                                                             // 1272
    function configFromStringAndFormat(config) {                                                                      // 1273
        // TODO: Move this to another part of the creation flow to prevent circular deps                              // 1274
        if (config._f === utils_hooks__hooks.ISO_8601) {                                                              // 1275
            configFromISO(config);                                                                                    // 1276
            return;                                                                                                   // 1277
        }                                                                                                             // 1278
                                                                                                                      // 1279
        config._a = [];                                                                                               // 1280
        getParsingFlags(config).empty = true;                                                                         // 1281
                                                                                                                      // 1282
        // This array is used to make a Date, either with `new Date` or `Date.UTC`                                    // 1283
        var string = '' + config._i,                                                                                  // 1284
            i, parsedInput, tokens, token, skipped,                                                                   // 1285
            stringLength = string.length,                                                                             // 1286
            totalParsedInputLength = 0;                                                                               // 1287
                                                                                                                      // 1288
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];                               // 1289
                                                                                                                      // 1290
        for (i = 0; i < tokens.length; i++) {                                                                         // 1291
            token = tokens[i];                                                                                        // 1292
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];                              // 1293
            // console.log('token', token, 'parsedInput', parsedInput,                                                // 1294
            //         'regex', getParseRegexForToken(token, config));                                                // 1295
            if (parsedInput) {                                                                                        // 1296
                skipped = string.substr(0, string.indexOf(parsedInput));                                              // 1297
                if (skipped.length > 0) {                                                                             // 1298
                    getParsingFlags(config).unusedInput.push(skipped);                                                // 1299
                }                                                                                                     // 1300
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);                              // 1301
                totalParsedInputLength += parsedInput.length;                                                         // 1302
            }                                                                                                         // 1303
            // don't parse if it's not a known token                                                                  // 1304
            if (formatTokenFunctions[token]) {                                                                        // 1305
                if (parsedInput) {                                                                                    // 1306
                    getParsingFlags(config).empty = false;                                                            // 1307
                }                                                                                                     // 1308
                else {                                                                                                // 1309
                    getParsingFlags(config).unusedTokens.push(token);                                                 // 1310
                }                                                                                                     // 1311
                addTimeToArrayFromToken(token, parsedInput, config);                                                  // 1312
            }                                                                                                         // 1313
            else if (config._strict && !parsedInput) {                                                                // 1314
                getParsingFlags(config).unusedTokens.push(token);                                                     // 1315
            }                                                                                                         // 1316
        }                                                                                                             // 1317
                                                                                                                      // 1318
        // add remaining unparsed input length to the string                                                          // 1319
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;                                // 1320
        if (string.length > 0) {                                                                                      // 1321
            getParsingFlags(config).unusedInput.push(string);                                                         // 1322
        }                                                                                                             // 1323
                                                                                                                      // 1324
        // clear _12h flag if hour is <= 12                                                                           // 1325
        if (getParsingFlags(config).bigHour === true &&                                                               // 1326
                config._a[HOUR] <= 12 &&                                                                              // 1327
                config._a[HOUR] > 0) {                                                                                // 1328
            getParsingFlags(config).bigHour = undefined;                                                              // 1329
        }                                                                                                             // 1330
        // handle meridiem                                                                                            // 1331
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);                         // 1332
                                                                                                                      // 1333
        configFromArray(config);                                                                                      // 1334
        checkOverflow(config);                                                                                        // 1335
    }                                                                                                                 // 1336
                                                                                                                      // 1337
                                                                                                                      // 1338
    function meridiemFixWrap (locale, hour, meridiem) {                                                               // 1339
        var isPm;                                                                                                     // 1340
                                                                                                                      // 1341
        if (meridiem == null) {                                                                                       // 1342
            // nothing to do                                                                                          // 1343
            return hour;                                                                                              // 1344
        }                                                                                                             // 1345
        if (locale.meridiemHour != null) {                                                                            // 1346
            return locale.meridiemHour(hour, meridiem);                                                               // 1347
        } else if (locale.isPM != null) {                                                                             // 1348
            // Fallback                                                                                               // 1349
            isPm = locale.isPM(meridiem);                                                                             // 1350
            if (isPm && hour < 12) {                                                                                  // 1351
                hour += 12;                                                                                           // 1352
            }                                                                                                         // 1353
            if (!isPm && hour === 12) {                                                                               // 1354
                hour = 0;                                                                                             // 1355
            }                                                                                                         // 1356
            return hour;                                                                                              // 1357
        } else {                                                                                                      // 1358
            // this is not supposed to happen                                                                         // 1359
            return hour;                                                                                              // 1360
        }                                                                                                             // 1361
    }                                                                                                                 // 1362
                                                                                                                      // 1363
    // date from string and array of format strings                                                                   // 1364
    function configFromStringAndArray(config) {                                                                       // 1365
        var tempConfig,                                                                                               // 1366
            bestMoment,                                                                                               // 1367
                                                                                                                      // 1368
            scoreToBeat,                                                                                              // 1369
            i,                                                                                                        // 1370
            currentScore;                                                                                             // 1371
                                                                                                                      // 1372
        if (config._f.length === 0) {                                                                                 // 1373
            getParsingFlags(config).invalidFormat = true;                                                             // 1374
            config._d = new Date(NaN);                                                                                // 1375
            return;                                                                                                   // 1376
        }                                                                                                             // 1377
                                                                                                                      // 1378
        for (i = 0; i < config._f.length; i++) {                                                                      // 1379
            currentScore = 0;                                                                                         // 1380
            tempConfig = copyConfig({}, config);                                                                      // 1381
            if (config._useUTC != null) {                                                                             // 1382
                tempConfig._useUTC = config._useUTC;                                                                  // 1383
            }                                                                                                         // 1384
            tempConfig._f = config._f[i];                                                                             // 1385
            configFromStringAndFormat(tempConfig);                                                                    // 1386
                                                                                                                      // 1387
            if (!valid__isValid(tempConfig)) {                                                                        // 1388
                continue;                                                                                             // 1389
            }                                                                                                         // 1390
                                                                                                                      // 1391
            // if there is any input that was not parsed add a penalty for that format                                // 1392
            currentScore += getParsingFlags(tempConfig).charsLeftOver;                                                // 1393
                                                                                                                      // 1394
            //or tokens                                                                                               // 1395
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;                                     // 1396
                                                                                                                      // 1397
            getParsingFlags(tempConfig).score = currentScore;                                                         // 1398
                                                                                                                      // 1399
            if (scoreToBeat == null || currentScore < scoreToBeat) {                                                  // 1400
                scoreToBeat = currentScore;                                                                           // 1401
                bestMoment = tempConfig;                                                                              // 1402
            }                                                                                                         // 1403
        }                                                                                                             // 1404
                                                                                                                      // 1405
        extend(config, bestMoment || tempConfig);                                                                     // 1406
    }                                                                                                                 // 1407
                                                                                                                      // 1408
    function configFromObject(config) {                                                                               // 1409
        if (config._d) {                                                                                              // 1410
            return;                                                                                                   // 1411
        }                                                                                                             // 1412
                                                                                                                      // 1413
        var i = normalizeObjectUnits(config._i);                                                                      // 1414
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);                                                                          // 1416
        });                                                                                                           // 1417
                                                                                                                      // 1418
        configFromArray(config);                                                                                      // 1419
    }                                                                                                                 // 1420
                                                                                                                      // 1421
    function createFromConfig (config) {                                                                              // 1422
        var res = new Moment(checkOverflow(prepareConfig(config)));                                                   // 1423
        if (res._nextDay) {                                                                                           // 1424
            // Adding is smart enough around DST                                                                      // 1425
            res.add(1, 'd');                                                                                          // 1426
            res._nextDay = undefined;                                                                                 // 1427
        }                                                                                                             // 1428
                                                                                                                      // 1429
        return res;                                                                                                   // 1430
    }                                                                                                                 // 1431
                                                                                                                      // 1432
    function prepareConfig (config) {                                                                                 // 1433
        var input = config._i,                                                                                        // 1434
            format = config._f;                                                                                       // 1435
                                                                                                                      // 1436
        config._locale = config._locale || locale_locales__getLocale(config._l);                                      // 1437
                                                                                                                      // 1438
        if (input === null || (format === undefined && input === '')) {                                               // 1439
            return valid__createInvalid({nullInput: true});                                                           // 1440
        }                                                                                                             // 1441
                                                                                                                      // 1442
        if (typeof input === 'string') {                                                                              // 1443
            config._i = input = config._locale.preparse(input);                                                       // 1444
        }                                                                                                             // 1445
                                                                                                                      // 1446
        if (isMoment(input)) {                                                                                        // 1447
            return new Moment(checkOverflow(input));                                                                  // 1448
        } else if (isArray(format)) {                                                                                 // 1449
            configFromStringAndArray(config);                                                                         // 1450
        } else if (format) {                                                                                          // 1451
            configFromStringAndFormat(config);                                                                        // 1452
        } else if (isDate(input)) {                                                                                   // 1453
            config._d = input;                                                                                        // 1454
        } else {                                                                                                      // 1455
            configFromInput(config);                                                                                  // 1456
        }                                                                                                             // 1457
                                                                                                                      // 1458
        if (!valid__isValid(config)) {                                                                                // 1459
            config._d = null;                                                                                         // 1460
        }                                                                                                             // 1461
                                                                                                                      // 1462
        return config;                                                                                                // 1463
    }                                                                                                                 // 1464
                                                                                                                      // 1465
    function configFromInput(config) {                                                                                // 1466
        var input = config._i;                                                                                        // 1467
        if (input === undefined) {                                                                                    // 1468
            config._d = new Date(utils_hooks__hooks.now());                                                           // 1469
        } else if (isDate(input)) {                                                                                   // 1470
            config._d = new Date(+input);                                                                             // 1471
        } else if (typeof input === 'string') {                                                                       // 1472
            configFromString(config);                                                                                 // 1473
        } else if (isArray(input)) {                                                                                  // 1474
            config._a = map(input.slice(0), function (obj) {                                                          // 1475
                return parseInt(obj, 10);                                                                             // 1476
            });                                                                                                       // 1477
            configFromArray(config);                                                                                  // 1478
        } else if (typeof(input) === 'object') {                                                                      // 1479
            configFromObject(config);                                                                                 // 1480
        } else if (typeof(input) === 'number') {                                                                      // 1481
            // from milliseconds                                                                                      // 1482
            config._d = new Date(input);                                                                              // 1483
        } else {                                                                                                      // 1484
            utils_hooks__hooks.createFromInputFallback(config);                                                       // 1485
        }                                                                                                             // 1486
    }                                                                                                                 // 1487
                                                                                                                      // 1488
    function createLocalOrUTC (input, format, locale, strict, isUTC) {                                                // 1489
        var c = {};                                                                                                   // 1490
                                                                                                                      // 1491
        if (typeof(locale) === 'boolean') {                                                                           // 1492
            strict = locale;                                                                                          // 1493
            locale = undefined;                                                                                       // 1494
        }                                                                                                             // 1495
        // object construction must be done this way.                                                                 // 1496
        // https://github.com/moment/moment/issues/1423                                                               // 1497
        c._isAMomentObject = true;                                                                                    // 1498
        c._useUTC = c._isUTC = isUTC;                                                                                 // 1499
        c._l = locale;                                                                                                // 1500
        c._i = input;                                                                                                 // 1501
        c._f = format;                                                                                                // 1502
        c._strict = strict;                                                                                           // 1503
                                                                                                                      // 1504
        return createFromConfig(c);                                                                                   // 1505
    }                                                                                                                 // 1506
                                                                                                                      // 1507
    function local__createLocal (input, format, locale, strict) {                                                     // 1508
        return createLocalOrUTC(input, format, locale, strict, false);                                                // 1509
    }                                                                                                                 // 1510
                                                                                                                      // 1511
    var prototypeMin = deprecate(                                                                                     // 1512
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',          // 1513
         function () {                                                                                                // 1514
             var other = local__createLocal.apply(null, arguments);                                                   // 1515
             if (this.isValid() && other.isValid()) {                                                                 // 1516
                 return other < this ? this : other;                                                                  // 1517
             } else {                                                                                                 // 1518
                 return valid__createInvalid();                                                                       // 1519
             }                                                                                                        // 1520
         }                                                                                                            // 1521
     );                                                                                                               // 1522
                                                                                                                      // 1523
    var prototypeMax = deprecate(                                                                                     // 1524
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',           // 1525
        function () {                                                                                                 // 1526
            var other = local__createLocal.apply(null, arguments);                                                    // 1527
            if (this.isValid() && other.isValid()) {                                                                  // 1528
                return other > this ? this : other;                                                                   // 1529
            } else {                                                                                                  // 1530
                return valid__createInvalid();                                                                        // 1531
            }                                                                                                         // 1532
        }                                                                                                             // 1533
    );                                                                                                                // 1534
                                                                                                                      // 1535
    // Pick a moment m from moments so that m[fn](other) is true for all                                              // 1536
    // other. This relies on the function fn to be transitive.                                                        // 1537
    //                                                                                                                // 1538
    // moments should either be an array of moment objects or an array, whose                                         // 1539
    // first element is an array of moment objects.                                                                   // 1540
    function pickBy(fn, moments) {                                                                                    // 1541
        var res, i;                                                                                                   // 1542
        if (moments.length === 1 && isArray(moments[0])) {                                                            // 1543
            moments = moments[0];                                                                                     // 1544
        }                                                                                                             // 1545
        if (!moments.length) {                                                                                        // 1546
            return local__createLocal();                                                                              // 1547
        }                                                                                                             // 1548
        res = moments[0];                                                                                             // 1549
        for (i = 1; i < moments.length; ++i) {                                                                        // 1550
            if (!moments[i].isValid() || moments[i][fn](res)) {                                                       // 1551
                res = moments[i];                                                                                     // 1552
            }                                                                                                         // 1553
        }                                                                                                             // 1554
        return res;                                                                                                   // 1555
    }                                                                                                                 // 1556
                                                                                                                      // 1557
    // TODO: Use [].sort instead?                                                                                     // 1558
    function min () {                                                                                                 // 1559
        var args = [].slice.call(arguments, 0);                                                                       // 1560
                                                                                                                      // 1561
        return pickBy('isBefore', args);                                                                              // 1562
    }                                                                                                                 // 1563
                                                                                                                      // 1564
    function max () {                                                                                                 // 1565
        var args = [].slice.call(arguments, 0);                                                                       // 1566
                                                                                                                      // 1567
        return pickBy('isAfter', args);                                                                               // 1568
    }                                                                                                                 // 1569
                                                                                                                      // 1570
    var now = function () {                                                                                           // 1571
        return Date.now ? Date.now() : +(new Date());                                                                 // 1572
    };                                                                                                                // 1573
                                                                                                                      // 1574
    function Duration (duration) {                                                                                    // 1575
        var normalizedInput = normalizeObjectUnits(duration),                                                         // 1576
            years = normalizedInput.year || 0,                                                                        // 1577
            quarters = normalizedInput.quarter || 0,                                                                  // 1578
            months = normalizedInput.month || 0,                                                                      // 1579
            weeks = normalizedInput.week || 0,                                                                        // 1580
            days = normalizedInput.day || 0,                                                                          // 1581
            hours = normalizedInput.hour || 0,                                                                        // 1582
            minutes = normalizedInput.minute || 0,                                                                    // 1583
            seconds = normalizedInput.second || 0,                                                                    // 1584
            milliseconds = normalizedInput.millisecond || 0;                                                          // 1585
                                                                                                                      // 1586
        // representation for dateAddRemove                                                                           // 1587
        this._milliseconds = +milliseconds +                                                                          // 1588
            seconds * 1e3 + // 1000                                                                                   // 1589
            minutes * 6e4 + // 1000 * 60                                                                              // 1590
            hours * 36e5; // 1000 * 60 * 60                                                                           // 1591
        // Because of dateAddRemove treats 24 hours as different from a                                               // 1592
        // day when working around DST, we need to store them separately                                              // 1593
        this._days = +days +                                                                                          // 1594
            weeks * 7;                                                                                                // 1595
        // It is impossible translate months into days without knowing                                                // 1596
        // which months you are are talking about, so we have to store                                                // 1597
        // it separately.                                                                                             // 1598
        this._months = +months +                                                                                      // 1599
            quarters * 3 +                                                                                            // 1600
            years * 12;                                                                                               // 1601
                                                                                                                      // 1602
        this._data = {};                                                                                              // 1603
                                                                                                                      // 1604
        this._locale = locale_locales__getLocale();                                                                   // 1605
                                                                                                                      // 1606
        this._bubble();                                                                                               // 1607
    }                                                                                                                 // 1608
                                                                                                                      // 1609
    function isDuration (obj) {                                                                                       // 1610
        return obj instanceof Duration;                                                                               // 1611
    }                                                                                                                 // 1612
                                                                                                                      // 1613
    // FORMATTING                                                                                                     // 1614
                                                                                                                      // 1615
    function offset (token, separator) {                                                                              // 1616
        addFormatToken(token, 0, 0, function () {                                                                     // 1617
            var offset = this.utcOffset();                                                                            // 1618
            var sign = '+';                                                                                           // 1619
            if (offset < 0) {                                                                                         // 1620
                offset = -offset;                                                                                     // 1621
                sign = '-';                                                                                           // 1622
            }                                                                                                         // 1623
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);                    // 1624
        });                                                                                                           // 1625
    }                                                                                                                 // 1626
                                                                                                                      // 1627
    offset('Z', ':');                                                                                                 // 1628
    offset('ZZ', '');                                                                                                 // 1629
                                                                                                                      // 1630
    // PARSING                                                                                                        // 1631
                                                                                                                      // 1632
    addRegexToken('Z',  matchShortOffset);                                                                            // 1633
    addRegexToken('ZZ', matchShortOffset);                                                                            // 1634
    addParseToken(['Z', 'ZZ'], function (input, array, config) {                                                      // 1635
        config._useUTC = true;                                                                                        // 1636
        config._tzm = offsetFromString(matchShortOffset, input);                                                      // 1637
    });                                                                                                               // 1638
                                                                                                                      // 1639
    // HELPERS                                                                                                        // 1640
                                                                                                                      // 1641
    // timezone chunker                                                                                               // 1642
    // '+10:00' > ['10',  '00']                                                                                       // 1643
    // '-1530'  > ['-15', '30']                                                                                       // 1644
    var chunkOffset = /([\+\-]|\d\d)/gi;                                                                              // 1645
                                                                                                                      // 1646
    function offsetFromString(matcher, string) {                                                                      // 1647
        var matches = ((string || '').match(matcher) || []);                                                          // 1648
        var chunk   = matches[matches.length - 1] || [];                                                              // 1649
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];                                                 // 1650
        var minutes = +(parts[1] * 60) + toInt(parts[2]);                                                             // 1651
                                                                                                                      // 1652
        return parts[0] === '+' ? minutes : -minutes;                                                                 // 1653
    }                                                                                                                 // 1654
                                                                                                                      // 1655
    // Return a moment from input, that is local/utc/zone equivalent to model.                                        // 1656
    function cloneWithOffset(input, model) {                                                                          // 1657
        var res, diff;                                                                                                // 1658
        if (model._isUTC) {                                                                                           // 1659
            res = model.clone();                                                                                      // 1660
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);                 // 1661
            // Use low-level api, because this fn is low-level api.                                                   // 1662
            res._d.setTime(+res._d + diff);                                                                           // 1663
            utils_hooks__hooks.updateOffset(res, false);                                                              // 1664
            return res;                                                                                               // 1665
        } else {                                                                                                      // 1666
            return local__createLocal(input).local();                                                                 // 1667
        }                                                                                                             // 1668
    }                                                                                                                 // 1669
                                                                                                                      // 1670
    function getDateOffset (m) {                                                                                      // 1671
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.                                             // 1672
        // https://github.com/moment/moment/pull/1871                                                                 // 1673
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;                                                       // 1674
    }                                                                                                                 // 1675
                                                                                                                      // 1676
    // HOOKS                                                                                                          // 1677
                                                                                                                      // 1678
    // This function will be called whenever a moment is mutated.                                                     // 1679
    // It is intended to keep the offset in sync with the timezone.                                                   // 1680
    utils_hooks__hooks.updateOffset = function () {};                                                                 // 1681
                                                                                                                      // 1682
    // MOMENTS                                                                                                        // 1683
                                                                                                                      // 1684
    // keepLocalTime = true means only change the timezone, without                                                   // 1685
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->                                           // 1686
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset                                            // 1687
    // +0200, so we adjust the time as needed, to be valid.                                                           // 1688
    //                                                                                                                // 1689
    // Keeping the time actually adds/subtracts (one hour)                                                            // 1690
    // from the actual represented time. That is why we call updateOffset                                             // 1691
    // a second time. In case it wants us to change the offset again                                                  // 1692
    // _changeInProgress == true case, then we have to adjust, because                                                // 1693
    // there is no such time in the given timezone.                                                                   // 1694
    function getSetOffset (input, keepLocalTime) {                                                                    // 1695
        var offset = this._offset || 0,                                                                               // 1696
            localAdjust;                                                                                              // 1697
        if (!this.isValid()) {                                                                                        // 1698
            return input != null ? this : NaN;                                                                        // 1699
        }                                                                                                             // 1700
        if (input != null) {                                                                                          // 1701
            if (typeof input === 'string') {                                                                          // 1702
                input = offsetFromString(matchShortOffset, input);                                                    // 1703
            } else if (Math.abs(input) < 16) {                                                                        // 1704
                input = input * 60;                                                                                   // 1705
            }                                                                                                         // 1706
            if (!this._isUTC && keepLocalTime) {                                                                      // 1707
                localAdjust = getDateOffset(this);                                                                    // 1708
            }                                                                                                         // 1709
            this._offset = input;                                                                                     // 1710
            this._isUTC = true;                                                                                       // 1711
            if (localAdjust != null) {                                                                                // 1712
                this.add(localAdjust, 'm');                                                                           // 1713
            }                                                                                                         // 1714
            if (offset !== input) {                                                                                   // 1715
                if (!keepLocalTime || this._changeInProgress) {                                                       // 1716
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);           // 1717
                } else if (!this._changeInProgress) {                                                                 // 1718
                    this._changeInProgress = true;                                                                    // 1719
                    utils_hooks__hooks.updateOffset(this, true);                                                      // 1720
                    this._changeInProgress = null;                                                                    // 1721
                }                                                                                                     // 1722
            }                                                                                                         // 1723
            return this;                                                                                              // 1724
        } else {                                                                                                      // 1725
            return this._isUTC ? offset : getDateOffset(this);                                                        // 1726
        }                                                                                                             // 1727
    }                                                                                                                 // 1728
                                                                                                                      // 1729
    function getSetZone (input, keepLocalTime) {                                                                      // 1730
        if (input != null) {                                                                                          // 1731
            if (typeof input !== 'string') {                                                                          // 1732
                input = -input;                                                                                       // 1733
            }                                                                                                         // 1734
                                                                                                                      // 1735
            this.utcOffset(input, keepLocalTime);                                                                     // 1736
                                                                                                                      // 1737
            return this;                                                                                              // 1738
        } else {                                                                                                      // 1739
            return -this.utcOffset();                                                                                 // 1740
        }                                                                                                             // 1741
    }                                                                                                                 // 1742
                                                                                                                      // 1743
    function setOffsetToUTC (keepLocalTime) {                                                                         // 1744
        return this.utcOffset(0, keepLocalTime);                                                                      // 1745
    }                                                                                                                 // 1746
                                                                                                                      // 1747
    function setOffsetToLocal (keepLocalTime) {                                                                       // 1748
        if (this._isUTC) {                                                                                            // 1749
            this.utcOffset(0, keepLocalTime);                                                                         // 1750
            this._isUTC = false;                                                                                      // 1751
                                                                                                                      // 1752
            if (keepLocalTime) {                                                                                      // 1753
                this.subtract(getDateOffset(this), 'm');                                                              // 1754
            }                                                                                                         // 1755
        }                                                                                                             // 1756
        return this;                                                                                                  // 1757
    }                                                                                                                 // 1758
                                                                                                                      // 1759
    function setOffsetToParsedOffset () {                                                                             // 1760
        if (this._tzm) {                                                                                              // 1761
            this.utcOffset(this._tzm);                                                                                // 1762
        } else if (typeof this._i === 'string') {                                                                     // 1763
            this.utcOffset(offsetFromString(matchOffset, this._i));                                                   // 1764
        }                                                                                                             // 1765
        return this;                                                                                                  // 1766
    }                                                                                                                 // 1767
                                                                                                                      // 1768
    function hasAlignedHourOffset (input) {                                                                           // 1769
        if (!this.isValid()) {                                                                                        // 1770
            return false;                                                                                             // 1771
        }                                                                                                             // 1772
        input = input ? local__createLocal(input).utcOffset() : 0;                                                    // 1773
                                                                                                                      // 1774
        return (this.utcOffset() - input) % 60 === 0;                                                                 // 1775
    }                                                                                                                 // 1776
                                                                                                                      // 1777
    function isDaylightSavingTime () {                                                                                // 1778
        return (                                                                                                      // 1779
            this.utcOffset() > this.clone().month(0).utcOffset() ||                                                   // 1780
            this.utcOffset() > this.clone().month(5).utcOffset()                                                      // 1781
        );                                                                                                            // 1782
    }                                                                                                                 // 1783
                                                                                                                      // 1784
    function isDaylightSavingTimeShifted () {                                                                         // 1785
        if (!isUndefined(this._isDSTShifted)) {                                                                       // 1786
            return this._isDSTShifted;                                                                                // 1787
        }                                                                                                             // 1788
                                                                                                                      // 1789
        var c = {};                                                                                                   // 1790
                                                                                                                      // 1791
        copyConfig(c, this);                                                                                          // 1792
        c = prepareConfig(c);                                                                                         // 1793
                                                                                                                      // 1794
        if (c._a) {                                                                                                   // 1795
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);                            // 1796
            this._isDSTShifted = this.isValid() &&                                                                    // 1797
                compareArrays(c._a, other.toArray()) > 0;                                                             // 1798
        } else {                                                                                                      // 1799
            this._isDSTShifted = false;                                                                               // 1800
        }                                                                                                             // 1801
                                                                                                                      // 1802
        return this._isDSTShifted;                                                                                    // 1803
    }                                                                                                                 // 1804
                                                                                                                      // 1805
    function isLocal () {                                                                                             // 1806
        return this.isValid() ? !this._isUTC : false;                                                                 // 1807
    }                                                                                                                 // 1808
                                                                                                                      // 1809
    function isUtcOffset () {                                                                                         // 1810
        return this.isValid() ? this._isUTC : false;                                                                  // 1811
    }                                                                                                                 // 1812
                                                                                                                      // 1813
    function isUtc () {                                                                                               // 1814
        return this.isValid() ? this._isUTC && this._offset === 0 : false;                                            // 1815
    }                                                                                                                 // 1816
                                                                                                                      // 1817
    // ASP.NET json date format regex                                                                                 // 1818
    var aspNetRegex = /(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;                                       // 1819
                                                                                                                      // 1820
    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html                      // 1821
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere                                      // 1822
    var isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
                                                                                                                      // 1824
    function create__createDuration (input, key) {                                                                    // 1825
        var duration = input,                                                                                         // 1826
            // matching against regexp is expensive, do it on demand                                                  // 1827
            match = null,                                                                                             // 1828
            sign,                                                                                                     // 1829
            ret,                                                                                                      // 1830
            diffRes;                                                                                                  // 1831
                                                                                                                      // 1832
        if (isDuration(input)) {                                                                                      // 1833
            duration = {                                                                                              // 1834
                ms : input._milliseconds,                                                                             // 1835
                d  : input._days,                                                                                     // 1836
                M  : input._months                                                                                    // 1837
            };                                                                                                        // 1838
        } else if (typeof input === 'number') {                                                                       // 1839
            duration = {};                                                                                            // 1840
            if (key) {                                                                                                // 1841
                duration[key] = input;                                                                                // 1842
            } else {                                                                                                  // 1843
                duration.milliseconds = input;                                                                        // 1844
            }                                                                                                         // 1845
        } else if (!!(match = aspNetRegex.exec(input))) {                                                             // 1846
            sign = (match[1] === '-') ? -1 : 1;                                                                       // 1847
            duration = {                                                                                              // 1848
                y  : 0,                                                                                               // 1849
                d  : toInt(match[DATE])        * sign,                                                                // 1850
                h  : toInt(match[HOUR])        * sign,                                                                // 1851
                m  : toInt(match[MINUTE])      * sign,                                                                // 1852
                s  : toInt(match[SECOND])      * sign,                                                                // 1853
                ms : toInt(match[MILLISECOND]) * sign                                                                 // 1854
            };                                                                                                        // 1855
        } else if (!!(match = isoRegex.exec(input))) {                                                                // 1856
            sign = (match[1] === '-') ? -1 : 1;                                                                       // 1857
            duration = {                                                                                              // 1858
                y : parseIso(match[2], sign),                                                                         // 1859
                M : parseIso(match[3], sign),                                                                         // 1860
                d : parseIso(match[4], sign),                                                                         // 1861
                h : parseIso(match[5], sign),                                                                         // 1862
                m : parseIso(match[6], sign),                                                                         // 1863
                s : parseIso(match[7], sign),                                                                         // 1864
                w : parseIso(match[8], sign)                                                                          // 1865
            };                                                                                                        // 1866
        } else if (duration == null) {// checks for null or undefined                                                 // 1867
            duration = {};                                                                                            // 1868
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {                        // 1869
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));          // 1870
                                                                                                                      // 1871
            duration = {};                                                                                            // 1872
            duration.ms = diffRes.milliseconds;                                                                       // 1873
            duration.M = diffRes.months;                                                                              // 1874
        }                                                                                                             // 1875
                                                                                                                      // 1876
        ret = new Duration(duration);                                                                                 // 1877
                                                                                                                      // 1878
        if (isDuration(input) && hasOwnProp(input, '_locale')) {                                                      // 1879
            ret._locale = input._locale;                                                                              // 1880
        }                                                                                                             // 1881
                                                                                                                      // 1882
        return ret;                                                                                                   // 1883
    }                                                                                                                 // 1884
                                                                                                                      // 1885
    create__createDuration.fn = Duration.prototype;                                                                   // 1886
                                                                                                                      // 1887
    function parseIso (inp, sign) {                                                                                   // 1888
        // We'd normally use ~~inp for this, but unfortunately it also                                                // 1889
        // converts floats to ints.                                                                                   // 1890
        // inp may be undefined, so careful calling replace on it.                                                    // 1891
        var res = inp && parseFloat(inp.replace(',', '.'));                                                           // 1892
        // apply sign while we're at it                                                                               // 1893
        return (isNaN(res) ? 0 : res) * sign;                                                                         // 1894
    }                                                                                                                 // 1895
                                                                                                                      // 1896
    function positiveMomentsDifference(base, other) {                                                                 // 1897
        var res = {milliseconds: 0, months: 0};                                                                       // 1898
                                                                                                                      // 1899
        res.months = other.month() - base.month() +                                                                   // 1900
            (other.year() - base.year()) * 12;                                                                        // 1901
        if (base.clone().add(res.months, 'M').isAfter(other)) {                                                       // 1902
            --res.months;                                                                                             // 1903
        }                                                                                                             // 1904
                                                                                                                      // 1905
        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));                                             // 1906
                                                                                                                      // 1907
        return res;                                                                                                   // 1908
    }                                                                                                                 // 1909
                                                                                                                      // 1910
    function momentsDifference(base, other) {                                                                         // 1911
        var res;                                                                                                      // 1912
        if (!(base.isValid() && other.isValid())) {                                                                   // 1913
            return {milliseconds: 0, months: 0};                                                                      // 1914
        }                                                                                                             // 1915
                                                                                                                      // 1916
        other = cloneWithOffset(other, base);                                                                         // 1917
        if (base.isBefore(other)) {                                                                                   // 1918
            res = positiveMomentsDifference(base, other);                                                             // 1919
        } else {                                                                                                      // 1920
            res = positiveMomentsDifference(other, base);                                                             // 1921
            res.milliseconds = -res.milliseconds;                                                                     // 1922
            res.months = -res.months;                                                                                 // 1923
        }                                                                                                             // 1924
                                                                                                                      // 1925
        return res;                                                                                                   // 1926
    }                                                                                                                 // 1927
                                                                                                                      // 1928
    // TODO: remove 'name' arg after deprecation is removed                                                           // 1929
    function createAdder(direction, name) {                                                                           // 1930
        return function (val, period) {                                                                               // 1931
            var dur, tmp;                                                                                             // 1932
            //invert the arguments, but complain about it                                                             // 1933
            if (period !== null && !isNaN(+period)) {                                                                 // 1934
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;                                                                // 1936
            }                                                                                                         // 1937
                                                                                                                      // 1938
            val = typeof val === 'string' ? +val : val;                                                               // 1939
            dur = create__createDuration(val, period);                                                                // 1940
            add_subtract__addSubtract(this, dur, direction);                                                          // 1941
            return this;                                                                                              // 1942
        };                                                                                                            // 1943
    }                                                                                                                 // 1944
                                                                                                                      // 1945
    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {                                      // 1946
        var milliseconds = duration._milliseconds,                                                                    // 1947
            days = duration._days,                                                                                    // 1948
            months = duration._months;                                                                                // 1949
                                                                                                                      // 1950
        if (!mom.isValid()) {                                                                                         // 1951
            // No op                                                                                                  // 1952
            return;                                                                                                   // 1953
        }                                                                                                             // 1954
                                                                                                                      // 1955
        updateOffset = updateOffset == null ? true : updateOffset;                                                    // 1956
                                                                                                                      // 1957
        if (milliseconds) {                                                                                           // 1958
            mom._d.setTime(+mom._d + milliseconds * isAdding);                                                        // 1959
        }                                                                                                             // 1960
        if (days) {                                                                                                   // 1961
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);                                   // 1962
        }                                                                                                             // 1963
        if (months) {                                                                                                 // 1964
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);                                            // 1965
        }                                                                                                             // 1966
        if (updateOffset) {                                                                                           // 1967
            utils_hooks__hooks.updateOffset(mom, days || months);                                                     // 1968
        }                                                                                                             // 1969
    }                                                                                                                 // 1970
                                                                                                                      // 1971
    var add_subtract__add      = createAdder(1, 'add');                                                               // 1972
    var add_subtract__subtract = createAdder(-1, 'subtract');                                                         // 1973
                                                                                                                      // 1974
    function moment_calendar__calendar (time, formats) {                                                              // 1975
        // We want to compare the start of today, vs this.                                                            // 1976
        // Getting start-of-today depends on whether we're local/utc/offset or not.                                   // 1977
        var now = time || local__createLocal(),                                                                       // 1978
            sod = cloneWithOffset(now, this).startOf('day'),                                                          // 1979
            diff = this.diff(sod, 'days', true),                                                                      // 1980
            format = diff < -6 ? 'sameElse' :                                                                         // 1981
                diff < -1 ? 'lastWeek' :                                                                              // 1982
                diff < 0 ? 'lastDay' :                                                                                // 1983
                diff < 1 ? 'sameDay' :                                                                                // 1984
                diff < 2 ? 'nextDay' :                                                                                // 1985
                diff < 7 ? 'nextWeek' : 'sameElse';                                                                   // 1986
                                                                                                                      // 1987
        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);                  // 1988
                                                                                                                      // 1989
        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));              // 1990
    }                                                                                                                 // 1991
                                                                                                                      // 1992
    function clone () {                                                                                               // 1993
        return new Moment(this);                                                                                      // 1994
    }                                                                                                                 // 1995
                                                                                                                      // 1996
    function isAfter (input, units) {                                                                                 // 1997
        var localInput = isMoment(input) ? input : local__createLocal(input);                                         // 1998
        if (!(this.isValid() && localInput.isValid())) {                                                              // 1999
            return false;                                                                                             // 2000
        }                                                                                                             // 2001
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');                                          // 2002
        if (units === 'millisecond') {                                                                                // 2003
            return +this > +localInput;                                                                               // 2004
        } else {                                                                                                      // 2005
            return +localInput < +this.clone().startOf(units);                                                        // 2006
        }                                                                                                             // 2007
    }                                                                                                                 // 2008
                                                                                                                      // 2009
    function isBefore (input, units) {                                                                                // 2010
        var localInput = isMoment(input) ? input : local__createLocal(input);                                         // 2011
        if (!(this.isValid() && localInput.isValid())) {                                                              // 2012
            return false;                                                                                             // 2013
        }                                                                                                             // 2014
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');                                          // 2015
        if (units === 'millisecond') {                                                                                // 2016
            return +this < +localInput;                                                                               // 2017
        } else {                                                                                                      // 2018
            return +this.clone().endOf(units) < +localInput;                                                          // 2019
        }                                                                                                             // 2020
    }                                                                                                                 // 2021
                                                                                                                      // 2022
    function isBetween (from, to, units) {                                                                            // 2023
        return this.isAfter(from, units) && this.isBefore(to, units);                                                 // 2024
    }                                                                                                                 // 2025
                                                                                                                      // 2026
    function isSame (input, units) {                                                                                  // 2027
        var localInput = isMoment(input) ? input : local__createLocal(input),                                         // 2028
            inputMs;                                                                                                  // 2029
        if (!(this.isValid() && localInput.isValid())) {                                                              // 2030
            return false;                                                                                             // 2031
        }                                                                                                             // 2032
        units = normalizeUnits(units || 'millisecond');                                                               // 2033
        if (units === 'millisecond') {                                                                                // 2034
            return +this === +localInput;                                                                             // 2035
        } else {                                                                                                      // 2036
            inputMs = +localInput;                                                                                    // 2037
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));              // 2038
        }                                                                                                             // 2039
    }                                                                                                                 // 2040
                                                                                                                      // 2041
    function isSameOrAfter (input, units) {                                                                           // 2042
        return this.isSame(input, units) || this.isAfter(input,units);                                                // 2043
    }                                                                                                                 // 2044
                                                                                                                      // 2045
    function isSameOrBefore (input, units) {                                                                          // 2046
        return this.isSame(input, units) || this.isBefore(input,units);                                               // 2047
    }                                                                                                                 // 2048
                                                                                                                      // 2049
    function diff (input, units, asFloat) {                                                                           // 2050
        var that,                                                                                                     // 2051
            zoneDelta,                                                                                                // 2052
            delta, output;                                                                                            // 2053
                                                                                                                      // 2054
        if (!this.isValid()) {                                                                                        // 2055
            return NaN;                                                                                               // 2056
        }                                                                                                             // 2057
                                                                                                                      // 2058
        that = cloneWithOffset(input, this);                                                                          // 2059
                                                                                                                      // 2060
        if (!that.isValid()) {                                                                                        // 2061
            return NaN;                                                                                               // 2062
        }                                                                                                             // 2063
                                                                                                                      // 2064
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;                                                      // 2065
                                                                                                                      // 2066
        units = normalizeUnits(units);                                                                                // 2067
                                                                                                                      // 2068
        if (units === 'year' || units === 'month' || units === 'quarter') {                                           // 2069
            output = monthDiff(this, that);                                                                           // 2070
            if (units === 'quarter') {                                                                                // 2071
                output = output / 3;                                                                                  // 2072
            } else if (units === 'year') {                                                                            // 2073
                output = output / 12;                                                                                 // 2074
            }                                                                                                         // 2075
        } else {                                                                                                      // 2076
            delta = this - that;                                                                                      // 2077
            output = units === 'second' ? delta / 1e3 : // 1000                                                       // 2078
                units === 'minute' ? delta / 6e4 : // 1000 * 60                                                       // 2079
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60                                                   // 2080
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst                    // 2081
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst              // 2082
                delta;                                                                                                // 2083
        }                                                                                                             // 2084
        return asFloat ? output : absFloor(output);                                                                   // 2085
    }                                                                                                                 // 2086
                                                                                                                      // 2087
    function monthDiff (a, b) {                                                                                       // 2088
        // difference in months                                                                                       // 2089
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),                                  // 2090
            // b is in (anchor - 1 month, anchor + 1 month)                                                           // 2091
            anchor = a.clone().add(wholeMonthDiff, 'months'),                                                         // 2092
            anchor2, adjust;                                                                                          // 2093
                                                                                                                      // 2094
        if (b - anchor < 0) {                                                                                         // 2095
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');                                                    // 2096
            // linear across the month                                                                                // 2097
            adjust = (b - anchor) / (anchor - anchor2);                                                               // 2098
        } else {                                                                                                      // 2099
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');                                                    // 2100
            // linear across the month                                                                                // 2101
            adjust = (b - anchor) / (anchor2 - anchor);                                                               // 2102
        }                                                                                                             // 2103
                                                                                                                      // 2104
        return -(wholeMonthDiff + adjust);                                                                            // 2105
    }                                                                                                                 // 2106
                                                                                                                      // 2107
    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';                                                        // 2108
                                                                                                                      // 2109
    function toString () {                                                                                            // 2110
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');                                  // 2111
    }                                                                                                                 // 2112
                                                                                                                      // 2113
    function moment_format__toISOString () {                                                                          // 2114
        var m = this.clone().utc();                                                                                   // 2115
        if (0 < m.year() && m.year() <= 9999) {                                                                       // 2116
            if (isFunction(Date.prototype.toISOString)) {                                                             // 2117
                // native implementation is ~50x faster, use it when we can                                           // 2118
                return this.toDate().toISOString();                                                                   // 2119
            } else {                                                                                                  // 2120
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                               // 2121
            }                                                                                                         // 2122
        } else {                                                                                                      // 2123
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                                 // 2124
        }                                                                                                             // 2125
    }                                                                                                                 // 2126
                                                                                                                      // 2127
    function format (inputString) {                                                                                   // 2128
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);                             // 2129
        return this.localeData().postformat(output);                                                                  // 2130
    }                                                                                                                 // 2131
                                                                                                                      // 2132
    function from (time, withoutSuffix) {                                                                             // 2133
        if (this.isValid() &&                                                                                         // 2134
                ((isMoment(time) && time.isValid()) ||                                                                // 2135
                 local__createLocal(time).isValid())) {                                                               // 2136
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);     // 2137
        } else {                                                                                                      // 2138
            return this.localeData().invalidDate();                                                                   // 2139
        }                                                                                                             // 2140
    }                                                                                                                 // 2141
                                                                                                                      // 2142
    function fromNow (withoutSuffix) {                                                                                // 2143
        return this.from(local__createLocal(), withoutSuffix);                                                        // 2144
    }                                                                                                                 // 2145
                                                                                                                      // 2146
    function to (time, withoutSuffix) {                                                                               // 2147
        if (this.isValid() &&                                                                                         // 2148
                ((isMoment(time) && time.isValid()) ||                                                                // 2149
                 local__createLocal(time).isValid())) {                                                               // 2150
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);     // 2151
        } else {                                                                                                      // 2152
            return this.localeData().invalidDate();                                                                   // 2153
        }                                                                                                             // 2154
    }                                                                                                                 // 2155
                                                                                                                      // 2156
    function toNow (withoutSuffix) {                                                                                  // 2157
        return this.to(local__createLocal(), withoutSuffix);                                                          // 2158
    }                                                                                                                 // 2159
                                                                                                                      // 2160
    // If passed a locale key, it will set the locale for this                                                        // 2161
    // instance.  Otherwise, it will return the locale configuration                                                  // 2162
    // variables for this instance.                                                                                   // 2163
    function locale (key) {                                                                                           // 2164
        var newLocaleData;                                                                                            // 2165
                                                                                                                      // 2166
        if (key === undefined) {                                                                                      // 2167
            return this._locale._abbr;                                                                                // 2168
        } else {                                                                                                      // 2169
            newLocaleData = locale_locales__getLocale(key);                                                           // 2170
            if (newLocaleData != null) {                                                                              // 2171
                this._locale = newLocaleData;                                                                         // 2172
            }                                                                                                         // 2173
            return this;                                                                                              // 2174
        }                                                                                                             // 2175
    }                                                                                                                 // 2176
                                                                                                                      // 2177
    var lang = deprecate(                                                                                             // 2178
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {                                                                                              // 2180
            if (key === undefined) {                                                                                  // 2181
                return this.localeData();                                                                             // 2182
            } else {                                                                                                  // 2183
                return this.locale(key);                                                                              // 2184
            }                                                                                                         // 2185
        }                                                                                                             // 2186
    );                                                                                                                // 2187
                                                                                                                      // 2188
    function localeData () {                                                                                          // 2189
        return this._locale;                                                                                          // 2190
    }                                                                                                                 // 2191
                                                                                                                      // 2192
    function startOf (units) {                                                                                        // 2193
        units = normalizeUnits(units);                                                                                // 2194
        // the following switch intentionally omits break keywords                                                    // 2195
        // to utilize falling through the cases.                                                                      // 2196
        switch (units) {                                                                                              // 2197
        case 'year':                                                                                                  // 2198
            this.month(0);                                                                                            // 2199
            /* falls through */                                                                                       // 2200
        case 'quarter':                                                                                               // 2201
        case 'month':                                                                                                 // 2202
            this.date(1);                                                                                             // 2203
            /* falls through */                                                                                       // 2204
        case 'week':                                                                                                  // 2205
        case 'isoWeek':                                                                                               // 2206
        case 'day':                                                                                                   // 2207
            this.hours(0);                                                                                            // 2208
            /* falls through */                                                                                       // 2209
        case 'hour':                                                                                                  // 2210
            this.minutes(0);                                                                                          // 2211
            /* falls through */                                                                                       // 2212
        case 'minute':                                                                                                // 2213
            this.seconds(0);                                                                                          // 2214
            /* falls through */                                                                                       // 2215
        case 'second':                                                                                                // 2216
            this.milliseconds(0);                                                                                     // 2217
        }                                                                                                             // 2218
                                                                                                                      // 2219
        // weeks are a special case                                                                                   // 2220
        if (units === 'week') {                                                                                       // 2221
            this.weekday(0);                                                                                          // 2222
        }                                                                                                             // 2223
        if (units === 'isoWeek') {                                                                                    // 2224
            this.isoWeekday(1);                                                                                       // 2225
        }                                                                                                             // 2226
                                                                                                                      // 2227
        // quarters are also special                                                                                  // 2228
        if (units === 'quarter') {                                                                                    // 2229
            this.month(Math.floor(this.month() / 3) * 3);                                                             // 2230
        }                                                                                                             // 2231
                                                                                                                      // 2232
        return this;                                                                                                  // 2233
    }                                                                                                                 // 2234
                                                                                                                      // 2235
    function endOf (units) {                                                                                          // 2236
        units = normalizeUnits(units);                                                                                // 2237
        if (units === undefined || units === 'millisecond') {                                                         // 2238
            return this;                                                                                              // 2239
        }                                                                                                             // 2240
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');                  // 2241
    }                                                                                                                 // 2242
                                                                                                                      // 2243
    function to_type__valueOf () {                                                                                    // 2244
        return +this._d - ((this._offset || 0) * 60000);                                                              // 2245
    }                                                                                                                 // 2246
                                                                                                                      // 2247
    function unix () {                                                                                                // 2248
        return Math.floor(+this / 1000);                                                                              // 2249
    }                                                                                                                 // 2250
                                                                                                                      // 2251
    function toDate () {                                                                                              // 2252
        return this._offset ? new Date(+this) : this._d;                                                              // 2253
    }                                                                                                                 // 2254
                                                                                                                      // 2255
    function toArray () {                                                                                             // 2256
        var m = this;                                                                                                 // 2257
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];                    // 2258
    }                                                                                                                 // 2259
                                                                                                                      // 2260
    function toObject () {                                                                                            // 2261
        var m = this;                                                                                                 // 2262
        return {                                                                                                      // 2263
            years: m.year(),                                                                                          // 2264
            months: m.month(),                                                                                        // 2265
            date: m.date(),                                                                                           // 2266
            hours: m.hours(),                                                                                         // 2267
            minutes: m.minutes(),                                                                                     // 2268
            seconds: m.seconds(),                                                                                     // 2269
            milliseconds: m.milliseconds()                                                                            // 2270
        };                                                                                                            // 2271
    }                                                                                                                 // 2272
                                                                                                                      // 2273
    function toJSON () {                                                                                              // 2274
        // JSON.stringify(new Date(NaN)) === 'null'                                                                   // 2275
        return this.isValid() ? this.toISOString() : 'null';                                                          // 2276
    }                                                                                                                 // 2277
                                                                                                                      // 2278
    function moment_valid__isValid () {                                                                               // 2279
        return valid__isValid(this);                                                                                  // 2280
    }                                                                                                                 // 2281
                                                                                                                      // 2282
    function parsingFlags () {                                                                                        // 2283
        return extend({}, getParsingFlags(this));                                                                     // 2284
    }                                                                                                                 // 2285
                                                                                                                      // 2286
    function invalidAt () {                                                                                           // 2287
        return getParsingFlags(this).overflow;                                                                        // 2288
    }                                                                                                                 // 2289
                                                                                                                      // 2290
    function creationData() {                                                                                         // 2291
        return {                                                                                                      // 2292
            input: this._i,                                                                                           // 2293
            format: this._f,                                                                                          // 2294
            locale: this._locale,                                                                                     // 2295
            isUTC: this._isUTC,                                                                                       // 2296
            strict: this._strict                                                                                      // 2297
        };                                                                                                            // 2298
    }                                                                                                                 // 2299
                                                                                                                      // 2300
    // FORMATTING                                                                                                     // 2301
                                                                                                                      // 2302
    addFormatToken(0, ['gg', 2], 0, function () {                                                                     // 2303
        return this.weekYear() % 100;                                                                                 // 2304
    });                                                                                                               // 2305
                                                                                                                      // 2306
    addFormatToken(0, ['GG', 2], 0, function () {                                                                     // 2307
        return this.isoWeekYear() % 100;                                                                              // 2308
    });                                                                                                               // 2309
                                                                                                                      // 2310
    function addWeekYearFormatToken (token, getter) {                                                                 // 2311
        addFormatToken(0, [token, token.length], 0, getter);                                                          // 2312
    }                                                                                                                 // 2313
                                                                                                                      // 2314
    addWeekYearFormatToken('gggg',     'weekYear');                                                                   // 2315
    addWeekYearFormatToken('ggggg',    'weekYear');                                                                   // 2316
    addWeekYearFormatToken('GGGG',  'isoWeekYear');                                                                   // 2317
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');                                                                   // 2318
                                                                                                                      // 2319
    // ALIASES                                                                                                        // 2320
                                                                                                                      // 2321
    addUnitAlias('weekYear', 'gg');                                                                                   // 2322
    addUnitAlias('isoWeekYear', 'GG');                                                                                // 2323
                                                                                                                      // 2324
    // PARSING                                                                                                        // 2325
                                                                                                                      // 2326
    addRegexToken('G',      matchSigned);                                                                             // 2327
    addRegexToken('g',      matchSigned);                                                                             // 2328
    addRegexToken('GG',     match1to2, match2);                                                                       // 2329
    addRegexToken('gg',     match1to2, match2);                                                                       // 2330
    addRegexToken('GGGG',   match1to4, match4);                                                                       // 2331
    addRegexToken('gggg',   match1to4, match4);                                                                       // 2332
    addRegexToken('GGGGG',  match1to6, match6);                                                                       // 2333
    addRegexToken('ggggg',  match1to6, match6);                                                                       // 2334
                                                                                                                      // 2335
    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {                     // 2336
        week[token.substr(0, 2)] = toInt(input);                                                                      // 2337
    });                                                                                                               // 2338
                                                                                                                      // 2339
    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {                                           // 2340
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);                                                    // 2341
    });                                                                                                               // 2342
                                                                                                                      // 2343
    // MOMENTS                                                                                                        // 2344
                                                                                                                      // 2345
    function getSetWeekYear (input) {                                                                                 // 2346
        return getSetWeekYearHelper.call(this,                                                                        // 2347
                input,                                                                                                // 2348
                this.week(),                                                                                          // 2349
                this.weekday(),                                                                                       // 2350
                this.localeData()._week.dow,                                                                          // 2351
                this.localeData()._week.doy);                                                                         // 2352
    }                                                                                                                 // 2353
                                                                                                                      // 2354
    function getSetISOWeekYear (input) {                                                                              // 2355
        return getSetWeekYearHelper.call(this,                                                                        // 2356
                input, this.isoWeek(), this.isoWeekday(), 1, 4);                                                      // 2357
    }                                                                                                                 // 2358
                                                                                                                      // 2359
    function getISOWeeksInYear () {                                                                                   // 2360
        return weeksInYear(this.year(), 1, 4);                                                                        // 2361
    }                                                                                                                 // 2362
                                                                                                                      // 2363
    function getWeeksInYear () {                                                                                      // 2364
        var weekInfo = this.localeData()._week;                                                                       // 2365
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);                                                  // 2366
    }                                                                                                                 // 2367
                                                                                                                      // 2368
    function getSetWeekYearHelper(input, week, weekday, dow, doy) {                                                   // 2369
        var weeksTarget;                                                                                              // 2370
        if (input == null) {                                                                                          // 2371
            return weekOfYear(this, dow, doy).year;                                                                   // 2372
        } else {                                                                                                      // 2373
            weeksTarget = weeksInYear(input, dow, doy);                                                               // 2374
            if (week > weeksTarget) {                                                                                 // 2375
                week = weeksTarget;                                                                                   // 2376
            }                                                                                                         // 2377
            return setWeekAll.call(this, input, week, weekday, dow, doy);                                             // 2378
        }                                                                                                             // 2379
    }                                                                                                                 // 2380
                                                                                                                      // 2381
    function setWeekAll(weekYear, week, weekday, dow, doy) {                                                          // 2382
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),                                    // 2383
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);                                     // 2384
                                                                                                                      // 2385
        // console.log("got", weekYear, week, weekday, "set", date.toISOString());                                    // 2386
        this.year(date.getUTCFullYear());                                                                             // 2387
        this.month(date.getUTCMonth());                                                                               // 2388
        this.date(date.getUTCDate());                                                                                 // 2389
        return this;                                                                                                  // 2390
    }                                                                                                                 // 2391
                                                                                                                      // 2392
    // FORMATTING                                                                                                     // 2393
                                                                                                                      // 2394
    addFormatToken('Q', 0, 'Qo', 'quarter');                                                                          // 2395
                                                                                                                      // 2396
    // ALIASES                                                                                                        // 2397
                                                                                                                      // 2398
    addUnitAlias('quarter', 'Q');                                                                                     // 2399
                                                                                                                      // 2400
    // PARSING                                                                                                        // 2401
                                                                                                                      // 2402
    addRegexToken('Q', match1);                                                                                       // 2403
    addParseToken('Q', function (input, array) {                                                                      // 2404
        array[MONTH] = (toInt(input) - 1) * 3;                                                                        // 2405
    });                                                                                                               // 2406
                                                                                                                      // 2407
    // MOMENTS                                                                                                        // 2408
                                                                                                                      // 2409
    function getSetQuarter (input) {                                                                                  // 2410
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);    // 2411
    }                                                                                                                 // 2412
                                                                                                                      // 2413
    // FORMATTING                                                                                                     // 2414
                                                                                                                      // 2415
    addFormatToken('w', ['ww', 2], 'wo', 'week');                                                                     // 2416
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');                                                                  // 2417
                                                                                                                      // 2418
    // ALIASES                                                                                                        // 2419
                                                                                                                      // 2420
    addUnitAlias('week', 'w');                                                                                        // 2421
    addUnitAlias('isoWeek', 'W');                                                                                     // 2422
                                                                                                                      // 2423
    // PARSING                                                                                                        // 2424
                                                                                                                      // 2425
    addRegexToken('w',  match1to2);                                                                                   // 2426
    addRegexToken('ww', match1to2, match2);                                                                           // 2427
    addRegexToken('W',  match1to2);                                                                                   // 2428
    addRegexToken('WW', match1to2, match2);                                                                           // 2429
                                                                                                                      // 2430
    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {                                 // 2431
        week[token.substr(0, 1)] = toInt(input);                                                                      // 2432
    });                                                                                                               // 2433
                                                                                                                      // 2434
    // HELPERS                                                                                                        // 2435
                                                                                                                      // 2436
    // LOCALES                                                                                                        // 2437
                                                                                                                      // 2438
    function localeWeek (mom) {                                                                                       // 2439
        return weekOfYear(mom, this._week.dow, this._week.doy).week;                                                  // 2440
    }                                                                                                                 // 2441
                                                                                                                      // 2442
    var defaultLocaleWeek = {                                                                                         // 2443
        dow : 0, // Sunday is the first day of the week.                                                              // 2444
        doy : 6  // The week that contains Jan 1st is the first week of the year.                                     // 2445
    };                                                                                                                // 2446
                                                                                                                      // 2447
    function localeFirstDayOfWeek () {                                                                                // 2448
        return this._week.dow;                                                                                        // 2449
    }                                                                                                                 // 2450
                                                                                                                      // 2451
    function localeFirstDayOfYear () {                                                                                // 2452
        return this._week.doy;                                                                                        // 2453
    }                                                                                                                 // 2454
                                                                                                                      // 2455
    // MOMENTS                                                                                                        // 2456
                                                                                                                      // 2457
    function getSetWeek (input) {                                                                                     // 2458
        var week = this.localeData().week(this);                                                                      // 2459
        return input == null ? week : this.add((input - week) * 7, 'd');                                              // 2460
    }                                                                                                                 // 2461
                                                                                                                      // 2462
    function getSetISOWeek (input) {                                                                                  // 2463
        var week = weekOfYear(this, 1, 4).week;                                                                       // 2464
        return input == null ? week : this.add((input - week) * 7, 'd');                                              // 2465
    }                                                                                                                 // 2466
                                                                                                                      // 2467
    // FORMATTING                                                                                                     // 2468
                                                                                                                      // 2469
    addFormatToken('D', ['DD', 2], 'Do', 'date');                                                                     // 2470
                                                                                                                      // 2471
    // ALIASES                                                                                                        // 2472
                                                                                                                      // 2473
    addUnitAlias('date', 'D');                                                                                        // 2474
                                                                                                                      // 2475
    // PARSING                                                                                                        // 2476
                                                                                                                      // 2477
    addRegexToken('D',  match1to2);                                                                                   // 2478
    addRegexToken('DD', match1to2, match2);                                                                           // 2479
    addRegexToken('Do', function (isStrict, locale) {                                                                 // 2480
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;                                         // 2481
    });                                                                                                               // 2482
                                                                                                                      // 2483
    addParseToken(['D', 'DD'], DATE);                                                                                 // 2484
    addParseToken('Do', function (input, array) {                                                                     // 2485
        array[DATE] = toInt(input.match(match1to2)[0], 10);                                                           // 2486
    });                                                                                                               // 2487
                                                                                                                      // 2488
    // MOMENTS                                                                                                        // 2489
                                                                                                                      // 2490
    var getSetDayOfMonth = makeGetSet('Date', true);                                                                  // 2491
                                                                                                                      // 2492
    // FORMATTING                                                                                                     // 2493
                                                                                                                      // 2494
    addFormatToken('d', 0, 'do', 'day');                                                                              // 2495
                                                                                                                      // 2496
    addFormatToken('dd', 0, 0, function (format) {                                                                    // 2497
        return this.localeData().weekdaysMin(this, format);                                                           // 2498
    });                                                                                                               // 2499
                                                                                                                      // 2500
    addFormatToken('ddd', 0, 0, function (format) {                                                                   // 2501
        return this.localeData().weekdaysShort(this, format);                                                         // 2502
    });                                                                                                               // 2503
                                                                                                                      // 2504
    addFormatToken('dddd', 0, 0, function (format) {                                                                  // 2505
        return this.localeData().weekdays(this, format);                                                              // 2506
    });                                                                                                               // 2507
                                                                                                                      // 2508
    addFormatToken('e', 0, 0, 'weekday');                                                                             // 2509
    addFormatToken('E', 0, 0, 'isoWeekday');                                                                          // 2510
                                                                                                                      // 2511
    // ALIASES                                                                                                        // 2512
                                                                                                                      // 2513
    addUnitAlias('day', 'd');                                                                                         // 2514
    addUnitAlias('weekday', 'e');                                                                                     // 2515
    addUnitAlias('isoWeekday', 'E');                                                                                  // 2516
                                                                                                                      // 2517
    // PARSING                                                                                                        // 2518
                                                                                                                      // 2519
    addRegexToken('d',    match1to2);                                                                                 // 2520
    addRegexToken('e',    match1to2);                                                                                 // 2521
    addRegexToken('E',    match1to2);                                                                                 // 2522
    addRegexToken('dd',   matchWord);                                                                                 // 2523
    addRegexToken('ddd',  matchWord);                                                                                 // 2524
    addRegexToken('dddd', matchWord);                                                                                 // 2525
                                                                                                                      // 2526
    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {                                  // 2527
        var weekday = config._locale.weekdaysParse(input, token, config._strict);                                     // 2528
        // if we didn't get a weekday name, mark the date as invalid                                                  // 2529
        if (weekday != null) {                                                                                        // 2530
            week.d = weekday;                                                                                         // 2531
        } else {                                                                                                      // 2532
            getParsingFlags(config).invalidWeekday = input;                                                           // 2533
        }                                                                                                             // 2534
    });                                                                                                               // 2535
                                                                                                                      // 2536
    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {                                        // 2537
        week[token] = toInt(input);                                                                                   // 2538
    });                                                                                                               // 2539
                                                                                                                      // 2540
    // HELPERS                                                                                                        // 2541
                                                                                                                      // 2542
    function parseWeekday(input, locale) {                                                                            // 2543
        if (typeof input !== 'string') {                                                                              // 2544
            return input;                                                                                             // 2545
        }                                                                                                             // 2546
                                                                                                                      // 2547
        if (!isNaN(input)) {                                                                                          // 2548
            return parseInt(input, 10);                                                                               // 2549
        }                                                                                                             // 2550
                                                                                                                      // 2551
        input = locale.weekdaysParse(input);                                                                          // 2552
        if (typeof input === 'number') {                                                                              // 2553
            return input;                                                                                             // 2554
        }                                                                                                             // 2555
                                                                                                                      // 2556
        return null;                                                                                                  // 2557
    }                                                                                                                 // 2558
                                                                                                                      // 2559
    // LOCALES                                                                                                        // 2560
                                                                                                                      // 2561
    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');                // 2562
    function localeWeekdays (m, format) {                                                                             // 2563
        return isArray(this._weekdays) ? this._weekdays[m.day()] :                                                    // 2564
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];                  // 2565
    }                                                                                                                 // 2566
                                                                                                                      // 2567
    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');                                        // 2568
    function localeWeekdaysShort (m) {                                                                                // 2569
        return this._weekdaysShort[m.day()];                                                                          // 2570
    }                                                                                                                 // 2571
                                                                                                                      // 2572
    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');                                                 // 2573
    function localeWeekdaysMin (m) {                                                                                  // 2574
        return this._weekdaysMin[m.day()];                                                                            // 2575
    }                                                                                                                 // 2576
                                                                                                                      // 2577
    function localeWeekdaysParse (weekdayName, format, strict) {                                                      // 2578
        var i, mom, regex;                                                                                            // 2579
                                                                                                                      // 2580
        if (!this._weekdaysParse) {                                                                                   // 2581
            this._weekdaysParse = [];                                                                                 // 2582
            this._minWeekdaysParse = [];                                                                              // 2583
            this._shortWeekdaysParse = [];                                                                            // 2584
            this._fullWeekdaysParse = [];                                                                             // 2585
        }                                                                                                             // 2586
                                                                                                                      // 2587
        for (i = 0; i < 7; i++) {                                                                                     // 2588
            // make the regex if we don't have it already                                                             // 2589
                                                                                                                      // 2590
            mom = local__createLocal([2000, 1]).day(i);                                                               // 2591
            if (strict && !this._fullWeekdaysParse[i]) {                                                              // 2592
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }                                                                                                         // 2596
            if (!this._weekdaysParse[i]) {                                                                            // 2597
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');                                     // 2599
            }                                                                                                         // 2600
            // test the regex                                                                                         // 2601
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {                        // 2602
                return i;                                                                                             // 2603
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {                 // 2604
                return i;                                                                                             // 2605
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {                    // 2606
                return i;                                                                                             // 2607
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {                                         // 2608
                return i;                                                                                             // 2609
            }                                                                                                         // 2610
        }                                                                                                             // 2611
    }                                                                                                                 // 2612
                                                                                                                      // 2613
    // MOMENTS                                                                                                        // 2614
                                                                                                                      // 2615
    function getSetDayOfWeek (input) {                                                                                // 2616
        if (!this.isValid()) {                                                                                        // 2617
            return input != null ? this : NaN;                                                                        // 2618
        }                                                                                                             // 2619
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();                                               // 2620
        if (input != null) {                                                                                          // 2621
            input = parseWeekday(input, this.localeData());                                                           // 2622
            return this.add(input - day, 'd');                                                                        // 2623
        } else {                                                                                                      // 2624
            return day;                                                                                               // 2625
        }                                                                                                             // 2626
    }                                                                                                                 // 2627
                                                                                                                      // 2628
    function getSetLocaleDayOfWeek (input) {                                                                          // 2629
        if (!this.isValid()) {                                                                                        // 2630
            return input != null ? this : NaN;                                                                        // 2631
        }                                                                                                             // 2632
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;                                             // 2633
        return input == null ? weekday : this.add(input - weekday, 'd');                                              // 2634
    }                                                                                                                 // 2635
                                                                                                                      // 2636
    function getSetISODayOfWeek (input) {                                                                             // 2637
        if (!this.isValid()) {                                                                                        // 2638
            return input != null ? this : NaN;                                                                        // 2639
        }                                                                                                             // 2640
        // behaves the same as moment#day except                                                                      // 2641
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)                                             // 2642
        // as a setter, sunday should belong to the previous week.                                                    // 2643
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);                        // 2644
    }                                                                                                                 // 2645
                                                                                                                      // 2646
    // FORMATTING                                                                                                     // 2647
                                                                                                                      // 2648
    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');                                                          // 2649
                                                                                                                      // 2650
    // ALIASES                                                                                                        // 2651
                                                                                                                      // 2652
    addUnitAlias('dayOfYear', 'DDD');                                                                                 // 2653
                                                                                                                      // 2654
    // PARSING                                                                                                        // 2655
                                                                                                                      // 2656
    addRegexToken('DDD',  match1to3);                                                                                 // 2657
    addRegexToken('DDDD', match3);                                                                                    // 2658
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {                                                  // 2659
        config._dayOfYear = toInt(input);                                                                             // 2660
    });                                                                                                               // 2661
                                                                                                                      // 2662
    // HELPERS                                                                                                        // 2663
                                                                                                                      // 2664
    // MOMENTS                                                                                                        // 2665
                                                                                                                      // 2666
    function getSetDayOfYear (input) {                                                                                // 2667
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;         // 2668
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');                                        // 2669
    }                                                                                                                 // 2670
                                                                                                                      // 2671
    // FORMATTING                                                                                                     // 2672
                                                                                                                      // 2673
    function hFormat() {                                                                                              // 2674
        return this.hours() % 12 || 12;                                                                               // 2675
    }                                                                                                                 // 2676
                                                                                                                      // 2677
    addFormatToken('H', ['HH', 2], 0, 'hour');                                                                        // 2678
    addFormatToken('h', ['hh', 2], 0, hFormat);                                                                       // 2679
                                                                                                                      // 2680
    addFormatToken('hmm', 0, 0, function () {                                                                         // 2681
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);                                                // 2682
    });                                                                                                               // 2683
                                                                                                                      // 2684
    addFormatToken('hmmss', 0, 0, function () {                                                                       // 2685
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +                                               // 2686
            zeroFill(this.seconds(), 2);                                                                              // 2687
    });                                                                                                               // 2688
                                                                                                                      // 2689
    addFormatToken('Hmm', 0, 0, function () {                                                                         // 2690
        return '' + this.hours() + zeroFill(this.minutes(), 2);                                                       // 2691
    });                                                                                                               // 2692
                                                                                                                      // 2693
    addFormatToken('Hmmss', 0, 0, function () {                                                                       // 2694
        return '' + this.hours() + zeroFill(this.minutes(), 2) +                                                      // 2695
            zeroFill(this.seconds(), 2);                                                                              // 2696
    });                                                                                                               // 2697
                                                                                                                      // 2698
    function meridiem (token, lowercase) {                                                                            // 2699
        addFormatToken(token, 0, 0, function () {                                                                     // 2700
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);                               // 2701
        });                                                                                                           // 2702
    }                                                                                                                 // 2703
                                                                                                                      // 2704
    meridiem('a', true);                                                                                              // 2705
    meridiem('A', false);                                                                                             // 2706
                                                                                                                      // 2707
    // ALIASES                                                                                                        // 2708
                                                                                                                      // 2709
    addUnitAlias('hour', 'h');                                                                                        // 2710
                                                                                                                      // 2711
    // PARSING                                                                                                        // 2712
                                                                                                                      // 2713
    function matchMeridiem (isStrict, locale) {                                                                       // 2714
        return locale._meridiemParse;                                                                                 // 2715
    }                                                                                                                 // 2716
                                                                                                                      // 2717
    addRegexToken('a',  matchMeridiem);                                                                               // 2718
    addRegexToken('A',  matchMeridiem);                                                                               // 2719
    addRegexToken('H',  match1to2);                                                                                   // 2720
    addRegexToken('h',  match1to2);                                                                                   // 2721
    addRegexToken('HH', match1to2, match2);                                                                           // 2722
    addRegexToken('hh', match1to2, match2);                                                                           // 2723
                                                                                                                      // 2724
    addRegexToken('hmm', match3to4);                                                                                  // 2725
    addRegexToken('hmmss', match5to6);                                                                                // 2726
    addRegexToken('Hmm', match3to4);                                                                                  // 2727
    addRegexToken('Hmmss', match5to6);                                                                                // 2728
                                                                                                                      // 2729
    addParseToken(['H', 'HH'], HOUR);                                                                                 // 2730
    addParseToken(['a', 'A'], function (input, array, config) {                                                       // 2731
        config._isPm = config._locale.isPM(input);                                                                    // 2732
        config._meridiem = input;                                                                                     // 2733
    });                                                                                                               // 2734
    addParseToken(['h', 'hh'], function (input, array, config) {                                                      // 2735
        array[HOUR] = toInt(input);                                                                                   // 2736
        getParsingFlags(config).bigHour = true;                                                                       // 2737
    });                                                                                                               // 2738
    addParseToken('hmm', function (input, array, config) {                                                            // 2739
        var pos = input.length - 2;                                                                                   // 2740
        array[HOUR] = toInt(input.substr(0, pos));                                                                    // 2741
        array[MINUTE] = toInt(input.substr(pos));                                                                     // 2742
        getParsingFlags(config).bigHour = true;                                                                       // 2743
    });                                                                                                               // 2744
    addParseToken('hmmss', function (input, array, config) {                                                          // 2745
        var pos1 = input.length - 4;                                                                                  // 2746
        var pos2 = input.length - 2;                                                                                  // 2747
        array[HOUR] = toInt(input.substr(0, pos1));                                                                   // 2748
        array[MINUTE] = toInt(input.substr(pos1, 2));                                                                 // 2749
        array[SECOND] = toInt(input.substr(pos2));                                                                    // 2750
        getParsingFlags(config).bigHour = true;                                                                       // 2751
    });                                                                                                               // 2752
    addParseToken('Hmm', function (input, array, config) {                                                            // 2753
        var pos = input.length - 2;                                                                                   // 2754
        array[HOUR] = toInt(input.substr(0, pos));                                                                    // 2755
        array[MINUTE] = toInt(input.substr(pos));                                                                     // 2756
    });                                                                                                               // 2757
    addParseToken('Hmmss', function (input, array, config) {                                                          // 2758
        var pos1 = input.length - 4;                                                                                  // 2759
        var pos2 = input.length - 2;                                                                                  // 2760
        array[HOUR] = toInt(input.substr(0, pos1));                                                                   // 2761
        array[MINUTE] = toInt(input.substr(pos1, 2));                                                                 // 2762
        array[SECOND] = toInt(input.substr(pos2));                                                                    // 2763
    });                                                                                                               // 2764
                                                                                                                      // 2765
    // LOCALES                                                                                                        // 2766
                                                                                                                      // 2767
    function localeIsPM (input) {                                                                                     // 2768
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays                            // 2769
        // Using charAt should be more compatible.                                                                    // 2770
        return ((input + '').toLowerCase().charAt(0) === 'p');                                                        // 2771
    }                                                                                                                 // 2772
                                                                                                                      // 2773
    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;                                                                 // 2774
    function localeMeridiem (hours, minutes, isLower) {                                                               // 2775
        if (hours > 11) {                                                                                             // 2776
            return isLower ? 'pm' : 'PM';                                                                             // 2777
        } else {                                                                                                      // 2778
            return isLower ? 'am' : 'AM';                                                                             // 2779
        }                                                                                                             // 2780
    }                                                                                                                 // 2781
                                                                                                                      // 2782
                                                                                                                      // 2783
    // MOMENTS                                                                                                        // 2784
                                                                                                                      // 2785
    // Setting the hour should keep the time, because the user explicitly                                             // 2786
    // specified which hour he wants. So trying to maintain the same hour (in                                         // 2787
    // a new timezone) makes sense. Adding/subtracting hours does not follow                                          // 2788
    // this rule.                                                                                                     // 2789
    var getSetHour = makeGetSet('Hours', true);                                                                       // 2790
                                                                                                                      // 2791
    // FORMATTING                                                                                                     // 2792
                                                                                                                      // 2793
    addFormatToken('m', ['mm', 2], 0, 'minute');                                                                      // 2794
                                                                                                                      // 2795
    // ALIASES                                                                                                        // 2796
                                                                                                                      // 2797
    addUnitAlias('minute', 'm');                                                                                      // 2798
                                                                                                                      // 2799
    // PARSING                                                                                                        // 2800
                                                                                                                      // 2801
    addRegexToken('m',  match1to2);                                                                                   // 2802
    addRegexToken('mm', match1to2, match2);                                                                           // 2803
    addParseToken(['m', 'mm'], MINUTE);                                                                               // 2804
                                                                                                                      // 2805
    // MOMENTS                                                                                                        // 2806
                                                                                                                      // 2807
    var getSetMinute = makeGetSet('Minutes', false);                                                                  // 2808
                                                                                                                      // 2809
    // FORMATTING                                                                                                     // 2810
                                                                                                                      // 2811
    addFormatToken('s', ['ss', 2], 0, 'second');                                                                      // 2812
                                                                                                                      // 2813
    // ALIASES                                                                                                        // 2814
                                                                                                                      // 2815
    addUnitAlias('second', 's');                                                                                      // 2816
                                                                                                                      // 2817
    // PARSING                                                                                                        // 2818
                                                                                                                      // 2819
    addRegexToken('s',  match1to2);                                                                                   // 2820
    addRegexToken('ss', match1to2, match2);                                                                           // 2821
    addParseToken(['s', 'ss'], SECOND);                                                                               // 2822
                                                                                                                      // 2823
    // MOMENTS                                                                                                        // 2824
                                                                                                                      // 2825
    var getSetSecond = makeGetSet('Seconds', false);                                                                  // 2826
                                                                                                                      // 2827
    // FORMATTING                                                                                                     // 2828
                                                                                                                      // 2829
    addFormatToken('S', 0, 0, function () {                                                                           // 2830
        return ~~(this.millisecond() / 100);                                                                          // 2831
    });                                                                                                               // 2832
                                                                                                                      // 2833
    addFormatToken(0, ['SS', 2], 0, function () {                                                                     // 2834
        return ~~(this.millisecond() / 10);                                                                           // 2835
    });                                                                                                               // 2836
                                                                                                                      // 2837
    addFormatToken(0, ['SSS', 3], 0, 'millisecond');                                                                  // 2838
    addFormatToken(0, ['SSSS', 4], 0, function () {                                                                   // 2839
        return this.millisecond() * 10;                                                                               // 2840
    });                                                                                                               // 2841
    addFormatToken(0, ['SSSSS', 5], 0, function () {                                                                  // 2842
        return this.millisecond() * 100;                                                                              // 2843
    });                                                                                                               // 2844
    addFormatToken(0, ['SSSSSS', 6], 0, function () {                                                                 // 2845
        return this.millisecond() * 1000;                                                                             // 2846
    });                                                                                                               // 2847
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {                                                                // 2848
        return this.millisecond() * 10000;                                                                            // 2849
    });                                                                                                               // 2850
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {                                                               // 2851
        return this.millisecond() * 100000;                                                                           // 2852
    });                                                                                                               // 2853
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {                                                              // 2854
        return this.millisecond() * 1000000;                                                                          // 2855
    });                                                                                                               // 2856
                                                                                                                      // 2857
                                                                                                                      // 2858
    // ALIASES                                                                                                        // 2859
                                                                                                                      // 2860
    addUnitAlias('millisecond', 'ms');                                                                                // 2861
                                                                                                                      // 2862
    // PARSING                                                                                                        // 2863
                                                                                                                      // 2864
    addRegexToken('S',    match1to3, match1);                                                                         // 2865
    addRegexToken('SS',   match1to3, match2);                                                                         // 2866
    addRegexToken('SSS',  match1to3, match3);                                                                         // 2867
                                                                                                                      // 2868
    var token;                                                                                                        // 2869
    for (token = 'SSSS'; token.length <= 9; token += 'S') {                                                           // 2870
        addRegexToken(token, matchUnsigned);                                                                          // 2871
    }                                                                                                                 // 2872
                                                                                                                      // 2873
    function parseMs(input, array) {                                                                                  // 2874
        array[MILLISECOND] = toInt(('0.' + input) * 1000);                                                            // 2875
    }                                                                                                                 // 2876
                                                                                                                      // 2877
    for (token = 'S'; token.length <= 9; token += 'S') {                                                              // 2878
        addParseToken(token, parseMs);                                                                                // 2879
    }                                                                                                                 // 2880
    // MOMENTS                                                                                                        // 2881
                                                                                                                      // 2882
    var getSetMillisecond = makeGetSet('Milliseconds', false);                                                        // 2883
                                                                                                                      // 2884
    // FORMATTING                                                                                                     // 2885
                                                                                                                      // 2886
    addFormatToken('z',  0, 0, 'zoneAbbr');                                                                           // 2887
    addFormatToken('zz', 0, 0, 'zoneName');                                                                           // 2888
                                                                                                                      // 2889
    // MOMENTS                                                                                                        // 2890
                                                                                                                      // 2891
    function getZoneAbbr () {                                                                                         // 2892
        return this._isUTC ? 'UTC' : '';                                                                              // 2893
    }                                                                                                                 // 2894
                                                                                                                      // 2895
    function getZoneName () {                                                                                         // 2896
        return this._isUTC ? 'Coordinated Universal Time' : '';                                                       // 2897
    }                                                                                                                 // 2898
                                                                                                                      // 2899
    var momentPrototype__proto = Moment.prototype;                                                                    // 2900
                                                                                                                      // 2901
    momentPrototype__proto.add               = add_subtract__add;                                                     // 2902
    momentPrototype__proto.calendar          = moment_calendar__calendar;                                             // 2903
    momentPrototype__proto.clone             = clone;                                                                 // 2904
    momentPrototype__proto.diff              = diff;                                                                  // 2905
    momentPrototype__proto.endOf             = endOf;                                                                 // 2906
    momentPrototype__proto.format            = format;                                                                // 2907
    momentPrototype__proto.from              = from;                                                                  // 2908
    momentPrototype__proto.fromNow           = fromNow;                                                               // 2909
    momentPrototype__proto.to                = to;                                                                    // 2910
    momentPrototype__proto.toNow             = toNow;                                                                 // 2911
    momentPrototype__proto.get               = getSet;                                                                // 2912
    momentPrototype__proto.invalidAt         = invalidAt;                                                             // 2913
    momentPrototype__proto.isAfter           = isAfter;                                                               // 2914
    momentPrototype__proto.isBefore          = isBefore;                                                              // 2915
    momentPrototype__proto.isBetween         = isBetween;                                                             // 2916
    momentPrototype__proto.isSame            = isSame;                                                                // 2917
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;                                                         // 2918
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;                                                        // 2919
    momentPrototype__proto.isValid           = moment_valid__isValid;                                                 // 2920
    momentPrototype__proto.lang              = lang;                                                                  // 2921
    momentPrototype__proto.locale            = locale;                                                                // 2922
    momentPrototype__proto.localeData        = localeData;                                                            // 2923
    momentPrototype__proto.max               = prototypeMax;                                                          // 2924
    momentPrototype__proto.min               = prototypeMin;                                                          // 2925
    momentPrototype__proto.parsingFlags      = parsingFlags;                                                          // 2926
    momentPrototype__proto.set               = getSet;                                                                // 2927
    momentPrototype__proto.startOf           = startOf;                                                               // 2928
    momentPrototype__proto.subtract          = add_subtract__subtract;                                                // 2929
    momentPrototype__proto.toArray           = toArray;                                                               // 2930
    momentPrototype__proto.toObject          = toObject;                                                              // 2931
    momentPrototype__proto.toDate            = toDate;                                                                // 2932
    momentPrototype__proto.toISOString       = moment_format__toISOString;                                            // 2933
    momentPrototype__proto.toJSON            = toJSON;                                                                // 2934
    momentPrototype__proto.toString          = toString;                                                              // 2935
    momentPrototype__proto.unix              = unix;                                                                  // 2936
    momentPrototype__proto.valueOf           = to_type__valueOf;                                                      // 2937
    momentPrototype__proto.creationData      = creationData;                                                          // 2938
                                                                                                                      // 2939
    // Year                                                                                                           // 2940
    momentPrototype__proto.year       = getSetYear;                                                                   // 2941
    momentPrototype__proto.isLeapYear = getIsLeapYear;                                                                // 2942
                                                                                                                      // 2943
    // Week Year                                                                                                      // 2944
    momentPrototype__proto.weekYear    = getSetWeekYear;                                                              // 2945
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;                                                           // 2946
                                                                                                                      // 2947
    // Quarter                                                                                                        // 2948
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;                                 // 2949
                                                                                                                      // 2950
    // Month                                                                                                          // 2951
    momentPrototype__proto.month       = getSetMonth;                                                                 // 2952
    momentPrototype__proto.daysInMonth = getDaysInMonth;                                                              // 2953
                                                                                                                      // 2954
    // Week                                                                                                           // 2955
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;                         // 2956
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;                      // 2957
    momentPrototype__proto.weeksInYear    = getWeeksInYear;                                                           // 2958
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;                                                        // 2959
                                                                                                                      // 2960
    // Day                                                                                                            // 2961
    momentPrototype__proto.date       = getSetDayOfMonth;                                                             // 2962
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;                    // 2963
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;                                                        // 2964
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;                                                           // 2965
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;                                                              // 2966
                                                                                                                      // 2967
    // Hour                                                                                                           // 2968
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;                                          // 2969
                                                                                                                      // 2970
    // Minute                                                                                                         // 2971
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;                                    // 2972
                                                                                                                      // 2973
    // Second                                                                                                         // 2974
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;                                    // 2975
                                                                                                                      // 2976
    // Millisecond                                                                                                    // 2977
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;                     // 2978
                                                                                                                      // 2979
    // Offset                                                                                                         // 2980
    momentPrototype__proto.utcOffset            = getSetOffset;                                                       // 2981
    momentPrototype__proto.utc                  = setOffsetToUTC;                                                     // 2982
    momentPrototype__proto.local                = setOffsetToLocal;                                                   // 2983
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;                                            // 2984
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;                                               // 2985
    momentPrototype__proto.isDST                = isDaylightSavingTime;                                               // 2986
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;                                        // 2987
    momentPrototype__proto.isLocal              = isLocal;                                                            // 2988
    momentPrototype__proto.isUtcOffset          = isUtcOffset;                                                        // 2989
    momentPrototype__proto.isUtc                = isUtc;                                                              // 2990
    momentPrototype__proto.isUTC                = isUtc;                                                              // 2991
                                                                                                                      // 2992
    // Timezone                                                                                                       // 2993
    momentPrototype__proto.zoneAbbr = getZoneAbbr;                                                                    // 2994
    momentPrototype__proto.zoneName = getZoneName;                                                                    // 2995
                                                                                                                      // 2996
    // Deprecations                                                                                                   // 2997
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);   // 2998
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);       // 2999
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);          // 3000
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);
                                                                                                                      // 3002
    var momentPrototype = momentPrototype__proto;                                                                     // 3003
                                                                                                                      // 3004
    function moment__createUnix (input) {                                                                             // 3005
        return local__createLocal(input * 1000);                                                                      // 3006
    }                                                                                                                 // 3007
                                                                                                                      // 3008
    function moment__createInZone () {                                                                                // 3009
        return local__createLocal.apply(null, arguments).parseZone();                                                 // 3010
    }                                                                                                                 // 3011
                                                                                                                      // 3012
    var defaultCalendar = {                                                                                           // 3013
        sameDay : '[Today at] LT',                                                                                    // 3014
        nextDay : '[Tomorrow at] LT',                                                                                 // 3015
        nextWeek : 'dddd [at] LT',                                                                                    // 3016
        lastDay : '[Yesterday at] LT',                                                                                // 3017
        lastWeek : '[Last] dddd [at] LT',                                                                             // 3018
        sameElse : 'L'                                                                                                // 3019
    };                                                                                                                // 3020
                                                                                                                      // 3021
    function locale_calendar__calendar (key, mom, now) {                                                              // 3022
        var output = this._calendar[key];                                                                             // 3023
        return isFunction(output) ? output.call(mom, now) : output;                                                   // 3024
    }                                                                                                                 // 3025
                                                                                                                      // 3026
    var defaultLongDateFormat = {                                                                                     // 3027
        LTS  : 'h:mm:ss A',                                                                                           // 3028
        LT   : 'h:mm A',                                                                                              // 3029
        L    : 'MM/DD/YYYY',                                                                                          // 3030
        LL   : 'MMMM D, YYYY',                                                                                        // 3031
        LLL  : 'MMMM D, YYYY h:mm A',                                                                                 // 3032
        LLLL : 'dddd, MMMM D, YYYY h:mm A'                                                                            // 3033
    };                                                                                                                // 3034
                                                                                                                      // 3035
    function longDateFormat (key) {                                                                                   // 3036
        var format = this._longDateFormat[key],                                                                       // 3037
            formatUpper = this._longDateFormat[key.toUpperCase()];                                                    // 3038
                                                                                                                      // 3039
        if (format || !formatUpper) {                                                                                 // 3040
            return format;                                                                                            // 3041
        }                                                                                                             // 3042
                                                                                                                      // 3043
        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {                          // 3044
            return val.slice(1);                                                                                      // 3045
        });                                                                                                           // 3046
                                                                                                                      // 3047
        return this._longDateFormat[key];                                                                             // 3048
    }                                                                                                                 // 3049
                                                                                                                      // 3050
    var defaultInvalidDate = 'Invalid date';                                                                          // 3051
                                                                                                                      // 3052
    function invalidDate () {                                                                                         // 3053
        return this._invalidDate;                                                                                     // 3054
    }                                                                                                                 // 3055
                                                                                                                      // 3056
    var defaultOrdinal = '%d';                                                                                        // 3057
    var defaultOrdinalParse = /\d{1,2}/;                                                                              // 3058
                                                                                                                      // 3059
    function ordinal (number) {                                                                                       // 3060
        return this._ordinal.replace('%d', number);                                                                   // 3061
    }                                                                                                                 // 3062
                                                                                                                      // 3063
    function preParsePostFormat (string) {                                                                            // 3064
        return string;                                                                                                // 3065
    }                                                                                                                 // 3066
                                                                                                                      // 3067
    var defaultRelativeTime = {                                                                                       // 3068
        future : 'in %s',                                                                                             // 3069
        past   : '%s ago',                                                                                            // 3070
        s  : 'a few seconds',                                                                                         // 3071
        m  : 'a minute',                                                                                              // 3072
        mm : '%d minutes',                                                                                            // 3073
        h  : 'an hour',                                                                                               // 3074
        hh : '%d hours',                                                                                              // 3075
        d  : 'a day',                                                                                                 // 3076
        dd : '%d days',                                                                                               // 3077
        M  : 'a month',                                                                                               // 3078
        MM : '%d months',                                                                                             // 3079
        y  : 'a year',                                                                                                // 3080
        yy : '%d years'                                                                                               // 3081
    };                                                                                                                // 3082
                                                                                                                      // 3083
    function relative__relativeTime (number, withoutSuffix, string, isFuture) {                                       // 3084
        var output = this._relativeTime[string];                                                                      // 3085
        return (isFunction(output)) ?                                                                                 // 3086
            output(number, withoutSuffix, string, isFuture) :                                                         // 3087
            output.replace(/%d/i, number);                                                                            // 3088
    }                                                                                                                 // 3089
                                                                                                                      // 3090
    function pastFuture (diff, output) {                                                                              // 3091
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];                                                // 3092
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);                                   // 3093
    }                                                                                                                 // 3094
                                                                                                                      // 3095
    function locale_set__set (config) {                                                                               // 3096
        var prop, i;                                                                                                  // 3097
        for (i in config) {                                                                                           // 3098
            prop = config[i];                                                                                         // 3099
            if (isFunction(prop)) {                                                                                   // 3100
                this[i] = prop;                                                                                       // 3101
            } else {                                                                                                  // 3102
                this['_' + i] = prop;                                                                                 // 3103
            }                                                                                                         // 3104
        }                                                                                                             // 3105
        // Lenient ordinal parsing accepts just a number in addition to                                               // 3106
        // number + (possibly) stuff coming from _ordinalParseLenient.                                                // 3107
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);                 // 3108
    }                                                                                                                 // 3109
                                                                                                                      // 3110
    var prototype__proto = Locale.prototype;                                                                          // 3111
                                                                                                                      // 3112
    prototype__proto._calendar       = defaultCalendar;                                                               // 3113
    prototype__proto.calendar        = locale_calendar__calendar;                                                     // 3114
    prototype__proto._longDateFormat = defaultLongDateFormat;                                                         // 3115
    prototype__proto.longDateFormat  = longDateFormat;                                                                // 3116
    prototype__proto._invalidDate    = defaultInvalidDate;                                                            // 3117
    prototype__proto.invalidDate     = invalidDate;                                                                   // 3118
    prototype__proto._ordinal        = defaultOrdinal;                                                                // 3119
    prototype__proto.ordinal         = ordinal;                                                                       // 3120
    prototype__proto._ordinalParse   = defaultOrdinalParse;                                                           // 3121
    prototype__proto.preparse        = preParsePostFormat;                                                            // 3122
    prototype__proto.postformat      = preParsePostFormat;                                                            // 3123
    prototype__proto._relativeTime   = defaultRelativeTime;                                                           // 3124
    prototype__proto.relativeTime    = relative__relativeTime;                                                        // 3125
    prototype__proto.pastFuture      = pastFuture;                                                                    // 3126
    prototype__proto.set             = locale_set__set;                                                               // 3127
                                                                                                                      // 3128
    // Month                                                                                                          // 3129
    prototype__proto.months            =        localeMonths;                                                         // 3130
    prototype__proto._months           = defaultLocaleMonths;                                                         // 3131
    prototype__proto.monthsShort       =        localeMonthsShort;                                                    // 3132
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;                                                    // 3133
    prototype__proto.monthsParse       =        localeMonthsParse;                                                    // 3134
    prototype__proto._monthsRegex      = defaultMonthsRegex;                                                          // 3135
    prototype__proto.monthsRegex       = monthsRegex;                                                                 // 3136
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;                                                     // 3137
    prototype__proto.monthsShortRegex  = monthsShortRegex;                                                            // 3138
                                                                                                                      // 3139
    // Week                                                                                                           // 3140
    prototype__proto.week = localeWeek;                                                                               // 3141
    prototype__proto._week = defaultLocaleWeek;                                                                       // 3142
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;                                                           // 3143
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;                                                           // 3144
                                                                                                                      // 3145
    // Day of Week                                                                                                    // 3146
    prototype__proto.weekdays       =        localeWeekdays;                                                          // 3147
    prototype__proto._weekdays      = defaultLocaleWeekdays;                                                          // 3148
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;                                                       // 3149
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;                                                       // 3150
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;                                                     // 3151
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;                                                     // 3152
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;                                                     // 3153
                                                                                                                      // 3154
    // Hours                                                                                                          // 3155
    prototype__proto.isPM = localeIsPM;                                                                               // 3156
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;                                                     // 3157
    prototype__proto.meridiem = localeMeridiem;                                                                       // 3158
                                                                                                                      // 3159
    function lists__get (format, index, field, setter) {                                                              // 3160
        var locale = locale_locales__getLocale();                                                                     // 3161
        var utc = create_utc__createUTC().set(setter, index);                                                         // 3162
        return locale[field](utc, format);                                                                            // 3163
    }                                                                                                                 // 3164
                                                                                                                      // 3165
    function list (format, index, field, count, setter) {                                                             // 3166
        if (typeof format === 'number') {                                                                             // 3167
            index = format;                                                                                           // 3168
            format = undefined;                                                                                       // 3169
        }                                                                                                             // 3170
                                                                                                                      // 3171
        format = format || '';                                                                                        // 3172
                                                                                                                      // 3173
        if (index != null) {                                                                                          // 3174
            return lists__get(format, index, field, setter);                                                          // 3175
        }                                                                                                             // 3176
                                                                                                                      // 3177
        var i;                                                                                                        // 3178
        var out = [];                                                                                                 // 3179
        for (i = 0; i < count; i++) {                                                                                 // 3180
            out[i] = lists__get(format, i, field, setter);                                                            // 3181
        }                                                                                                             // 3182
        return out;                                                                                                   // 3183
    }                                                                                                                 // 3184
                                                                                                                      // 3185
    function lists__listMonths (format, index) {                                                                      // 3186
        return list(format, index, 'months', 12, 'month');                                                            // 3187
    }                                                                                                                 // 3188
                                                                                                                      // 3189
    function lists__listMonthsShort (format, index) {                                                                 // 3190
        return list(format, index, 'monthsShort', 12, 'month');                                                       // 3191
    }                                                                                                                 // 3192
                                                                                                                      // 3193
    function lists__listWeekdays (format, index) {                                                                    // 3194
        return list(format, index, 'weekdays', 7, 'day');                                                             // 3195
    }                                                                                                                 // 3196
                                                                                                                      // 3197
    function lists__listWeekdaysShort (format, index) {                                                               // 3198
        return list(format, index, 'weekdaysShort', 7, 'day');                                                        // 3199
    }                                                                                                                 // 3200
                                                                                                                      // 3201
    function lists__listWeekdaysMin (format, index) {                                                                 // 3202
        return list(format, index, 'weekdaysMin', 7, 'day');                                                          // 3203
    }                                                                                                                 // 3204
                                                                                                                      // 3205
    locale_locales__getSetGlobalLocale('en', {                                                                        // 3206
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,                                                                         // 3207
        ordinal : function (number) {                                                                                 // 3208
            var b = number % 10,                                                                                      // 3209
                output = (toInt(number % 100 / 10) === 1) ? 'th' :                                                    // 3210
                (b === 1) ? 'st' :                                                                                    // 3211
                (b === 2) ? 'nd' :                                                                                    // 3212
                (b === 3) ? 'rd' : 'th';                                                                              // 3213
            return number + output;                                                                                   // 3214
        }                                                                                                             // 3215
    });                                                                                                               // 3216
                                                                                                                      // 3217
    // Side effect imports                                                                                            // 3218
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);
                                                                                                                      // 3221
    var mathAbs = Math.abs;                                                                                           // 3222
                                                                                                                      // 3223
    function duration_abs__abs () {                                                                                   // 3224
        var data           = this._data;                                                                              // 3225
                                                                                                                      // 3226
        this._milliseconds = mathAbs(this._milliseconds);                                                             // 3227
        this._days         = mathAbs(this._days);                                                                     // 3228
        this._months       = mathAbs(this._months);                                                                   // 3229
                                                                                                                      // 3230
        data.milliseconds  = mathAbs(data.milliseconds);                                                              // 3231
        data.seconds       = mathAbs(data.seconds);                                                                   // 3232
        data.minutes       = mathAbs(data.minutes);                                                                   // 3233
        data.hours         = mathAbs(data.hours);                                                                     // 3234
        data.months        = mathAbs(data.months);                                                                    // 3235
        data.years         = mathAbs(data.years);                                                                     // 3236
                                                                                                                      // 3237
        return this;                                                                                                  // 3238
    }                                                                                                                 // 3239
                                                                                                                      // 3240
    function duration_add_subtract__addSubtract (duration, input, value, direction) {                                 // 3241
        var other = create__createDuration(input, value);                                                             // 3242
                                                                                                                      // 3243
        duration._milliseconds += direction * other._milliseconds;                                                    // 3244
        duration._days         += direction * other._days;                                                            // 3245
        duration._months       += direction * other._months;                                                          // 3246
                                                                                                                      // 3247
        return duration._bubble();                                                                                    // 3248
    }                                                                                                                 // 3249
                                                                                                                      // 3250
    // supports only 2.0-style add(1, 's') or add(duration)                                                           // 3251
    function duration_add_subtract__add (input, value) {                                                              // 3252
        return duration_add_subtract__addSubtract(this, input, value, 1);                                             // 3253
    }                                                                                                                 // 3254
                                                                                                                      // 3255
    // supports only 2.0-style subtract(1, 's') or subtract(duration)                                                 // 3256
    function duration_add_subtract__subtract (input, value) {                                                         // 3257
        return duration_add_subtract__addSubtract(this, input, value, -1);                                            // 3258
    }                                                                                                                 // 3259
                                                                                                                      // 3260
    function absCeil (number) {                                                                                       // 3261
        if (number < 0) {                                                                                             // 3262
            return Math.floor(number);                                                                                // 3263
        } else {                                                                                                      // 3264
            return Math.ceil(number);                                                                                 // 3265
        }                                                                                                             // 3266
    }                                                                                                                 // 3267
                                                                                                                      // 3268
    function bubble () {                                                                                              // 3269
        var milliseconds = this._milliseconds;                                                                        // 3270
        var days         = this._days;                                                                                // 3271
        var months       = this._months;                                                                              // 3272
        var data         = this._data;                                                                                // 3273
        var seconds, minutes, hours, years, monthsFromDays;                                                           // 3274
                                                                                                                      // 3275
        // if we have a mix of positive and negative values, bubble down first                                        // 3276
        // check: https://github.com/moment/moment/issues/2166                                                        // 3277
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||                                                      // 3278
                (milliseconds <= 0 && days <= 0 && months <= 0))) {                                                   // 3279
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;                                             // 3280
            days = 0;                                                                                                 // 3281
            months = 0;                                                                                               // 3282
        }                                                                                                             // 3283
                                                                                                                      // 3284
        // The following code bubbles up values, see the tests for                                                    // 3285
        // examples of what that means.                                                                               // 3286
        data.milliseconds = milliseconds % 1000;                                                                      // 3287
                                                                                                                      // 3288
        seconds           = absFloor(milliseconds / 1000);                                                            // 3289
        data.seconds      = seconds % 60;                                                                             // 3290
                                                                                                                      // 3291
        minutes           = absFloor(seconds / 60);                                                                   // 3292
        data.minutes      = minutes % 60;                                                                             // 3293
                                                                                                                      // 3294
        hours             = absFloor(minutes / 60);                                                                   // 3295
        data.hours        = hours % 24;                                                                               // 3296
                                                                                                                      // 3297
        days += absFloor(hours / 24);                                                                                 // 3298
                                                                                                                      // 3299
        // convert days to months                                                                                     // 3300
        monthsFromDays = absFloor(daysToMonths(days));                                                                // 3301
        months += monthsFromDays;                                                                                     // 3302
        days -= absCeil(monthsToDays(monthsFromDays));                                                                // 3303
                                                                                                                      // 3304
        // 12 months -> 1 year                                                                                        // 3305
        years = absFloor(months / 12);                                                                                // 3306
        months %= 12;                                                                                                 // 3307
                                                                                                                      // 3308
        data.days   = days;                                                                                           // 3309
        data.months = months;                                                                                         // 3310
        data.years  = years;                                                                                          // 3311
                                                                                                                      // 3312
        return this;                                                                                                  // 3313
    }                                                                                                                 // 3314
                                                                                                                      // 3315
    function daysToMonths (days) {                                                                                    // 3316
        // 400 years have 146097 days (taking into account leap year rules)                                           // 3317
        // 400 years have 12 months === 4800                                                                          // 3318
        return days * 4800 / 146097;                                                                                  // 3319
    }                                                                                                                 // 3320
                                                                                                                      // 3321
    function monthsToDays (months) {                                                                                  // 3322
        // the reverse of daysToMonths                                                                                // 3323
        return months * 146097 / 4800;                                                                                // 3324
    }                                                                                                                 // 3325
                                                                                                                      // 3326
    function as (units) {                                                                                             // 3327
        var days;                                                                                                     // 3328
        var months;                                                                                                   // 3329
        var milliseconds = this._milliseconds;                                                                        // 3330
                                                                                                                      // 3331
        units = normalizeUnits(units);                                                                                // 3332
                                                                                                                      // 3333
        if (units === 'month' || units === 'year') {                                                                  // 3334
            days   = this._days   + milliseconds / 864e5;                                                             // 3335
            months = this._months + daysToMonths(days);                                                               // 3336
            return units === 'month' ? months : months / 12;                                                          // 3337
        } else {                                                                                                      // 3338
            // handle milliseconds separately because of floating point math errors (issue #1867)                     // 3339
            days = this._days + Math.round(monthsToDays(this._months));                                               // 3340
            switch (units) {                                                                                          // 3341
                case 'week'   : return days / 7     + milliseconds / 6048e5;                                          // 3342
                case 'day'    : return days         + milliseconds / 864e5;                                           // 3343
                case 'hour'   : return days * 24    + milliseconds / 36e5;                                            // 3344
                case 'minute' : return days * 1440  + milliseconds / 6e4;                                             // 3345
                case 'second' : return days * 86400 + milliseconds / 1000;                                            // 3346
                // Math.floor prevents floating point math errors here                                                // 3347
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;                                   // 3348
                default: throw new Error('Unknown unit ' + units);                                                    // 3349
            }                                                                                                         // 3350
        }                                                                                                             // 3351
    }                                                                                                                 // 3352
                                                                                                                      // 3353
    // TODO: Use this.as('ms')?                                                                                       // 3354
    function duration_as__valueOf () {                                                                                // 3355
        return (                                                                                                      // 3356
            this._milliseconds +                                                                                      // 3357
            this._days * 864e5 +                                                                                      // 3358
            (this._months % 12) * 2592e6 +                                                                            // 3359
            toInt(this._months / 12) * 31536e6                                                                        // 3360
        );                                                                                                            // 3361
    }                                                                                                                 // 3362
                                                                                                                      // 3363
    function makeAs (alias) {                                                                                         // 3364
        return function () {                                                                                          // 3365
            return this.as(alias);                                                                                    // 3366
        };                                                                                                            // 3367
    }                                                                                                                 // 3368
                                                                                                                      // 3369
    var asMilliseconds = makeAs('ms');                                                                                // 3370
    var asSeconds      = makeAs('s');                                                                                 // 3371
    var asMinutes      = makeAs('m');                                                                                 // 3372
    var asHours        = makeAs('h');                                                                                 // 3373
    var asDays         = makeAs('d');                                                                                 // 3374
    var asWeeks        = makeAs('w');                                                                                 // 3375
    var asMonths       = makeAs('M');                                                                                 // 3376
    var asYears        = makeAs('y');                                                                                 // 3377
                                                                                                                      // 3378
    function duration_get__get (units) {                                                                              // 3379
        units = normalizeUnits(units);                                                                                // 3380
        return this[units + 's']();                                                                                   // 3381
    }                                                                                                                 // 3382
                                                                                                                      // 3383
    function makeGetter(name) {                                                                                       // 3384
        return function () {                                                                                          // 3385
            return this._data[name];                                                                                  // 3386
        };                                                                                                            // 3387
    }                                                                                                                 // 3388
                                                                                                                      // 3389
    var milliseconds = makeGetter('milliseconds');                                                                    // 3390
    var seconds      = makeGetter('seconds');                                                                         // 3391
    var minutes      = makeGetter('minutes');                                                                         // 3392
    var hours        = makeGetter('hours');                                                                           // 3393
    var days         = makeGetter('days');                                                                            // 3394
    var months       = makeGetter('months');                                                                          // 3395
    var years        = makeGetter('years');                                                                           // 3396
                                                                                                                      // 3397
    function weeks () {                                                                                               // 3398
        return absFloor(this.days() / 7);                                                                             // 3399
    }                                                                                                                 // 3400
                                                                                                                      // 3401
    var round = Math.round;                                                                                           // 3402
    var thresholds = {                                                                                                // 3403
        s: 45,  // seconds to minute                                                                                  // 3404
        m: 45,  // minutes to hour                                                                                    // 3405
        h: 22,  // hours to day                                                                                       // 3406
        d: 26,  // days to month                                                                                      // 3407
        M: 11   // months to year                                                                                     // 3408
    };                                                                                                                // 3409
                                                                                                                      // 3410
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize                         // 3411
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {                                     // 3412
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);                                   // 3413
    }                                                                                                                 // 3414
                                                                                                                      // 3415
    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {                                // 3416
        var duration = create__createDuration(posNegDuration).abs();                                                  // 3417
        var seconds  = round(duration.as('s'));                                                                       // 3418
        var minutes  = round(duration.as('m'));                                                                       // 3419
        var hours    = round(duration.as('h'));                                                                       // 3420
        var days     = round(duration.as('d'));                                                                       // 3421
        var months   = round(duration.as('M'));                                                                       // 3422
        var years    = round(duration.as('y'));                                                                       // 3423
                                                                                                                      // 3424
        var a = seconds < thresholds.s && ['s', seconds]  ||                                                          // 3425
                minutes <= 1           && ['m']           ||                                                          // 3426
                minutes < thresholds.m && ['mm', minutes] ||                                                          // 3427
                hours   <= 1           && ['h']           ||                                                          // 3428
                hours   < thresholds.h && ['hh', hours]   ||                                                          // 3429
                days    <= 1           && ['d']           ||                                                          // 3430
                days    < thresholds.d && ['dd', days]    ||                                                          // 3431
                months  <= 1           && ['M']           ||                                                          // 3432
                months  < thresholds.M && ['MM', months]  ||                                                          // 3433
                years   <= 1           && ['y']           || ['yy', years];                                           // 3434
                                                                                                                      // 3435
        a[2] = withoutSuffix;                                                                                         // 3436
        a[3] = +posNegDuration > 0;                                                                                   // 3437
        a[4] = locale;                                                                                                // 3438
        return substituteTimeAgo.apply(null, a);                                                                      // 3439
    }                                                                                                                 // 3440
                                                                                                                      // 3441
    // This function allows you to set a threshold for relative time strings                                          // 3442
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {                                      // 3443
        if (thresholds[threshold] === undefined) {                                                                    // 3444
            return false;                                                                                             // 3445
        }                                                                                                             // 3446
        if (limit === undefined) {                                                                                    // 3447
            return thresholds[threshold];                                                                             // 3448
        }                                                                                                             // 3449
        thresholds[threshold] = limit;                                                                                // 3450
        return true;                                                                                                  // 3451
    }                                                                                                                 // 3452
                                                                                                                      // 3453
    function humanize (withSuffix) {                                                                                  // 3454
        var locale = this.localeData();                                                                               // 3455
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);                                      // 3456
                                                                                                                      // 3457
        if (withSuffix) {                                                                                             // 3458
            output = locale.pastFuture(+this, output);                                                                // 3459
        }                                                                                                             // 3460
                                                                                                                      // 3461
        return locale.postformat(output);                                                                             // 3462
    }                                                                                                                 // 3463
                                                                                                                      // 3464
    var iso_string__abs = Math.abs;                                                                                   // 3465
                                                                                                                      // 3466
    function iso_string__toISOString() {                                                                              // 3467
        // for ISO strings we do not use the normal bubbling rules:                                                   // 3468
        //  * milliseconds bubble up until they become hours                                                          // 3469
        //  * days do not bubble at all                                                                               // 3470
        //  * months bubble up until they become years                                                                // 3471
        // This is because there is no context-free conversion between hours and days                                 // 3472
        // (think of clock changes)                                                                                   // 3473
        // and also not between days and months (28-31 days per month)                                                // 3474
        var seconds = iso_string__abs(this._milliseconds) / 1000;                                                     // 3475
        var days         = iso_string__abs(this._days);                                                               // 3476
        var months       = iso_string__abs(this._months);                                                             // 3477
        var minutes, hours, years;                                                                                    // 3478
                                                                                                                      // 3479
        // 3600 seconds -> 60 minutes -> 1 hour                                                                       // 3480
        minutes           = absFloor(seconds / 60);                                                                   // 3481
        hours             = absFloor(minutes / 60);                                                                   // 3482
        seconds %= 60;                                                                                                // 3483
        minutes %= 60;                                                                                                // 3484
                                                                                                                      // 3485
        // 12 months -> 1 year                                                                                        // 3486
        years  = absFloor(months / 12);                                                                               // 3487
        months %= 12;                                                                                                 // 3488
                                                                                                                      // 3489
                                                                                                                      // 3490
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js               // 3491
        var Y = years;                                                                                                // 3492
        var M = months;                                                                                               // 3493
        var D = days;                                                                                                 // 3494
        var h = hours;                                                                                                // 3495
        var m = minutes;                                                                                              // 3496
        var s = seconds;                                                                                              // 3497
        var total = this.asSeconds();                                                                                 // 3498
                                                                                                                      // 3499
        if (!total) {                                                                                                 // 3500
            // this is the same as C#'s (Noda) and python (isodate)...                                                // 3501
            // but not other JS (goog.date)                                                                           // 3502
            return 'P0D';                                                                                             // 3503
        }                                                                                                             // 3504
                                                                                                                      // 3505
        return (total < 0 ? '-' : '') +                                                                               // 3506
            'P' +                                                                                                     // 3507
            (Y ? Y + 'Y' : '') +                                                                                      // 3508
            (M ? M + 'M' : '') +                                                                                      // 3509
            (D ? D + 'D' : '') +                                                                                      // 3510
            ((h || m || s) ? 'T' : '') +                                                                              // 3511
            (h ? h + 'H' : '') +                                                                                      // 3512
            (m ? m + 'M' : '') +                                                                                      // 3513
            (s ? s + 'S' : '');                                                                                       // 3514
    }                                                                                                                 // 3515
                                                                                                                      // 3516
    var duration_prototype__proto = Duration.prototype;                                                               // 3517
                                                                                                                      // 3518
    duration_prototype__proto.abs            = duration_abs__abs;                                                     // 3519
    duration_prototype__proto.add            = duration_add_subtract__add;                                            // 3520
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;                                       // 3521
    duration_prototype__proto.as             = as;                                                                    // 3522
    duration_prototype__proto.asMilliseconds = asMilliseconds;                                                        // 3523
    duration_prototype__proto.asSeconds      = asSeconds;                                                             // 3524
    duration_prototype__proto.asMinutes      = asMinutes;                                                             // 3525
    duration_prototype__proto.asHours        = asHours;                                                               // 3526
    duration_prototype__proto.asDays         = asDays;                                                                // 3527
    duration_prototype__proto.asWeeks        = asWeeks;                                                               // 3528
    duration_prototype__proto.asMonths       = asMonths;                                                              // 3529
    duration_prototype__proto.asYears        = asYears;                                                               // 3530
    duration_prototype__proto.valueOf        = duration_as__valueOf;                                                  // 3531
    duration_prototype__proto._bubble        = bubble;                                                                // 3532
    duration_prototype__proto.get            = duration_get__get;                                                     // 3533
    duration_prototype__proto.milliseconds   = milliseconds;                                                          // 3534
    duration_prototype__proto.seconds        = seconds;                                                               // 3535
    duration_prototype__proto.minutes        = minutes;                                                               // 3536
    duration_prototype__proto.hours          = hours;                                                                 // 3537
    duration_prototype__proto.days           = days;                                                                  // 3538
    duration_prototype__proto.weeks          = weeks;                                                                 // 3539
    duration_prototype__proto.months         = months;                                                                // 3540
    duration_prototype__proto.years          = years;                                                                 // 3541
    duration_prototype__proto.humanize       = humanize;                                                              // 3542
    duration_prototype__proto.toISOString    = iso_string__toISOString;                                               // 3543
    duration_prototype__proto.toString       = iso_string__toISOString;                                               // 3544
    duration_prototype__proto.toJSON         = iso_string__toISOString;                                               // 3545
    duration_prototype__proto.locale         = locale;                                                                // 3546
    duration_prototype__proto.localeData     = localeData;                                                            // 3547
                                                                                                                      // 3548
    // Deprecations                                                                                                   // 3549
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;                                                                            // 3551
                                                                                                                      // 3552
    // Side effect imports                                                                                            // 3553
                                                                                                                      // 3554
    // FORMATTING                                                                                                     // 3555
                                                                                                                      // 3556
    addFormatToken('X', 0, 0, 'unix');                                                                                // 3557
    addFormatToken('x', 0, 0, 'valueOf');                                                                             // 3558
                                                                                                                      // 3559
    // PARSING                                                                                                        // 3560
                                                                                                                      // 3561
    addRegexToken('x', matchSigned);                                                                                  // 3562
    addRegexToken('X', matchTimestamp);                                                                               // 3563
    addParseToken('X', function (input, array, config) {                                                              // 3564
        config._d = new Date(parseFloat(input, 10) * 1000);                                                           // 3565
    });                                                                                                               // 3566
    addParseToken('x', function (input, array, config) {                                                              // 3567
        config._d = new Date(toInt(input));                                                                           // 3568
    });                                                                                                               // 3569
                                                                                                                      // 3570
    // Side effect imports                                                                                            // 3571
                                                                                                                      // 3572
                                                                                                                      // 3573
    utils_hooks__hooks.version = '2.11.1';                                                                            // 3574
                                                                                                                      // 3575
    setHookCallback(local__createLocal);                                                                              // 3576
                                                                                                                      // 3577
    utils_hooks__hooks.fn                    = momentPrototype;                                                       // 3578
    utils_hooks__hooks.min                   = min;                                                                   // 3579
    utils_hooks__hooks.max                   = max;                                                                   // 3580
    utils_hooks__hooks.now                   = now;                                                                   // 3581
    utils_hooks__hooks.utc                   = create_utc__createUTC;                                                 // 3582
    utils_hooks__hooks.unix                  = moment__createUnix;                                                    // 3583
    utils_hooks__hooks.months                = lists__listMonths;                                                     // 3584
    utils_hooks__hooks.isDate                = isDate;                                                                // 3585
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;                                    // 3586
    utils_hooks__hooks.invalid               = valid__createInvalid;                                                  // 3587
    utils_hooks__hooks.duration              = create__createDuration;                                                // 3588
    utils_hooks__hooks.isMoment              = isMoment;                                                              // 3589
    utils_hooks__hooks.weekdays              = lists__listWeekdays;                                                   // 3590
    utils_hooks__hooks.parseZone             = moment__createInZone;                                                  // 3591
    utils_hooks__hooks.localeData            = locale_locales__getLocale;                                             // 3592
    utils_hooks__hooks.isDuration            = isDuration;                                                            // 3593
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;                                                // 3594
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;                                                // 3595
    utils_hooks__hooks.defineLocale          = defineLocale;                                                          // 3596
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;                                              // 3597
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;                                                        // 3598
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;                        // 3599
    utils_hooks__hooks.prototype             = momentPrototype;                                                       // 3600
                                                                                                                      // 3601
    var _moment = utils_hooks__hooks;                                                                                 // 3602
                                                                                                                      // 3603
    return _moment;                                                                                                   // 3604
                                                                                                                      // 3605
}));                                                                                                                  // 3606
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/momentjs_moment/meteor/export.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// moment.js makes `moment` global on the window (or global) object, while Meteor expects a file-scoped global variable
moment = this.moment;                                                                                                 // 2
try {                                                                                                                 // 3
    delete this.moment;                                                                                               // 4
} catch (e) {                                                                                                         // 5
}                                                                                                                     // 6
                                                                                                                      // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['momentjs:moment'] = {
  moment: moment
};

})();

//# sourceMappingURL=momentjs_moment.js.map
