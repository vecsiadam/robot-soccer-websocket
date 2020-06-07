var socket = io();

var movement = {
  up: true,
  down: false,
};

//Connecting to the websocket
socket.emit("new player");

//reciveing player details and
var myPlayer;
var myId = null;
socket.on("player details", function (playerDetails) {
  if (myId === null) {
    myPlayer = new myPlayerMovement(
      40,
      60,
      playerDetails.color,
      playerDetails.id,
      playerDetails.x,
      playerDetails.y
    );
    myId = playerDetails.id;
    gameArea.start();
  }
});

var gameArea = {
  canvas: document.getElementById("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function (e) {
      e.preventDefault();
      gameArea.keys = gameArea.keys || [];
      gameArea.keys[e.keyCode] = e.type == "keydown";
    });
    window.addEventListener("keyup", function (e) {
      gameArea.keys[e.keyCode] = e.type == "keydown";
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function myPlayerMovement(width, height, color, id, x, y) {
  this.id = id;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = gameArea.context;
    //left gate
    ctx.fillStyle = "white";
    ctx.fillRect(0, 150, 10, 300);
    //right gate
    ctx.fillStyle = "white";
    ctx.fillRect(790, 150, 10, 300);
    //my player
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    //reciveing players state and draw other players
    socket.on("state", function (message) {
      //console.log(message);
      for (var id in message.players) {
        if (id !== myPlayer.id) {
          var player = message.players[id];
          ctx.fillStyle = player.color;
          ctx.fillRect(player.x, player.y, 40, 60);
        }
      }
    });
  };
}

function updateGameArea() {
  //TODO: itt kell még vele valamit csinálni mert a socketen érkező játékos vibrál
  gameArea.clear();
  //my player movement down
  if (movement.up && !movement.down) {
    myPlayer.y -= 2;
    if (myPlayer.y === 150 || myPlayer.y < 150) {
      movement.up = false;
      movement.down = true;
    }
  }
  //my player movement down
  if (movement.down && !movement.up) {
    myPlayer.y += 2;
    if (myPlayer.y === 390 || myPlayer.y > 390) {
      movement.up = true;
      movement.down = false;
    }
  }
  if (gameArea.keys && gameArea.keys[65]) {
    myPlayer.x -= 5;
  }
  if (gameArea.keys && gameArea.keys[68]) {
    myPlayer.x += 5;
  }

  myPlayer.update();
}

setInterval(function () {
  var playerDescriptor = {
    id: myId,
    x: myPlayer.x,
    y: myPlayer.y,
  };

  var message = {
    messageId: generateUuid(),
    player: playerDescriptor,
  };
  //sending my player movement message
  socket.emit("player movement", message);
}, 1000 / 60);

function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
