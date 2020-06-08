var socket = io();

var movement = {
  up: true,
  down: false,
};

//Connecting to the websocket
socket.emit("new player");

//reciveing player details and
var myPlayer = {};
var myId = null;
var ball = {};
socket.on("player details", function (playerDetails, ballPos) {
  if (myId === null) {
    myPlayer = new myPlayerMovement(
      playerDetails.color,
      playerDetails.id,
      playerDetails.x,
      playerDetails.y
    );
    ball = ballPos;
    myId = playerDetails.id;
    //gameArea.start();
  }
});

function myPlayerMovement(color, id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.color = color;
}

function updateGameArea() {
  //my player movement down
  if (movement.up) {
    myPlayer.y -= 2;
    if (myPlayer.y === 100 || myPlayer.y < 100) {
      movement.up = false;
      movement.down = true;
    }
  }
  //my player movement down
  if (movement.down) {
    myPlayer.y += 2;
    if (myPlayer.y === 260 || myPlayer.y > 260) {
      movement.up = true;
      movement.down = false;
    }
  }
}

var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 400;
var ctx = canvas.getContext("2d");
socket.on("state", function (message) {
  ctx.clearRect(0, 0, 800, 600);
  //left gate
  ctx.fillStyle = "white";
  ctx.fillRect(0, 100, 10, 200);
  //right gate
  ctx.fillStyle = "white";
  ctx.fillRect(790, 100, 10, 200);
  //ball
  ctx.fillStyle = "white";
  ctx.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  for (var id in message.players) {
    var player = message.players[id];
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, 40, 40);
  }
  console.log(message.players);
});

setInterval(function () {
  updateGameArea();
  var playerDescriptor = {
    id: myId,
    x: myPlayer.x,
    y: myPlayer.y,
  };

  var message = {
    messageId: generateUuid(),
    ball: ball,
    player: playerDescriptor,
  };
  //sending my player movement message
  socket.emit("player movement", message);
}, 1000 / 25);

function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
