var socket = io();

var movement = {
  up: true,
  down: false,
  left: false,
  right: false
}

var ball = {
  left: false,
  right: false
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ball.left = true;
      break;
    case 39: // right arrow
      ball.right = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ball.left = false;
      break;
    case 39: // right arrow
      ball.right = false;
      break;
  }
});


socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement, ball);
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
      if(player.y === 100 || player.y < 100){
        movement.up = false;
        movement.down = true;
      }
      if(player.y === 260 || player.y > 260){
        movement.up = true;
        movement.down = false;
      }
      if(player.color === 1){
        //red players
        context.fillStyle = 'red';
        context.beginPath();
        context.fillRect(player.x, player.y, 40, 40);
        context.fillRect(200, 50, 40, 40);
        context.fillRect(200, 300, 40, 40);
        //gate
        context.fillStyle = 'white';
        context.fillRect(0, 100, 10, 200);

      }
      if(player.color === 2){
        //blue players
        context.fillStyle = 'blue';
        context.beginPath();
        context.fillRect(player.x, player.y, 40, 40);
        context.fillRect(600, 50, 40, 40);
        context.fillRect(600, 300, 40, 40);
        //gate
        context.fillStyle = 'white';
        context.fillRect(790, 100, 10, 200);
        //ball
        context.fillStyle = 'white';
        //ctx.arc(player.x-20, player.y+20, 20, 0, 2 * Math.PI);
        context.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
        context.fill();
      }
      console.log(player);
    }
});