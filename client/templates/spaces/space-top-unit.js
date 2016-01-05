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
