var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
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
document.addEventListener('keyup', function(event) {
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
socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 400;
var context = canvas.getContext('2d');
socket.on('state', function(players, ball) {
  console.log(players);
  context.clearRect(0, 0, 800, 600);
    for (var id in players) {
      var player = players[id];
      if(player.color === 1){
        context.fillStyle = 'red';
        context.beginPath();
        context.fillRect(player.x, player.y, 40, 40);
      }
      if(player.color === 2){
        context.fillStyle = 'blue';
        context.beginPath();
        context.fillRect(player.x, player.y, 40, 40);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.arc(player.x-20, player.y+20, 20, 0, 2 * Math.PI);
        ctx.fill();
      }

    }
});