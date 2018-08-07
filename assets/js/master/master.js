$(document).ready(function() {
  var path = window.location.pathname;
  var xpath = path.split('/');

  if (path == "/")
    $("#navhome").css("border-top", "3px solid #ed8a63");
  else if (xpath[1] == "staffs")
    $("#navstaff").css("border-top", "3px solid #ed8a63");
  else if (xpath[1] == "module")
    $("#navmod").css("border-top", "3px solid #ed8a63");
  else if (xpath[1] == "schedule")
    $("#navschedule").css("border-top", "3px solid #ed8a63");
  else if (xpath[1] == "import")
    $("#navimport").css("border-top", "3px solid #ed8a63");
  else if (xpath[1] == 'export')
    $("#navexport").css("border-top", "3px solid #ed8a63");
});

function redirect(url) {
    window.location.href = url;
}
