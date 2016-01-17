Template.threadSendMessage.events({
  "submit #send-message-form": function(event, template) {
    event.preventDefault();

    var message = {
      recipientId: this.recipientId(),
      body: $(event.target).find('#send-message-body').val(),
    }

    Talk.send(message)
  }
});
