// Toggle xrp secret error visibilty based on input validity
function toggle_xrp_secret_error(){
  var xrp_secret_invalid = document.getElementById("xrp_secret_invalid")

  if(inputs_valid.xrp_secret){
    xrp_secret_invalid.style.display = 'none';

  }else{
    xrp_secret_invalid.style.display = 'block';
  }
}

// Validate xrp secret input format
function validate_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");

  inputs_valid.xrp_secret = offline_api.isValidSecret(xrp_secret.value)
  toggle_xrp_secret_error();
  toggle_submit();
}

// Validate xrp secret on input
function wire_up_xrp_secret(){
  var xrp_secret = document.getElementById("xrp_secret");
  xrp_secret.addEventListener("input",function(e){
    validate_xrp_secret();
  },false);
}

// Wire up toggle xrp secret visibility controls
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
