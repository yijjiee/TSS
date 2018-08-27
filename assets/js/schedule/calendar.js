// $(function() {
//   // page is now ready, initialize the calendar...
//   $('#calendar').fullCalendar({
//     // Sizing
//     height: "auto",
//
//     // View of Calendar (Week, Day)
//     defaultView: "agendaWeek",
//
//     // Toolbar Appearance
//     header: {
//       left: '',
//       center: 'title',
//       right: 'agendaDay, agendaWeek',
//     },
//
//     titleFormat: ' ',
//     buttonText: {
//       week: 'Week',
//       day: 'Day',
//     },
//
//     allDaySlot: false,
//
//     // Time Appearance
//     slotLabelFormat: 'HH:mm',
//     minTime: '08:30',
//
//     // Day Appearance
//     hiddenDays: [0],
//     columnHeaderFormat: 'dddd',
//   })
// });

let content_array = [];

$(document).ready(function () {
  $("#calendar").html(generateCalendar("weekView"));

  $("#myfile").change(load_file);

  if (new Date().getMonth() > 6)
    $(".header-title").text(new Date().getFullYear() + 1 + " S2");
  else
    $(".header-title").text(new Date().getFullYear() + " S1");

});

function check_generate_calendar(calendarView) {
  if ($("#calendar").data("calendar-view") == calendarView)
    return;
  else {
    $("#calendar").html(generateCalendar(calendarView));
  }
}

function prev() {
  let day = $("#day_header").data("day");

  if (day != "0") {
    let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    $("#day_header").data("day", day-1);
    $("#day_header").text(days_array[day-1]);


    //loading of all the data content
  }
}

function next() {
  let day = $("#day_header").data("day");

  if (day != "5") {
    let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    $("#day_header").data("day", day+1);
    $("#day_header").text(days_array[day+1]);


    //loading of all the data content
  }
}

function generateCalendar(calendarView) {
  let time_slots = [];

  for (let i = 830; i < 2400; i += 100) {
    if (i < 1000)
      time_slots.push("0" + i);
    else
      time_slots.push(i)
  }

  let return_string = "<div class='calendar_table'>";
  if (calendarView == "weekView") {
    $(".nav-wrapper").removeAttr("style");
    $("#day-btn").removeClass("btn-dark").addClass("btn-outline-dark");
    $("#week-btn").removeClass("btn-outline-dark").addClass("btn-dark");

    let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return_string += "<div class='ct_row'><div class='time_slot'> </div>";
    for (let i = 0; i < days_array.length; i++)
      return_string += "<div class='day_slot'>" + days_array[i] + "</div>";
    return_string += "</div>";

    for (let i = 0; i < time_slots.length; i++) {
      return_string += "<div class='ct_row'>";
      for (let j = 0; j <= days_array.length; j++) {
        if (j == 0)
          return_string += "<div class='time_slot'>" + time_slots[i] + "</div>";
        else
          return_string += "<div class='weekly_content' data-row=" + (i+1) +" data-column=" + j + " data-overflow='false'></div>";
      }
      return_string += "</div>";
    }
    $("#calendar").data("calendar-view", "weekView");
  } else if (calendarView == "dayView") {
    $(".nav-wrapper").css("display", "inline");
    $("#week-btn").removeClass("btn-dark").addClass("btn-outline-dark");
    $("#day-btn").removeClass("btn-outline-dark").addClass("btn-dark");

    return_string += "<tr><td></td><td id='day_header' class='day_slot' data-day='0'>Monday</td>";

    for (let i = 0; i < time_slots.length; i++) {
      return_string += "<tr>";
      for (let j = 0; j < 2; j++) {
        if (j == 0)
          return_string += "<td class='time_slot'>" + time_slots[i] + "</td>";
        else
          return_string += "<td class='daily_content' data-row=" + i +" data-column=" + j + " data-overflow=false></td>";
      }
      return_string += "</tr>";
    }

    return_string += "</tr>";
    $("#calendar").data("calendar-view", "dayView");
  }
  return_string += "</div>";
  return return_string;
}


function choose_file() {
  $("#myfile").click();
}

function load_file() {
  let file = $("#myfile")[0].files[0];
  if (file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      let days_array = ["M", "T", "W", "TH", "F", "S"];
      let lines = event.target.result.split("\r\n");

      // $(".header-title").text(lines[0].slice(0, 4) + " S" + lines[0].slice(4, 5));
      for (let i = 0; i < lines.length; i++) {
        let next; if (i+1 <= lines.length) next = lines[i+1];
        let day = lines[i].slice(19, 21).trim();
        let start_time = lines[i].slice(21, 23) + "" + lines[i].slice(24, 26);
        let end_time = lines[i].slice(26, 28) + "" + lines[i].slice(29, 31);
        let table_column = days_array.indexOf(day) + 1;
        let table_row = (16 - (2330 - parseInt(start_time)) / 100);

        let module_code = lines[i].slice(5, 11).trim();
        let lesson_type = lines[i].slice(11, 14).trim();
        let group = lines[i].slice(14, 19).trim();
        let venue = lines[i].slice(31, 51).trim();

        let duration = 1;

        if (next) {
          let next_day = next.slice(19, 21).trim();
          let next_start_time = next.slice(21, 23) + "" + next.slice(24, 26);
          let next_end_time = next.slice(26, 28) + "" + next.slice(29, 31);
          let next_module = next.slice(5, 11).trim();
          let next_lesson_type = next.slice(11, 14).trim();
          let next_group = next.slice(14, 19).trim();
          let next_venue = next.slice(31, 51).trim();


          if (day == next_day && module_code == next_module && lesson_type == next_lesson_type && group == next_group && venue == next_venue && end_time == next_start_time) {
            duration = (parseInt(next_end_time) - parseInt(start_time)) / 100;
            i+=1;
          }
        }

        content_array.push(JSON.parse('{ "module_code" : "' + module_code + '", "lesson_type" : "' + lesson_type + '", "group" : "' + group
          + '", "venue" : "' + venue + '", "day" : "' + day + '", "start_time" : "' + start_time + '", "duration" : "' + duration + '", "table_row" : "' + table_row + '", "table_col" : "' + table_column + '"}'));

        let element = $("[data-row='" + table_row + "'][data-column='" + table_column + "']");
        let next_element = $("[data-row='" + (table_row+1) + "'][data-column='" + table_column + "']");

        $(element).append("<p data-toggle='modal' data-target='#exampleModal' onclick='view_details(this)' id='" + group + "' class='" + lesson_type + "' title='" + lesson_type + "-" + module_code + "'>" + lesson_type + "</p>");
      }
    };
  }
}


function save_changes() {

}

function view_details(element) {
  if (content_array.length != 0) {
    let row = $(element).parent().data("row");
    let column = $(element).parent().data("column");
    let group = $(element).attr("id");
    let temp = $(element).attr("title").split("-");
    let module_code = temp[1].trim();
    let lesson_type = temp[0].trim();

    console.log(row + " " + column + " " + group + " " + module_code + " " + lesson_type);

    for (let i = 0; i < content_array.length; i++) {
      let ele = content_array[i];
      if (ele.module_code == module_code && ele.group == group && ele.lesson_type == lesson_type && ele.table_row == row && ele.table_col == column)
        $("#exampleModal > .modal-dialog > .modal-content > .modal-body").html("<p>" + content_array[i].module_code + " " + content_array[i].lesson_type + " " + content_array[i].group + " "
          + content_array[i].venue + " " + content_array[i].day + " " + content_array[i].start_time + " " + content_array[i].duration + "</p>");
    }
  }
}
