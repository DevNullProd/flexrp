// network operations and helpers

const RippleAPI = require('ripple-lib').RippleAPI;
const offline_api = new RippleAPI();

// Create new online API handle from settings
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

// Reset online api
function reset_online_api(){
  _online_api = null;
}

// Sign transaction using input values and settings
async function sign_tx(api, settings){
  var xrp_secret = document.getElementById("xrp_secret");
  var xrp_address = document.getElementById("xrp_address");
  var eth_address = document.getElementById("eth_address")
  var key_pair = {}

  // Generate the key_pair to use for signing purposes
  if (offline_api.isValidSecret(xrp_secret.value)) {
    // Secret key was specified
    key_pair = offline_api.deriveKeypair(xrp_secret.value);

  } else {
    // Private key was specified

    // Key is ED25519 if first two bytes are 'ED'
    const is_ed25519 = xrp_secret.value.length == 66 &&
                       xrp_secret.value.substr(0, 2) == 'ED';

    // Trim prefix if appropriate
    const private_key = xrp_secret.value.length == 66 ?
                           xrp_secret.value.substr(2) :
                           xrp_secret.value;

    // Generate public key
    const public_key = is_ed25519 ?
      'ED' + bytesToHex(ed25519.keyFromSecret(private_key).pubBytes()) :
      bytesToHex(secp256k1.keyFromPrivate(private_key).getPublic().encodeCompressed());

    // Prefix corresponding to key type
    const prefix = is_ed25519 ? 'ED' : '00';

    key_pair = {
      privateKey : prefix + private_key,
      publicKey  : public_key
    }
  }

  // Specify instructions if offline, else will be retrieved from server
  const instructions = settings.offline ? {
    fee : settings.fee,
    sequence : settings.sequence,
    maxLedgerVersion : settings.maxLedgerVersion
  } : {};

  // Specified xrp address or convert secret to public address
  const xrp_addr = settings.specify_account ?
    xrp_address.value :
    offline_api.deriveAddress(key_pair.publicKey);

  // Eth address to message key
  const message_key = ('02' + (new Array(25).join("0")) + eth_address.value.substr(2)).toUpperCase()

  // Create AccountSet transaction, setting the message key, and sign
  const prepared = await api.prepareSettings(xrp_addr, {messageKey: message_key}, instructions)
  return api.sign(prepared.txJSON, key_pair)
}

// Process transaction
async function process_tx(){
  var loading = document.getElementById("loading");

  // Offline mode: sign and render signed tx
  if(settings.offline){
    var signed;
    var error = null
    try{
      signed = await sign_tx(offline_api, settings)
    }catch(err){
      error = err
    }

    if(error){
      ipcRenderer.send("set_operation_result", {err : error})
      ipcRenderer.send("show_signing_failed");

    }else{
      ipcRenderer.send("set_operation_result", {tx : signed.signedTransaction});
      ipcRenderer.send("show_signed_tx");
    }


  // Online mode: sign and submit tx
  }else{
    const api = await online_api(settings)

    var error = null
    try{
      const signed = await sign_tx(api, settings)
      await api.submit(signed.signedTransaction);
    }catch(err){
      error = err
    }

    if(error){
      ipcRenderer.send("set_operation_result", {err: error})
      ipcRenderer.send("show_submit_failed");

    }else
      ipcRenderer.send("show_submit_success")
  }

  loading.style.display = 'none';
}
