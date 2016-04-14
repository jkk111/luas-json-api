var jsdom = require("jsdom");
var express = require("express"),
app = express();
var fs = require("fs");
var stops;
try {
  stops = JSON.parse(fs.readFileSync("stops.json", "utf8"));
} catch(e) {
  console.log("Couldn't open stops.json, run buildStops.js to get stop list.");
  process.exit();
}

app.get("/stop/:stop", function(req, res) {
  if(!isInStops(req.params.stop)) {
    return res.status(404).send("Could not find stop");
  }
  jsdom.env("https://www.luas.ie/luaspid.html?get=" + req.params.stop, function(err, window) {
    var document = window.document;
    var trips = [];
    var inbound = document.querySelectorAll(".Inbound > .location");
    var outbound = document.querySelectorAll(".Outbound > .location");

    for(var i = 0; i < inbound.length; i++) {
      if(inbound[i].innerHTML !== "No trams forecast") {
        trips.push({time: inbound[i].nextSibling.innerHTML, dest: inbound[i].innerHTML, inbound: true});
      }
    }
    for(var i = 0; i < outbound.length; i++) {
      if(outbound[i].innerHTML !== "No trams forecast") {
        trips.push({time: outbound[i].nextSibling.innerHTML, dest: outbound[i].innerHTML, inbound: false});
      }
    }

    res.send(trips);
  });
});

app.get("/stops", function(req, res) {
  res.json(stops);
})

function isInStops(stop) {
  for(var i = 0 ; i < stops.length; i++) {
    if(stop === stops[i])
      return true;
  }
  return false;
}

module.exports = app;