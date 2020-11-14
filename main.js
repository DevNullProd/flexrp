const {ipcRenderer} = require('electron')

const RippleAPI = require('ripple-lib').RippleAPI;
const ripple_api = new RippleAPI();

const EthWallet = require('ethereumjs-wallet').default;
const { isValidAddress } = require('ethereumjs-util')

var inputs_valid = {xrp : false, eth : false};

///

function toggle_submit(){
  var submit = document.getElementById("submit");
  submit.disabled = !inputs_valid.xrp || !inputs_valid.eth;
}

function wire_up_settings(){
  var settings = document.getElementById("settings");
  settings.addEventListener("click",function(e){
    ipcRenderer.send('show_settings');
  },false);
}

function wire_up_help(){
  var help = document.getElementById("help");
  help.addEventListener("click",function(e){
    ipcRenderer.send('show_help');
  },false);
}

function validate_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")

  inputs_valid.xrp = ripple_api.isValidSecret(xrp_secret.value)

  if(inputs_valid.xrp){
    xrp_secret_invalid.style.display = 'none';

  }else{
    xrp_secret_invalid.style.display = 'block';
  }

  toggle_submit();
}

function wire_up_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");
  xrp_secret.addEventListener("input",function(e){
    validate_xrp_secret();
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

function validate_eth_address(){
  var eth_address = document.getElementById("eth_address")
  var eth_address_invalid = document.getElementById("eth_address_invalid")

  try{
    inputs_valid.eth = isValidAddress(eth_address.value);
  }catch(err){
    inputs_valid.eth = false;
  }

  if(inputs_valid.eth){
    eth_address_invalid.style.display = 'none';

  }else{
    eth_address_invalid.style.display = 'block';
  }

  toggle_submit();
}

function wire_up_eth_address(){
  var eth_address = document.getElementById("eth_address")
  eth_address.addEventListener("input",function(e){
    validate_eth_address();
  })
}

function wire_up_create_eth_address(){
  const wallet = EthWallet.generate();

  ipcRenderer.on("generate_eth_confirmed", () => {
    ipcRenderer.send("show_eth_secret", wallet.getPrivateKeyString());
  })

  var address = document.getElementById("eth_address")
  ipcRenderer.on("eth_secret_saved", (event) => {
    address.value = wallet.getAddressString();
    inputs_valid.eth = true;
    toggle_submit();
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
