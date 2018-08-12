$(document).ready(function () {
  $("#module_form").submit(function() {
    var num_lesson_types = 0;
    if ($("#lec_details").css("display") == "none")
      $("#lec_details").find("input").each(function() {
        $(this).attr('disabled', 'disabled');
      });
    if ($("#tut_details").css("display") == "none")
      $("#tut_details").find("input").each(function() {
        $(this).attr('disabled', 'disabled');
      });
    if ($("#lab_details").css("display") == "none")
      $("#lab_details").find("input").each(function() {
        $(this).attr('disabled', 'disabled');
      });

    return true;
  });

  $("#venues_modal").on("show.bs.modal", function (event) {
    let btn = $(event.relatedTarget);
    let lesson_type = btn.data("lessontype");
    let venue_arr = "";
    $(this).find(".modal-footer button:nth-child(2)").data("lessontype", lesson_type);
    let vlist = $(this).find(".modal-body input");

    if (lesson_type == "LT") {

      vlist.each(function () {
        if ($(this).attr("alt") != lesson_type)
          $(this).parent().css("display", "none");
        else
          $(this).parent().css("display", "block");
      });

      venue_arr = $("#lec_details>.input-group>input[name='possible_venues']").val();
      if (venue_arr != "")
        venue_arr = (venue_arr).split(",");
    } else if (lesson_type == "TR") {

      vlist.each(function () {
        $(this).parent().css("display", "block");
      });

      venue_arr = $("#tut_details>.input-group>input[name='possible_venues']").val();
      if (venue_arr != "")
        venue_arr = (venue_arr).split(",");
    } else if (lesson_type == "LAB") {

      vlist.each(function () {
        if ($(this).attr("alt") != lesson_type)
          $(this).parent().css("display", "none");
        else
          $(this).parent().css("display", "block");
      });

      venue_arr = $("#lab_details>.input-group>input[name='possible_venues']").val();
      if (venue_arr != "")
        venue_arr = (venue_arr).split(",");
    }

    let venue_list = $("#possible_venues_list>.form-check>input[name='venue_cb']:checked");
    venue_list.each(function () {
      $(this).prop("checked", false);
    });

    if (venue_arr != "")
      for (let i = 0; i < venue_arr.length; i++)
        $("#" + venue_arr[i]).prop("checked", true);
  });

  $("#groups_modal").on("show.bs.modal", function (event) {
    let btn = $(event.relatedTarget);
    let lesson_type = btn.data("lessontype");
    let group_arr = "";

    $(this).find(".modal-footer button:nth-child(2)").data("lessontype", lesson_type);
    let glist = $(this).find(".modal-body input");

    if (lesson_type == "LT") {
      group_arr = $("#lec_details>.input-group>input[name='groups']").val();
      if (group_arr != "")
        group_arr = (group_arr).split(",");
    } else if (lesson_type == "TR") {
      group_arr = $("#tut_details>.input-group>input[name='groups']").val();
      if (group_arr != "")
        group_arr = (group_arr).split(",");
    } else if (lesson_type == "LAB") {
      group_arr = $("#lab_details>.input-group>input[name='groups']").val();
      if (group_arr != "")
        group_arr = (group_arr).split(",");
    }

    let group_list = $("#group_list>.form-check>input[name='group_cb']:checked");
    group_list.each(function () {
      $(this).prop("checked", false);
    });

    if (group_arr != "")
      for (let i = 0; i < group_arr.length; i++)
        $("#" + group_arr[i]).prop("checked", true);
  });
});

function add_lesson_details(lessonType, imgElement) {
    if ($(lessonType).css("display") == "none") {
      $(lessonType).css("display", "block");
      $(imgElement).attr("src", "/images/icons/delete.svg");
    } else {
      $(lessonType).css("display", "none");
      $(imgElement).attr("src", "/images/icons/add.svg");
    }
}

function save_venues(element) {
  let lesson_type = $(element).data("lessontype");
  let venues_str = "";
  let pv_list = $("#possible_venues_list>.form-check>input[name='venue_cb']:checked");
  let length = $("#possible_venues_list>.form-check>input[name='venue_cb']:checked").length;
  pv_list.each(function (index) {
    if ($(this).parent().css("display") != "none") {
      venues_str += $(this).val()
      if (index != (length - 1))
        venues_str += ",";
    }
  });
  let p_venue_value =  -1;
  if (lesson_type == "LT")
    p_venue_value = 0;
  else if (lesson_type == "TR")
    p_venue_value = 1;
  else
    p_venue_value = 2;

  $("input[name='possible_venues']:eq(" + p_venue_value + ")").val(venues_str);
  $("#venues_modal").modal('toggle');
}

function save_groups(element) {
  let lesson_type = $(element).data("lessontype");
  let group_str = "";
  let group_list = $("#group_list>.form-check>input[name='group_cb']:checked");
  let length = $("#group_list>.form-check>input[name='group_cb']:checked").length;
  group_list.each(function (index) {
    if ($(this).parent().css("display") != "none") {
      group_str += $(this).val()
      if (index != (length - 1))
        group_str += ",";
    }
  });
  let p_venue_value =  -1;
  if (lesson_type == "LT")
    p_venue_value = 0;
  else if (lesson_type == "TR")
    p_venue_value = 1;
  else
    p_venue_value = 2;

  $("input[name='groups']:eq(" + p_venue_value + ")").val(group_str);
  $("#groups_modal").modal('toggle');
}
