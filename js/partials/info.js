function load_security_partial(){
  append_partial("security_partial", load_partial("security"));
}

function info_partial_loaded(){
  load_security_partial();
}
