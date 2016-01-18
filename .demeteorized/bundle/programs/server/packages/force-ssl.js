(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/force-ssl/force_ssl_common.js                                                               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
_.extend(Meteor.absoluteUrl.defaultOptions, {secure: true});                                            // 1
                                                                                                        // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/force-ssl/force_ssl_server.js                                                               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var url = Npm.require("url");                                                                           // 1
                                                                                                        // 2
// Unfortunately we can't use a connect middleware here since                                           // 3
// sockjs installs itself prior to all existing listeners                                               // 4
// (meaning prior to any connect middlewares) so we need to take                                        // 5
// an approach similar to overshadowListeners in                                                        // 6
// https://github.com/sockjs/sockjs-node/blob/cf820c55af6a9953e16558555a31decea554f70e/src/utils.coffee
                                                                                                        // 8
var httpServer = WebApp.httpServer;                                                                     // 9
var oldHttpServerListeners = httpServer.listeners('request').slice(0);                                  // 10
httpServer.removeAllListeners('request');                                                               // 11
httpServer.addListener('request', function (req, res) {                                                 // 12
                                                                                                        // 13
  // allow connections if they have been handled w/ ssl already                                         // 14
  // (either by us or by a proxy) OR the connection is entirely over                                    // 15
  // localhost (development mode).                                                                      // 16
  //                                                                                                    // 17
  // Note: someone could trick us into serving over non-ssl by setting                                  // 18
  // x-forwarded-for or x-forwarded-proto. Not much we can do there if                                  // 19
  // we still want to operate behind proxies.                                                           // 20
                                                                                                        // 21
  var remoteAddress =                                                                                   // 22
        req.connection.remoteAddress || req.socket.remoteAddress;                                       // 23
  // Determine if the connection is only over localhost. Both we                                        // 24
  // received it on localhost, and all proxies involved received on                                     // 25
  // localhost.                                                                                         // 26
  var localhostRegexp = /^\s*(127\.0\.0\.1|::1)\s*$/;                                                   // 27
  var isLocal = (                                                                                       // 28
    localhostRegexp.test(remoteAddress) &&                                                              // 29
      (!req.headers['x-forwarded-for'] ||                                                               // 30
       _.all(req.headers['x-forwarded-for'].split(','), function (x) {                                  // 31
         return localhostRegexp.test(x);                                                                // 32
       })));                                                                                            // 33
                                                                                                        // 34
  // Determine if the connection was over SSL at any point. Either we                                   // 35
  // received it as SSL, or a proxy did and translated it for us.                                       // 36
  var isSsl = req.connection.pair ||                                                                    // 37
      (req.headers['x-forwarded-proto'] &&                                                              // 38
       req.headers['x-forwarded-proto'].indexOf('https') !== -1);                                       // 39
                                                                                                        // 40
  if (!isLocal && !isSsl) {                                                                             // 41
    // connection is not cool. send a 302 redirect!                                                     // 42
                                                                                                        // 43
    var host = url.parse(Meteor.absoluteUrl()).hostname;                                                // 44
                                                                                                        // 45
    // strip off the port number. If we went to a URL with a custom                                     // 46
    // port, we don't know what the custom SSL port is anyway.                                          // 47
    host = host.replace(/:\d+$/, '');                                                                   // 48
                                                                                                        // 49
    res.writeHead(302, {                                                                                // 50
      'Location': 'https://' + host + req.url                                                           // 51
    });                                                                                                 // 52
    res.end();                                                                                          // 53
    return;                                                                                             // 54
  }                                                                                                     // 55
                                                                                                        // 56
  // connection is OK. Proceed normally.                                                                // 57
  var args = arguments;                                                                                 // 58
  _.each(oldHttpServerListeners, function(oldListener) {                                                // 59
    oldListener.apply(httpServer, args);                                                                // 60
  });                                                                                                   // 61
});                                                                                                     // 62
                                                                                                        // 63
                                                                                                        // 64
// NOTE: this doesn't handle websockets!                                                                // 65
//                                                                                                      // 66
// Websockets come in via the 'upgrade' request. We can override this,                                  // 67
// however the problem is we're not sure if the websocket is actually                                   // 68
// encrypted. We don't get x-forwarded-for or x-forwarded-proto on                                      // 69
// websockets. It's possible the 'sec-websocket-origin' header does                                     // 70
// what we want, but that's not clear.                                                                  // 71
//                                                                                                      // 72
// For now, this package allows raw unencrypted DDP connections over                                    // 73
// websockets.                                                                                          // 74
                                                                                                        // 75
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['force-ssl'] = {};

})();

//# sourceMappingURL=force-ssl.js.map
