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
  // reciving new player connection
  socket.on("new player", function () {
    players[socket.id] = {
      id: socket.id,
      x: 300,
      y: 400
    };
    var player = players[socket.id];
    //sending player details
    io.sockets.emit("player details", player);
  });

  // reciving movements and save in players object
  socket.on("player movement", function (data) {
    var player = data.player || {};
    var serverPlayer = players[player.id] || {};

    if (player.id === serverPlayer.id) {
      serverPlayer.x = player.x;
      serverPlayer.y = player.y;
    }

    var message = {
      messageId: uuid(),
      players: players,
    };

    //sending players state
    io.sockets.emit("state", message);
  });
});
