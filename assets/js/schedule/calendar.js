/** Global Variables **/

let modules = [];
let event_id = 0;

/** End of Global Variables **/

function choose_file() {
  if ($(".content_group > .day_placeholder >.events_group").find(".single_event").length != 0) {
    let resp = confirm("There are unsaved changes, are you sure you want to continue?");
    if (!resp)
      return;
  }
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
      for (let i = 0; i < lines.length; i++,event_id++) {
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
        let lesson_week = [];
        for (let j = 51; j < 64; j++) {
          lesson_week.push(lines[i].slice(j, j+1));
        }

        let lesson_weeks_type = "";
        if (lesson_week[1] == "N" && lesson_week[3] == "N" && lesson_week[5] == "N" && lesson_week[7] == "N" && lesson_week[9] == "N" && lesson_week[11] == "N")
          lesson_weeks_type = "ODD";
        else if (lesson_week[0] == "N" && lesson_week[2] == "N" && lesson_week[4] == "N" && lesson_week[6] == "N" && lesson_week[8] == "N" && lesson_week[10] == "N" && lesson_week[12] == "N")
          lesson_weeks_type = "EVEN";

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
        $(currentDiv).attr("data-weektype", lesson_weeks_type);
        $(currentDiv).attr("data-venue", venue);
        $(currentDiv).attr("data-group", group);
        $(currentDiv).attr("ondragstart", "drag(event)");
        $(currentDiv).html("<p>" + duration + "H/" +lesson_weeks_type + " " + module_code + "</p><p>" + venue + " - " + group + "</p>" +
          "<img src='/images/icons/cross.svg' onclick='removeElement(this)' style='position: absolute; right: 5px; top: 5px;' />");

        add_event(currentDiv, time_index, day_index, 1);
      }
    };
  }
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

  window.onbeforeunload = function(){
    return "";
  }

  create_planner($("#weekly_planner"), 0, 5, "08:30", "23:30", 1);

  $("#all_mods_modal").draggable({
    handle: ".modal-header"
  });

  let modules_length = $("#all_mods_modal > .modal-dialog > .modal-content > .modal-body > .modal_content > .modal_module").length;
  for (let i = 0; i < modules_length; i++) {
    let element = $("#all_mods_modal > .modal-dialog > .modal-content > .modal-body > .modal_content > .modal_module:nth(" + i + ")");
    let module = new Module($(element).data("modulecode"), $(element).data("name"), $(element).data("au"), $(element).data("cohort"));
    module.lessons = [];
    for (let j = 1; j < $(element).find(".lesson_info > .lesson > .form-control[name='lessontype'] > option").length; j++) {
      let lesson = $(element).find(".lesson_info > .lesson > .form-control[name='lessontype'] > option:nth(" + j + ")");
      module.lessons.push(new Lesson(lesson.data("lessonid"), module.code));
    }
    modules.push(module);
  }
});


function display_modules() {
  $("#all_mods_modal").modal("show");
}


function add_lesson(target) {
  let element = $(target).parent().siblings(".lesson_info");
  if ($(element).css("display") == "none") {
    $(element).css("display", "flex");
    $(target).attr("src", "/images/icons/minus.svg");
  } else {
    $(element).hide();
    $(target).attr("src", "/images/icons/plus.svg");
  }

  let mainElement = $(target).parent().parent();
  if (modules[$(mainElement).attr("id")].lessons.possible_venues == null) {
    $.ajax({
      url: "/lesson/show",
      method: "POST",
      data: {module_code: $(mainElement).data("modulecode")},
      success: function (res) {
        let lessons = res[1];
        for (let i = 0; i < lessons.length; i++) {
          let lesson = modules[$(mainElement).attr("id")].lessons.find(function(element) { return element.id == lessons[i].id ? element : null; });
          lesson.possible_venues = [], lesson.groups_assigned = [];
          for (let j = 0; j < lessons[i].possible_venues.length; j++) {
            let venue = lessons[i].possible_venues[j];
            lesson.possible_venues.push(new Venue(venue.id, venue.name, venue.venue_type, venue.capacity));
          }
          for (let j = 0; j < lessons[i].groups_assigned.length; j++) {
            let group = lessons[i].groups_assigned[j];
            lesson.groups_assigned.push(new Group(group.group_index, group.group_size));
          }
        }
      }
    });
  }
}

function check_lesson_duration(target) {
  $(target).siblings("select[name='duration']").empty();
  $(target).siblings("select[name='venue']").empty();
  for (let i = 0; i < target.value; i++) {
    $(target).siblings("select[name='duration']").append($("<option>", {value: (i+1), text: (i+1)}));
  }

  if ($(target).find(":selected").data("frequency") == "Alternate")
    $(target).siblings("select[name='weektype']").show();
  else
    $(target).siblings("select[name='weektype']").hide();

  let module = $(target).parent().parent().parent();
  let possible_venues = modules[$(module).attr("id")].lessons.find(function(element) { return element.id == $(target).find(":selected").data("lessonid") ? element : null; }).possible_venues;
  let groups_assigned = modules[$(module).attr("id")].lessons.find(function(element) { return element.id == $(target).find(":selected").data("lessonid") ? element : null; }).groups_assigned;
  for (let i = 0; i < possible_venues.length; i++) {
    $(target).siblings("select[name='venue']").append($("<option>", {value: possible_venues[i].id, text: possible_venues[i].name}));
  }
  for (let i = 0; i < groups_assigned.length; i++) {
    $(target).siblings("select[name='groups']").append($("<option>", {value: groups_assigned[i].group_index, text: groups_assigned[i].group_index}));
  }
  $(target).siblings("select[name='venue']").show();
  $(target).siblings("select[name='groups']").show();
}

function elementTransform(target) {
  let form_controls = $(target).siblings(".form-control");

  let module_code = $(target).parent().parent().parent().data("modulecode");
  let lesson_type = $(form_controls[0]).find(":selected").text();
  let duration = $(form_controls[1]).find(":selected").text();
  let lesson_weeks_type = "";
  if ($(form_controls[2]).css("display") == "block")
    lesson_weeks_type = $(form_controls[2]).find(":selected").text();
  let venue = $(form_controls[3]).find(":selected").text();
  let group = $(form_controls[4]).find(":selected").text();

  let currentDiv = document.createElement("div");
  $(currentDiv).attr("draggable", true);
  $(currentDiv).attr("id", "event_" + event_id);
  $(currentDiv).addClass("single_event");
  $(currentDiv).attr("data-lessontype", lesson_type);
  $(currentDiv).attr("data-duration", duration);
  $(currentDiv).attr("data-yearmod", module_code.slice(2,3));
  $(currentDiv).attr("data-weektype", lesson_weeks_type);
  $(currentDiv).attr("data-venue", venue);
  $(currentDiv).attr("data-group", group);
  $(currentDiv).attr("onclick", "view_details(this)");
  $(currentDiv).attr("ondragstart", "drag(event)");
  $(currentDiv).html("<p>" + duration + "H/" +lesson_weeks_type + " " + module_code + "</p><p>" + venue + " - " + group + "</p>" +
    "<img src='/images/icons/cross.svg' onclick='removeElement(this)' style='position: absolute; right: 5px; top: 5px;' />");

  event_id++;
  $(target).parent().parent().append(currentDiv);
}

function removeElement(target) {
  let grandparent;
  if ($(target).parent().parent().hasClass("events_group"))
    grandparent = $(target).parent().parent();
  $(target).parent().remove();
  if (grandparent != null)
    checkPage(grandparent);
}

function view_details(target) {
  if ($(target).parent().length > 0) {
    let lesson_on_week = $(target).data("lessonweeks") != null ? $(target).data("lessonweeks").split(",") : null;
    $("#details_popup > .popup").data("eventID", $(target).attr("id"));

    if (lesson_on_week == null) {
      $("#details_popup > .popup > .content > .lessonweeks").empty();
      for (let i = 0; i < 13; i++) {
        let checkbox = document.createElement("input");
        let label = document.createElement("label");
        $(checkbox).attr("type", "checkbox");
        $(checkbox).attr("id", "box-" + (i+1));
        $(label).attr("for", "box-" + (i+1));
        $(label).html("Week " + (i+1));
        $("#details_popup > .popup > .content > .lessonweeks").append([checkbox, label]);
      }
    } else {
      for (let i = 0; i < 13; i++) {
        $("#box-" + (i+1)).prop("checked", false);
      }
      for (let i = 0; i < lesson_on_week.length; i++) {
          $("#box-" + lesson_on_week[i]).prop("checked", true);
      }
    }
      $("#details_popup > .popup > .content").html();
    window.location.href = "#details_popup";
  }
}

function add_lesson_weeks(target) {
  let eventID = $(target).data("eventID");
  let checkboxes = $(target).find(".lessonweeks").find("input[type='checkbox']:checked");
  let str = "";
  for (let i = 0; i < checkboxes.length; i++) {
    if (i != 0)
      str += ",";
    str += $(checkboxes[i]).attr("id").slice(4)
  }
  if (str != "")
    $("#" + eventID).data("lessonweeks", str);

  window.location.href = "#";
}

class Module {
  constructor(code, name, au, size) {
    this.code = code;
    this.name = name;
    this.au = au;
    this.size = size;
  }
}

class Lesson {
  constructor(id, module_code) {
    this.id = id;
    this.module_code = module_code;
  }
}

class Venue {
  constructor(id, name, venue_type, capacity) {
    this.id = id;
    this.name = name;
    this.venue_type = venue_type;
    this.capacity = capacity;
  }
}

class Group {
  constructor(group_index, group_size) {
    this.group_index = group_index;
    this.group_size = group_size;
  }
}
