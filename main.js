

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let bricks = [];

  var key_left = false;
  var key_right = false;
  var key_start = false;

  var currentlevel=0;

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

// LEVELS MAP
  let Levelmap = [];
  Levelmap[0]='000000000000-000000000000-000000000000-111000000111-111111111111-000000000000-000000000000';
  Levelmap[1]='000300003000-000000000000-002220022200-111000000111-111111111111-000000000000-000004400000';

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


    var brickrows = Levelmap[currentlevel].split('-');
    for (i=0;i<7; i++) {
        let l = brickrows[i];
            for (j = 0; j < 12; j++) {
            let yy = ypadding * (i+1) + i * 20;
            let xx = xpadding * (j+1) + j * 40;
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

const drawbricks = function(){

   bricks.forEach(function(brick) {
       if (brick.bricktype>=0) {
//           context.fillStyle=brick.color;
           context.fillStyle=brickcolors[brick.bricktype-1];
           context.fillRect(brick.x,brick.y,brick.width,brick.height);
       }
    });
};

const drawball = function() {

    context.fillStyle = ball.color;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.height, 0, 2 * Math.PI);
    context.fill();

    ball.x += ball.xDelta;
    ball.y += ball.yDelta;
    if (ball.y - ball.height - 1 <= 0) {
        ball.yDelta *= -1;
    }
    if (ball.y + ball.height >= canvas.height) {
        ball.yDelta *= -1;
        initgame();
    }
    if (ball.x - ball.height - 1 <= 0 || ball.x + ball.height + 1 >= canvas.width) {
        ball.xDelta *= -1;
    }

// Check collision with br top side
    if (ball.x >= br.x && ball.x <= br.x + br.width && ball.y + ball.height >= br.y && ball.y < br.y){
        ball.yDelta *= -1;
//  change ball angle
        ball.xDelta =  ((ball.x - br.x) - br.width / 2) / 10;
    }
// Check collision with br left-top corner
    if (ball.x < br.x &&
    ball.x + ball.height > br.x &&
    Math.pow((ball.x-br.x), 2) + Math.pow((ball.y-br.y), 2) <= Math.pow(ball.height,2) ) {
        ball.yDelta *= -1;
        ball.xDelta = -3;
    }
// Check collision with br right-top corner
    if (ball.x > br.x + br.width &&
        ball.x - ball.height < br.x + br.width &&
        Math.pow((ball.x-br.x), 2) + Math.pow((ball.y-br.y), 2) <= Math.pow(ball.height,2) ) {
        ball.yDelta *= -1;
        ball.xDelta = 3;
    }

//  Check collision with bricks
    let bb = -1;
    bricks.forEach(function (brick) {

// Collision with bottom side of brick
        if ((ball.yDelta < 0) &&
            (ball.x >= brick.x) &&
            (ball.x <= brick.x + brick.width) &&
            (ball.y - ball.height <= brick.y + brick.height) &&
            (ball.y > brick.y)){
            ball.yDelta *= -1;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }
// Collision with top side of brick
        if (bb==-1 && (ball.yDelta > 0) &&
            (ball.x >= brick.x) &&
            (ball.x <= brick.x + brick.width) &&
            (ball.y + ball.height >= brick.y) &&
            (ball.y < brick.y + brick.height)) {
            ball.yDelta *= -1;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }
// Collision with left side of brick
        if (bb==-1 && (ball.xDelta > 0) &&
            (ball.y >= brick.y) &&
            (ball.y <= brick.y + brick.height) &&
            (ball.x + ball.height >= brick.x) &&
            (ball.x < brick.x)) {
            ball.xDelta *= -1;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }
// Collision with right side of brick
        if (bb==-1 && (ball.xDelta < 0) &&
            (ball.y >= brick.y) &&
            (ball.y <= brick.y + brick.height) &&
            (ball.x - ball.height <= brick.x) &&
            (ball.x > brick.x + brick.width)) {
            ball.xDelta *= -1;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }

// Collision with brick`s corners
// top-left
        if (bb==-1 && ball.x < brick.x &&
            ball.x + ball.height > brick.x &&
            Math.pow((ball.x-brick.x), 2) + Math.pow((ball.y-brick.y), 2) <= Math.pow(ball.height,2) ) {
            ball.yDelta = -1;
            ball.xDelta = -3;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }

// top-right
        if (bb==-1 && ball.x > brick.x + brick.width &&
            ball.x - ball.height < brick.x + brick.width &&
            Math.pow((ball.x-brick.x-brick.width), 2) + Math.pow((ball.y-brick.y), 2) <= Math.pow(ball.height,2) ) {
            ball.yDelta = -1;
            ball.xDelta = 3;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }
// bottom-left
        if (bb==-1 && ball.x < brick.x &&
            ball.x + ball.height > brick.x &&
            Math.pow((ball.x-brick.x), 2) + Math.pow((ball.y-brick.y-brick.height), 2) <= Math.pow(ball.height,2) ) {
            ball.yDelta = 1;
            ball.xDelta = -3;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }
// bottom-right
        if (bb==-1 && ball.x > brick.x + brick.width &&
            ball.x - ball.height < brick.x + brick.width &&
            Math.pow((ball.x-brick.x-brick.width), 2) + Math.pow((ball.y-brick.y-brick.height), 2) <= Math.pow(ball.height,2) ) {
            ball.yDelta = 1;
            ball.xDelta = 3;
            brick.bricktype -= 1;
            bb = bricks.indexOf(brick);
        }


    });
// delete brick from array
    if (bb > -1 && bricks[bb].bricktype == 0){
        bricks.splice(bb,1);
        bb = -1;
    }



};
    const drawbr = function () {

        context.fillRect(br.x, br.y, br.width, br.height);
        if (br.x > canvas.width-100) {
            if (br.x + br.width >= canvas.width) br.xDelta = 0;
            if (br.xDelta === 0 && key_left) {
                br.xDelta = defaultx;
                br.x -= br.xDelta;
            }
        }
        if (br.x < 100 ) {
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
        if (key_start) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawbricks();
            drawball();
            drawbr();
        }
        intrv = setTimeout(animate, 10);
    };
  let initgame = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      br.x = 270;
      br.y = 450;
      br.width = 60;
      br.height = 10;
      br.xDelta = 2;
      br.color = 'red';
      br.type = 'br';
      defaultx = br.xDelta;

      ball.x = 300;
      ball.y = 440;
      ball.height = 10;
      ball.width = 0;
      ball.type = 'ball';
      ball.xDelta = 1;
      ball.color = 'red';
      ball.yDelta = -2;

      drawbricks();
      drawball();
      drawbr();
      key_start = false;

  };
  initgame();
  animate();



