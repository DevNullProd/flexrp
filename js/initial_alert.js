const {ipcRenderer} = require('electron')

document.addEventListener("DOMContentLoaded", function(){
  show_dialog({
    buttons : [{
      text : "QUIT",
      id : "quit"
    },{
      text : "OK",
      id : "ok",
      disabled : true
    }]
  });

  // Show security guidelines when 'read more' is clicked
  const initial_alert_security = document.getElementById("initial_alert_security")
  initial_alert_security.addEventListener("click", function(){
    ipcRenderer.send("show_security")
  })

  // Close dialog on 'ok' button click
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("close_window")
  })

  // Disable ok button based on state of 'secure' checkbox
  const secure = document.getElementById("secure")
  secure.addEventListener("change", function() {
    ok.disabled = !this.checked;
  }, false);

  // Quit app when 'quit' button clicked
  const quit = document.getElementById("quit");
  quit.addEventListener("click", function() {
    ipcRenderer.send("quit_app")
  }, false)
});
