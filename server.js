// Dependencies.
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var uuid = require("uuid-random");

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var port = 8080;

app.set("port", port);
app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, function () {
  console.log("Starting server on port " + port);
});

var players = {};
io.on("connection", function (socket) {
  // reciving new message
  socket.on("new player", function () {
    players[socket.id] = {
      x: 300,
      y: 300,
    };
  });
  // reciving new message
  socket.on("movement", function (data) {
    var player = players[socket.id] || {};
    console.log(players);
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function () {
  var message = new Object();
  message.messageId = uuid();
  message.players  = players;
  //sending message
  io.sockets.emit("state", message);
  //console.log(message);
}, 1000 / 60);
