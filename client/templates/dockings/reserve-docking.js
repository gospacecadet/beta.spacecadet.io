Template.reserveDocking.events({
  "click .removeBooking": function(event, template) {
    Mart.LineItem.remove(this._id)
  }
});
