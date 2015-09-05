describe("homepage", function() {
  it("shows SpaceCadet heading", function() {
    expect($('h1').text()).toContain('SpaceCadet');
  });

  // it("sets all users logged out by default", function() {
  //   expect(Meteor.userId()).toBeNull();
  // });
});