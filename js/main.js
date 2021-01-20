// Global application settings
var settings = {
  testnet : false,
  offline : false,
  fee : null,
  sequence : null,
  maxLedgerVersion : null,
  specify_account : false
};

// User input validation results
var inputs_valid = {
  xrp_secret : false,
  xrp_address : false,
  eth_address : false,
  fee : false,
  sequence : false,
  max_ledger_version : false
}

function load_navigation_partial(){
  append_partial("navigation_partial", load_partial("navigation"));
}

function load_main_partial(){
  append_partial("main_partial", load_partial("main"));
}

function load_settings_partial(){
  append_partial("settings_partial", load_partial("settings"));
}

function load_info_partial(){
  append_partial("info_partial", load_partial("info"));
}

function main_dom_content_loaded(){
  load_navigation_partial()
  load_main_partial()
  load_settings_partial()
  load_info_partial()
}

document.addEventListener("DOMContentLoaded", main_dom_content_loaded);
