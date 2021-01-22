// network_selector component control logic

// Handle click on mainnet and testnet network components
function wire_up_network_selector(){
  var mainnet = document.getElementById("mainnet");
  var testnet = document.getElementById("testnet");

  // On mainnet
  // - set testnet to false
  // - update settings
  // - update DOM
  mainnet.addEventListener("click",function(e){
    settings.testnet = false;
    ipcRenderer.send('settings_updated');

    mainnet.classList.add('active')
    testnet.classList.remove('active')
  }, false);

  // On testnet
  // - set testnet to true
  // - update settings
  // - update DOM
  testnet.addEventListener("click",function(e){
    settings.testnet = true;
    ipcRenderer.send('settings_updated');

    mainnet.classList.remove('active')
    testnet.classList.add('active')
  }, false);
}

///

// Partial Loaded callback,
// - wire up control
function network_selector_partial_loaded(){
  wire_up_network_selector();
}
