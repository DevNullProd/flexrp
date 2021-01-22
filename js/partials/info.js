// info partial control logic

// Append security partial to dom
function load_security_partial(){
  append_partial("security_partial", load_partial("security"));
}

///

// Partial Loaded callback,
// - load security partial
function info_partial_loaded(){
  load_security_partial();
}
