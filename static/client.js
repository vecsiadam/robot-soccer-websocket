var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};
document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

//sending message
socket.emit("new player");
setInterval(function () {
  //sending message
  socket.emit("movement", movement);
}, 1000 / 60);

var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");
//reciveing message
socket.on("state", function (message) {
  console.log(message);
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = "blue";
  for (var id in message.players) {
    var player = message.players[id];
    context.beginPath();
    context.fillRect(player.x, player.y, 40, 60);
    context.fill();
  }
});
