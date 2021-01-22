// main partial control logic

const {ipcRenderer} = require('electron')

// Append partials to DOM

function load_xrp_secret_partial(){
  append_partial("xrp_secret_partial", load_partial("xrp_secret"));
}

function load_xrp_address_partial(){
  append_partial("xrp_address_partial", load_partial("xrp_address"));
}

function load_eth_address_partial(){
  append_partial("eth_address_partial", load_partial("eth_address"));
}

///

// Enable / disable 'Submit' button based on input validity
function toggle_submit(){
  var submit = document.getElementById("_main_partial_submit");

  // Conditions to enable button:
  // - xrp_secret must be valid
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
  var submit = document.getElementById("_main_partial_submit");
  submit.addEventListener("click",function(e){
    loading.style.display = 'block';
    submit.disabled = true;
    process_tx();
  })
}

// Wire up 'Clear' button click, reset input controls
function wire_up_clear(){
  var clear = document.getElementById("_main_partial_clear_all");
  clear.addEventListener("click",function(e){
    reset_xrp_secret();
    reset_xrp_address();
    reset_eth_address();
    toggle_submit();
  });
}

///

// Partial Loaded callback,
// - load partials
// - wire up controls
function main_partial_loaded(){
  load_xrp_secret_partial();
  load_xrp_address_partial();
  load_eth_address_partial();
  wire_up_submit();
  wire_up_clear();
}
