// Validate fee input format
function validate_fee(){
  var fee = document.getElementById("fee");
  var error = document.getElementById("fee_invalid")

  const value = fee.value;
  const float_value = parseFloat(value)
  inputs_valid.fee = is_int(float_value) || is_float(float_value);

  if(inputs_valid.fee){
    fee.classList.remove("error_input")
    error.style.display = "none";
    settings.fee = value;
    ipcRenderer.send('settings_updated');

  }else{
    error.style.display = "block";
    fee.classList.add("error_input")
  }

  toggle_submit();
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
    sequence.classList.remove("error_input")
    error.style.display = "none";
    settings.sequence = float_value;
    ipcRenderer.send('settings_updated');

  }else{
    sequence.classList.add("error_input")
    error.style.display = "block";
  }

  toggle_submit();
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
    max_ledger_version.classList.remove("error_input")
    error.style.display = "none";
    settings.max_ledger_version = float_value;
    ipcRenderer.send('settings_updated');

  }else{
    max_ledger_version.classList.add("error_input")
    error.style.display = "block";
  }

  toggle_submit();
}

// Wireup max ledger version input textbox
function wire_up_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");

  max_ledger_version.addEventListener("input",function(e){
    validate_max_ledger_version();
  },false);
}

function offline_settings_partial_loaded(){
  wire_up_fee();
  wire_up_sequence();
  wire_up_max_ledger_version();
}
