let all_events = [];

/**
 * Author: Wong Yijie
 * create_planner is to generate the weekly calendar view based on the required paramaters.
 * @param weekly_planner - First node to be passed in for to generate the weekly planner.
 * @param start_day - [0-6] Monday - Sunday , which day to display first.
 * @param no_of_days - Number of days to be displayed. E.g. start_day to be on Monday, no_of_days = 3, weekly_planner will show only Monday to Wednesday.
 * @param start_time - First time slot to be displayed. Format (HH:MM)
 * @param end_time - Last time slot to be displayed. Format (HH:MM)
 * @param duration_interval - Duration of each time slot in hours. (Integer)
 */
function create_planner(weekly_planner, start_day, no_of_days, start_time, end_time, duration_interval) {
  let day_array = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let header = document.createElement("div");
  let content = document.createElement("div");

  /** Calendar days manipulation below */
  // Retrieving the correct day index and push in for further manipulation.
  let start_end = [];
  for (let i = 0, x = start_day; i < no_of_days; i++, x++) {
    if (x == 6)
      x = 0;
    start_end.push(day_array[x]);
  }
  // Retrieving the correct day with start_end array and day_array to display after creating an element
  for (let i = 0; i < start_end.length; i++) {
    let day = document.createElement("div");
    $(day).addClass("day_title");
    $(day).addClass(start_end[i]);
    $(day).html(start_end[i]);
    $(header).append(day);
  }


  /** Calendar time manipulation below */
  // Calculation of time slots
  let s_time = parseInt(start_time.slice(0,2));
  let e_time = parseInt(end_time.slice(0,2));

  // Creation of time slot elements for content wrapper
  for (let i = s_time; i < e_time; i+=duration_interval) {
    let content_group = document.createElement("div");
    let event_time = document.createElement("span");
    let day_placeholder = document.createElement("div");

    $(content_group).addClass("content_group");
    $(event_time).addClass("event_time");
    $(event_time).html(("0" + i).slice(-2) + "" + start_time.slice(2,5));

    $(day_placeholder).addClass("day_placeholder");
    $(day_placeholder).attr("data-timeslot", i-s_time);

    for (let j = 0; j < start_end.length; j++) {
      let events_group = document.createElement("div");
      let page_control = document.createElement("ul");

      $(page_control).addClass("pagination");
      $(page_control).addClass("pagination-sm");
      $(page_control).append("<li class='page-item' style='display: none;'><a class='page-x active' href='#'></a></li>");
      $(events_group).addClass("events_group");
      $(events_group).attr("data-day", (j+1));
      $(events_group).attr("ondrop", "dragndrop_event(event)");
      $(events_group).attr("ondragover", "allowDrop(event)");
      $(events_group).append(page_control);

      $(day_placeholder).append(events_group);
    }
    $(content_group).append([event_time, day_placeholder]);
    $(content).append(content_group);
  }

  // Header details below
  $(header).addClass("header");

  // Content details below
  $(content).addClass("content_placeholder");

  $(weekly_planner).append([header, content]);
  weekly_planner = $(weekly_planner);
}

/**
 * Author: Wong Yijie
 * @param event - Event object to be added and displayed on the particular time and day.
 * @param time_index - Time index to add event object.
 * @param day_index - Day index to add day object. [0-whichever]
 * @param add_method - [0,1] 0 - Prepend, 1 - Append
 */
function add_event(event, time_index, day_index, add_method) {
  let events_group = $("#weekly_planner > .content_placeholder > .content_group:nth(" + time_index + ") > .day_placeholder > .events_group:nth(" + day_index + ")");
  if (add_method == 1) {
    events_group.append(event);
    all_events.push(event);
  } else
    events_group.prepend(event);
  checkPage(events_group);
}

/**
 * Author: Wong Yijie
 * @param ev - Event object
 */
function dragndrop_event(ev) {
  ev.preventDefault();

  let element = ev.target;
  let day = ev.dataTransfer.getData("day_slot");
  let time = ev.dataTransfer.getData("time_slot");
  let prev_event_group = $("#weekly_planner > .content_placeholder > .content_group:nth(" + time + ") > .day_placeholder > .events_group:nth(" + (day-1) + ")");
  if ($(element).hasClass("single_event") || $(element).hasClass("more_events")) {
    element = ev.target.parentNode;
  }
  if ($(element).data("day") != day || $(element).parent().data("timeslot") != time) {
    add_event(document.getElementById(ev.dataTransfer.getData("elementID")), $(element).parent().data("timeslot"), ($(element).data("day")-1), 0);
  }
  checkPage(prev_event_group);
}

/**
 * Author: Wong Yijie
 * @param ev - Event object
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Author: Wong Yijie
 * drag() is to transfer details of the parent element and current element.
 * @param ev - Event object
 */
function drag(ev) {
  ev.dataTransfer.setData("elementID", ev.target.id);
  ev.dataTransfer.setData("day_slot", $(ev.target.parentNode).data("day"));
  ev.dataTransfer.setData("time_slot", $(ev.target.parentNode).parent().data("timeslot"));
}

/**
 * Author: Wong Yijie
 * @param events_group - Specified day & time events container object
 */
function checkPage(event_group) {
  let items_per_page = 5;
  let page_items_array = "";
  let page_control = $(event_group).find(".pagination");
  let total_pages = Math.ceil($(event_group).children(".single_event").length/items_per_page);
  let page = $($(event_group).find(".pagination > .page-item > .page-x")).index($(event_group).find(".pagination > .page-item > .page-x.active"))+1;

  $(page_control).find(".page-item").show();
  if ($(event_group).children(".single_event").length == 0) {
    $(page_control).find(".page-item").hide();
  } else {
    if ($(page_control).children(".page-item").length != total_pages) {
      for (let i = 0; i < total_pages; i++) {
        let page_item = document.createElement("li");
        $(page_item).addClass("page-item");
        if ((i + 1) == page)
          $(page_item).html("<a class='page-x active' href='#' onclick='return change_page(this)'></a>");
        else
          $(page_item).html("<a class='page-x' href='#' onclick='return change_page(this)'></a>");
        page_items_array += page_item.outerHTML;
      }
      $(page_control).html(page_items_array);
    }
  }

  showPage(event_group, page, items_per_page);
}

function showPage(event_group, page, items_per_page) {
  for (let i = 0; i < $(event_group).children(".single_event").length; i++) {
    let event = $(event_group).children(".single_event:nth(" + i + ")");
    $(event).hide();
    if (i >= items_per_page * (page - 1) && i < items_per_page * page)
      $(event).show();
  }
}

function change_page(target) {
  $(target).parent().siblings().find(".active").removeClass("active");
  $(target).addClass("active");
  checkPage($(target).parent().parent().parent());

  return false;
}
