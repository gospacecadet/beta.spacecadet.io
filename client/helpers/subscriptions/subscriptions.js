Template.subscriptions.helpers({
  hasSubscriptions: function() {
    return !!Mart.Subscriptions.findOne()
  },
  subscriptions: function() {
    return Mart.Subscriptions.find({}, {sort: {createdAt: -1}})
  },
  isActive: function() {
    return this.state === Mart.Subscription.STATES.ACTIVE
  }
});
