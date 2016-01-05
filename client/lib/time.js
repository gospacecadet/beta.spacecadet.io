Template.registerHelper("hours", function () {
  return [
    {name: "12AM", value: 0},
    {name: "1AM", value: 1},
    {name: "2AM", value: 2},
    {name: "3AM", value: 3},
    {name: "4AM", value: 4},
    {name: "5AM", value: 5},
    {name: "6AM", value: 6},
    {name: "7AM", value: 7},
    {name: "8AM", value: 8},
    {name: "9AM", value: 9},
    {name: "10AM", value: 10},
    {name: "11AM", value: 11},
    {name: "12PM", value: 12},
    {name: "1PM", value: 13},
    {name: "2PM", value: 14},
    {name: "3PM", value: 15},
    {name: "4PM", value: 16},
    {name: "5PM", value: 17},
    {name: "6PM", value: 18},
    {name: "7PM", value: 19},
    {name: "8PM", value: 20},
    {name: "9PM", value: 21},
    {name: "10PM", value: 22},
    {name: "11PM", value: 23},
  ]
})

Template.registerHelper("minutes", function () {
  return [
    {name: "00", value: 0},
    {name: "15", value: 15},
    {name: "30", value: 30},
    {name: "45", value: 45},
  ]
})
