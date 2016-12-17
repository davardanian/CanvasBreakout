

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");


  let bricks = [];

  var livecount = 3;
  var scorecount = 0;


  var key_left = false;
  var key_right = false;
  var key_start = false;

  var currentlevel = 1;

  const xpadding = 10;
  const ypadding = 10;
  const brickcolors = ['yellow', 'purple', 'blue', 'black'];
  let br = {
      x: 270,
      y: 450,
      width: 60,
      height: 10,
      xDelta: 4,
      color: 'red'
  };
  let ball = {
      x: 300,
      y: 440,
      height: 10,
      width: 0,
      xDelta: 1,
      yDelta: -1,
      color: 'red'
  };


  let defaultx = br.xDelta;


// INFO BAR


  // LEVELS MAP
  let Levelmap = [];
  Levelmap[0]='000000000000-000000000000-000000000000-000000000000-000000010000-000000000000-000000000000';
  Levelmap[1]='000300003000-000000000000-002220022200-111000000111-111111111111-000000000000-000004400000';
  Levelmap[2]='010203302010-030201102030-101010101010-010101010101-000000000000-000000000000-000000000000';
  Levelmap[3]='000001100000-000010010000-000100001000-001003300100-000100001000-000010010000-000001100000';
  Levelmap[4]='040000000040-001100110011-110011001100-202020202020-020202020202-303030303030-040404040404';

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('keydown', handleKeyStart, true);




  function handleKeyStart(event) {
      if (event.keyCode == 13) {
          key_start = true;
      }
  }
  function handleKeyDown(event) {
      if (event.keyCode == 37)
          key_left = true;
      else if (event.keyCode == 39)
          key_right = true;
  }

  function handleKeyUp(event) {
      if (event.keyCode == 37)
          key_left = false;
      else if (event.keyCode == 39)
          key_right = false;
  }

  const getlist = function() {
      $.ajax({
          url: "/index",
          type: 'get',
          dataType: 'json',
          contentType: 'json',
          success: function (data) {
              var byScore = data.slice(0);
              byScore.sort(function(a,b) {
                  return a.score - b.score;
              });
              console.log(byScore);
              byScore.forEach(function(item) {

                  $('#scorebody').append('<tr><td>'+item.name+'</td><td>'+item.score+'</td></tr>');
              });
                 // $('#scorebody').append('<tr><td>'+item.name+'</td><td>'+item.score+'</td></tr>');


          },
          error: function (data) {
              alert('Error ');
          }


      });
  };

  const sendscore = function() {
      do{
          input = prompt("Game Over" +
              ". Enter your name");
      }while(input == null || !input.replace(/\s/g, '').length );
      $.ajax({
          url: "/index",
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({
              name: input,
              score: scorecount
          }),
          contentType: "application/json; charset=utf-8",
          success: function (data) {
              // REFRESH THE LIST
              $('#scorebody').html('');
          },
          error: function (data) {
              alert('Error creating todo');
          }
      });
  }

      let preparelevel = function () {
          var brickrows = Levelmap[currentlevel - 1].split('-');
          for (i = 0; i < 7; i++) {
              let l = brickrows[i];
              for (j = 0; j < 12; j++) {
                  let yy = ypadding * (i + 1) + i * 20;
                  let xx = xpadding * (j + 1) + j * 40;
                  if (l.substr(j, 1) != '0') {
                      bricks.push({
                          x: xx,
                          y: yy,
                          width: 40,
                          height: 20,
                          bricktype: l.substr(j, 1)
                      })
                  }
              }
          }

      };
      const drawbricks = function () {

          bricks.forEach(function (brick) {
              if (brick.bricktype >= 0) {
//           context.fillStyle=brick.color;
                  context.fillStyle = brickcolors[brick.bricktype - 1];
                  context.fillRect(brick.x, brick.y, brick.width, brick.height);
              }
          });
      };

  // BORDER DRAW FUNCTION
      const drawborders = function() {
          context.strokeStyle= "#34495E";
          context.lineWidth= 10;
          context.strokeRect(2,2,canvas.width-2,canvas.height-2);
          context.strokeStyle= "grey";
          context.lineWidth= 5;
          context.strokeRect(0,0,canvas.width,canvas.height);

      };
      const drawball = function () {

          context.fillStyle = ball.color;
          context.beginPath();
          context.arc(ball.x, ball.y, ball.height, 0, 2 * Math.PI);
          context.fill();
          if (!key_start) {
              ball.x = br.x + br.width / 2;
              return;
          }

          ball.x += ball.xDelta;
          ball.y += ball.yDelta;
          if (ball.y - ball.height - 1 <= 0) {
              ball.yDelta *= -1;
          }
// AUT
          if (ball.y + ball.height >= canvas.height) {
              ball.yDelta *= -1;
              livecount--;
              scorecount = scorecount - 10;
              $('#scorecount').html(scorecount);
              if (livecount == 0) {
                  sendscore();
                  getlist();
                  livecount = 3;
                  currentlevel = 1;
                  scorecount = 0;
                  console.log('Go to prepare level');
                  preparelevel();
                  console.log('Return from prepare level');
              }
              initgame();
              return;
          }
          if (ball.x - ball.height - 1 <= 0 || ball.x + ball.height + 1 >= canvas.width) {
              ball.xDelta *= -1;
          }

// Check collision with br top side
          if (ball.x >= br.x && ball.x <= br.x + br.width && ball.y + ball.height >= br.y && ball.y < br.y) {
              ball.yDelta *= -1;
//  change ball angle
              ball.xDelta = ((ball.x - br.x) - br.width / 2) / 10;
          }
// Check collision with br left-top corner
          if (ball.x < br.x &&
              ball.x + ball.height > br.x &&
              Math.pow((ball.x - br.x), 2) + Math.pow((ball.y - br.y), 2) <= Math.pow(ball.height, 2)) {
              ball.yDelta *= -1;
              ball.xDelta = -3;
          }
// Check collision with br right-top corner
          if (ball.x > br.x + br.width &&
              ball.x - ball.height < br.x + br.width &&
              Math.pow((ball.x - br.x), 2) + Math.pow((ball.y - br.y), 2) <= Math.pow(ball.height, 2)) {
              ball.yDelta *= -1;
              ball.xDelta = 3;
          }

//  Check collision with bricks
          let bb = -1;
          for (i = 0; i < bricks.length; i++) {
// Collision with bottom side of brick
              if ((ball.yDelta < 0) &&
                  (ball.x >= bricks[i].x) &&
                  (ball.x <= bricks[i].x + bricks[i].width) &&
                  (ball.y - ball.height <= bricks[i].y + bricks[i].height) &&
                  (ball.y > bricks[i].y)) {
                  ball.yDelta *= -1;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }
// Collision with top side of brick
              if (bb == -1 && (ball.yDelta > 0) &&
                  (ball.x >= bricks[i].x) &&
                  (ball.x <= bricks[i].x + bricks[i].width) &&
                  (ball.y + ball.height >= bricks[i].y) &&
                  (ball.y < bricks[i].y + bricks[i].height)) {
                  ball.yDelta *= -1;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }
// Collision with left side of brick
              if (bb == -1 && (ball.xDelta > 0) &&
                  (ball.y >= bricks[i].y) &&
                  (ball.y <= bricks[i].y + bricks[i].height) &&
                  (ball.x + ball.height >= bricks[i].x) &&
                  (ball.x < bricks[i].x)) {
                  ball.xDelta *= -1;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }
// Collision with right side of brick
              if (bb == -1 && (ball.xDelta < 0) &&
                  (ball.y >= bricks[i].y) &&
                  (ball.y <= bricks[i].y + bricks[i].height) &&
                  (ball.x - ball.height <= bricks[i].x) &&
                  (ball.x > bricks[i].x + bricks[i].width)) {
                  ball.xDelta *= -1;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }

// Collision with brick`s corners
// top-left
              if (bb == -1 && ball.x < bricks[i].x &&
                  ball.x + ball.height > bricks[i].x &&
                  Math.pow((ball.x - bricks[i].x), 2) + Math.pow((ball.y - bricks[i].y), 2) <= Math.pow(ball.height, 2)) {
                  ball.yDelta = -1;
                  ball.xDelta = -3;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }

// top-right
              if (bb == -1 && ball.x > bricks[i].x + bricks[i].width &&
                  ball.x - ball.height < bricks[i].x + bricks[i].width &&
                  Math.pow((ball.x - bricks[i].x - bricks[i].width), 2) + Math.pow((ball.y - bricks[i].y), 2) <= Math.pow(ball.height, 2)) {
                  ball.yDelta = -1;
                  ball.xDelta = 3;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }
// bottom-left
              if (bb == -1 && ball.x < bricks[i].x &&
                  ball.x + ball.height > bricks[i].x &&
                  Math.pow((ball.x - bricks[i].x), 2) + Math.pow((ball.y - bricks[i].y - bricks[i].height), 2) <= Math.pow(ball.height, 2)) {
                  ball.yDelta = 1;
                  ball.xDelta = -3;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }
// bottom-right
              if (bb == -1 && ball.x > bricks[i].x + bricks[i].width &&
                  ball.x - ball.height < bricks[i].x + bricks[i].width &&
                  Math.pow((ball.x - bricks[i].x - bricks[i].width), 2) + Math.pow((ball.y - bricks[i].y - bricks[i].height), 2) <= Math.pow(ball.height, 2)) {
                  ball.yDelta = 1;
                  ball.xDelta = 3;
                  bricks[i].bricktype -= 1;
                  bb = i;
                  break;
              }


          }
// delete brick from array
          if (bb > -1) {
              $('#scorecount').html(++scorecount);
              if (bricks[bb].bricktype == 0) {
                  bricks.splice(bb, 1);
                  bb = -1;
                  if (bricks.length == 0) {
                      currentlevel++;
                      livecount++;
                      $('#livecount').html(livecount + 1);
                      if (currentlevel > Levelmap.length) currentlevel = 1;
                      preparelevel();
                      initgame();
                  }
              }
          }


      };
      const drawbr = function () {

          context.fillRect(br.x, br.y, br.width, br.height);
          if (br.x > canvas.width - 100) {
              if (br.x + br.width >= canvas.width) br.xDelta = 0;
              if (br.xDelta === 0 && key_left) {
                  br.xDelta = defaultx;
                  br.x -= br.xDelta;
              }
          }
          if (br.x < 100) {
              if (br.x <= 0) br.xDelta = 0;
              if (br.xDelta === 0 && key_right) {
                  br.xDelta = defaultx;
                  br.x += br.xDelta;
              }
          }
          if (key_left) {
              br.x -= br.xDelta;
          }
          if (key_right) {

              br.x += br.xDelta;

          }

      };

      let animate = function () {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawbricks();
          drawball();
          drawbr();
          setTimeout(animate, 10);
      };
      let initgame = function () {
          context.clearRect(0, 0, canvas.width, canvas.height);
          br.x = 270;
          br.y = 450;
          br.width = 60;
          br.height = 10;
          br.xDelta = 4;
          br.color = 'red';
          br.type = 'br';
          defaultx = br.xDelta;

          ball.x = 300;
          ball.y = 440;
          ball.height = 10;
          ball.width = 0;ball.type = 'ball';
          ball.xDelta = 4; //1
          ball.color = 'red';
          ball.yDelta = -2;

          $('#livecount').html(livecount);
          $('#levelcount').html(currentlevel);
          $('#scorecount').html(scorecount);

          drawbricks();
          drawball();
          drawbr();
          key_start = false;

      };

      preparelevel();
      getlist();
      initgame();
      animate();







