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

// Restore all settings inputs from global settings
function restore_settings(){
  // Global settings retrieved callback
  ipcRenderer.on("got_settings", (event, settings) => {
    restore_network_selector_partial(settings);
    restore_offline_toggle_partial(settings);
    restore_offline_settings_partial(settings);
    restore_xrp_account_toggle_partial(settings);
  })

  // Retrieve global settings
  ipcRenderer.send("get_settings")
}

// Wireup controls and restore settings on dom content being loaded
function settings_dom_content_loaded(){
  load_network_selector_partial();
  load_offline_toggle_partial();
  load_offline_settings_partial();
  load_xrp_account_toggle_partial();
  restore_settings();
}

document.addEventListener("DOMContentLoaded", settings_dom_content_loaded);
