(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var exports;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/lepozepo_accounting/packages/lepozepo_accounting.js                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
(function () {                                                                                                 // 1
                                                                                                               // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                      //     // 4
// packages/lepozepo:accounting/accounting.js                                                           //     // 5
//                                                                                                      //     // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                        //     // 8
/*!                                                                                                     // 1   // 9
 * accounting.js v0.3.2                                                                                 // 2   // 10
 * Copyright 2011, Joss Crowcroft                                                                       // 3   // 11
 *                                                                                                      // 4   // 12
 * Freely distributable under the MIT license.                                                          // 5   // 13
 * Portions of accounting.js are inspired or borrowed from underscore.js                                // 6   // 14
 *                                                                                                      // 7   // 15
 * Full details and documentation:                                                                      // 8   // 16
 * http://josscrowcroft.github.com/accounting.js/                                                       // 9   // 17
 */                                                                                                     // 10  // 18
                                                                                                        // 11  // 19
(function(root, undefined) {                                                                            // 12  // 20
                                                                                                        // 13  // 21
	/* --- Setup --- */                                                                                    // 14  // 22
                                                                                                        // 15  // 23
	// Create the local library object, to be exported or referenced globally later                        // 16  // 24
	var lib = {};                                                                                          // 17  // 25
                                                                                                        // 18  // 26
	// Current version                                                                                     // 19  // 27
	lib.version = '0.3.2';                                                                                 // 20  // 28
                                                                                                        // 21  // 29
                                                                                                        // 22  // 30
	/* --- Exposed settings --- */                                                                         // 23  // 31
                                                                                                        // 24  // 32
	// The library's settings configuration object. Contains default parameters for                        // 25  // 33
	// currency and number formatting                                                                      // 26  // 34
	lib.settings = {                                                                                       // 27  // 35
		currency: {                                                                                           // 28  // 36
			symbol : "$",		// default currency symbol is '$'                                                     // 29  // 37
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)               // 30  // 38
			decimal : ".",		// decimal point separator                                                           // 31  // 39
			thousand : ",",		// thousands separator                                                              // 32  // 40
			precision : 2,		// decimal places                                                                    // 33  // 41
			grouping : 3		// digit grouping (not implemented yet)                                                // 34  // 42
		},                                                                                                    // 35  // 43
		number: {                                                                                             // 36  // 44
			precision : 0,		// default precision on numbers is 0                                                 // 37  // 45
			grouping : 3,		// digit grouping (not implemented yet)                                               // 38  // 46
			thousand : ",",                                                                                      // 39  // 47
			decimal : "."                                                                                        // 40  // 48
		}                                                                                                     // 41  // 49
	};                                                                                                     // 42  // 50
                                                                                                        // 43  // 51
                                                                                                        // 44  // 52
	/* --- Internal Helper Methods --- */                                                                  // 45  // 53
                                                                                                        // 46  // 54
	// Store reference to possibly-available ECMAScript 5 methods for later                                // 47  // 55
	var nativeMap = Array.prototype.map,                                                                   // 48  // 56
		nativeIsArray = Array.isArray,                                                                        // 49  // 57
		toString = Object.prototype.toString;                                                                 // 50  // 58
                                                                                                        // 51  // 59
	/**                                                                                                    // 52  // 60
	 * Tests whether supplied parameter is a string                                                        // 53  // 61
	 * from underscore.js                                                                                  // 54  // 62
	 */                                                                                                    // 55  // 63
	function isString(obj) {                                                                               // 56  // 64
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));                                       // 57  // 65
	}                                                                                                      // 58  // 66
                                                                                                        // 59  // 67
	/**                                                                                                    // 60  // 68
	 * Tests whether supplied parameter is a string                                                        // 61  // 69
	 * from underscore.js, delegates to ECMA5's native Array.isArray                                       // 62  // 70
	 */                                                                                                    // 63  // 71
	function isArray(obj) {                                                                                // 64  // 72
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';                  // 65  // 73
	}                                                                                                      // 66  // 74
                                                                                                        // 67  // 75
	/**                                                                                                    // 68  // 76
	 * Tests whether supplied parameter is a true object                                                   // 69  // 77
	 */                                                                                                    // 70  // 78
	function isObject(obj) {                                                                               // 71  // 79
		return toString.call(obj) === '[object Object]';                                                      // 72  // 80
	}                                                                                                      // 73  // 81
                                                                                                        // 74  // 82
	/**                                                                                                    // 75  // 83
	 * Extends an object with a defaults object, similar to underscore's _.defaults                        // 76  // 84
	 *                                                                                                     // 77  // 85
	 * Used for abstracting parameter handling from API methods                                            // 78  // 86
	 */                                                                                                    // 79  // 87
	function defaults(object, defs) {                                                                      // 80  // 88
		var key;                                                                                              // 81  // 89
		object = object || {};                                                                                // 82  // 90
		defs = defs || {};                                                                                    // 83  // 91
		// Iterate over object non-prototype properties:                                                      // 84  // 92
		for (key in defs) {                                                                                   // 85  // 93
			if (defs.hasOwnProperty(key)) {                                                                      // 86  // 94
				// Replace values with defaults only if undefined (allow empty/zero values):                        // 87  // 95
				if (object[key] == null) object[key] = defs[key];                                                   // 88  // 96
			}                                                                                                    // 89  // 97
		}                                                                                                     // 90  // 98
		return object;                                                                                        // 91  // 99
	}                                                                                                      // 92  // 100
                                                                                                        // 93  // 101
	/**                                                                                                    // 94  // 102
	 * Implementation of `Array.map()` for iteration loops                                                 // 95  // 103
	 *                                                                                                     // 96  // 104
	 * Returns a new Array as a result of calling `iterator` on each array value.                          // 97  // 105
	 * Defers to native Array.map if available                                                             // 98  // 106
	 */                                                                                                    // 99  // 107
	function map(obj, iterator, context) {                                                                 // 100
		var results = [], i, j;                                                                               // 101
                                                                                                        // 102
		if (!obj) return results;                                                                             // 103
                                                                                                        // 104
		// Use native .map method if it exists:                                                               // 105
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);                            // 106
                                                                                                        // 107
		// Fallback for native .map:                                                                          // 108
		for (i = 0, j = obj.length; i < j; i++ ) {                                                            // 109
			results[i] = iterator.call(context, obj[i], i, obj);                                                 // 110
		}                                                                                                     // 111
		return results;                                                                                       // 112
	}                                                                                                      // 113
                                                                                                        // 114
	/**                                                                                                    // 115
	 * Check and normalise the value of precision (must be positive integer)                               // 116
	 */                                                                                                    // 117
	function checkPrecision(val, base) {                                                                   // 118
		val = Math.round(Math.abs(val));                                                                      // 119
		return isNaN(val)? base : val;                                                                        // 120
	}                                                                                                      // 121
                                                                                                        // 122
                                                                                                        // 123
	/**                                                                                                    // 124
	 * Parses a format string or object and returns format obj for use in rendering                        // 125
	 *                                                                                                     // 126
	 * `format` is either a string with the default (positive) format, or object                           // 127
	 * containing `pos` (required), `neg` and `zero` values (or a function returning                       // 128
	 * either a string or object)                                                                          // 129
	 *                                                                                                     // 130
	 * Either string or format.pos must contain "%v" (value) to be valid                                   // 131
	 */                                                                                                    // 132
	function checkCurrencyFormat(format) {                                                                 // 133
		var defaults = lib.settings.currency.format;                                                          // 134
                                                                                                        // 135
		// Allow function as format parameter (should return string or object):                               // 136
		if ( typeof format === "function" ) format = format();                                                // 137
                                                                                                        // 138
		// Format can be a string, in which case `value` ("%v") must be present:                              // 139
		if ( isString( format ) && format.match("%v") ) {                                                     // 140
                                                                                                        // 141
			// Create and return positive, negative and zero formats:                                            // 142
			return {                                                                                             // 143
				pos : format,                                                                                       // 144
				neg : format.replace("-", "").replace("%v", "-%v"),                                                 // 145
				zero : format                                                                                       // 146
			};                                                                                                   // 147
                                                                                                        // 148
		// If no format, or object is missing valid positive value, use defaults:                             // 149
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {                                     // 150
                                                                                                        // 151
			// If defaults is a string, casts it to an object for faster checking next time:                     // 152
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {                       // 153
				pos : defaults,                                                                                     // 154
				neg : defaults.replace("%v", "-%v"),                                                                // 155
				zero : defaults                                                                                     // 156
			};                                                                                                   // 157
                                                                                                        // 158
		}                                                                                                     // 159
		// Otherwise, assume format was fine:                                                                 // 160
		return format;                                                                                        // 161
	}                                                                                                      // 162
                                                                                                        // 163
                                                                                                        // 164
	/* --- API Methods --- */                                                                              // 165
                                                                                                        // 166
	/**                                                                                                    // 167
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value       // 168
	 * alias: accounting.`parse(string)`                                                                   // 169
	 *                                                                                                     // 170
	 * Decimal must be included in the regular expression to match floats (default: "."), so if the number // 171
	 * uses a non-standard decimal separator, provide it as the second argument.                           // 172
	 *                                                                                                     // 173
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)                                          // 174
	 *                                                                                                     // 175
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future                            // 176
	 */                                                                                                    // 177
	var unformat = lib.unformat = lib.parse = function(value, decimal) {                                   // 178
		// Recursively unformat arrays:                                                                       // 179
		if (isArray(value)) {                                                                                 // 180
			return map(value, function(val) {                                                                    // 181
				return unformat(val, decimal);                                                                      // 182
			});                                                                                                  // 183
		}                                                                                                     // 184
                                                                                                        // 185
		// Fails silently (need decent errors):                                                               // 186
		value = value || 0;                                                                                   // 187
                                                                                                        // 188
		// Return the value as-is if it's already a number:                                                   // 189
		if (typeof value === "number") return value;                                                          // 190
                                                                                                        // 191
		// Default decimal point is "." but could be set to eg. "," in opts:                                  // 192
		decimal = decimal || ".";                                                                             // 193
                                                                                                        // 194
		 // Build regex to strip out everything except digits, decimal point and minus sign:                  // 195
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),                                              // 196
			unformatted = parseFloat(                                                                            // 197
				("" + value)                                                                                        // 198
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives                              // 199
				.replace(regex, '')         // strip out any cruft                                                  // 200
				.replace(decimal, '.')      // make sure decimal point is standard                                  // 201
			);                                                                                                   // 202
                                                                                                        // 203
		// This will fail silently which may cause trouble, let's wait and see:                               // 204
		return !isNaN(unformatted) ? unformatted : 0;                                                         // 205
	};                                                                                                     // 206
                                                                                                        // 207
                                                                                                        // 208
	/**                                                                                                    // 209
	 * Implementation of toFixed() that treats floats more like decimals                                   // 210
	 *                                                                                                     // 211
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present                       // 212
	 * problems for accounting- and finance-related software.                                              // 213
	 */                                                                                                    // 214
	var toFixed = lib.toFixed = function(value, precision) {                                               // 215
		precision = checkPrecision(precision, lib.settings.number.precision);                                 // 216
		var power = Math.pow(10, precision);                                                                  // 217
                                                                                                        // 218
		// Multiply up by precision, round accurately, then divide and use native toFixed():                  // 219
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);                          // 220
	};                                                                                                     // 221
                                                                                                        // 222
                                                                                                        // 223
	/**                                                                                                    // 224
	 * Format a number, with comma-separated thousands and custom precision/decimal places                 // 225
	 *                                                                                                     // 226
	 * Localise by overriding the precision and thousand / decimal separators                              // 227
	 * 2nd parameter `precision` can be an object matching `settings.number`                               // 228
	 */                                                                                                    // 229
	var formatNumber = lib.formatNumber = function(number, precision, thousand, decimal) {                 // 230
		// Resursively format arrays:                                                                         // 231
		if (isArray(number)) {                                                                                // 232
			return map(number, function(val) {                                                                   // 233
				return formatNumber(val, precision, thousand, decimal);                                             // 234
			});                                                                                                  // 235
		}                                                                                                     // 236
                                                                                                        // 237
		// Clean up number:                                                                                   // 238
		number = unformat(number);                                                                            // 239
                                                                                                        // 240
		// Build options object from second param (if object) or all params, extending defaults:              // 241
		var opts = defaults(                                                                                  // 242
				(isObject(precision) ? precision : {                                                                // 243
					precision : precision,                                                                             // 244
					thousand : thousand,                                                                               // 245
					decimal : decimal                                                                                  // 246
				}),                                                                                                 // 247
				lib.settings.number                                                                                 // 248
			),                                                                                                   // 249
                                                                                                        // 250
			// Clean up precision                                                                                // 251
			usePrecision = checkPrecision(opts.precision),                                                       // 252
                                                                                                        // 253
			// Do some calc:                                                                                     // 254
			negative = number < 0 ? "-" : "",                                                                    // 255
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",                              // 256
			mod = base.length > 3 ? base.length % 3 : 0;                                                         // 257
                                                                                                        // 258
		// Format the number:                                                                                 // 259
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};                                                                                                     // 261
                                                                                                        // 262
                                                                                                        // 263
	/**                                                                                                    // 264
	 * Format a number into currency                                                                       // 265
	 *                                                                                                     // 266
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)          // 267
	 * defaults: (0, "$", 2, ",", ".", "%s%v")                                                             // 268
	 *                                                                                                     // 269
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format              // 270
	 * Second param can be an object matching `settings.currency` which is the easiest way.                // 271
	 *                                                                                                     // 272
	 * To do: tidy up the parameters                                                                       // 273
	 */                                                                                                    // 274
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {   // 275
		// Resursively format arrays:                                                                         // 276
		if (isArray(number)) {                                                                                // 277
			return map(number, function(val){                                                                    // 278
				return formatMoney(val, symbol, precision, thousand, decimal, format);                              // 279
			});                                                                                                  // 280
		}                                                                                                     // 281
                                                                                                        // 282
		// Clean up number:                                                                                   // 283
		number = unformat(number);                                                                            // 284
                                                                                                        // 285
		// Build options object from second param (if object) or all params, extending defaults:              // 286
		var opts = defaults(                                                                                  // 287
				(isObject(symbol) ? symbol : {                                                                      // 288
					symbol : symbol,                                                                                   // 289
					precision : precision,                                                                             // 290
					thousand : thousand,                                                                               // 291
					decimal : decimal,                                                                                 // 292
					format : format                                                                                    // 293
				}),                                                                                                 // 294
				lib.settings.currency                                                                               // 295
			),                                                                                                   // 296
                                                                                                        // 297
			// Check format (returns object with pos, neg and zero):                                             // 298
			formats = checkCurrencyFormat(opts.format),                                                          // 299
                                                                                                        // 300
			// Choose which format to use for this value:                                                        // 301
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;                      // 302
                                                                                                        // 303
		// Return with currency symbol added:                                                                 // 304
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};                                                                                                     // 306
                                                                                                        // 307
                                                                                                        // 308
	/**                                                                                                    // 309
	 * Format a list of numbers into an accounting column, padding with whitespace                         // 310
	 * to line up currency symbols, thousand separators and decimals places                                // 311
	 *                                                                                                     // 312
	 * List should be an array of numbers                                                                  // 313
	 * Second parameter can be an object containing keys that match the params                             // 314
	 *                                                                                                     // 315
	 * Returns array of accouting-formatted number strings of same length                                  // 316
	 *                                                                                                     // 317
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent                         // 318
	 * browsers from collapsing the whitespace in the output strings.                                      // 319
	 */                                                                                                    // 320
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {                      // 321
		if (!list) return [];                                                                                 // 322
                                                                                                        // 323
		// Build options object from second param (if object) or all params, extending defaults:              // 324
		var opts = defaults(                                                                                  // 325
				(isObject(symbol) ? symbol : {                                                                      // 326
					symbol : symbol,                                                                                   // 327
					precision : precision,                                                                             // 328
					thousand : thousand,                                                                               // 329
					decimal : decimal,                                                                                 // 330
					format : format                                                                                    // 331
				}),                                                                                                 // 332
				lib.settings.currency                                                                               // 333
			),                                                                                                   // 334
                                                                                                        // 335
			// Check format (returns object with pos, neg and zero), only need pos for now:                      // 336
			formats = checkCurrencyFormat(opts.format),                                                          // 337
                                                                                                        // 338
			// Whether to pad at start of string or after currency symbol:                                       // 339
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,               // 340
                                                                                                        // 341
			// Store value for the length of the longest string in the column:                                   // 342
			maxLength = 0,                                                                                       // 343
                                                                                                        // 344
			// Format the list according to options, store the length of the longest string:                     // 345
			formatted = map(list, function(val, i) {                                                             // 346
				if (isArray(val)) {                                                                                 // 347
					// Recursively format columns if list is a multi-dimensional array:                                // 348
					return lib.formatColumn(val, opts);                                                                // 349
				} else {                                                                                            // 350
					// Clean up the value                                                                              // 351
					val = unformat(val);                                                                               // 352
                                                                                                        // 353
					// Choose which format to use for this value (pos, neg or zero):                                   // 354
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,                      // 355
                                                                                                        // 356
						// Format this value, push into formatted list and save the length:                               // 357
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));
                                                                                                        // 359
					if (fVal.length > maxLength) maxLength = fVal.length;                                              // 360
					return fVal;                                                                                       // 361
				}                                                                                                   // 362
			});                                                                                                  // 363
                                                                                                        // 364
		// Pad each number in the list and send back the column of numbers:                                   // 365
		return map(formatted, function(val, i) {                                                              // 366
			// Only if this is a string (not a nested array, which would have already been padded):              // 367
			if (isString(val) && val.length < maxLength) {                                                       // 368
				// Depending on symbol position, pad after symbol or at index 0:                                    // 369
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}                                                                                                    // 371
			return val;                                                                                          // 372
		});                                                                                                   // 373
	};                                                                                                     // 374
                                                                                                        // 375
                                                                                                        // 376
	/* --- Module Definition --- */                                                                        // 377
                                                                                                        // 378
	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.                // 379
	// Otherwise, just add `accounting` to the global object                                               // 380
	if (typeof exports !== 'undefined') {                                                                  // 381
		if (typeof module !== 'undefined' && module.exports) {                                                // 382
			exports = module.exports = lib;                                                                      // 383
		}                                                                                                     // 384
		exports.accounting = lib;                                                                             // 385
	} else if (typeof define === 'function' && define.amd) {                                               // 386
		// Return the library as an AMD module:                                                               // 387
		define([], function() {                                                                               // 388
			return lib;                                                                                          // 389
		});                                                                                                   // 390
	} else {                                                                                               // 391
		// Use accounting.noConflict to restore `accounting` back to its original value.                      // 392
		// Returns a reference to the library's `accounting` object;                                          // 393
		// e.g. `var numbers = accounting.noConflict();`                                                      // 394
		lib.noConflict = (function(oldAccounting) {                                                           // 395
			return function() {                                                                                  // 396
				// Reset the value of the root's `accounting` variable:                                             // 397
				root.accounting = oldAccounting;                                                                    // 398
				// Delete the noConflict method:                                                                    // 399
				lib.noConflict = undefined;                                                                         // 400
				// Return reference to the library to re-assign it:                                                 // 401
				return lib;                                                                                         // 402
			};                                                                                                   // 403
		})(root.accounting);                                                                                  // 404
                                                                                                        // 405
		// Declare `fx` on the root (global/window) object:                                                   // 406
		root['accounting'] = lib;                                                                             // 407
	}                                                                                                      // 408
                                                                                                        // 409
	// Root will be `window` in browser or `global` on the server:                                         // 410
}(this));                                                                                               // 411
                                                                                                        // 412
//////////////////////////////////////////////////////////////////////////////////////////////////////////     // 421
                                                                                                               // 422
}).call(this);                                                                                                 // 423
                                                                                                               // 424
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['lepozepo:accounting'] = {};

})();

//# sourceMappingURL=lepozepo_accounting.js.map
