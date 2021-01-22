// security window control logic

const {ipcRenderer} = require('electron')

///

// Append security partial to DOM
function load_security_partial(){
  append_partial("security_partial", load_partial("security"));
}

// Close security window on 'Close' button click
function wire_up_close(){
  var close = document.getElementById("security_close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_security');
  },false);
}

///

// DOM Content Loaded Callback,
// - load security partial
// - wire up controls
function security_dom_content_loaded(){
  load_security_partial()
  wire_up_close();
}

document.addEventListener("DOMContentLoaded", security_dom_content_loaded);
