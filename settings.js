const {ipcRenderer} = require('electron')

///

function wire_up_testnet(){
  var testnet = document.getElementById("testnet");
  testnet.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {testnet : this.checked});
  },false);
}

function wire_up_offline(){
  var offline = document.getElementById("offline");
  offline.addEventListener("change",function(e){
    ipcRenderer.send('set_setting', {offline : this.checked});
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
  wire_up_close();
}

function restore_settings(){
  var offline = document.getElementById("offline");
  var testnet = document.getElementById("testnet");

  ipcRenderer.on("got_settings", (event, settings) => {
    offline.checked = settings.offline
    testnet.checked = settings.testnet
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
