describe("homepage", function() {
  'use strict';

  it("shows SpaceCadet heading", function() {
    expect($('h1').text()).toContain('SpaceCadet');
  });

  it("sets all users logged out by default", function() {
    expect(Meteor.userId()).toBeNull();
  });

  // beforeEach(function () {
  //   MeteorStubs.install();
  //   mock(window, 'Stations');
  // });

  // afterEach(function () {
  //   MeteorStubs.uninstall();
  // });

  // it("shows all Stations", function() {
  //   var result = [
  //     { name: "test" }
  //   ];

  //   spyOn(Stations, 'find').and.returnValue(result);

  //   var _numStations = $('h2').size();
  //   expect(_numStations).toEqual(result.length);
  // });
});