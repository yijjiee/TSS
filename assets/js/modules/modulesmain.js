function selectModule(element) {
  if ($(element).attr("aria-selected") == "true") {
    return ;
  } else {
    $(".modules_list>p").each(function (index, module) {
      $(module).attr("aria-selected", false);
      $(module).css("backgroundColor", "transparent");
    });

    $(element).attr("aria-selected", "true");
    $(element).css("backgroundColor", "#c0c0c0");


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

        $("#moduleyear").val(module_year);
        $("#moduleau").val(module_au);
        $("#modulecohort").val(module_cohort);

        let lessons = res[1];
        for (let i = 0; i < lessons.length; i++) {
          if (lessons[i].lesson_type == "LEC") {
            let possible_venues = "";

            $("#lecfreq").val(lessons[i].frequency);
            for (let j in lessons[i].possible_venues) {
              possible_venues += lessons[i].possible_venues[j].name;
              if (j != lessons[i].possible_venues.length - 1)
                possible_venues += ",";
            }

            $("#lec_pvenues_textarea").val(possible_venues);
            $("#lec_wrapper").css("display", "grid");
          } else if (lessons[i].lesson_type == "TUT") {
            let possible_venues = "";

            $("#tutfreq").val(lessons[i].frequency);
            for (let j in lessons[i].possible_venues) {
              possible_venues += lessons[i].possible_venues[j].name;
              if (j != lessons[i].possible_venues.length - 1)
                possible_venues += ",";
            }

            $("#tut_pvenues_textarea").val(possible_venues);
            $("#tut_wrapper").css("display", "grid");
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
          }
        }
      }
    });
  }
}
