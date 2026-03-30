const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Images
const imgPokeball = document.getElementById('img-pokeball');
const imgPikachu = document.getElementById('img-pikachu');

// Game state
let score = 0;
let lives = 3;

// Game elements
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 15,
    velocityX: 5,
    velocityY: -5, // Start moving up
    speed: 7
};

const paddle1 = {
    x: canvas.width / 2 - 120, // Left paddle
    y: canvas.height - 20,
    width: 100,
    height: 10,
    color: '#ffde00',
    dx: 15
};

const paddle2 = {
    x: canvas.width / 2 + 20, // Right paddle
    y: canvas.height - 20,
    width: 100,
    height: 10,
    color: '#3b4cca',
    dx: 15
};

const target = {
    x: Math.random() * (canvas.width - 64),
    y: 50 + Math.random() * (canvas.height / 3),
    width: 64,
    height: 64,
    visible: true
};

// --- Drawing Functions ---
function drawImage(img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawText(text, x, y, color = '#FFF', font = '30px fantasy') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

// --- Game Logic ---
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.velocityY = 5;
}

function respawnTarget(){
    target.x = Math.random() * (canvas.width - target.width);
    target.y = 50 + Math.random() * (canvas.height / 3);
    target.visible = true;
}

function collision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}


function update() {
    if (lives <= 0) return; // Game over

    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with walls (left/right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
    }
    // Ball collision with wall (top)
    if (ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with bottom wall (lose life)
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        resetBall();
    }

    // Ball collision with paddles
    const ballAsRect = { x: ball.x - ball.radius, y: ball.y - ball.radius, width: ball.radius * 2, height: ball.radius * 2 };
    if (collision(ballAsRect, paddle1) || collision(ballAsRect, paddle2)) {
        ball.velocityY = -ball.velocityY;
        // Prevent sticking
        ball.y = paddle1.y - ball.radius;
    }

    // Ball collision with target
    if (target.visible && collision(ballAsRect, target)) {
        score++;
        target.visible = false;
        // Increase speed slightly
        ball.speed += 0.2;
        ball.velocityX = ball.velocityX > 0 ? ball.speed : -ball.speed;
        ball.velocityY = ball.velocityY > 0 ? ball.speed : -ball.speed;
        // Respawn target after a short delay
        setTimeout(respawnTarget, 500);
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, paddle1.color);
    drawRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, paddle2.color);

    // Draw ball (Pokéball)
    drawImage(imgPokeball, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);

    // Draw target (Pikachu)
    if (target.visible) {
        drawImage(imgPikachu, target.x, target.y, target.width, target.height);
    }

    // Draw score and lives
    drawText(`Score: ${score}`, 20, 40, '#ffde00');
    drawText(`Lives: ${lives}`, canvas.width - 120, 40, '#ffde00');
    
    // Draw Game Over
    if (lives <= 0) {
        drawText('Game Over', canvas.width/2 - 100, canvas.height/2, '#ffde00', '50px fantasy');
    }
}

// --- Controls ---
const keysPressed = {};
window.addEventListener('keydown', (e) => { keysPressed[e.key] = true; });
window.addEventListener('keyup', (e) => { keysPressed[e.key] = false; });

function handleControls() {
    // Player 1 (Left Paddle)
    if (keysPressed['a'] && paddle1.x > 0) {
        paddle1.x -= paddle1.dx;
    }
    if (keysPressed['d'] && paddle1.x + paddle1.width < canvas.width) {
        paddle1.x += paddle1.dx;
    }
    // Player 2 (Right Paddle)
    if (keysPressed['ArrowLeft'] && paddle2.x > 0) {
        paddle2.x -= paddle2.dx;
    }
    if (keysPressed['ArrowRight'] && paddle2.x + paddle2.width < canvas.width) {
        paddle2.x += paddle2.dx;
    }
}

// --- Game Loop ---
function gameLoop() {
    handleControls();
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Wait for images to load before starting
let imagesLoaded = 0;
const totalImages = 2;
imgPokeball.onload = () => { imagesLoaded++; if(imagesLoaded === totalImages) requestAnimationFrame(gameLoop); };
imgPikachu.onload = () => { imagesLoaded++; if(imagesLoaded === totalImages) requestAnimationFrame(gameLoop); };

// In case images are already cached
if (imgPokeball.complete) imgPokeball.onload();
if (imgPikachu.complete) imgPikachu.onload();
