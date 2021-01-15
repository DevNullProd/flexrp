function restore_network_selector_partial(settings){
  var testnet = document.getElementById("testnet");
  testnet.checked = settings.testnet;
}

// Set testnet setting
function wire_up_testnet(){
  var testnet = document.getElementById("testnet");
  testnet.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {testnet : this.checked});
  },false);
}
