SyncedCron.add({
  name: 'Remove threads that dont have any messages due to hack in messaging logic',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 hours');
  },
  job: function() {
    var threads = Talk.Threads.find().fetch()

    _.each(threads, function(thread) {
      var oneMessage = Talk.Messages.findOne({threadId: thread._id})

      if(!oneMessage) {
        Talk.Threads.remove(thread._id)
      }
    })
  }
});
