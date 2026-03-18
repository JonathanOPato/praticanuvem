// --- Canvas and Asset Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const imgPokeball = document.getElementById('img-pokeball');

// --- Ball Properties (Pokéball) ---
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;
const ballRadius = 12; // Adjusted for the image size

// --- Paddle Properties (Master Ball) ---
const paddleHeight = 20; // Increased height for better visual
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

// --- Brick Properties (Pokémon Types) ---
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40; // Pushed down to make space for score
const brickOffsetLeft = 30;
const brickColors = [
    '#A9A9A9', // Rock type
    '#FFD700', // Electric type
    '#33FF57', // Grass type
    '#33AFFF', // Water type
    '#FF5733'  // Fire type
];

// --- Game State ---
let score = 0;

// --- Brick Initialization ---
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r] };
    }
}

// --- Event Listeners ---
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// --- Drawing Functions ---
function drawBall() {
    if (imgPokeball && imgPokeball.complete) {
        ctx.drawImage(imgPokeball, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red'; // Fallback red
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    // Master Ball theme
    // Main purple body
    ctx.fillStyle = '#A040A0';
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

    // White stripe in the middle
    ctx.fillStyle = 'white';
    ctx.fillRect(paddleX, canvas.height - paddleHeight + (paddleHeight/2) - 2, paddleWidth, 4);

    // Central circle
    ctx.beginPath();
    ctx.arc(paddleX + paddleWidth / 2, canvas.height - paddleHeight / 2, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFC0CB'; // Pinkish center
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 8, 25);
}

// --- Collision Detection ---
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert('YOU\'VE CAPTURED THEM ALL! CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// --- Main Game Loop ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert('GAME OVER! The Pokéball was lost.');
            document.location.reload();
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Start the game
draw();
