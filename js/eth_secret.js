const {ipcRenderer} = require('electron')

var eth_account;

// Load generated secret and append to page
function load_eth_secret(){
  const eth_secret = document.getElementById("key")
  ipcRenderer.on("got_eth_account", (event, account) => {
    eth_account = account;

    var text = document.createTextNode(account.secret);
    eth_secret.appendChild(text)
  })
  ipcRenderer.send("get_eth_account")
}

function wire_up_saved(){
  const done = document.getElementById("done")
  const saved = document.getElementById("saved");
  saved.addEventListener("change", function() {
    done.disabled = !saved.checked;
  })
}

// Just close window on cancel
function wire_up_cancel(){
  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function() {
    ipcRenderer.send("close_eth_secret")
  }, false)
}

// Persist account and close window on Done
function wire_up_done(){
  const done = document.getElementById("done")
  done.addEventListener("click", function(){
    ipcRenderer.send("persist_eth_account")
    ipcRenderer.send("close_eth_secret")
  })

  // Only allow 'done' if user confirmed save
  const saved = document.getElementById("saved")
  saved.addEventListener("change", function() {
    done.disabled = !this.checked;
  }, false);
}

function wire_up_copy(){
  // Copy secret to clipboard on command
  const copy = document.getElementById("copy");
  const tooltiptext = document.getElementById("copy_tooltiptext");
  copy.addEventListener("click", function(){
    navigator.clipboard.writeText(eth_account.secret)
             .then(function(){
               tooltiptext.style.visibility = 'visible';
               setTimeout(function(){
                 tooltiptext.style.visibility = 'hidden';
               }, 3000)

             }).catch(function(){
               alert("Problem Copying Key")
             })
  })
}

function eth_secret_dom_content_loaded(){
  load_eth_secret();
  wire_up_saved();
  wire_up_cancel();
  wire_up_done();
  wire_up_copy();
}

document.addEventListener("DOMContentLoaded", eth_secret_dom_content_loaded);
