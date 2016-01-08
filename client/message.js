Template.threadSendMessage.events({
  "submit #send-message-form": function(event, template){
    event.preventDefault()

    console.log('sending message');
  }
});

Template.thread.helpers({
  recipientName: function() {
    console.log('recipientName');
    console.log(this);
  }
});
