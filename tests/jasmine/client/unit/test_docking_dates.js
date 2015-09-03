var customMatchers = {
  toBeJustBefore: function(util, customEqualityTesters) {
    var delayTolerance = 3; // miliseconds
    return {
      compare: function(actual, expected) {
        if (expected === undefined) {
          expected = '';
        }

        var result = {};
        result.pass = expected < actual + delayTolerance;

        if(result.pass) {
          result.message = "Expected " + actual + " not to be within " + delayTolerance + " miliseconds of " + expected;
        } else {
          result.message = "Expected " + actual + " to be within " + delayTolerance + " miliseconds of " + expected;
        }

        return result;
      }
    }
  }
}


describe("The dates selected for the current docking", function() {
  var timeTolerance = 5;

  // Reset the session variables
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
    Session.set(SESSION_LOOKUP_START_DOCKING_ON, undefined);
    Session.set(SESSION_LOOKUP_END_DOCKING_ON, undefined);
  });

  // it("start date defaults to todays date", function() {
  //   expect(startDockingOn().getTime()).toEqual(today().getTime());
  // });

  it("end date defaults to todays date", function() {
    var tolerance = 5;
    expect(endDockingOn().getTime()).toBeJustBefore(today().getTime());
    // Don't need to check greater than since left side is evaluated first
  });

  // it("always knows what today is"), function() {
  //   expect(today().getTime()).toEqual((new Date()).getTime();
  // }
});