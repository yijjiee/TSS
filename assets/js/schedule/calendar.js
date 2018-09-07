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
        let start_time = lines[i].slice(21,26); //lines[i].slice(21, 23) + "" + lines[i].slice(24, 26);
        let end_time = lines[i].slice(26, 31); //lines[i].slice(26, 28) + "" + lines[i].slice(29, 31);
        let table_column = days_array.indexOf(day) + 1;
        let table_row = (16 - (2330 - parseInt(start_time)) / 100);

        let module_code = lines[i].slice(5, 11).trim();
        let lesson_type = lines[i].slice(11, 14).trim();
        let group = lines[i].slice(14, 19).trim();
        let venue = lines[i].slice(31, 51).trim();
        let lesson_on_week = [];
        for (let j = 51; j < 64; j++) {
          lesson_on_week.push(lines[i].slice(j, j+1));
        }

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

        /* Module Object Creation */
        let module_type = module_code.slice(0,2);
        let module_year = module_code.slice(2,3);


        let day_index = days_array.indexOf(day);
        let time_slots = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
        let time_index = time_slots.indexOf(start_time);


        let currentDiv = document.createElement("div");
        $(currentDiv).attr("draggable", true);
        $(currentDiv).attr("id", "event_" + i);
        $(currentDiv).addClass("single_event");
        $(currentDiv).attr("data-lessontype", lesson_type);
        $(currentDiv).attr("data-duration", duration);
        $(currentDiv).attr("data-yearmod", module_year);
        $(currentDiv).attr("ondragstart", "drag(event)");
        $(currentDiv).html(duration + "H/ " + module_code + "<br />" + venue + " - " + group);

        if ($("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ")").children(".single_event").length < 5)
          $("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ")").append(currentDiv);
        else {
          $(currentDiv).css("display", "none");
          $("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ")").append(currentDiv);
        }

        if ($("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ")").children(".single_event").length == 5)
          $("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ") > .show_more_btn").css("display", "block");
      }
    };
  }
}

function add_module(ev) {
  ev.preventDefault();
  let element = ev.target;
  let day = ev.dataTransfer.getData("day_slot");
  let time = ev.dataTransfer.getData("time_slot");
  if ($(element).hasClass("single_event") || $(element).hasClass("more_events")) {
    element = ev.target.parentNode;
  }
  if ($(element).data("day") != day || $(element).parent().data("timeslot") != time) {
    let id = ev.dataTransfer.getData("elementID");
    element.prepend(document.getElementById(id));
    let events = element.getElementsByClassName("single_event");
    if (events.length > 5) {
      $(events).siblings(".single_event:visible").last().css("display", "none");
      $(events).siblings(".show_more_btn:hidden").css("display", "block");
    }
  }

  let prev = $(".day_placeholder[data-timeslot='"+ time +"'] > .events_group[data-day='" + day + "']");
  $(prev).find(".single_event:hidden:nth(0)").css("display", "block");
  if (prev.children(".single_event").length < 5)
    $(prev).find(".show_more_btn:visible").css("display", "none");
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("elementID", ev.target.id);
  ev.dataTransfer.setData("day_slot", $(ev.target.parentNode).data("day"));
  ev.dataTransfer.setData("time_slot", $(ev.target.parentNode).parent().data("timeslot"));
}
//
//
// function save_changes() {
//
// }
//
function show_details(element) {
  let time_array = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
  let day_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let day = $(element).parent().data("day");
  let time_slot = $(element).parent().parent().data("timeslot");


  $("#details_modal .modal-title").html(day_array[day-1] + " - " + time_array[time_slot]);
  $("#details_modal").modal("show");
}

$(document).ready(function () {
  $("#myfile").change(load_file);

  let time_slots = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
  let day_slots = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  for (let i = 0; i < day_slots.length; i++) {
    $("#weekly_planner > .header").append("<div class='day_title'>" + day_slots[i] + "</div>");
  }
  for (let i = 0; i < time_slots.length; i++) {
    let temp_div = document.createElement("div");
    $(temp_div).addClass("content_group");
    $(temp_div).html("<span class='event_time'>" + time_slots[i] + "</span>" +
      "<div class='day_placeholder' data-timeslot='" + i + "'>" +
      "<div class='events_group' data-day='1' ondrop='add_module(event);' ondragover='allowDrop(event);'><span onclick='show_details(this)' class='show_more_btn' style='display: none;'>More &#10148;</span></div>" +
      "<div class='events_group' data-day='2' ondrop='add_module(event);' ondragover='allowDrop(event);'><span onclick='show_details(this)' class='show_more_btn' style='display: none;'>More &#10148;</span></div>" +
      "<div class='events_group' data-day='3' ondrop='add_module(event);' ondragover='allowDrop(event);'><span onclick='show_details(this)' class='show_more_btn' style='display: none;'>More &#10148;</span></div>" +
      "<div class='events_group' data-day='4' ondrop='add_module(event);' ondragover='allowDrop(event);'><span onclick='show_details(this)' class='show_more_btn' style='display: none;'>More &#10148;</span></div>" +
      "<div class='events_group' data-day='5' ondrop='add_module(event);' ondragover='allowDrop(event);'><span onclick='show_details(this)' class='show_more_btn' style='display: none;'>More &#10148;</span></div>" +
      "</div>");

    $("#weekly_planner > .content_placeholder").append(temp_div);
  }
});
