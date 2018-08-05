$(document).ready(function () {
  $("#module_form").submit(function() {
    var num_lesson_types = 0;
    if ($("#lec_details").css("display") != "none")
      num_lesson_types+= 1;
    if ($("#tut_details").css("display") != "none")
      num_lesson_types+= 1;
    if ($("#lab_details").css("display") != "none")
      num_lesson_types+= 1;

    var hiddenField = $("<input>").attr("type", "hidden").attr("name", "num_lesson_types").val(num_lesson_types);
    $("#module_form").append($(hiddenField));

    return true;
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
