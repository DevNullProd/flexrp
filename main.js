const {ipcRenderer} = require('electron')

const RippleAPI = require('ripple-lib').RippleAPI;
const offline_api = new RippleAPI();

const { isValidAddress } = require('ethereumjs-util')

var inputs_valid = {xrp : false, eth : false};

var _online_api;
async function online_api(settings){
  if(_online_api) return _online_api;

  _online_api = new RippleAPI({
    server : settings.testnet ? 'wss://s.altnet.rippletest.net:51233' :
                                'wss://s1.ripple.com'
  })

  await _online_api.connect();
  return _online_api;
}

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

function toggle_xrp_secret_error(){
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")

  if(inputs_valid.xrp){
    xrp_secret_invalid.style.display = 'none';

  }else{
    xrp_secret_invalid.style.display = 'block';
  }
}

function validate_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");

  inputs_valid.xrp = offline_api.isValidSecret(xrp_secret.value)
  toggle_xrp_secret_error();
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

function toggle_eth_address_error(){
  var eth_address_invalid = document.getElementById("eth_address_invalid")
  if(inputs_valid.eth){
    eth_address_invalid.style.display = 'none';

  }else{
    eth_address_invalid.style.display = 'block';
  }
}

function validate_eth_address(){
  var eth_address = document.getElementById("eth_address")

  try{
    inputs_valid.eth = isValidAddress(eth_address.value);
  }catch(err){
    inputs_valid.eth = false;
  }

  toggle_eth_address_error();
  toggle_submit();
}

function wire_up_eth_address(){
  var eth_address = document.getElementById("eth_address")
  eth_address.addEventListener("input",function(e){
    validate_eth_address();
  })
}

function wire_up_create_eth_address(){
  var address = document.getElementById("eth_address")
  ipcRenderer.on("update_eth_address", (event, eth_address) => {
    address.value = eth_address;
    inputs_valid.eth = true;
    toggle_eth_address_error();
    toggle_submit();
  })

  var create = document.getElementById("create_eth_address");
  create.addEventListener("click",function(e){
    ipcRenderer.send('confirm_generate_eth');
  },false);
}

async function sign_tx(api, instructions){
  var xrp_secret = document.getElementById("xrp_secret");
  var eth_address = document.getElementById("eth_address")

  // Secret to public address
  const xrp_addr = offline_api.deriveAddress(offline_api.deriveKeypair(xrp_secret.value).publicKey)

  // Eth address to message key
  const message_key = ('02' + (new Array(25).join("0")) + eth_address.value.substr(2)).toUpperCase()

  // Create AccountSet transaction, setting the message key, and sign
  const prepared = await api.prepareSettings(xrp_addr, {messageKey: message_key}, instructions)
  return api.sign(prepared.txJSON, xrp_secret.value)
}

async function process_tx(settings){
  var loader = document.getElementById("loader");

  if(settings.offline){
    const instructions = {
      fee : settings.fee,
      sequence : settings.sequence,
      maxLedgerVersion : settings.maxLedgerVersion
    }

    var signed;
    var error = null
    try{
      signed = await sign_tx(offline_api, instructions)
    }catch(err){
      error = err
    }

    if(error){
      ipcRenderer.send("sign_failed", error);

    }else{
      ipcRenderer.send("set_signed_tx", signed.signedTransaction);
      ipcRenderer.send("show_signed_tx");
    }

  }else{
    const api = await online_api(settings)

    var error = null
    try{
      const signed = await sign_tx(api, {})
      await api.submit(signed.signedTransaction);
    }catch(err){
      error = err
    }

    if(error)
      ipcRenderer.send("submit_failed", error)
    else
      ipcRenderer.send("submit_success")
  }

  loader.style.display = 'none';
}

function wire_up_submit(){
  var loader = document.getElementById("loader");
  var submit = document.getElementById("submit");
  submit.addEventListener("click",function(e){
    loader.style.display = 'block';
    submit.style.display = 'none';
    ipcRenderer.on("got_settings", (event, settings) => {
      process_tx(settings);
    })
    ipcRenderer.send("get_settings")
  })
}

function wire_up_controls(){
  wire_up_settings();
  wire_up_help();
  wire_up_xrp_secret();
  wire_up_toggle_xrp_secret();
  wire_up_eth_address();
  wire_up_create_eth_address();
  wire_up_submit();
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
