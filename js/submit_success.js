// submit_success window control logic

const {ipcRenderer} = require('electron')

// Send operation_complete when 'OK' is clicked
function wire_up_ok(){
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("operation_complete")
  })
}

// DOM Content Loaded callback,
// - wire up controls
function submit_success_dom_content_loaded(){
  wire_up_ok();
}

document.addEventListener("DOMContentLoaded", submit_success_dom_content_loaded);
