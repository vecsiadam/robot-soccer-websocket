var socket = io();

var playerMovement = {
  redUp: true,
  redDown: false,
  blueUp: true,
  blueDown: false
}

var ballMovement = {
  left: false,
  right: false
}

/*document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ballMovement.left = true;
      break;
    case 39: // right arrow
      ballMovement.right = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ballMovement.left = false;
      break;
    case 39: // right arrow
      ballMovement.right = false;
      break;
  }
});*/


socket.emit('new player');
setInterval(function() {
  socket.emit('movement', playerMovement, ballMovement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 400;
var context = canvas.getContext('2d');
socket.on('state', function(players, ball, playersIds) {
  console.log(players);
  console.log(ball);
  context.clearRect(0, 0, 800, 600);
  for (var id in players) {
    var player = players[id];
    if(player.y === 100 || player.y < 100){
      if(player.id === playersIds[0]){
        playerMovement.redUp = false;
        playerMovement.redDown = true;
      }
      if(player.id === playersIds[1]){
        playerMovement.blueUp = false;
        playerMovement.blueDown = true;
      }
    }
    if(player.y === 260 || player.y > 260){
      if(player.id === playersIds[0]){
        playerMovement.redUp = true;
        playerMovement.redDown = false;
      }
      if(player.id === playersIds[1]){
        playerMovement.blueUp = true;
        playerMovement.blueDown = false;
      }
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
      context.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
      context.fill();
    }
  }
});