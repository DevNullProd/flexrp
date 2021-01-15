// Toggle xrp_address visibility based on specify_account setting
function toggle_xrp_address(specify_account){
  var container = document.getElementById("xrp_address_container");
  var xrp_address = document.getElementById("xrp_address");

  if(specify_account){
    container.style.display = 'block';
    xrp_address.value = null;
    inputs_valid.xrp_address = false;

  }else{
    container.style.display = 'none';
    inputs_valid.xrp_address = true;
  }

  toggle_submit();
}

// Toggle xrp address error visibilty based on input validity
function toggle_xrp_address_error(){
  var xrp_address_invalid = document.getElementById("xrp_address_invalid")

  if(inputs_valid.xrp_address){
    xrp_address_invalid.style.display = 'none';

  }else{
    xrp_address_invalid.style.display = 'block';
  }
}

// Validate xrp address input format
function validate_xrp_address(){
  var xrp_address = document.getElementById("xrp_address");

  inputs_valid.xrp_address = offline_api.isValidAddress(xrp_address.value)
  toggle_xrp_address_error();
  toggle_submit();
}

// Validate xrp address on input
function wire_up_xrp_address(){
  // Update state of UI on settings
  ipcRenderer.on("settings_updated", (event, settings) => {
    toggle_xrp_address(settings.specify_account)
  })

  var xrp_address = document.getElementById("xrp_address");
  xrp_address.addEventListener("input",function(e){
    validate_xrp_address();
  },false);
}
