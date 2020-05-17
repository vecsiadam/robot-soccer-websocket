// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = 8080

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

var players = {};
var counter = 1;
var ball = {
  x: 400,
  y: 200,
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
    //refactor
    var redGoals = 0;
    var blueGoals = 0;
    socket.on('movement', function(playerMove, ballMove) {
      var player = players[socket.id] || {};
        if (playerMove.up && player.y >= 0 ) {
          player.y -= 1;
        }

        if (playerMove.down && player.y <= 360) {
          player.y += 1;
        }
       
        if(ballMove.right && ball.x < 780){
          ball.x += 5;
          if(ball.x === 775){
            redGoals++;
            console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
            ball = {
              x: 400,
              y: 200,
            };
          }
        }
        if(ballMove.left && ball.x > 20){
          ball.x -= 5;
          if(ball.x === 25){
            blueGoals++;
            console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
            ball = {
              x: 400,
              y: 200,
            };
          }
        } 
    });
  } else {
    console.log("Players limit max 2");
  }
  });
  
setInterval(function() {
  io.sockets.emit('state', players, ball);
}, 1000 / 60);