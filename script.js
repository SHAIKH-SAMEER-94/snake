const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let highScore = 0;

// Load highscore from file
fetch('highscore.txt')
    .then(response => response.text())
    .then(data => {
        highScore = parseInt(data) || 0;
        document.getElementById('highscore').textContent = highScore;
    });

document.addEventListener('keydown', changeDirection);

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});


function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let part of snake) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(part.x, part.y, box, box);
    }

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, box, box);

    moveSnake();
    checkCollision();
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'UP') head.y -= box;
    else if (direction === 'DOWN') head.y += box;
    else if (direction === 'LEFT') head.x -= box;
    else if (direction === 'RIGHT') head.x += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    document.getElementById('score').textContent = score;
}

function checkCollision() {
    const head = snake[0];

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        endGame();
    }
}

function endGame() {
    alert('Game Over!');
    if (score > highScore) {
        highScore = score;
        saveHighScore();
    }
    document.getElementById('highscore').textContent = highScore;
    snake = [{ x: 200, y: 200 }];
    direction = 'RIGHT';
    food = generateFood();
    score = 0;
}

function saveHighScore() {
    fetch('highscore.txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highscore: highScore })
    });
}

setInterval(drawGame, 100);
