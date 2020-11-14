const {ipcRenderer} = require('electron')

const RippleAPI = require('ripple-lib').RippleAPI;
const ripple_api = new RippleAPI();

///

function wire_up_settings(){
  var settings = document.getElementById("settings");
  settings.addEventListener("click",function(e){
  },false);
}

function wire_up_help(){
  var help = document.getElementById("help");
  help.addEventListener("click",function(e){
    ipcRenderer.send('show_help');
  },false);
}

function wire_up_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")
  xrp_secret.addEventListener("input",function(e){
    const valid = ripple_api.isValidSecret(xrp_secret.value)

    if(valid){
      xrp_secret_invalid.style.display = 'none';

    }else{
      xrp_secret_invalid.style.display = 'block';
    }
  },false);
}

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

function wire_up_eth_address(){
}

function wire_up_create_eth_address(){
  ipcRenderer.on("generate_eth_confirmed", () => {
    ipcRenderer.send("generate_eth");
  })

  var address = document.getElementById("eth_address")
  ipcRenderer.on("generated_eth", (event, addr) => {
    address.value = addr;
  })

  var create = document.getElementById("create_eth_address");
  create.addEventListener("click",function(e){
    ipcRenderer.send('confirm_generate_eth');
  },false);
}

function wire_up_controls(){
  wire_up_settings();
  wire_up_help();
  wire_up_xrp_secret();
  wire_up_toggle_xrp_secret();
  wire_up_eth_address();
  wire_up_create_eth_address();
}

function show_initial_alert(){
  ipcRenderer.send('initial_alert');
}

function dom_content_loaded(){
  wire_up_controls();
  show_initial_alert();
}

document.addEventListener("DOMContentLoaded", function(){
  dom_content_loaded();
});
