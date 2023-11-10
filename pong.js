const MSPF = 20;

const SIZE = 10;
const HSIZE = SIZE / 2;

const RELATIVE_PLAYER_HEIGHT = 1 / 8; // default player height in relation to canvas height

var game = {
    ball: {
        speed: 5,
        x: 0,
        y: 0,
        dx: 1,
        dy: 1
    },
    p1: {
        height: 0,
        speed: 10,
        y: 0,
        input: 0
    },
    p2: {
        height: 0,
        speed: 10,
        y: 0,
        input: 0
    }
}

var input = {
    'KeyW': 0,
    'KeyS': 0,
    'ArrowUp': 0,
    'ArrowDown': 0,
}

/** @type {DOMRect} */
var canvas;

/** @type {CanvasRenderingContext2D} */
var ctx;

function frame() {
    let ball = game.ball, p1 = game.p1, p2 = game.p2;
    
    // input
    p1.input = input['KeyS'] - input['KeyW'];
    p2.input = input['ArrowDown'] - input['ArrowUp'];
    
    // ball movement
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;
    if(ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if(ball.y > canvas.height - SIZE) {
        ball.y = canvas.height - SIZE;
        ball.dy *= -1;
    }
    
    // player movement
    [p1, p2].forEach((player) => {
        player.y += player.input * player.speed;
        player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);
    });
    
    // clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF';
    
    // draw ball
    ctx.fillRect(ball.x, ball.y, SIZE, SIZE);
    
    // draw players
    ctx.fillRect(0, p1.y, SIZE, p1.height);
    ctx.fillRect(canvas.width - SIZE, p2.y, SIZE, p2.height);
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    
    // set player height
    game.p1.height = game.p2.height = canvas.height * RELATIVE_PLAYER_HEIGHT;
    
    // set initial player position
    game.p1.y = game.p2.y = ((canvas.height - game.p1.height) / 2) >> 0;
    
    // input events
    document.addEventListener('keydown', (keyEvent) => input[keyEvent.code] = 1);
    document.addEventListener('keyup', (keyEvent) => input[keyEvent.code] = 0);
    
    // start game loop
    setInterval(frame, MSPF);
});