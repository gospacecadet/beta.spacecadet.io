Template.spaceTopForUnit.events({
  "focus #hourly-start-date": function(event, template) {
    $("#hourly-start-date").datepicker();
  },
  "focus #daily-start-date": function(event, template) {
    $("#daily-start-date").datepicker();
  },
  "focus #monthly-start-date": function(event, template) {
    $("#monthly-start-date").datepicker();
  }
});

Template.spaceTopForUnit.helpers({
  hourlyNums: function() {
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  },
  dailyNums: function() {
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
  },
  monthlyNums: function() {
    return [1,2,3,4,5,6,7,8,9,10,11,12]
  }
});

Template.spaceTopImageAndButtons.helpers({
  currentUnit: function() {
    return Mart.Product.UNITS.DAY
  },
  currentQuantity: function() {
    return 2
  },
  currentDate: function() {
    return '01/27/2016'
  },
  currentHour: function() {
    return 10
  },
  currentMinute: function() {
    return 15
  }
});

Template.spaceTopImageAndButtons.events({
  "click .logged-out": function(event, template) {
     event.preventDefault()

     sAlert.error("You must log in first")
  }
});

Template.spaceTopImageAndButtons.onCreated(function() {
  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    after: {
      insert: function(error, result) {
        sAlert.success("Added to cart")
      }
    },
    onError: function(operation, error) {
      if(error) {
        console.log(error);
        sAlert.error('Could not add item to cart')
      }
    }
  };
  AutoForm.addHooks(['insertLineItemForm'], hooksObject);
})
