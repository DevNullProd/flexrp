const {ipcRenderer} = require('electron')

///

// Tracks validity of inputs
var inputs_valid = {
  fee : false,
  sequence : false,
  max_ledger_version : false
}

// Return boolean indicating if input is an integer
function is_int(n){
  return Number(n) === n && n % 1 === 0;
}

// Return boolean indicating if input is a float
function is_float(n){
  return Number(n) === n && n % 1 !== 0;
}

// Set testnet setting
function wire_up_testnet(){
  var testnet = document.getElementById("testnet");
  testnet.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {testnet : this.checked});
  },false);
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

// Validate fee input format
function validate_fee(){
  var fee = document.getElementById("fee");
  var error = document.getElementById("fee_invalid")

  const value = fee.value;
  const float_value = parseFloat(value)
  inputs_valid.fee = is_int(float_value) || is_float(float_value);

  if(inputs_valid.fee){
    error.style.display = "none";
    ipcRenderer.send('set_setting', {fee : value});

  }else{
    error.style.display = "block";
  }

  toggle_close();
}

// Wireup fee input textbox
function wire_up_fee(){
  var fee = document.getElementById("fee");
  fee.addEventListener("input",function(e){
    validate_fee();
  },false);
}

// Validate sequence input format
function validate_sequence(){
  var sequence = document.getElementById("sequence");
  var error = document.getElementById("sequence_invalid");

  const float_value = parseFloat(sequence.value)
  inputs_valid.sequence = is_int(float_value) && !is_float(float_value);

  if(inputs_valid.sequence){
    error.style.display = "none";
    ipcRenderer.send('set_setting', {sequence : float_value});

  }else{
    error.style.display = "block";
  }

  toggle_close();
}

// Wireup sequence input textbox
function wire_up_sequence(){
  var sequence = document.getElementById("sequence");
  sequence.addEventListener("input",function(e){
    validate_sequence();
  },false);
}

// Validate max ledger version input format
function validate_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");
  var error = document.getElementById("max_ledger_version_invalid");

  const float_value = parseFloat(max_ledger_version.value);
  inputs_valid.max_ledger_version = is_int(float_value) && !is_float(float_value);

  if(inputs_valid.max_ledger_version){
    error.style.display = "none";
    ipcRenderer.send('set_setting', {max_ledger_version : float_value});

  }else{
    error.style.display = "block";
  }

  toggle_close();
}

// Wireup max ledger version input textbox
function wire_up_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");

  max_ledger_version.addEventListener("input",function(e){
    validate_max_ledger_version();
  },false);
}

// Close window on button click
function wire_up_close(){
  var close = document.getElementById("close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_window');
  },false);
}

// Disable close button if inputs are not valid
function toggle_close(){
  var offline = document.getElementById("offline");

  var close = document.getElementById("close");
  close.disabled =  offline.checked &&
                 !(inputs_valid.fee &&
              inputs_valid.sequence &&
       inputs_valid.max_ledger_version);
}

// Set specify_account setting
function wire_up_specify_account(){
  var specify_account = document.getElementById("specify_account");
  specify_account.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {specify_account : this.checked});
  },false);
}

// Wireup all controls
function wire_up_controls(){
  wire_up_testnet();
  wire_up_offline();
  wire_up_fee();
  wire_up_sequence();
  wire_up_max_ledger_version();
  wire_up_specify_account();
  wire_up_close();
}

// Reset offline settings to initial state
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

// Restore all settings inputs from global settings
function restore_settings(){
  var offline            = document.getElementById("offline");
  var testnet            = document.getElementById("testnet");
  var fee                = document.getElementById("fee");
  var sequence           = document.getElementById("sequence");
  var max_ledger_version = document.getElementById("max_ledger_version");
  var specify_account    = document.getElementById("specify_account");

  // Retrieve global settings
  ipcRenderer.on("got_settings", (event, settings) => {
    offline.checked          = settings.offline;
    testnet.checked          = settings.testnet;
    fee.value                = settings.fee;
    sequence.value           = settings.sequence;
    max_ledger_version.value = settings.max_ledger_version;
    specify_account.checked  = settings.specify_account;
    toggle_offline_settings();
  })

  ipcRenderer.send("get_settings")
}

// Wireup controls and restore settings on dom content being loaded
function dom_content_loaded(){
  wire_up_controls();
  restore_settings();
}

document.addEventListener("DOMContentLoaded", function(){
  dom_content_loaded();
});
