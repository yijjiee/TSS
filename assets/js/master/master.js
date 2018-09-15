$(document).ready(function() {
  var path = window.location.pathname;
  var xpath = path.split('/');

  if (path == "/")
    $("#navhome").css("backgroundColor", "#ed8a63");
  else if (xpath[1] == "staffs")
    $("#navstaff").css("backgroundColor", "#ed8a63");
  else if (xpath[1] == "module") {
    $("#navmod").css("backgroundColor", "#ed8a63");
    $("#module_submenu").addClass("show");
    if (!xpath[2])
      $("#module_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#module_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  } else if (xpath[1] == "schedule")
    $("#navschedule").css("backgroundColor", "#ed8a63");
  else if (xpath[1] == "import")
    $("#navimport").css("backgroundColor", "#ed8a63");
  else if (xpath[1] == 'export')
    $("#navexport").css("backgroundColor", "#ed8a63");
});

function redirect(url) {
    window.location.href = url;
}

function toggle_collapse(target) {
  if (window.innerWidth <= 1200) {
    redirect("/"+ $(target).data("menu"));
  } else {
    $($(target).data("target")).toggle();
  }
}
