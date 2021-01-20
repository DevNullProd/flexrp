// Toggle offline settings visibility based on offline input state
function toggle_offline_settings(){
  var offline = document.getElementById("offline_toggle");
  const offline_enabled = offline.checked;

  const settings = document.getElementById("offline_settings_partial")
  if(offline_enabled){
    settings.style.display = 'flex';

  }else{
    settings.style.display = 'none';
  }
}

// Set offline setting, updating related controls / visibility
function wire_up_offline(){
  var fee_container = document.getElementById("fee_container");
  var sequence_container = document.getElementById("sequence_container");
  var max_ledger_version_container = document.getElementById("max_ledger_version_container");

  var offline = document.getElementById("offline_toggle");
  offline.addEventListener("change",function(e){
    settings.offline = this.checked;
    ipcRenderer.send('settings_updated');

    toggle_offline_settings();
    toggle_submit();
  },false);
}

function offline_toggle_partial_loaded(){
  wire_up_offline();
}
