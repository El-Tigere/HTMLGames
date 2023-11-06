const MSPF = 20;

const SIZE = 10;
const HSIZE = SIZE / 2;

var game = {
    ball: {
        speed: 1,
        x: 0,
        y: 0,
        dx: 1,
        dy: 1
    },
    p1: {
        height: 0,
        speed: 1,
        y: 0,
        input: 0
    },
    p2: {
        height: 0,
        speed: 1,
        y: 0,
        input: 0
    }
}

/** @type {DOMRect} */
var canvas;

/** @type {CanvasRenderingContext2D} */
var ctx;

function frame() {
    // ball movement
    game.ball.x += game.ball.dx * game.ball.speed;
    game.ball.y += game.ball.dy * game.ball.speed;
    if(game.ball.y < HSIZE) {
        game.ball.y = HSIZE;
        game.ball.dy *= -1;
    }
    if(game.ball.y > canvas.height - HSIZE) {
        game.ball.y = canvas.height - HSIZE;
        game.ball.dy *= -1;
    }
    
    // clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw ball
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(game.ball.x - HSIZE, game.ball.y - HSIZE, SIZE, SIZE);
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    setInterval(frame, MSPF);
});