function restore_offline_settings_partial(settings){
  var offline = document.getElementById("offline");
  offline.checked = settings.offline;
  toggle_offline_settings();
}

// Toggle offline settings visibility based on offline input state
function toggle_offline_settings(){
  var offline = document.getElementById("offline");
  const offline_enabled = offline.checked;
  if(offline_enabled){
    fee_container.style.display                = 'flex';
    sequence_container.style.display           = 'flex';
    max_ledger_version_container.style.display = 'flex';

  }else{
    fee_container.style.display                = 'none';
    sequence_container.style.display           = 'none';
    max_ledger_version_container.style.display = 'none';
  }
}


// Set offline setting, updating related controls / visibility
function wire_up_offline(){
  var fee_container = document.getElementById("fee_container");
  var sequence_container = document.getElementById("sequence_container");
  var max_ledger_version_container = document.getElementById("max_ledger_version_container");

  var offline = document.getElementById("offline");
  offline.addEventListener("change",function(e){
    reset_offline_settings();
    toggle_offline_settings();
    toggle_close();
    ipcRenderer.send('set_setting', {offline : this.checked});
  },false);
}
