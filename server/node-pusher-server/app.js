var express = require("express");
var url = require("url");
var Pusher = require("pusher");

var bodyParser = require('body-parser');
 

var pusher = new Pusher({
  appId: '210185',
  key: '376656a8edb3f7821b1a',
  secret: 'ccad9a4b31a608cbd053',
  encrypted: true
});


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

app.listen(3000);