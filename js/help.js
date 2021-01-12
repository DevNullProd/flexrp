const {ipcRenderer} = require('electron')

///

function wire_up_close(){
  var close = document.getElementById("close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_window');
  },false);
}

function wire_up_controls(){
  wire_up_close();
}

function dom_content_loaded(){
  wire_up_controls();
}

document.addEventListener("DOMContentLoaded", function(){
  dom_content_loaded();
});
