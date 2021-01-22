// navigation partial control logic

// Hide all sections
function navigation_hide_all(){
  const main     = document.getElementById("main_partial");
  const settings = document.getElementById("settings_partial");
  const info     = document.getElementById("info_partial");

  main.style.display     = 'none';
  settings.style.display = 'none';
  info.style.display     = 'none';

  const main_indicator     = document.getElementById("_navigation_main_indicator");
  const settings_indicator = document.getElementById("_navigation_settings_indicator");
  const info_indicator     = document.getElementById("_navigation_info_indicator");
  main_indicator.classList.remove("active")
  settings_indicator.classList.remove("active")
  info_indicator.classList.remove("active")
}

// Show main section, hide others on logo click
function wire_up_navigation_logo(){
  var logo = document.getElementById("_navigation_logo");
  logo.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("main_partial");
    partial.style.display = 'block';

    const indicator = document.getElementById("_navigation_main_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show main section, hide others on home click
function wire_up_navigation_home(){
  var home = document.getElementById("_navigation_home");
  home.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("main_partial");
    partial.style.display = 'block';

    const indicator = document.getElementById("_navigation_main_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show settings section, hide others on home click
function wire_up_navigation_settings(){
  var settings = document.getElementById("_navigation_settings");
  settings.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("settings_partial");
    partial.style.display = 'block';

    const indicator = document.getElementById("_navigation_settings_indicator");
    indicator.classList.add("active")
  }, false);
}

// Show help form on button click
function wire_up_navigation_info(){
  var info = document.getElementById("_navigation_info");
  info.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("info_partial");
    partial.style.display = 'block';

    const indicator = document.getElementById("_navigation_info_indicator");
    indicator.classList.add("active")
  }, false);
}

///

// Partial Loaded callback,
// - wire up navigation components
function navigation_partial_loaded(){
  wire_up_navigation_logo();
  wire_up_navigation_home();
  wire_up_navigation_settings();
  wire_up_navigation_info();
}
