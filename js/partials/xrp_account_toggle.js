// Set specify_account setting
function wire_up_specify_account(){
  var specify_account = document.getElementById("xrp_account_toggle");
  specify_account.addEventListener("change",function(e){
    settings.specify_account = this.checked;
    ipcRenderer.send('settings_updated');
  }, false);
}

function xrp_account_toggle_partial_loaded(){
  wire_up_specify_account();
}
