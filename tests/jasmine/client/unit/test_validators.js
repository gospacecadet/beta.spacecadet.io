describe("Email validation", function() {
  it("works for some common emails", function() {
    var emails = ["marvin.m.arnold@gmail.com", "marvin@unplugged.im", "marvin@ostel.co"]
    for(var i = 0; i < emails.length; i++) {
      var email = emails[i];
      // expect(isValidEmail(email)).toEqual(true);
      expect(true).toBe(false);
    }
  });
});