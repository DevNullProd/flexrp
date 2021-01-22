// splash window control logic

const {ipcRenderer} = require('electron')
const pkg = require("../package.json")

///

// Launch the security window when 'More Info' is clicked
function wireup_security_moreinfo(){
  var security_moreinfo = document.getElementById("splash_security_moreinfo");
  security_moreinfo.addEventListener("click", function(e){
    ipcRenderer.send('show_security');
  })
}

// Quit the application when 'Quit' is clicked
function wireup_quit(){
  var quit = document.getElementById("splash_quit");
  quit.addEventListener("click", function(e){
    ipcRenderer.send('quit_app');
  })
}

// Show main window and close splash window
// when 'I confirm' is clicked
function wireup_confirm(){
  var cnfirm = document.getElementById("splash_confirm");
  cnfirm.addEventListener("click", function(e){
    ipcRenderer.send('show_main');
    ipcRenderer.send('close_splash');
  })
}

// Set application version from value in package.json
function set_version(){
  var version = document.getElementById("splash_version");
  version.innerHTML = "v" + pkg.version;
}

///

// DOM Content Loaded callback,
// - wire up controls
// - set version
function splash_dom_content_loaded(){
  wireup_security_moreinfo();
  wireup_quit();
  wireup_confirm();
  set_version();
}

document.addEventListener("DOMContentLoaded", splash_dom_content_loaded);
