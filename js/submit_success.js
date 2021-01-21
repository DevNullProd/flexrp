const {ipcRenderer} = require('electron')

function wire_up_ok(){
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("operation_complete")
  })
}

function submit_success_dom_content_loaded(){
  wire_up_ok();
}

document.addEventListener("DOMContentLoaded", submit_success_dom_content_loaded);
