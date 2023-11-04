const MSPF = 20;

function frame() {
    /** @type {DOMRect} */
    let canvas = document.getElementById('pongCanvas');
    
    /** @type {CanvasRenderingContext2D} */
    let ctx = document.getElementById('pongCanvas').getContext('2d');
    
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
    setInterval(frame, MSPF);
});