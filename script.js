document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn !== null) {
    logoutBtn.onclick = function () {
      window.location.href = "login.html";
    };
  }
});