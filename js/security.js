const {ipcRenderer} = require('electron')

///

function load_security_partial(){
  append_partial("security_partial", load_partial("security"));
}

function wire_up_close(){
  var close = document.getElementById("security_close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_security');
  },false);
}

function wire_up_controls(){
  wire_up_close();
}

function security_dom_content_loaded(){
  load_security_partial()
  wire_up_controls();
}

document.addEventListener("DOMContentLoaded", security_dom_content_loaded);
