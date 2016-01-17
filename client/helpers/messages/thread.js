Template.thread.helpers({
  messages: function() {
    if(this._id)
      return Talk.Messages({threadId: this._id})
  },
  userId: function() {
    return Meteor.userId()
  }
});
