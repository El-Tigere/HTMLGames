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

var running = false;

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

var lastFrame = null;

const gameModes = {
    versus: {
        start: () => {
            scores = {p1: 0, p2: 0};
        },
        reset: () => {
        },
        bounce: (player) => {
            game.speedFactor += 0.02;
        },
        score: (player) => {
            scores[player]++;
            restartAfterDelay(1000);
        },
        end: () => {
        }
    },
    coop: {
        start: () => {
        },
        reset: () => {
            scores = {p1: 0, p2: 0};
        },
        bounce: (player) => {
            scores.p1++;
            scores.p2++;
            game.speedFactor += 0.02;
        },
        score: (player) => {
            console.log(scores.p1);
            restartAfterDelay(1000);
        },
        end: () => {
        }
    }
}

var currentGameMode;

function collideRect(a, b) {
    return a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y
}

/**
 * The frame-function is the main loop of the game.
 */
function update(deltaTime) {
    let ball = game.ball, p1 = game.p1, p2 = game.p2;
    
    let speed = game.speedFactor * deltaTime / 1000;
    
    // input
    p1.input = input['KeyS'] - input['KeyW'];
    p2.input = input['ArrowDown'] - input['ArrowUp'];
    
    // player movement
    [p1, p2].forEach((player) => {
        player.y += player.input * player.speed * speed;
        player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);
    });
    
    // ball movement
    ball.x += ball.dx * ball.speed * speed;
    ball.y += ball.dy * ball.speed * speed;
    // ball-player-collisions
    if(collideRect(p1, ball) && ball.dx < 0) {
        ball.dx = 1;
        ball.dy = (2 * (ball.y - p1.y) - p1.height + SIZE) / p1.height;
        currentGameMode.bounce('p1');
    }
    if(collideRect(p2, ball) && ball.dx > 0) {
        ball.dx = -1;
        ball.dy = (2 * (ball.y - p2.y) - p2.height + SIZE) / p2.height;
        currentGameMode.bounce('p2');
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
        currentGameMode.score('p2');
        return;
    }
    if(ball.x > canvas.width) {
        currentGameMode.score('p1');
        return;
    }
}

function restartAfterDelay(delay) {
    pause();
    reset();
    setTimeout(start, delay);
}

function draw() {
    let ball = game.ball, p1 = game.p1, p2 = game.p2;
    
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

function reset() {
    game = {
        ball: {
            x: (canvas.width - SIZE) / 2,
            y: (canvas.height - SIZE) / 2,
            width: SIZE,
            height: SIZE,
            dx: (Math.random() >= 0.5) * 2 - 1,
            dy: Math.random() * 2 - 1,
            speed: 500
        },
        p1: {
            x: 0,
            y: ((canvas.height * (1 - RELATIVE_PLAYER_HEIGHT)) / 2) >> 0,
            width: SIZE,
            height: canvas.height * RELATIVE_PLAYER_HEIGHT,
            speed: 1000,
            input: 0
        },
        p2: {
            x: canvas.width - SIZE,
            y: ((canvas.height * (1 - RELATIVE_PLAYER_HEIGHT)) / 2) >> 0,
            width: SIZE,
            height: canvas.height * RELATIVE_PLAYER_HEIGHT,
            speed: 1000,
            input: 0
        },
        speedFactor: 1
    }
    
    currentGameMode.reset();
}

function start() {
    lastFrame = null;
    running = true;
    window.requestAnimationFrame(gameLoop);
}

function pause() {
    running = false;
}

function startGame(gameMode) {
    // set gameMode
    currentGameMode = gameMode;
    
    // init
    reset();
    currentGameMode.start();
    
    // draw first frame
    draw();
    
    // start game after delay
    setTimeout(start, 3000);
}

function gameLoop(timeStamp) {
    if(!running) return;
    
    let deltaTime = lastFrame == null ? 0 : timeStamp - lastFrame;
    
    update(deltaTime);
    draw();
    
    lastFrame = timeStamp;
    
    if(running) requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    
    // input events
    document.addEventListener('keydown', (keyEvent) => input[keyEvent.code] = 1);
    document.addEventListener('keyup', (keyEvent) => input[keyEvent.code] = 0);
    
    // start game
    startGame(gameModes.coop);
});