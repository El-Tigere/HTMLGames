const MSPF = 20;

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