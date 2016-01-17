Template.threadModal.helpers({
  recipientName: function() {
    console.log('recipientName');
    console.log(this);
    console.log(this.recipientId());
    var recipientId = this.recipientId()

    if(!recipientId)
      return

    var recipient = Meteor.users.findOne(recipientId)

    if(recipient && recipient.profile)
      return recipient.profile.firstName + " " + recipient.profile.lastName;
    // return 'marvin'
  }
});
