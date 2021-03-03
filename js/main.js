// main window control logic

const {ipcRenderer} = require('electron')


// extra vars for private keypair analysis
const elliptic = require('elliptic')
const secp256k1 = elliptic.ec('secp256k1')
const ed25519 = elliptic.eddsa('ed25519')

function bytesToHex(a) {
  return a.map(function(byteValue) {
    const hex = byteValue.toString(16).toUpperCase()
    return hex.length > 1 ? hex : '0' + hex
  }).join('')
}



// Global application settings
var settings = {
  testnet : false,
  offline : false,
  fee : 0.00002,
  sequence : null,
  maxLedgerVersion : null,
  specify_account : false
};

// User input validation results
var inputs_valid = {
  xrp_secret : false,
  xrp_address : false,
  eth_address : false,
  fee : true,
  sequence : false,
  max_ledger_version : false
}

///

// Reset online api when settings are updated
function configure_network(){
  ipcRenderer.on("settings_updated", (event, settings) => {
    reset_online_api();
  })
}

///

// navigation subsection control logic

// Hide all sections
function navigation_hide_all(){
  const main     = document.getElementById("main_subsection");
  const settings = document.getElementById("settings_subsection");
  const info     = document.getElementById("info_subsection");

  main.style.display     = 'none';
  settings.style.display = 'none';
  info.style.display     = 'none';

  const main_indicator     = document.getElementById("navigation_main_indicator");
  const settings_indicator = document.getElementById("navigation_settings_indicator");
  const info_indicator     = document.getElementById("navigation_info_indicator");
  main_indicator.classList.remove("active")
  settings_indicator.classList.remove("active")
  info_indicator.classList.remove("active")
}

// Show main section, hide others on logo click
function wire_up_navigation_logo(){
  var logo = document.getElementById("navigation_logo");
  logo.addEventListener("click",function(e){
    navigation_hide_all();
    const subsection = document.getElementById("main_subsection");
    subsection.style.display = 'block';

    const indicator = document.getElementById("navigation_main_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show main section, hide others on home click
function wire_up_navigation_home(){
  var home = document.getElementById("navigation_home");
  home.addEventListener("click",function(e){
    navigation_hide_all();
    const subsection = document.getElementById("main_subsection");
    subsection.style.display = 'block';

    const indicator = document.getElementById("navigation_main_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show settings section, hide others on home click
function wire_up_navigation_settings(){
  var settings = document.getElementById("navigation_settings");
  settings.addEventListener("click",function(e){
    navigation_hide_all();
    const subsection = document.getElementById("settings_subsection");
    subsection.style.display = 'block';

    const indicator = document.getElementById("navigation_settings_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show help form on button click
function wire_up_navigation_info(){
  var info = document.getElementById("navigation_info");
  info.addEventListener("click",function(e){
    navigation_hide_all();
    const subsection = document.getElementById("info_subsection");
    subsection.style.display = 'block';

    const indicator = document.getElementById("navigation_info_indicator");
    indicator.classList.add("active")
  }, false);
}

// Wire up navigation components
function wire_up_navigation(){
  wire_up_navigation_logo();
  wire_up_navigation_home();
  wire_up_navigation_settings();
  wire_up_navigation_info();
}

///

// main subsection control logic

// Enable / disable 'Submit' button based on input validity
function toggle_submit(){
  var submit = document.getElementById("main_submit");

  // Conditions to enable button:
  // - xrp_secret must be valid (or be a valid privatekey)
  // - if specify_account setting is set
  //   - xrp_address must be valid
  // - eth_address must be valid
  // - if offline setting is set
  //   - fee must be valid
  //   - sequence must be valid
  //   - max_ledger_version must be valid
  submit.disabled = !inputs_valid.xrp_secret   ||
                    (settings.specify_account  &&
                    !inputs_valid.xrp_address) ||
                    !inputs_valid.eth_address  ||
                    (settings.offline          &&
                   (!inputs_valid.fee          ||
                    !inputs_valid.sequence     ||
                    !inputs_valid.max_ledger_version));
}

// Wire up 'Submit' button click: process transaction
function wire_up_submit(){
  var loading = document.getElementById("loading");
  var submit = document.getElementById("main_submit");
  submit.addEventListener("click",function(e){
    loading.style.display = 'block';
    submit.disabled = true;
    process_tx();
  })
}

// Wire up 'Clear' button click, reset input controls
function wire_up_clear(){
  var clear = document.getElementById("main_clear_all");
  clear.addEventListener("click",function(e){
    reset_xrp_secret();
    reset_xrp_address();
    reset_eth_address();
    toggle_submit();
  });
}

// Wire up main subsection controls
function wire_up_main_subsection(){
  wire_up_xrp_secret_subsection();
  wire_up_xrp_address_subsection();
  wire_up_eth_address_subsection();
  wire_up_submit();
  wire_up_clear();
}

///

// xrp secret subsection control logic

// Reset variables and DOM components to initial state
function reset_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")

  xrp_secret.value = null
  xrp_secret.classList.remove("error_input")
  xrp_secret_invalid.style.display = 'none';
  inputs_valid.xrp_secret = false;
}

// Toggle xrp secret error visibilty based on input validity
function toggle_xrp_secret_error(){
  var xrp_secret = document.getElementById("xrp_secret");
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")

  if(inputs_valid.xrp_secret){
    xrp_secret_invalid.style.display = 'none';
    xrp_secret.classList.remove("error_input")

  }else{
    xrp_secret_invalid.style.display = 'block';
    xrp_secret.classList.add("error_input")
  }
}

// Validate xrp secret input format
function validate_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");

  inputs_valid.xrp_secret = offline_api.isValidSecret(xrp_secret.value);
  if (!inputs_valid.xrp_secret) {
      // not a valid secret, so check to see if it's a valid HEX private key instead.
      // Is it > 64 chars?  if so, could be padded with double-zero at start
      const xrp_privatekey = (xrp_secret.length > 64) ? xrp_secret.value.slice(2) : xrp_secret.value;
      var re = /^[A-Fa-f0-9]{64}/g;  
      inputs_valid.xrp_secret = re.test(xrp_privatekey);  
  }
  toggle_xrp_secret_error();
  toggle_submit();
}

// Validate xrp secret on input
function wire_up_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");

  // Validate if we have the minimum # of characters
  xrp_secret.addEventListener("input",function(e){
    if(xrp_secret.value.length >= 29)
      validate_xrp_secret();
  },false);

  // Validate when we lose focus
  xrp_secret.addEventListener("blur",function(e){
    if(xrp_secret.value.length > 0)
      validate_xrp_secret();
  },false);
}

// Wire up toggle xrp secret visibility controls
function wire_up_toggle_xrp_secret(){
  var view = document.getElementById("view_xrp_secret");
  var hide = document.getElementById("hide_xrp_secret");
  var secret = document.getElementById("xrp_secret");

  view.addEventListener("click",function(e){
    view.style.display = 'none';
    hide.style.display = 'block';
    secret.type = 'text';
  },false);

  hide.addEventListener("click",function(e){
    view.style.display = 'block';
    hide.style.display = 'none';
    secret.type = 'password';
  },false);
}

// Wire up xrp secret subsection
function wire_up_xrp_secret_subsection(){
  wire_up_xrp_secret();
  wire_up_toggle_xrp_secret();
}

///

// xrp address subsection control logic

// Reset variables and DOM components to initial state
function reset_xrp_address(){
  var xrp_address = document.getElementById("xrp_address");
  var xrp_address_invalid = document.getElementById("xrp_address_invalid")

  xrp_address.value = null;
  xrp_address.classList.remove("error_input")
  xrp_address_invalid.style.display = 'none';
  inputs_valid.xrp_address = false;
}

// Toggle xrp_address visibility based on specify_account setting
function toggle_xrp_address(){
  var container = document.getElementById("xrp_address_subsection");
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

// Wire up xrp address subsection
function wire_up_xrp_address_subsection(){
  wire_up_xrp_address();
}

///

// eth address subsection control logic

const { isValidAddress } = require('ethereumjs-util')

// Reset variables and DOM components to initial state
function reset_eth_address(){
  var eth_address = document.getElementById("eth_address")
  var eth_address_invalid = document.getElementById("eth_address_invalid")

  eth_address.value = null
  eth_address.classList.remove("error_input")
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

// Wire up eth address subsection
function wire_up_eth_address_subsection(){
  wire_up_eth_address();
  wire_up_create_eth_address();
}

///

// settings subsection control logic

// Wire up settings subsection controls
function wire_up_settings_subsection(){
  wire_up_network_selector_subsection();
  wire_up_offline_toggle_subsection();
  wire_up_offline_settings_subsection();
  wire_up_xrp_account_toggle_subsection();
}

///

// network_selector component control logic

// Handle click on mainnet and testnet network components
function wire_up_network_selector(){
  var mainnet = document.getElementById("mainnet");
  var testnet = document.getElementById("testnet");

  // On mainnet
  // - set testnet to false
  // - update settings
  // - update DOM
  mainnet.addEventListener("click",function(e){
    settings.testnet = false;
    ipcRenderer.send('settings_updated');

    mainnet.classList.add('active')
    testnet.classList.remove('active')
  }, false);

  // On testnet
  // - set testnet to true
  // - update settings
  // - update DOM
  testnet.addEventListener("click",function(e){
    settings.testnet = true;
    ipcRenderer.send('settings_updated');

    mainnet.classList.remove('active')
    testnet.classList.add('active')
  }, false);
}

// Wire up network selector subsection
function wire_up_network_selector_subsection(){
  wire_up_network_selector();
}

///

// offline_toggle control input

// Toggle offline settings visibility based on offline input state
function toggle_offline_settings(){
  var offline = document.getElementById("offline_toggle");
  const offline_enabled = offline.checked;

  const settings = document.getElementById("offline_settings_subsection")
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

// Wire up offline toggle controls
function wire_up_offline_toggle_subsection(){
  wire_up_offline();
}

///

// offline_settings component control logic

// Validate fee input format:
// - must be a valid int or float
function validate_fee(){
  var fee = document.getElementById("fee");
  var error = document.getElementById("fee_invalid")

  const value = fee.value;
  const float_value = parseFloat(value)
  inputs_valid.fee = is_int(float_value) || is_float(float_value);

  // If valid: hide error and update setting
  if(inputs_valid.fee){
    fee.classList.remove("error_input")
    error.style.display = "none";
    settings.fee = value;
    ipcRenderer.send('settings_updated');

  // If invalid: show error
  }else{
    error.style.display = "block";
    fee.classList.add("error_input")
  }

  toggle_submit();
}

// Validate fee on input change
function wire_up_fee(){
  var fee = document.getElementById("fee");
  fee.value = settings.fee;

  fee.addEventListener("input",function(e){
    validate_fee();
  },false);
}

// Validate sequence input format:
// - must be valid integer (not float)
function validate_sequence(){
  var sequence = document.getElementById("sequence");
  var error = document.getElementById("sequence_invalid");

  const float_value = parseFloat(sequence.value)
  inputs_valid.sequence = is_int(float_value) && !is_float(float_value);

  // If valid: hide error and update setting
  if(inputs_valid.sequence){
    sequence.classList.remove("error_input")
    error.style.display = "none";
    settings.sequence = float_value;
    ipcRenderer.send('settings_updated');

  // If invalid: show error
  }else{
    sequence.classList.add("error_input")
    error.style.display = "block";
  }

  toggle_submit();
}

// Validate sequence on input change
function wire_up_sequence(){
  var sequence = document.getElementById("sequence");
  sequence.addEventListener("input",function(e){
    validate_sequence();
  },false);
}

// Validate max ledger version input format
// - must be a valid int (not float)
function validate_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");
  var error = document.getElementById("max_ledger_version_invalid");

  const float_value = parseFloat(max_ledger_version.value);
  inputs_valid.max_ledger_version = is_int(float_value) && !is_float(float_value);

  // If valid: hide error and update setting
  if(inputs_valid.max_ledger_version){
    max_ledger_version.classList.remove("error_input")
    error.style.display = "none";
    settings.max_ledger_version = float_value;
    ipcRenderer.send('settings_updated');

  // If invalid: show error
  }else{
    max_ledger_version.classList.add("error_input")
    error.style.display = "block";
  }

  toggle_submit();
}

// Validate max_ledger_version on input change
function wire_up_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");

  max_ledger_version.addEventListener("input",function(e){
    validate_max_ledger_version();
  },false);
}

// Wire up offline settings subsection
function wire_up_offline_settings_subsection(){
  wire_up_fee();
  wire_up_sequence();
  wire_up_max_ledger_version();
}

///

// xrp account toggle subsection control logic

// Set specify_account setting on input change
function wire_up_specify_account(){
  var specify_account = document.getElementById("xrp_account_toggle");
  specify_account.addEventListener("change",function(e){
    settings.specify_account = this.checked;
    ipcRenderer.send('settings_updated');
  }, false);
}

// Wire up xrp account toggle subsection
function wire_up_xrp_account_toggle_subsection(){
  wire_up_specify_account();
}

///

// DOM Control Loaded callback,
// - wire up components
// - configure network
function main_dom_content_loaded(){
  wire_up_navigation()
  wire_up_main_subsection()
  wire_up_settings_subsection()
  configure_network();
}

document.addEventListener("DOMContentLoaded", main_dom_content_loaded);
