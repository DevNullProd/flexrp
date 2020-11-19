function show_dialog(options){
  var container = document.createElement("div");
  container.style['display'] = 'flex';
  container.style['justify-content'] = 'space-evenly';
  container.style['padding-top'] = '25px';

  if(options.buttons){
    for(var b = 0; b < options.buttons.length; b += 1){
      var obtn = options.buttons[b];
      var btn  = document.createElement("button");
      var text = document.createTextNode(obtn.text);
      btn.id   = obtn.id;

      if(obtn.disabled)
        btn.disabled = true;

      btn.appendChild(text)
      container.appendChild(btn);
    }

  }else{
    var ok   = document.createElement("button")
    var text = document.createTextNode("OK")
    ok.appendChild(text);
    container.appendChild(ok);
  }

  var body = document.getElementsByTagName("body")[0];
  body.style['padding-top'] = '15px'
  body.appendChild(container);
}
