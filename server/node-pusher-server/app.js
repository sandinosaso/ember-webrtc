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

var port = config.server.port;


var app = express();
// app.use(function(req, res, next) {
//   req.rawBody = "";
//   req.setEncoding("utf8");

//   req.on("data", function(chunk) {
//     req.rawBody += chunk;
//   });

//   req.on("end", function() {
//     next();
//   });
// });

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
  // var webhook = pusher.webhook(req);
  // console.log("data:", webhook.getData());
  // console.log("events:", webhook.getEvents());
  // console.log("time:", webhook.getTime());
  // console.log("valid:", webhook.isValid());
  res.send("OK");
});

app.listen(config.web.port);