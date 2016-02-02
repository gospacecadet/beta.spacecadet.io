Template.subscriptions.helpers({
  subscriptions: function() {
    return Mart.Subscriptions.find({}, {sort: {createdAt: -1}})
  }
});
