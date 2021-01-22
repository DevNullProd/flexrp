// Logic to load partial components and append to page

const fs = require('fs');
const path = require('path');

// Load and return partial specified by name from
// 'partials' subdirs under html, js, and css.
function load_partial(name){
  var partial = {name}

  const html = "./html/partials/" + name + ".html";
  if(fs.existsSync(html))
    partial.html = fs.readFileSync(html, 'utf8');

  const js = path.resolve("./js/partials/" + name + ".js");
  if(fs.existsSync(js))
    partial.js = js;

  const css = path.resolve("./css/partials/" + name + ".css");
  if(fs.existsSync(css))
    partial.css = css;

  return partial;
}

// Append given partial to DOM component identified w/ ID.
// If appending JS component and partial.name + '_partial_loaded'
// is defined, invoke it.
function append_partial(id, partial){
  const dom = document.getElementById(id);
  if(partial.html)
    dom.innerHTML = partial.html;

  if(partial.css){
    const link = document.createElement("link");
    link.setAttribute("href", partial.css);
    link.setAttribute("rel", "stylesheet");
    document.head.appendChild(link);
  }

  if(partial.js){
    const script = document.createElement("script");
    script.setAttribute("src", partial.js);
    script.setAttribute("type", "text/javascript");
    script.onload = function(){
      const loaded = window[partial.name + "_partial_loaded"]
      if(loaded) loaded();
    }
    document.head.appendChild(script);
  }
}
