// submit_failed window control logic

const {ipcRenderer} = require('electron')

// Retrieve signing error, setting it on the page
function load_operation_result(){
  const err = document.getElementById("err")
  ipcRenderer.on("got_operation_result", (event, result) => {
    var text = document.createTextNode(result.err);
    err.appendChild(text)
  })
  ipcRenderer.send("get_operation_result")
}

// Close window when 'OK' is clicked
function wire_up_ok(){
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("close_submit_failed")
  })
}

///

// DOM Content Loaded callback,
// - load operation result
// - wire up controls
function signing_failed_dom_content_loaded(){
  load_operation_result();
  wire_up_ok();
}

document.addEventListener("DOMContentLoaded", signing_failed_dom_content_loaded);
