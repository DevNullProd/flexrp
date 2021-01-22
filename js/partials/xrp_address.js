// xrp_address component control logic

// Reset variables and DOM components to initial state
function reset_xrp_address(){
  var xrp_address = document.getElementById("xrp_address");
  var xrp_address_invalid = document.getElementById("xrp_address_invalid")

  xrp_address.value = null;
  xrp_address_invalid.style.display = 'none';
  inputs_valid.xrp_address = false;
}

// Toggle xrp_address visibility based on specify_account setting
function toggle_xrp_address(){
  var container = document.getElementById("_xrp_address_partial");
  var xrp_address = document.getElementById("xrp_address");

  if(settings.specify_account){
    container.style.display = 'block';

  }else{
    container.style.display = 'none';
  }

  toggle_submit();
}

// Toggle xrp address error visibilty based on input validity
function toggle_xrp_address_error(){
  var xrp_address = document.getElementById("xrp_address");
  var xrp_address_invalid = document.getElementById("xrp_address_invalid")

  if(inputs_valid.xrp_address){
    xrp_address_invalid.style.display = 'none';
    xrp_address.classList.remove("error_input")

  }else{
    xrp_address_invalid.style.display = 'block';
    xrp_address.classList.add("error_input")
  }
}

// Validate xrp address input format
function validate_xrp_address(){
  var xrp_address = document.getElementById("xrp_address");

  inputs_valid.xrp_address = offline_api.isValidAddress(xrp_address.value);
  toggle_xrp_address_error();
  toggle_submit();
}

// Validate xrp address on input
function wire_up_xrp_address(){
  // If specify_account setting changed, need to toggle component visibility
  ipcRenderer.on("settings_updated", (event, settings) => {
    toggle_xrp_address();
  })

  // Validate if we have the minimum # of characters
  var xrp_address = document.getElementById("xrp_address");
  xrp_address.addEventListener("input",function(e){
    if(xrp_address.value.length >= 34)
      validate_xrp_address();
  }, false);

  // Validate when we lose focus
  xrp_address.addEventListener("blur",function(e){
    if(xrp_address.value.length > 0)
      validate_xrp_address();
  }, false);
}

///

// Partial Loaded callback,
// - wire up controls
function xrp_address_partial_loaded(){
  wire_up_xrp_address();
}
