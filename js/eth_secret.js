const {ipcRenderer} = require('electron')

document.addEventListener("DOMContentLoaded", function(){
  show_dialog({
    buttons : [{
      text : "CANCEL",
      id : "cancel"
    },{
      text : "OK",
      id : "ok",
      disabled : true
    }]
  });

  // Load generated secret and append to page
  var eth_account;
  const eth_secret = document.getElementById("eth_secret")
  ipcRenderer.on("got_eth_account", (event, account) => {
    eth_account = account;

    var text = document.createTextNode(account.secret);
    eth_secret.appendChild(text)
  })
  ipcRenderer.send("get_eth_account")

  // Persist account and close window on OK
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    ipcRenderer.send("persist_eth_account")
    ipcRenderer.send("close_window")
  })

  // Only allow 'ok' if user confirmed save
  const saved = document.getElementById("saved")
  saved.addEventListener("change", function() {
    ok.disabled = !this.checked;
  }, false);

  // Just close window on cancel
  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function() {
    ipcRenderer.send("close_window")
  }, false)

  // Copy secret to clipboard on command
  const copy = document.getElementById("copy");
  copy.addEventListener("click", function(){
    navigator.clipboard.writeText(eth_account.secret)
             .then(function(){
               alert("Copied!")
             }).catch(function(){
               alert("Problem Copying Key")
             })
  })
});
