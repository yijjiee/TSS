$(function() {

  // page is now ready, initialize the calendar...

  $('#calendar').fullCalendar({
    // Sizing
    height: "auto",

    // View of Calendar (Week, Day)
    defaultView: "agendaWeek",

    // Toolbar Appearance
    header: {
      left: '',
      center: 'title',
      right: 'agendaDay, agendaWeek',
    },

    titleFormat: ' ',
    buttonText: {
      week: 'Week',
      day: 'Day',
    },

    allDaySlot: false,

    // Time Appearance
    slotLabelFormat: 'HH:mm',
    minTime: '08:30',

    // Day Appearance
    hiddenDays: [0],
    columnHeaderFormat: 'dddd',
  })

});
