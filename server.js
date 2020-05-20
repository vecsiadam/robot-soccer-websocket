// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = 8080;

var ball = {
  x: 780,
  y: 200
};
var players = {};
var counter = 1;
var redGoals = 0;
var blueGoals = 0;
var playersIds =[];

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

io.on('connection', function(socket) {
  var playersSize = Object.keys(players).length + 1;
  if(playersSize <= 2 ){
    if(playersSize === 1){
      newPlayer(socket, 20, 175);
      
    } else {
      newPlayer(socket, 740, 175);
    }
  } else {
      console.log("Players limit max 2");
  }
  movement(socket);
});

function newPlayer(socket, x, y) {
  socket.on('new player', function() {
    players[socket.id] = {
      id: socket.id,
      x: x,
      y: y,
      color: counter
    };
    console.log(players)
    console.log("Number of players: " + counter)
    counter++;
    playersIds.push(socket.id);
  });
}

function movement(socket) {
  socket.on('movement', function(playerMove, ballMove) {
    var player = players[socket.id] || {};

    if (player.id === playersIds[0] && playerMove.redUp && player.y >= 0 ) {
      player.y -= 1;
    }
    if (player.id === playersIds[0] && playerMove.redDown && player.y <= 360) {
      player.y += 1;
    }
    if (player.id === playersIds[1] && playerMove.blueUp && player.y >= 0 ) {
      player.y -= 1;
    }
    if (player.id === playersIds[1] && playerMove.blueDown && player.y <= 360) {
      player.y += 1;
    }

    if(ballMove.up && ball.y > 0){
      ball.y -= 1;
    }
    if(ballMove.down && ball.y < 400){
      ball.y += 1;
    }

   if(ballMove.right && ball.x < 780){
      ball.x += 5;
      if(ball.x === 780 && ball.y >= 100 && ball.y <= 300){
        redGoals++;
        console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
      }
    }
   
    if(ballMove.left && ball.x > 20){
      ball.x -= 5;
      if(ball.x === 20 && ball.y >= 100 && ball.y <= 300 ){
        blueGoals++;
        console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
      }
    } 
  });
}

setInterval(function() {
  io.sockets.emit('state', players, ball, playersIds, blueGoals, redGoals);
}, 1000 / 60);