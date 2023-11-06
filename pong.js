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
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.stroke();
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    setInterval(frame, MSPF);
});