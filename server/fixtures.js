Meteor.startup(function() {
  if(Mart.Storefronts.find().count() === 0) {
    let merchantId = Accounts.createUser({
      email: "merchant@spacecadet.io",
      password: "spacecadet",
      profile: {
        firstName: 'Steven',
        lastName: "Quintanilla",
      }
    });

    for(let i = 0; i < 20; i++) {
      Mart.Storefronts.insert({
        name: "Test",
        description: "A description goes here.",
        isPublished: true,
        isDeleted: false,
        address: "123 Fake St",
        zip: "70113",
        state: "LA",
        city: "New Orleans",
        userId: merchantId
      })
    }
  }
});
