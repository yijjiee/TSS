$(document).ready(function() {
  if ($(".modules_list > p").length != 0)
  $(".modules_list > p:nth(0)").click();
});

function selectModule(element) {
  if ($(element).attr("aria-selected") == "true") {
    return ;
  } else {
    $(".modules_list > p").each(function (index, module) {
      $(module).attr("aria-selected", false);
      $(module).css("backgroundColor", "transparent");
    });

    $(element).attr("aria-selected", "true");
    $(element).css("backgroundColor", "rgba(0,0,0,0.4)");


    $("#module_title").html($(element).html());

    $("#lec_wrapper, #tut_wrapper, #lab_wrapper").css("display", "none");
    let module_code = $(element).attr("id");
    $.ajax({
      url: "/lesson/show",
      method: "POST",
      data: {module_code: module_code},
      success: function (res) {
        let module = res[0][0];
        let module_year = module.code.charAt(2);
        let module_au = module.academic_units;
        let module_cohort = module.cohort_size;

        $(".module_main_details_editable > .module_info").empty();
        $(".module_main_details_editable > .module_info").append("<li>Academic Units: <span>" + module_au + "</span></li>");
        $(".module_main_details_editable > .module_info").append("<li>Cohort Size: <span>" + module_cohort + "</span></li>");

        let lessons = res[1];
        $(".module_details_wrapper > .class_details").empty();
        for (let i = 0; i < lessons.length; i++) {
          let tempDiv = document.createElement("div");
          $(tempDiv).attr("data-lessontype", lessons[i].lesson_type);
          $(tempDiv).addClass(lessons[i].lesson_type);

          if (lessons[i].lesson_type == "LEC") {

          } else if (lessons[i].lesson_type == "TUT") {

          } else if (lessons[i].lesson_type == "LAB") {
            let possible_venues = "";

            $("#labfreqfreq").val(lessons[i].frequency);
            for (let j in lessons[i].possible_venues) {
              possible_venues += lessons[i].possible_venues[j].name;
              if (j != lessons[i].possible_venues.length - 1)
                possible_venues += ",";
            }

            $("#lab_pvenues_textarea").val(possible_venues);
            $("#lab_wrapper").css("display", "grid");
          } else {
            $(tempDiv).append("<p>Others</p>");
          }
          $(".module_details_wrapper > .class_details").append(tempDiv);
        }
      }
    });
  }
}

function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}
