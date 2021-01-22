// eth_address component control logic

const { isValidAddress } = require('ethereumjs-util')

// Reset variables and DOM components to initial state
function reset_eth_address(){
  var eth_address = document.getElementById("eth_address")
  var eth_address_invalid = document.getElementById("eth_address_invalid")

  eth_address.value = null
  eth_address_invalid.style.display = 'none';
  inputs_valid.eth_address = false;
}

// Toggle eth address error visibilty based on input validity
function toggle_eth_address_error(){
  var eth_address = document.getElementById("eth_address")
  var eth_address_invalid = document.getElementById("eth_address_invalid")

  if(inputs_valid.eth_address){
    eth_address_invalid.style.display = 'none';
    eth_address.classList.remove("error_input")

  }else{
    eth_address_invalid.style.display = 'block';
    eth_address.classList.add("error_input")
  }
}

// Validate eth address on input
function validate_eth_address(){
  var eth_address = document.getElementById("eth_address")

  try{
    inputs_valid.eth_address = isValidAddress(eth_address.value);
  }catch(err){
    inputs_valid.eth_address = false;
  }

  toggle_eth_address_error();
  toggle_submit();
}

// Validate eth address on input
function wire_up_eth_address(){
  var eth_address = document.getElementById("eth_address")

  // Validate if we have the minimum # of characters
  eth_address.addEventListener("input",function(e){
    if(eth_address.value.length >= 42)
      validate_eth_address();
  })

  // Validate when we lose focus
  eth_address.addEventListener("blur",function(e){
    if(eth_address.value.length > 0)
      validate_eth_address();
  })
}

// Wire up eth address generator control
function wire_up_create_eth_address(){
  // Set address on form when updated
  var address = document.getElementById("eth_address")
  ipcRenderer.on("update_eth_address", (event, eth_address) => {
    address.value = eth_address;
    inputs_valid.eth_address = true;
    toggle_eth_address_error();
    toggle_submit();
  })

  // show_generate_eth window when 'Create' is clicked
  var create = document.getElementById("create_eth_address");
  create.addEventListener("click",function(e){
    ipcRenderer.send('show_generate_eth');
  },false);
}

///

// Partial Loaded callback,
// - wire up controls
function eth_address_partial_loaded(){
  wire_up_eth_address();
  wire_up_create_eth_address();
}
