const {ipcRenderer} = require('electron')

document.addEventListener("DOMContentLoaded", function(){
  show_dialog({
    buttons : [{
      text : "OK",
      id : "ok",
      disabled : true
    }]
  });

  // Retrieve signed tx, setting it on the page
  var _signed_tx;
  const signed_tx = document.getElementById("signed_tx")
  ipcRenderer.on("got_signed_tx", (event, tx) => {
    _signed_tx = tx;

    var text = document.createTextNode(tx);
    signed_tx.appendChild(text)
  })
  ipcRenderer.send("get_signed_tx")

  // Close window on "ok" button
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("close_window")
    ipcRenderer.send("signed_tx_complete")
  })

  // Only allow 'ok' is user confirmed copy
  const copied = document.getElementById("copied")
  copied.addEventListener("change", function() {
    ok.disabled = !this.checked;
  }, false);

  // Copy tx to clipboard on command
  const copy = document.getElementById("copy");
  copy.addEventListener("click", function(){
    navigator.clipboard.writeText(_signed_tx)
             .then(function(){
               alert("Copied!")
             }).catch(function(){
               alert("Problem Copying TX")
             })
  })
});
