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

// let content_array = [];
//
// $(document).ready(function () {
//   $("#calendar").html(generateCalendar("weekView"));
//
//   $("#myfile").change(load_file);
//
//   if (new Date().getMonth() > 6)
//     $(".header-title").text(new Date().getFullYear() + 1 + " S2");
//   else
//     $(".header-title").text(new Date().getFullYear() + " S1");
//
// });
//
// function check_generate_calendar(calendarView) {
//   if ($("#calendar").data("calendar-view") == calendarView)
//     return;
//   else {
//     $("#calendar").html(generateCalendar(calendarView));
//   }
// }
//
// function prev() {
//   let day = $("#day_header").data("day");
//
//   if (day != "0") {
//     let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//
//     $("#day_header").data("day", day-1);
//     $("#day_header").text(days_array[day-1]);
//
//
//     //loading of all the data content
//   }
// }
//
// function next() {
//   let day = $("#day_header").data("day");
//
//   if (day != "5") {
//     let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//
//     $("#day_header").data("day", day+1);
//     $("#day_header").text(days_array[day+1]);
//
//
//     //loading of all the data content
//   }
// }
//
// function generateCalendar(calendarView) {
//   let time_slots = [];
//
//   for (let i = 830; i < 2400; i += 100) {
//     if (i < 1000)
//       time_slots.push("0" + i);
//     else
//       time_slots.push(i)
//   }
//
//   let return_string = "<div class='calendar_table'>";
//   if (calendarView == "weekView") {
//     $(".nav-wrapper").removeAttr("style");
//     $("#day-btn").removeClass("btn-dark").addClass("btn-outline-dark");
//     $("#week-btn").removeClass("btn-outline-dark").addClass("btn-dark");
//
//     let days_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//
//     return_string += "<div class='ct_row'><div class='time_slot'> </div>";
//     for (let i = 0; i < days_array.length; i++)
//       return_string += "<div class='day_slot'>" + days_array[i] + "</div>";
//     return_string += "</div>";
//
//     for (let i = 0; i < time_slots.length; i++) {
//       return_string += "<div class='ct_row'>";
//       for (let j = 0; j <= days_array.length; j++) {
//         if (j == 0)
//           return_string += "<div class='time_slot'>" + time_slots[i] + "</div>";
//         else
//           return_string += "<div class='weekly_content' data-row=" + (i+1) +" data-column=" + j + " data-overflow='false'></div>";
//       }
//       return_string += "</div>";
//     }
//     $("#calendar").data("calendar-view", "weekView");
//   } else if (calendarView == "dayView") {
//     $(".nav-wrapper").css("display", "inline");
//     $("#week-btn").removeClass("btn-dark").addClass("btn-outline-dark");
//     $("#day-btn").removeClass("btn-outline-dark").addClass("btn-dark");
//
//     return_string += "<tr><td></td><td id='day_header' class='day_slot' data-day='0'>Monday</td>";
//
//     for (let i = 0; i < time_slots.length; i++) {
//       return_string += "<tr>";
//       for (let j = 0; j < 2; j++) {
//         if (j == 0)
//           return_string += "<td class='time_slot'>" + time_slots[i] + "</td>";
//         else
//           return_string += "<td class='daily_content' data-row=" + i +" data-column=" + j + " data-overflow=false></td>";
//       }
//       return_string += "</tr>";
//     }
//
//     return_string += "</tr>";
//     $("#calendar").data("calendar-view", "dayView");
//   }
//   return_string += "</div>";
//   return return_string;
// }
//
//
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

      let ce_array = '{"CEMods":[', cz_array = '{"CZMods":[', cze_array = '{"CZEMods":[';

      // $(".header-title").text(lines[0].slice(0, 4) + " S" + lines[0].slice(4, 5));
      for (let i = 0; i < lines.length; i++) {
        let next; if (i+1 <= lines.length) next = lines[i+1];
        let day = lines[i].slice(19, 21).trim();
        let start_time = lines[i].slice(21,26); //lines[i].slice(21, 23) + "" + lines[i].slice(24, 26);
        let end_time = lines[i].slice(26, 31); //lines[i].slice(26, 28) + "" + lines[i].slice(29, 31);
        let table_column = days_array.indexOf(day) + 1;
        let table_row = (16 - (2330 - parseInt(start_time)) / 100);

        let module_code = lines[i].slice(5, 11).trim();
        let lesson_type = lines[i].slice(11, 14).trim();
        let group = lines[i].slice(14, 19).trim();
        let venue = lines[i].slice(31, 51).trim();

        let duration = 1;

        if (next) {
          let next_day = next.slice(19, 21).trim();
          let next_start_time = next.slice(21, 26);
          let next_end_time = next.slice(26, 31);
          let next_module = next.slice(5, 11).trim();
          let next_lesson_type = next.slice(11, 14).trim();
          let next_group = next.slice(14, 19).trim();
          let next_venue = next.slice(31, 51).trim();


          if (day == next_day && module_code == next_module && lesson_type == next_lesson_type && group == next_group && venue == next_venue && end_time == next_start_time) {
            duration = (parseInt(next_end_time) - parseInt(start_time));
            i+=1;
          }
        }

        let module_type = module_code.slice(0,2);
        if (module_type == "CE") {
          if (i != 0)
            ce_array += ',';
          ce_array += '{"id":"' + i + ',"module_code":"' + module_code + '", "lesson_type":"' + lesson_type + '", "venue":"' + venue + '", "group_index":"' + group + '", "start_time": "' + start_time + '", "duration":"' + duration + '"}';
        } else if (module_type == "CZ") {
          if (i != 0)
            cz_array += ',';
          cz_array += '{"id":"' + i + ',"module_code":"' + module_code + '", "lesson_type":"' + lesson_type + '", "venue":"' + venue + '", "group_index":"' + group + '", "start_time": "' + start_time + '", "duration":"' + duration + '"}';
        } else {
          if (i != 0)
            cze_array += ',';
          cze_array += '{"id":"' + i + ',"module_code":"' + module_code + '", "lesson_type":"' + lesson_type + '", "venue":"' + venue + '", "group_index":"' + group + '", "start_time": "' + start_time + '", "duration":"' + duration + '"}';
        }

        let day_index = days_array.indexOf(day);
        let time_slots = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
        let time_index = time_slots.indexOf(start_time);
        let shift_left = 0;


        // First condition: Is current position taken? Yes -> Shift 72px, No -> Second condition
        // Second condition: Is duration 1 or more? 1 -> Third condition, More -> Fourth condition
        // Third condition: Is the element one earlier a longer duration slot? Yes -> Shift 72px, No -> Append element
        // Fourth condition: Is there any element on a later slot during the duration? Yes -> Shift 72px, No -> Third condition
        if (duration == 1) {
          let condition = false;
          let currDay = $("#weekly_planner > .day_placeholder > .event_placeholder > .events_group:nth(" + day_index + ")");
          do {
            if (time_index == 0) {
              if (currDay.find("[style*='left: " + shift_left + "px;']").length == 0) {
                condition = true;
                break;
              }
              shift_left += 47;
            } else {
              let prev = currDay.find("[style*='top: " + ((time_index-1)*35) + "px; left: " + shift_left + "px;']");
              if (currDay.find("[style*='top: " + (time_index*35) + "px; left: " + shift_left + "px;']").length == 0 && (prev.length == 0 || prev.data("duration") == 1)) {
                condition = true;
                break;
              }
              shift_left += 47;
            }
          } while(!condition);
        } else {
          let condition = false;
          let currDay = $("#weekly_planner > .day_placeholder > .event_placeholder > .events_group:nth(" + day_index + ")");
          do {
            let prev = currDay.find("[style*='top: " + ((time_index-1)*35) + "px; left: " + shift_left + "px;']");
            let next = currDay.find("[style*='top: " + ((time_index+1)*35) + "px; left: " + shift_left + "px;']");
            if (time_index == 0) {
              if (currDay.find("[style*='left: " + shift_left + "px;']").length == 0 && next.length == 0) {
                condition = true;
                break;
              }
              shift_left += 47;
            } else {
              if (currDay.find("[style*='top: " + (time_index*35) + "px; left: " + shift_left + "px;']").length == 0 && next.length == 0 && (prev.length == 0 || prev.data("duration") == 1)) {
                condition = true;
                break;
              }
              shift_left += 47;
            }
          } while (!condition);
        }


        let currentDiv = document.createElement("div");
        $(currentDiv).attr("draggable", true);
        $(currentDiv).addClass("single_event");
        $(currentDiv).attr("data-lessontype", lesson_type);
        $(currentDiv).attr("data-duration", duration);
        $(currentDiv).css("top", (time_index*35) + "px");
        $(currentDiv).css("left", shift_left + "px");
        $(currentDiv).css("height", ((duration*35)-1) + "px");
        $(currentDiv).html(module_code);

        if (duration == 1)
          $("#weekly_planner > .day_placeholder:nth(" + day_index + ") > .event_placeholder > .events_group > ." + time_index).append(currentDiv);
        else
          $("#weekly_planner > .day_placeholder:nth(" + day_index + ") > .event_placeholder > .events_group > ." + time_index).prepend(currentDiv);
        //onAddedElements($("#test-calendar > .event_slots > ul > .day > ul:nth(" + day_index + ")"));
//         content_array.push(JSON.parse('{ "module_code" : "' + module_code + '", "lesson_type" : "' + lesson_type + '", "group" : "' + group
//           + '", "venue" : "' + venue + '", "day" : "' + day + '", "start_time" : "' + start_time + '", "duration" : "' + duration + '", "table_row" : "' + table_row + '", "table_col" : "' + table_column + '"}'));
//
//         let element = $("[data-row='" + table_row + "'][data-column='" + table_column + "']");
//         let next_element = $("[data-row='" + (table_row+1) + "'][data-column='" + table_column + "']");
//
//         $(element).append("<p data-toggle='modal' data-target='#exampleModal' onclick='view_details(this)' id='" + group + "' class='" + lesson_type + "' title='" + lesson_type + "-" + module_code + "'>" + lesson_type + "</p>");
      }

      ce_array += ']}'; cz_array += ']}'; cze_array += ']}';
      JSON.parse(ce_array); // JSON.parse(cz_array); JSON.parse(cze_array);
    };
  }
}

function shift_elements(current, start_time_index) {
  let parent = $("#weekly_planner > .event_placeholder > .events_group > ." + start_time_index);
  if ($(current).data("duration") == 1) {
    if ($(parent).children.length == 0) { $(parent).append(current); }
    else {

    }
  }
}
//
//
// function save_changes() {
//
// }
//
// function view_details(element) {
//   if (content_array.length != 0) {
//     let row = $(element).parent().data("row");
//     let column = $(element).parent().data("column");
//     let group = $(element).attr("id");
//     let temp = $(element).attr("title").split("-");
//     let module_code = temp[1].trim();
//     let lesson_type = temp[0].trim();
//
//     console.log(row + " " + column + " " + group + " " + module_code + " " + lesson_type);
//
//     for (let i = 0; i < content_array.length; i++) {
//       let ele = content_array[i];
//       if (ele.module_code == module_code && ele.group == group && ele.lesson_type == lesson_type && ele.table_row == row && ele.table_col == column)
//         $("#exampleModal > .modal-dialog > .modal-content > .modal-body").html("<p>" + content_array[i].module_code + " " + content_array[i].lesson_type + " " + content_array[i].group + " "
//           + content_array[i].venue + " " + content_array[i].day + " " + content_array[i].start_time + " " + content_array[i].duration + "</p>");
//     }
//   }
// }

$(document).ready(function () {
  $("#myfile").change(load_file);

  let time_slots = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
  let day_slots = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let i = 0; i < day_slots.length; i++) {
    $("#weekly_planner").append("<div class='day_placeholder'>" +
        "<div class='day_title'>" + day_slots[i] + "</div>" +
        "<div class='time_placeholder'></div>" +
        "<div class='event_placeholder'>" +
          "<div class='event_background_lines'></div>" +
          "<div class='events_group'></div>" +
        "</div>" +
      "</div>");
  }
  for (let i = 0; i < time_slots.length; i++) {
    $("#weekly_planner > .day_placeholder > .time_placeholder").append("<p>" + time_slots[i] + "</p>");
    $("#weekly_planner > .day_placeholder > .event_placeholder > .events_group").append("<div class='" + i + "'></div>");
    $("#weekly_planner > .day_placeholder > .event_placeholder > .event_background_lines").append("<span>&emsp;</span>");
  }

  //$("#weekly_planner > .day_placeholder > .event_placeholder > .events_group:nth(0) > .0").append("<div class='single_event LEC'>CZ1005</div>");
});
