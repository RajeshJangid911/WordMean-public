function darkMode() {
  var elBody = document.body;
  var btn = document.getElementById("btn-dark-toggle");
  if (elBody.getAttribute("dark-mode") === "false") {
    elBody.setAttribute("dark-mode", "true");
    btn.innerText = "Go Light";
  } else {
    elBody.setAttribute("dark-mode", "false");
    btn.innerText = "Go Dark!";
  }
}
