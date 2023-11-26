const MSPF = 20;

const SIZE = 15;

const RELATIVE_PLAYER_HEIGHT = 1 / 8; // default player height in relation to canvas height

const colors = {
    background: '#000000',
    net: '#808080',
    scores: '#808080',
    players: '#FFFFFF',
    ball: '#FFFFFF'
}

/**
 * game variables that store information about the players and the ball
 * p1: player1
 * p2: player2
 */
var game = {};

var scores = {
    p1: 0,
    p2: 0
};

var input = {
    'KeyW': 0,
    'KeyS': 0,
    'ArrowUp': 0,
    'ArrowDown': 0
}

/** @type {DOMRect} */
var canvas;

/** @type {CanvasRenderingContext2D} */
var ctx;

/**
 * The frame-function is the main loop of the game. It is run every MSPF milliseconds (MSPF = milliseconds per frame).
 */
function frame() {
    let ball = game.ball, p1 = game.p1, p2 = game.p2;
    
    // input
    p1.input = input['KeyS'] - input['KeyW'];
    p2.input = input['ArrowDown'] - input['ArrowUp'];
    
    // player movement
    [p1, p2].forEach((player) => {
        player.y += player.input * player.speed * game.speedFactor;
        player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);
    });
    
    // ball movement
    ball.x += ball.dx * ball.speed * game.speedFactor;
    ball.y += ball.dy * ball.speed * game.speedFactor;
    // ball-player-collisions
    if(ball.x < SIZE && ball.x >= 0 && ball.y > p1.y - SIZE && ball.y < p1.y + p1.height && ball.dx < 0) {
        ball.dx = 1;
        game.speedFactor += 0.02;
        ball.dy = (2 * (ball.y - p1.y) - p1.height + SIZE) / p1.height;
    }
    if(ball.x > canvas.width - 2 * SIZE && ball.x <= canvas.width - SIZE && ball.y > p2.y - SIZE && ball.y < p2.y + p2.height && ball.dx > 0) {
        ball.dx = -1;
        game.speedFactor += 0.02;
        ball.dy = (2 * (ball.y - p2.y) - p2.height + SIZE) / p2.height;
    }
    // ball-border-collisions
    if(ball.y < 0) {
        ball.y = 0;
        ball.dy = Math.abs(ball.dy);
    }
    if(ball.y > canvas.height - SIZE) {
        ball.y = canvas.height - SIZE;
        ball.dy = -Math.abs(ball.dy);
    }
    
    // scores
    if(ball.x < -SIZE) {
        scores.p2++;
        start();
        return;
    }
    if(ball.x > canvas.width) {
        scores.p1++;
        start();
        return;
    }
    
    // clear background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw scores
    ctx.fillStyle = colors.scores;
    ctx.font = (SIZE * 4) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(scores.p1, canvas.width * 0.25, canvas.height * 0.15);
    ctx.fillText(scores.p2, canvas.width * 0.75, canvas.height * 0.15);
    
    // draw net
    ctx.fillStyle = colors.net;
    for(let i = ((canvas.height - SIZE) % (SIZE * 2)) / 2; i < canvas.height; i += SIZE * 2) {
        ctx.fillRect((canvas.width - SIZE) / 2, i, SIZE, SIZE);
    }
    
    // draw ball
    ctx.fillStyle = colors.ball;
    ctx.fillRect(ball.x, ball.y, SIZE, SIZE);
    
    // draw players
    ctx.fillStyle = colors.players;
    ctx.fillRect(0, p1.y, SIZE, p1.height);
    ctx.fillRect(canvas.width - SIZE, p2.y, SIZE, p2.height);
}

function start() {
    game = {
        ball: {
            x: (canvas.width - SIZE) / 2,
            y: (canvas.height - SIZE) / 2,
            width: SIZE,
            height: SIZE,
            dx: (Math.random() >= 0.5) * 2 - 1,
            dy: Math.random() * 2 - 1,
            speed: 10
        },
        p1: {
            x: 0,
            y: ((canvas.height * (1 - RELATIVE_PLAYER_HEIGHT)) / 2) >> 0,
            width: SIZE,
            height: canvas.height * RELATIVE_PLAYER_HEIGHT,
            speed: 20,
            input: 0
        },
        p2: {
            x: canvas.width - SIZE,
            y: ((canvas.height * (1 - RELATIVE_PLAYER_HEIGHT)) / 2) >> 0,
            width: SIZE,
            height: canvas.height * RELATIVE_PLAYER_HEIGHT,
            speed: 20,
            input: 0
        },
        speedFactor: 1
    }
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    
    // input events
    document.addEventListener('keydown', (keyEvent) => input[keyEvent.code] = 1);
    document.addEventListener('keyup', (keyEvent) => input[keyEvent.code] = 0);
    
    // start game
    start();
    
    // start game loop
    setInterval(frame, MSPF);
});