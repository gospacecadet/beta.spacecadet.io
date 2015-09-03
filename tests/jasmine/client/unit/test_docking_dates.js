// var customMatchers = {
//   toBeJustBefore: function(util, customEqualityTesters) {
//     var delayTolerance = 0; // miliseconds
//     return {
//       compare: function(actual, expected) {
//         if (expected === undefined) {
//           expected = '';
//         }

//         var result = {};
//         result.pass = expected < actual + delayTolerance;

//         if(result.pass) {
//           result.message = "Expected " + actual + " not to be within " + delayTolerance + " miliseconds of " + expected;
//         } else {
//           result.message = "Expected " + actual + " to be within " + delayTolerance + " miliseconds of " + expected;
//         }

//         return result;
//       }
//     }
//   }
// }

describe("The dates selected for the current docking", function() {
  // Reset the session variables
  // beforeEach(function() {
    // jasmine.addMatchers(customMatchers);
    // Session.set(SESSION_LOOKUP_START_DOCKING_ON, undefined);
    // Session.set(SESSION_LOOKUP_END_DOCKING_ON, undefined);
  // });

  // it("start date defaults to todays date", function() {
  //   expectDefaultDate(startDockingOn().getTime());
  // });

  // it("end date defaults to todays date", function() {
  //   expectDefaultDate(endDockingOn().getTime());
  // });

  it("always knows what today is", function() {
    // var today = today().getTime();
    // var now = (new Date()).getTime();
    // expect(today).toBeJustBefore(now);
    expect(true).toBe(false);
  }

  // var expectDefaultDate = function(date) {
  //   expect(date).toBeJustBefore(today().getTime());
  // }
});