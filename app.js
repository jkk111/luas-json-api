var express = require("express");
var app = express();
app.use(require("./index.js"));
app.listen(80);