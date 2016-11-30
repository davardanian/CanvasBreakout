

    let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);


    function handleKeyDown(event)
    {
        if (event.keyCode == 37)
            key_left = true;
        else if (event.keyCode == 39)
            key_right = true;
    }

    function handleKeyUp(event)
    {
        if (event.keyCode == 37)
            key_left = false;
        else if (event.keyCode == 39)
            key_right = false;
    }


    var key_left = false;
    var key_right = false;



let bricks = [];
let br = {
    x: 300,

    y: 450,

    width: 60,

    height: 10,

    xDelta: 2,



    color: 'red',

    type: 'br'
};
    let defaultx = br.xDelta;
    let ball = {

        x: 320,
        y: 440,
        height: 10,
        width: 0,
        type: 'ball',
        xDelta: 1,
        color: 'red',
        yDelta: 1
    };
    let Levelmap = [];
    Levelmap[0]='000000000000-000000001100-000000000000-000000001111-111111101111-111110000000-000000000000';

    const xpadding = 10;
    const ypadding = 10;
    var currentlevel=0;
    var brickrows = Levelmap[currentlevel].split('-');
    for (i=0;i<7; i++) {
        let l = brickrows[i];
        for (j = 1; j < 13; j++) {
            let yy = ypadding * i + (i - 1) * 20;
            let xx = xpadding * j + (j - 1) * 40;
            if (l.substr(j-1, 1) != '0') {
                bricks.push({
                    x: xx,
                    y: yy,
                    width: 40,
                    height: 20,
                    type: l.substr(j-1, 1),
                    color: 'yellow'
                })
            }
        }
    }

const drawbricks = function(){

   bricks.forEach(function(brick) {
       context.fillStyle=brick.color;
       context.fillRect(brick.x,brick.y,brick.width,brick.height)     ;
    });
};

const drawball = function() {

    context.fillStyle = ball.color;

    context.beginPath();
    context.arc(ball.x, ball.y, ball.height, ball.width, 2 * Math.PI);

    context.fill();


            ball.x += ball.xDelta;
            ball.y += ball.yDelta;
            if (ball.y - ball.height <= 0) {
                ball.yDelta *= -1;
            }
            if (ball.y + ball.height >= canvas.height) {
                ball.yDelta *= -1;
            }
            if (ball.x - ball.height <= 0 || ball.x + ball.height >= canvas.width) {
                ball.xDelta *= -1;
            }



}
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


        context.clearRect(0, 0, canvas.width, canvas.height);
        drawbricks();
        drawball();
        drawbr();


        setTimeout(animate, 10);

    };


console.log(bricks);
animate();



