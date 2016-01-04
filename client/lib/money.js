Template.registerHelper("money", function (priceInCents) {
  return accounting.formatMoney(priceInCents/100)
})
