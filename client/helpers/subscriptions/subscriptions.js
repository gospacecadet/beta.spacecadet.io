Template.subscriptions.helpers({
  hasSubscriptions: function() {
    return !!Mart.Subscriptions.findOne()
  },
  subscriptions: function() {
    return Mart.Subscriptions.find({}, {sort: {createdAt: -1}})
  },
});

Template.subscription.helpers({
  isActive: function() {
    return (this.state === Mart.Subscription.STATES.ACTIVE) ||
      (this.state === Mart.Subscription.STATES.SPAWNED)
  }
});
