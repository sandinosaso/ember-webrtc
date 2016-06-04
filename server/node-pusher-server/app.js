var express = require("express");
var url = require("url");
var Pusher = require("pusher");
var config = require('./config');

var bodyParser = require('body-parser');
 

var pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  encrypted: config.pusher.encrypted,
});

var port = config.web.port;


var app = express();

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post("/messages", function(req, res){
  var data = req.body;

  console.log(data);
  pusher.trigger('messages', 'new_message', data);
  res.send("OK");
});

app.listen(config.web.port);