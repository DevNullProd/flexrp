// xrp_account_toggle component control logic

// Set specify_account setting on input change
function wire_up_specify_account(){
  var specify_account = document.getElementById("xrp_account_toggle");
  specify_account.addEventListener("change",function(e){
    settings.specify_account = this.checked;
    ipcRenderer.send('settings_updated');
  }, false);
}

///

// Partial Loaded callback,
// - wire up controls
function xrp_account_toggle_partial_loaded(){
  wire_up_specify_account();
}
