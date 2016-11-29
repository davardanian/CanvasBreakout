

    let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)


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

const objects = [];


let br = {
    x: 300,

    y: 450,

    width: 60,

    height: 10,

    xDelta: 2,



    color: 'red',

    type: 'br'
}
    let ball = {

        x: 300,
        y: 300,
        height: 10,
        type: 'ball',
        xDelta: 1,
        color: 'red',
        yDelta: 1
    }


    objects.push(br);
    objects.push(ball);

const draw = function() {




    context.clearRect(0,0,canvas.width,canvas.height);
    objects.forEach(function(point) {



        context.fillStyle=point.color;
        if (point.type === 'ball'){
           context.beginPath();
            context.arc(point.x,point.y,point.height,0,2*Math.PI)

            context.fill();
            point.x += point.xDelta;
            point.y += point.yDelta;
            if(point.y - point.height <= 0 || point.y + point.height >= canvas.height){point.yDelta *= -1}
            if(point.x - point.height <= 0 || point.x + point.height >= canvas.width){point.xDelta *= -1}
        }
        context.fillRect(point.x,point.y,point.width,point.height)     ;
        if (point.x >= canvas.width || point.x <= 0) { point.xDelta *= -1}
        if (point.y >= canvas.height || point.y <= 0) { point.yDelta *= -1}
        if (point.type==='br') {
            if (key_left) {
                point.x -= point.xDelta;
            }
            if (key_right) {
                point.x += point.xDelta;
            }
        }

    });



};


let animate = function() {

    draw();

    setTimeout(animate, 10);

};

animate();



