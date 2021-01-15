// Tracks validity of inputs
var inputs_valid = {
  fee : false,
  sequence : false,
  max_ledger_version : false
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

function restore_offline_settings_partial(settings){
  var fee                = document.getElementById("fee");
  var sequence           = document.getElementById("sequence");
  var max_ledger_version = document.getElementById("max_ledger_version");

  fee.value                = settings.fee;
  sequence.value           = settings.sequence;
  max_ledger_version.value = settings.max_ledger_version;
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
