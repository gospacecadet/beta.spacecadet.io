(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Messages, Threads, Talk;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/marvin_talk/messages.js                                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Messages = new Mongo.Collection("TalkMessages", {                                                                   // 1
  transform: function (doc) {                                                                                       // 2
    return new Message(doc);                                                                                        // 2
  }                                                                                                                 //
});                                                                                                                 //
                                                                                                                    //
var Message = function (doc) {                                                                                      // 5
  _.extend(this, doc);                                                                                              // 6
};                                                                                                                  //
                                                                                                                    //
_.extend(Message.prototype, {                                                                                       // 9
  isSender: function () {                                                                                           // 10
    return this.senderId === Meteor.userId();                                                                       // 11
  },                                                                                                                //
  yourName: function () {                                                                                           // 13
    if (this.senderId === Meteor.userId()) return "You";                                                            // 14
  },                                                                                                                //
  otherName: function () {                                                                                          // 17
    var user = Meteor.users.findOne(this.senderId);                                                                 // 18
                                                                                                                    //
    if (user && user.profile) return user.profile.firstName + " " + user.profile.lastName;                          // 20
  },                                                                                                                //
  isRecipient: function () {                                                                                        // 23
    return this.recipientId === Meteor.userId();                                                                    // 24
  },                                                                                                                //
  isText: function () {                                                                                             // 26
    return !!this.body;                                                                                             // 27
  },                                                                                                                //
  isAttachment: function () {                                                                                       // 29
    return !!this.attachmentUrl;                                                                                    // 30
  }                                                                                                                 //
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/marvin_talk/threads.js                                                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Threads = new Mongo.Collection("TalkThreads", {                                                                     // 1
  transform: function (doc) {                                                                                       // 2
    return new Thread(doc);                                                                                         // 2
  }                                                                                                                 //
});                                                                                                                 //
                                                                                                                    //
var Thread = function (doc) {                                                                                       // 5
  _.extend(this, doc);                                                                                              // 6
};                                                                                                                  //
                                                                                                                    //
_.extend(Thread.prototype, {                                                                                        // 9
  recipientId: function () {                                                                                        // 10
    return this.user1Id === Meteor.userId() ? this.user2Id : this.user1Id;                                          // 11
  },                                                                                                                //
  messages: function () {                                                                                           // 13
    return Messages.find({ threadId: this._id });                                                                   // 14
  },                                                                                                                //
  recipientName: function () {                                                                                      // 16
    var recipientId = this.recipientId();                                                                           // 17
                                                                                                                    //
    if (recipientId) {                                                                                              // 19
      var recipient = Meteor.users.findOne(recipientId);                                                            // 20
      if (recipient && recipient.profile) return recipient.profile.firstName + " " + recipient.profile.lastName;    // 21
    }                                                                                                               //
  }                                                                                                                 //
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/marvin_talk/talk.js                                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Talk = {                                                                                                            // 1
  Messages: Messages,                                                                                               // 2
  Threads: Threads,                                                                                                 // 3
  thread: function (recipientId) {                                                                                  // 4
    var thread = Threads.findOne({ $or: [{ user1Id: recipientId }, { user2Id: recipientId }] });                    // 5
                                                                                                                    //
    if (thread) return thread;                                                                                      // 10
                                                                                                                    //
    var threadId = Meteor.call("talk/create-thread", recipientId);                                                  // 13
  },                                                                                                                //
  threads: function () {                                                                                            // 15
    var allThreads = Talk.Threads.find().fetch();                                                                   // 16
                                                                                                                    //
    return _.filter(allThreads, function (thread) {                                                                 // 18
      return thread.messages().count() > 0;                                                                         // 19
    });                                                                                                             //
  },                                                                                                                //
  send: function (options, callback) {                                                                              // 22
    console.log('send');                                                                                            // 23
    Meteor.call("talk/send", options, callback);                                                                    // 24
  }                                                                                                                 //
};                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/marvin_talk/talk-server.js                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.methods({                                                                                                    // 1
  'talk/send': function (options) {                                                                                 // 2
    console.log('talk/send');                                                                                       // 3
    if (!Meteor.userId()) throw new Meteor.Error('talk-not-logged-in', "Cannot send messages when not logged in.");
                                                                                                                    //
    check(options, {                                                                                                // 7
      recipientId: String,                                                                                          // 8
      body: Match.Optional(String),                                                                                 // 9
      attachmentUrl: Match.Optional(String),                                                                        // 10
      attachmentName: Match.Optional(String)                                                                        // 11
    });                                                                                                             //
                                                                                                                    //
    var message = {                                                                                                 // 14
      recipientId: options.recipientId,                                                                             // 15
      senderId: Meteor.userId()                                                                                     // 16
    };                                                                                                              //
                                                                                                                    //
    if (options.attachmentName || options.attachmentUrl) {                                                          // 19
      if (!options.attachmentName || !options.attachmentUrl) {                                                      // 20
        throw new Meteor.Error('talk-incomplete-attachment', "Attachment name and URL must both be provided or must both be undefined.");
      } else {                                                                                                      //
        message.attachmentName = options.attachmentName;                                                            // 23
        message.attachmentUrl = options.attachmentUrl;                                                              // 24
      }                                                                                                             //
    }                                                                                                               //
                                                                                                                    //
    if (!Meteor.users.findOne(options.recipientId)) throw new Meteor.Error('talk-invalid-recipient', "The user you are trying to send to does not exist.");
                                                                                                                    //
    if (options.body) message.body = options.body;                                                                  // 31
                                                                                                                    //
    message.createdAt = new Date();                                                                                 // 34
                                                                                                                    //
    var thread = Threads.findOne({ $or: [{ $and: [{ user1Id: Meteor.userId() }, { user2Id: message.recipientId }] }, { $and: [{ user2Id: Meteor.userId() }, { user1Id: message.recipientId }] }] });
                                                                                                                    //
    if (!thread) {                                                                                                  // 47
      thread = Threads.insert({                                                                                     // 48
        user1Id: Meteor.userId(),                                                                                   // 49
        user2Id: message.recipientId                                                                                // 50
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    message.threadId = thread._id;                                                                                  // 54
    return Messages.insert(message);                                                                                // 55
  },                                                                                                                //
  'talk/create-thread': function (recipientId) {                                                                    // 57
    check(recipientId, String);                                                                                     // 58
                                                                                                                    //
    if (Meteor.userId()) return Threads.insert({ user1Id: Meteor.userId(), user2Id: recipientId });                 // 60
  }                                                                                                                 //
});                                                                                                                 //
                                                                                                                    //
Meteor.publish("talk/messages", function (threadId) {                                                               // 65
  console.log(threadId);                                                                                            // 66
  check(threadId, String);                                                                                          // 67
                                                                                                                    //
  var thread = Threads.findOne({ $or: [{ user1Id: this.userId }, { user2Id: this.userId }] });                      // 69
                                                                                                                    //
  if (thread) return Messages.find({ threadId: threadId }, { sort: { createdAt: -1 } });                            // 74
});                                                                                                                 //
                                                                                                                    //
Meteor.publish("talk/all-messages", function () {                                                                   // 78
  return Messages.find({ $or: [{ senderId: this.userId }, { recipientId: this.userId }] }, { sort: { createdAt: -1 } });
});                                                                                                                 //
                                                                                                                    //
Meteor.publish("talk/threads", function () {                                                                        // 85
  return Threads.find({ $or: [{ user1Id: this.userId }, { user2Id: this.userId }] });                               // 86
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['marvin:talk'] = {
  Talk: Talk
};

})();

//# sourceMappingURL=marvin_talk.js.map
