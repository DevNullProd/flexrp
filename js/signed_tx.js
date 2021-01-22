// signed_tx window control logic

const {ipcRenderer} = require('electron')

var operation_result;

// Retrieve signed tx, setting it on the page
function load_operation_result(){
  const tx = document.getElementById("tx")
  ipcRenderer.on("got_operation_result", (event, result) => {
    operation_result = result;

    var text = document.createTextNode(result.tx);
    tx.appendChild(text)
  })
  ipcRenderer.send("get_operation_result")
}

// Send operation_complete when 'OK' is clicked
function wire_up_ok(){
  const done = document.getElementById("done")
  done.addEventListener("click", function(){
    ipcRenderer.send("operation_complete")
  })

  // Only allow 'Ok' if user confirmed save
  const saved = document.getElementById("saved")
  saved.addEventListener("change", function() {
    done.disabled = !this.checked;
  }, false);
}

// Copy secret to clipboard on command
function wire_up_copy(){
  const copy = document.getElementById("copy");
  const tooltiptext = document.getElementById("copy_tooltiptext");
  copy.addEventListener("click", function(){
    navigator.clipboard.writeText(operation_result.tx)
             .then(function(){
               // Render 'Copied' tooltip, and hide after a few seconds
               tooltiptext.style.visibility = 'visible';
               setTimeout(function(){
                 tooltiptext.style.visibility = 'hidden';
               }, 3000)

             }).catch(function(){
               alert("Problem Copying Key")
             })
  })
}

///

// DOM Content Loaded callback,
// - load operation result
// - wire up controls
function signed_tx_dom_content_loaded(){
  load_operation_result();
  wire_up_ok();
  wire_up_copy();
}

document.addEventListener("DOMContentLoaded", signed_tx_dom_content_loaded);
