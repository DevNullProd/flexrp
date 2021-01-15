// Hide all sections
function navigation_hide_all(){
  const main     = document.getElementById("main_partial");
  const settings = document.getElementById("settings_partial");
  const info     = document.getElementById("info_partial");

  main.style.display     = 'none';
  settings.style.display = 'none';
  info.style.display     = 'none';
}

// Show main section, hide others on logo click
function wire_up_navigation_logo(){
  var logo = document.getElementById("_navigation_partial_logo");
  logo.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("main_partial");
    partial.style.display = 'block';
  }, false);
}

// Show main section, hide others on home click
function wire_up_navigation_home(){
  var home = document.getElementById("_navigation_partial_home");
  home.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("main_partial");
    partial.style.display = 'block';
  }, false);
}

// Show settings section, hide others on home click
function wire_up_navigation_settings(){
  var settings = document.getElementById("_navigation_partial_settings");
  settings.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("settings_partial");
    partial.style.display = 'block';
  }, false);
}

// Show help form on button click
function wire_up_navigation_info(){
  var info = document.getElementById("_navigation_partial_info");
  info.addEventListener("click",function(e){
    navigation_hide_all();
    const partial = document.getElementById("info_partial");
    partial.style.display = 'block';
  }, false);
}

function navigation_partial_loaded(){
  wire_up_navigation_logo();
  wire_up_navigation_home();
  wire_up_navigation_settings();
  wire_up_navigation_info();
}
