var jsdom = require("jsdom");
var fs = require("fs");
var stopsFinal = [];
jsdom.env("https://www.luas.ie/red-line-inputs.html", function(err, window) {
  if(err) console.log(err);
  var stops = window.document.getElementsByTagName("option");
  for(var i = 1; i < stops.length; i++) {
    stopsFinal.push(stops[i].innerHTML);
  }
  jsdom.env("https://www.luas.ie/green-line-inputs.html", function(err, window) {
    if(err) console.log(err);
    var stops = window.document.getElementsByTagName("option");
    for(var i = 1; i < stops.length; i++) {
      stopsFinal.push(stops[i].innerHTML);
    }
    fs.writeFileSync("stops.json", JSON.stringify(stopsFinal, null, "  "), "utf8");
  });
});