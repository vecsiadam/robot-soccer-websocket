var socket = io();

var playerMovement = {
  redUp: true,
  redDown: false,
  blueUp: true,
  blueDown: false
}

var ballMovement = {
  left: false,
  right: false,
  up: false,
  down: false
}

var redGoalKeeper = false;
var blueGoalKeeper = false;
/*document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ballMovement.left = true;
      redGoalKeeper = false;
      blueGoalKeeper = false;
      break;
    case 38: // up arrow
      ballMovement.up = true;
      redGoalKeeper = false;
      blueGoalKeeper = false;
      break;
    case 39: // right arrow
      ballMovement.right = true;
      redGoalKeeper = false;
      blueGoalKeeper = false;
      break;
    case 40: // down arrow
      ballMovement.down = true;
      redGoalKeeper = false;
      blueGoalKeeper = false;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      ballMovement.left = false;
      break;
    case 38: // up arrow
      ballMovement.up = false;
      break;
    case 39: // right arrow
      ballMovement.right = false;
      break;
    case 40: // down arrow
      ballMovement.down = false;
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
socket.on('state', function(players, ball, playersIds, blueGoals, redGoals, redGoalKeeper, blueGoalKeeper) {
  context.clearRect(0, 0, 800, 600);
  if(ball.x === 780 && ball.y >= 100 && ball.y <= 300){
    console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
    blueGoalKeeper = true;
    redGoalKeeper = false;
    ballMovement.right = false;
  }
  if(ball.x === 20 && ball.y >= 100 && ball.y <= 300){
    console.log('Result: blue: ' + blueGoals + ' ,red: ' + redGoals);
    redGoalKeeper = true;
    blueGoalKeeper = false;
    ballMovement.left = false;
  }
  
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

    if(redGoalKeeper && player === players[playersIds[0]]){
      ball.x = player.x + 60;
      ball.y = player.y + 20;
      setTimeout(function(){ 
        ballMovement.right = true;
        redGoalKeeper = false;
      }, 3000);
    }

    if(blueGoalKeeper && player === players[playersIds[1]]){
      ball.x = player.x - 20;
      ball.y = player.y + 20;
      setTimeout(function(){
        ballMovement.left = true;
        blueGoalKeeper = false;
      }, 3000);
    }

    if(player === players[playersIds[0]]){
      //red players
      context.fillStyle = 'red';
      context.beginPath();
      context.fillRect(player.x, player.y, 40, 40);
      //context.fillRect(200, 50, 40, 40);
      //context.fillRect(200, 300, 40, 40);
      //gate
      context.fillStyle = 'white';
      context.fillRect(0, 100, 10, 200);
    }
    if(player === players[playersIds[1]]){
      //blue players
      context.fillStyle = 'blue';
      context.beginPath();
      context.fillRect(player.x, player.y, 40, 40);
      //context.fillRect(600, 50, 40, 40);
      //context.fillRect(600, 300, 40, 40);
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