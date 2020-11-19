const {ipcRenderer} = require('electron')

///

function is_int(n){
  return Number(n) === n && n % 1 === 0;
}

function is_float(n){
  return Number(n) === n && n % 1 !== 0;
}

function wire_up_testnet(){
  var testnet = document.getElementById("testnet");
  testnet.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {testnet : this.checked});
  },false);
}

function wire_up_offline(){
  var fee_container = document.getElementById("fee_container");
  var sequence_container = document.getElementById("sequence_container");
  var max_ledger_version_container = document.getElementById("max_ledger_version_container");

  var offline = document.getElementById("offline");
  offline.addEventListener("change",function(e){
    reset_offline_settings();
    toggle_offline_settings();
    ipcRenderer.send('set_setting', {offline : this.checked});
  },false);
}

function wire_up_fee(){
  var fee = document.getElementById("fee");
  var error = document.getElementById("fee_invalid")

  fee.addEventListener("input",function(e){
    const value = fee.value;
    const float_value = parseFloat(value)
    const is_valid = is_int(float_value) || is_float(float_value);
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {fee : value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_sequence(){
  var sequence = document.getElementById("sequence");
  var error = document.getElementById("sequence_invalid");

  sequence.addEventListener("input",function(e){
    const float_value = parseFloat(sequence.value)
    const is_valid = is_int(float_value) && !is_float(float_value);
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {sequence : float_value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");
  var error = document.getElementById("sequence_invalid");

  max_ledger_version.addEventListener("input",function(e){
    const float_value = parseFloat(max_ledger_version.value);
    const is_valid = is_int(float_value) && !is_float(float_value);
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {max_ledger_version : float_value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_close(){
  var close = document.getElementById("close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_window');
  },false);
}

function wire_up_controls(){
  wire_up_testnet();
  wire_up_offline();
  wire_up_fee();
  wire_up_sequence();
  wire_up_max_ledger_version();
  wire_up_close();
}

function reset_offline_settings(){
  ipcRenderer.send('set_setting', {fee                : null});
  ipcRenderer.send('set_setting', {sequence           : null});
  ipcRenderer.send('set_setting', {max_ledger_version : null});

  var fee                = document.getElementById("fee")
  var sequence           = document.getElementById("sequence")
  var max_ledger_version = document.getElementById("max_ledger_version");

  fee.value                = null;
  sequence.value           = null;
  max_ledger_version.value = null;

  var fee_error                = document.getElementById("fee_invalid");
  var sequence_error           = document.getElementById("sequence_invalid");
  var max_ledger_version_error = document.getElementById("max_ledger_version_invalid");

  fee_error.style.display                = 'none';
  sequence_error.style.display           = 'none';
  max_ledger_version_error.style.display = 'none';
}

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

function restore_settings(){
  var offline            = document.getElementById("offline");
  var testnet            = document.getElementById("testnet");
  var fee                = document.getElementById("fee");
  var sequence           = document.getElementById("sequence");
  var max_ledger_version = document.getElementById("max_ledger_version");

  ipcRenderer.on("got_settings", (event, settings) => {
    offline.checked          = settings.offline;
    testnet.checked          = settings.testnet;
    fee.value                = settings.fee;
    sequence.value           = settings.sequence;
    max_ledger_version.value = settings.max_ledger_version;
    toggle_offline_settings();
  })

  ipcRenderer.send("get_settings")
}

function dom_content_loaded(){
  wire_up_controls();
  restore_settings();
}

document.addEventListener("DOMContentLoaded", function(){
  dom_content_loaded();
});
