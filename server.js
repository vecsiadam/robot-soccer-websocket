// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var players = {};
var counter = 1;
var ball = {
  x: 80,
  y: 190,
};
//refactor
io.on('connection', function(socket) {
  var playersSize = Object.keys(players).length;
  if(playersSize <= 1){
    if(playersSize === 0){
      socket.on('new player', function() {
        players[socket.id] = {
          x: 20,
          y: 175,
          color: counter
        };
        console.log(players)
        console.log("Number of players: " + counter)
        counter++;
    });
    } else {
      socket.on('new player', function() {
        players[socket.id] = {
          x: 740,
          y: 175,
          color: counter
        };
        console.log(players)
        console.log("Number of players: " + counter)
        counter++;
    });
    }
      
    socket.on('movement', function(data, ballMove) {
      var player = players[socket.id] || {};
        if (data.left && player.x > 0) {
          player.x -= 5;
        }
        if (data.up && player.y > 0 ) {
          player.y -= 5;
        }
        if (data.right && player.x < 760) {
          player.x += 5;
        }
        if (data.down && player.y < 360) {
          player.y += 5;
        }  
        if(ballMove.right && ball.x < 780){
          ball.x += 5;
        }
        if(ballMove.left && ball.x > 20){
          ball.x -= 5;
        }
    });
  } else {
    console.log("Players limit max 2");
  }
  });
  
setInterval(function() {
  io.sockets.emit('state', players, ball);
}, 1000 / 60);