const {ipcRenderer} = require('electron')


function load_operation_result(){
  const err = document.getElementById("err")
  ipcRenderer.on("got_operation_result", (event, result) => {
    var text = document.createTextNode(result.err);
    err.appendChild(text)
  })
  ipcRenderer.send("get_operation_result")
}

function wire_up_ok(){
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("close_submit_failed")
  })
}

function signing_failed_dom_content_loaded(){
  load_operation_result();
  wire_up_ok();
}

document.addEventListener("DOMContentLoaded", signing_failed_dom_content_loaded);
