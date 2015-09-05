var customMatchers = {
  toBeJustBefore: function(util, customEqualityTesters) {
    var delayTolerance = 10; // miliseconds
    return {
      compare: function(actual, expected) {
        if (expected === undefined) {
          expected = '';
        }

        var result = {};
        result.pass = expected <= actual + delayTolerance;

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

describe("The current docking", function() {
  describe('set dates', function() {
    var _randomDate;

    beforeEach(function() {
      var _day = Math.floor((Math.random() * 28) + 1);
      var _month = Math.floor((Math.random() * 12) + 1);
      var _year = Math.floor((Math.random() * 2015) + 1);
      _randomDate = new Date(_year, _month, _day);
    });

    it("can have its start date set", function() {
      setStartDockingOn(_randomDate);
      expect(getStartDockingOn()).toEqual(_randomDate);
    });

    it("can have its end date set", function() {
      setEndDockingOn(_randomDate);
      expect(getEndDockingOn()).toEqual(_randomDate);
    });

    it("always knows what today is", function() {
      jasmine.addMatchers(customMatchers);
      var _today = today().getTime();
      var _now = (new Date()).getTime();
      expect(_today).toBeJustBefore(_now);
    });
  });
});

describe("The current docking is undefined", function() {
  // Reset the session variables
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
    Session.set(SESSION_LOOKUP_START_DOCKING_ON, undefined);
    Session.set(SESSION_LOOKUP_END_DOCKING_ON, undefined);
  });

  it("start date defaults to todays date", function() {
    expectDefaultDate(getStartDockingOn().getTime());
  });

  it("end date defaults to todays date", function() {
    expectDefaultDate(getEndDockingOn().getTime());
  });

  var expectDefaultDate = function(date) {
    expect(date).toBeJustBefore(today().getTime());
  }
});