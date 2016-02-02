Template.subscriptions.onCreated(function() {
  this.subscribe('mart/subscriptions')
})

Template.subscriptionsForbid.onCreated(function() {
  if(!Meteor.userId())
    forbid()
})
