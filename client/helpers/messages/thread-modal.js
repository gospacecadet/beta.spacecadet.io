Template.threadModal.helpers({
  recipientName: function() {
    var recipientId = this.recipientId()

    if(!recipientId)
      return

    var recipient = Meteor.users.findOne(recipientId)

    if(recipient && recipient.profile)
      return recipient.profile.firstName + " " + recipient.profile.lastName;
  }
});
