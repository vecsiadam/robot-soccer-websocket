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
var ball = {
  x: 60,
  y: 200,
};
var ballMovement = {
  right: true,
  left: false,
};

var ballInGoalKeeper = {
  red: false,
  blue: false,
};

var result = {
  red: 0,
  blue: 0,
};
var counter = 0;

io.on("connection", function (socket) {
  if (counter === 0) {
    newPlayer(socket, 20, 175, "red");
    counter++;
  } else if (counter === 1) {
    newPlayer(socket, 740, 175, "blue");
  } else {
    // just two players play this game
  }

  // reciving movements and save in players object
  socket.on("player movement", function (data) {
    var player = data.player || {};
    var serverPlayer = players[player.id] || {};

    if (player.id === serverPlayer.id) {
      serverPlayer.x = player.x;
      serverPlayer.y = player.y;
    }

    updateBall(players);

    // create message object with message id, ball, players and result
    var message = {
      messageId: uuid(),
      ball: ball,
      players: players,
      result: result,
    };

    //sending players and ball state
    io.sockets.emit("state", message);
    console.log(message);
  });
});

function updateBall(players) {
  var player1 = {};
  var player2 = {};
  for (var id in players) {
    if (players[id].color === "red") {
      player1 = players[id];
    } else {
      player2 = players[id];
    }
  }
  //ball movement left
  if (ballMovement.left) {
    ball.x -= 5;
    if (ball.x === 0 || ball.x < 0) {
      result.blue++;
      ballMovement.left = false;
      ballInGoalKeeper.red = true;
      ballInGoalKeeper.blue = false;
      setTimeout(function () {
        ballInGoalKeeper.red = false;
        ballMovement.right = true;
      }, 3000);
    }
  }
  //ball movement right
  if (ballMovement.right) {
    ball.x += 5;
    if (ball.x === 780 || ball.x > 780) {
      result.red++;
      ballMovement.right = false;
      ballInGoalKeeper.red = false;
      ballInGoalKeeper.blue = true;
      setTimeout(function () {
        ballInGoalKeeper.blue = false;
        ballMovement.left = true;
      }, 3000);
    }
  }

  if (ballInGoalKeeper.red && !ballInGoalKeeper.blue) {
    ball = {
      x: 60,
      y: player1.y,
    };
  }

  if (!ballInGoalKeeper.red && ballInGoalKeeper.blue) {
    ball = {
      x: 720,
      y: player2.y,
    };
  }

  //TODO: y tengelyt is figyelembe venni mert most csak az x et nézzük
  if (ball.x - 20 === player1.x && ball.y >= player1.y - 20 && ball.y <= player1.y + 40) {
    ballInGoalKeeper.red = true;
    ballInGoalKeeper.blue = false;
    ballMovement.left = false;
    setTimeout(function () {
      ballInGoalKeeper.red = false;
      ballMovement.right = true;
    }, 3000);
  }

  if (ball.x + 20 === player2.x && ball.y >= player2.y - 20 && ball.y <= player2.y + 40) {
    ballInGoalKeeper.red = false;
    ballInGoalKeeper.blue = true;
    ballMovement.right = false;
    setTimeout(function () {
      ballInGoalKeeper.blue = false;
      ballMovement.left = true;
    }, 3000);
  }
}

function newPlayer(socket, x, y, color) {
  // reciving new player connection
  socket.on("new player", function () {
    players[socket.id] = {
      id: socket.id,
      x: x,
      y: y,
      color: color,
    };
    var player = players[socket.id];
    //sending player details
    io.sockets.emit("player details", player);
  });
}
