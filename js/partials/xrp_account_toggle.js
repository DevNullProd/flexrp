function restore_xrp_account_toggle_partial(settings){
  var specify_account = document.getElementById("specify_account");
  specify_account.checked = settings.specify_account;
}

// Set specify_account setting
function wire_up_specify_account(){
  var specify_account = document.getElementById("specify_account");
  specify_account.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {specify_account : this.checked});
  },false);
}
