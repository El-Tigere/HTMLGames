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
var game = {
    ball: {
        speed: 10,
        x: 0,
        y: 0,
        dx: 1,
        dy: 1
    },
    p1: {
        height: 0,
        speed: 20,
        y: 0,
        input: 0,
        score: 0
    },
    p2: {
        height: 0,
        speed: 20,
        y: 0,
        input: 0,
        score: 0
    },
    speedFactor: 1
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
        player.y += player.input * player.speed;
        player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);
    });
    
    // ball movement
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;
    // ball-player-collisions
    if(ball.x < SIZE && ball.x >= 0 && ball.y > p1.y - SIZE && ball.y < p1.y + p1.height) {
        ball.dx = 1;
        ball.dy = (2 * (ball.y - p1.y) - p1.height + SIZE) / p1.height;
    }
    if(ball.x > canvas.width - 2 * SIZE && ball.x <= canvas.width - SIZE && ball.y > p2.y - SIZE && ball.y < p2.y + p2.height) {
        ball.dx = -1;
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
        p2.score++;
        start();
        return;
    }
    if(ball.x > canvas.width) {
        p1.score++;
        start();
        return;
    }
    
    // clear background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    // draw scores
    ctx.fillStyle = colors.scores;
    ctx.font = (SIZE * 4) + 'px Arial'
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p1.score, canvas.width * 0.25, canvas.height * 0.15);
    ctx.fillText(p2.score, canvas.width * 0.75, canvas.height * 0.15);
    
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
    // set player position
    game.p1.y = game.p2.y = ((canvas.height - game.p1.height) / 2) >> 0;
    
    // init ball
    game.ball.x = (canvas.width - SIZE) / 2;
    game.ball.y = (canvas.height - SIZE) / 2;
    game.ball.dx = (Math.random() > 0.5) * 2 - 1;
    game.ball.dy = Math.random() * 2 - 1;
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    
    // set player height
    game.p1.height = game.p2.height = canvas.height * RELATIVE_PLAYER_HEIGHT;
    
    // input events
    document.addEventListener('keydown', (keyEvent) => input[keyEvent.code] = 1);
    document.addEventListener('keyup', (keyEvent) => input[keyEvent.code] = 0);
    
    // start game
    start();
    
    // start game loop
    setInterval(frame, MSPF);
});