// generate_eth window control logic

const {ipcRenderer} = require('electron')

// Just close window on 'Cancel'
function wire_up_cancel(){
  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function() {
    ipcRenderer.send("close_generate_eth")
  }, false)
}

// Generate ETH account and show_eth_secret window on 'Continue'
function wire_up_continue(){
  const cntinue = document.getElementById("continue")
  cntinue.addEventListener("click", function(){
    const EthWallet = require('ethereumjs-wallet').default;
    const wallet = EthWallet.generate();

    ipcRenderer.send("set_eth_account",
                     wallet.getAddressString(),
                     wallet.getPrivateKeyString())
    ipcRenderer.send("close_generate_eth")
    ipcRenderer.send("show_eth_secret")
  })
}

///

// DOM Content Loaded callback,
// - wire up controls
function generate_eth_dom_content_loaded(){
  wire_up_cancel();
  wire_up_continue();
}

document.addEventListener("DOMContentLoaded", generate_eth_dom_content_loaded);
