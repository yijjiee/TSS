$(document).ready(function() {
  var path = window.location.pathname;

  if (path == "/")
    $("#navhome").css("border-bottom", "3px solid #ed8a63");
  else if (path == "/MaintainStaffs")
    $("#navstaff").css("border-bottom", "3px solid #ed8a63");
  else if (path == "/MaintainModules")
    $("#navmod").css("border-bottom", "3px solid #ed8a63");
  else if (path == "/Schedule")
    $("#navschedule").css("border-bottom", "3px solid #ed8a63");
  else if (path == "/Import")
    $("#navimport").css("border-bottom", "3px solid #ed8a63");
  else if (path == '/Export')
    $("#navexport").css("border-bottom", "3px solid #ed8a63");
});

function redirect(url) {
    window.location.href = url;
}
