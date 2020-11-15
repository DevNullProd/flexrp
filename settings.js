const {ipcRenderer} = require('electron')

///

function wire_up_testnet(){
  var testnet = document.getElementById("testnet");
  testnet.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {testnet : this.checked});
  },false);
}

function wire_up_offline(){
  var fee_container = document.getElementById("fee_container");
  var sequence_container = document.getElementById("sequence_container");
  var max_ledger_version_container = document.getElementById("max_ledger_version_container");

  var offline = document.getElementById("offline");
  offline.addEventListener("change",function(e){
    reset_offline_settings();

    const offline_enabled = this.checked;
    if(offline_enabled){
      fee_container.style.display                = 'flex';
      sequence_container.style.display           = 'flex';
      max_ledger_version_container.style.display = 'flex';

    }else{
      fee_container.style.display                = 'none';
      sequence_container.style.display           = 'none';
      max_ledger_version_container.style.display = 'none';
    }

    ipcRenderer.send('set_setting', {offline : offline_enabled});
  },false);
}

function wire_up_fee(){
  var fee = document.getElementById("fee");
  var error = document.getElementById("fee_invalid")

  fee.addEventListener("input",function(e){
    const is_valid = Number.isInteger(parseInt(fee.value));
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {fee : fee.value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_sequence(){
  var sequence = document.getElementById("sequence");
  var error = document.getElementById("sequence_invalid");

  sequence.addEventListener("input",function(e){
    const is_valid = Number.isInteger(parseInt(sequence.value));
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {sequence : sequence.value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_max_ledger_version(){
  var max_ledger_version = document.getElementById("max_ledger_version");
  var error = document.getElementById("sequence_invalid");

  max_ledger_version.addEventListener("input",function(e){
    const is_valid = Number.isInteger(parseInt(max_ledger_version.value))
    if(is_valid){
      error.style.display = "none";
      ipcRenderer.send('set_setting', {max_ledger_version : max_ledger_version.value});

    }else{
      error.style.display = "block";
    }
  },false);
}

function wire_up_close(){
  var close = document.getElementById("close");
  close.addEventListener("click",function(e){
    ipcRenderer.send('close_settings');
  },false);
}

function wire_up_controls(){
  wire_up_testnet();
  wire_up_offline();
  wire_up_fee();
  wire_up_sequence();
  wire_up_max_ledger_version();
  wire_up_close();
}

function reset_offline_settings(){
  ipcRenderer.send('set_setting', {fee                : null});
  ipcRenderer.send('set_setting', {sequence           : null});
  ipcRenderer.send('set_setting', {max_ledger_version : null});

  var fee                = document.getElementById("fee")
  var sequence           = document.getElementById("sequence")
  var max_ledger_version = document.getElementById("max_ledger_version");

  fee.value                = null;
  sequence.value           = null;
  max_ledger_version.value = null;

  var fee_error                = document.getElementById("fee_invalid");
  var sequence_error           = document.getElementById("sequence_invalid");
  var max_ledger_version_error = document.getElementById("max_ledger_version_invalid");

  fee_error.style.display                = 'none';
  sequence_error.style.display           = 'none';
  max_ledger_version_error.style.display = 'none';
}

function restore_settings(){
  var offline            = document.getElementById("offline");
  var testnet            = document.getElementById("testnet");
  var fee                = document.getElementById("fee");
  var sequence           = document.getElementById("sequence");
  var max_ledger_version = document.getElementById("max_ledger_version");

  ipcRenderer.on("got_settings", (event, settings) => {
    offline.checked    = settings.offline;
    testnet.checked    = settings.testnet;
    fee                = settings.fee;
    sequence           = settings.sequence;
    max_ledger_version = settings.max_ledger_version;
  })

  ipcRenderer.send("get_settings")
}

function dom_content_loaded(){
  wire_up_controls();
  restore_settings();
}

document.addEventListener("DOMContentLoaded", function(){
  dom_content_loaded();
});
