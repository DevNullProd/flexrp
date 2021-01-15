function load_network_selector_partial(){
  append_partial("network_selector_partial", load_partial("network_selector"));
}

function load_offline_toggle_partial(){
  append_partial("offline_toggle_partial", load_partial("offline_toggle"));
}

function load_offline_settings_partial(){
  append_partial("offline_settings_partial", load_partial("offline_settings"));
}

function load_xrp_account_toggle_partial(){
  append_partial("xrp_account_toggle_partial", load_partial("xrp_account_toggle"));
}

function settings_partial_loaded(){
  load_network_selector_partial();
  load_offline_toggle_partial();
  load_offline_settings_partial();
  load_xrp_account_toggle_partial();
}
