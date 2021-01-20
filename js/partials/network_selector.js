// Set testnet setting
function wire_up_network_selector(){
  var mainnet = document.getElementById("mainnet");
  var testnet = document.getElementById("testnet");

  mainnet.addEventListener("click",function(e){
    settings.testnet = false;
    ipcRenderer.send('settings_updated');

    mainnet.classList.add('active')
    testnet.classList.remove('active')
  }, false);

  testnet.addEventListener("click",function(e){
    settings.testnet = true;
    ipcRenderer.send('settings_updated');

    mainnet.classList.remove('active')
    testnet.classList.add('active')
  }, false);
}

function network_selector_partial_loaded(){
  wire_up_network_selector();
}
