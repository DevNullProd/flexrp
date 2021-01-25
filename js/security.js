// security window control logic

const {ipcRenderer} = require('electron')

///

// Close security window on 'Close' button click
function wire_up_close(){
  var close = document.getElementById("security_close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_security');
  },false);
}

///

// DOM Content Loaded Callback,
// - wire up controls
function security_dom_content_loaded(){
  wire_up_close();
}

document.addEventListener("DOMContentLoaded", security_dom_content_loaded);
