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
  x: 300,
  y: 300
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
    if (playerMove.up && player.y >= 0 ) {
      player.y -= 1;
    }
    if (playerMove.down && player.y <= 360) {
      player.y += 1;
    }

    //TODO: random ossza ki hogy kinél legyen  labda
    ballInBlueGoalKeeper(player, ballMove, ball);
    //console.log(ball);

    if(ballMove.right && ball.x < 780){
      ball.x += 5;
      if(ball.x === 775){
        redGoals++;
        console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
        ball = {
            x: player.x+20,
            y: player.y-20,
          };
      }
    }
    if(ballMove.left && ball.x > 20){
      ball.x -= 5;
      if(ball.x === 25){
        blueGoals++;
        console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
          ball = {
            x: player.x+20,
            y: player.y+60,
          };
      }
    } 
  });
}

function ballInBlueGoalKeeper(player, ballMove, ball) {
  if(player.id === playersIds[1] && ballMove.left === false ){
    ball.y = player.y+20;
    ball.x = player.x-20;
  }
}

function ballInRedGoalKeeper(player, ballMove, ball) {
  if(player.id === playersIds[0] && ballMove.right === false ){
    ball.y = player.y+20;
    ball.x = player.x+60;
  }
}

setInterval(function() {
  io.sockets.emit('state', players, ball,playersIds);
}, 1000 / 60);