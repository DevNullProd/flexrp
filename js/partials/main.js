const {ipcRenderer} = require('electron')

function load_xrp_secret_partial(){
  append_partial("xrp_secret_partial", load_partial("xrp_secret"));
}

function load_xrp_address_partial(){
  append_partial("xrp_address_partial", load_partial("xrp_address"));
}

function load_eth_address_partial(){
  append_partial("eth_address_partial", load_partial("eth_address"));
}

// Enable / disable submit button based on xrp and eth input validity
function toggle_submit(){
  var submit = document.getElementById("_main_partial_submit");
  submit.disabled = !inputs_valid.xrp_secret   ||
                    (settings.specify_account  &&
                    !inputs_valid.xrp_address) ||
                    !inputs_valid.eth_address  ||
                    (settings.offline          &&
                   (!inputs_valid.fee          ||
                    !inputs_valid.sequence     ||
                    !inputs_valid.max_ledger_version));
}

// Wire up submit button click: retrieve settings and process transaction
function wire_up_submit(){
  var loading = document.getElementById("loading");
  var submit = document.getElementById("_main_partial_submit");
  submit.addEventListener("click",function(e){
    loading.style.display = 'block';
    submit.disabled = true;
    process_tx();
  })
}

function wire_up_clear(){
  var clear = document.getElementById("_main_partial_clear_all");
  clear.addEventListener("click",function(e){
    reset_xrp_secret();
    reset_xrp_address();
    reset_eth_address();
    toggle_submit();
  });
}

function wire_up_controls(){
  wire_up_submit();
  wire_up_clear();
}

function main_partial_loaded(){
  load_xrp_secret_partial();
  load_xrp_address_partial();
  load_eth_address_partial();
  wire_up_controls();
}
