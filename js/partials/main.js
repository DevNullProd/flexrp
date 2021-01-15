function load_xrp_secret_partial(){
  append_partial("xrp_secret_partial", load_partial("xrp_secret"));
}

function load_xrp_address_partial(){
  append_partial("xrp_address_partial", load_partial("xrp_address"));
}

function load_eth_address_partial(){
  append_partial("eth_address_partial", load_partial("eth_address"));
}

// Enable / disable submit button based on xrp and eth input validity
function toggle_submit(){
  var submit = document.getElementById("submit");
  submit.disabled = !inputs_valid.xrp_secret  ||
                    !inputs_valid.xrp_address ||
                    !inputs_valid.eth_address;
}

// Wire up submit button click: retrieve settings and process transaction
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
  wire_up_submit();
  wire_up_clear();
}

function main_partial_loaded(){
  load_xrp_secret_partial();
  load_xrp_address_partial();
  load_eth_address_partial();
  wire_up_controls();
}
