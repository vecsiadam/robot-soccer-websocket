var socket = io();

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
      "blue",
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

    //reciveing players state and draw other players with red color
    socket.on("state", function (message) {
      console.log(message);
      ctx = gameArea.context;
      ctx.fillStyle = "red";
      for (var id in message.players) {
        if (id !== myPlayer.id) {
          var player = message.players[id];
          ctx.beginPath();
          ctx.fillRect(player.x, player.y, 40, 60);
        }
      }
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
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function updateGameArea() {
  gameArea.clear();
  if (gameArea.keys && gameArea.keys[87]) {
    myPlayer.y -= 5;
  }
  if (gameArea.keys && gameArea.keys[83]) {
    myPlayer.y += 5;
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
