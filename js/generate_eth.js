const {ipcRenderer} = require('electron')

document.addEventListener("DOMContentLoaded", function(){
  show_dialog({
    buttons : [{
      text : "CANCEL",
      id : "cancel"
    },{
      text : "OK",
      id : "ok"
    }]
  });

  // Generate eth wallet and show secret on ok
  const ok = document.getElementById("ok")
  ok.addEventListener("click", function(){
    const EthWallet = require('ethereumjs-wallet').default;
    const wallet = EthWallet.generate();

    ipcRenderer.send("set_eth_account",
                     wallet.getAddressString(),
                     wallet.getPrivateKeyString())
    ipcRenderer.send("close_window")
    ipcRenderer.send("show_eth_secret")
  })

  // Just close window on cancel
  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function() {
    ipcRenderer.send("close_window")
  }, false)
});
