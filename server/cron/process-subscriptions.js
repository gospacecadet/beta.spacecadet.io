SyncedCron.add({
  name: 'Process subscriptions that are due for payment',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 days');
  },
  job: function() {
    var subscriptions = Mart.Subscriptions.find({
      state:  Mart.Subscription.STATES.SPAWNED
    }).fetch()

    _.each(subscriptions, function(subscription) {
      subscription.process()
    })
  }
});
