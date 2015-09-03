describe("homepage", function(){
  it("shows 'SpaceCadet' heading", function(){
    expect($('h1').text()).toContain('SpaceCadet');
  });
});