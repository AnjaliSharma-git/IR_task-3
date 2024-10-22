const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;

let player = { x: 180, y: 450, width: 40, height: 40, speed: 5 };
let obstacles = [];
let gameInterval;
let score = 0;
let scoreInterval = 0; // Controls how often the score increments
let isGameOver = false;

document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
    player.x = 180;
    obstacles = [];
    score = 0;
    scoreInterval = 0;
    isGameOver = false;
    document.getElementById("score").textContent = score;
    gameInterval = setInterval(updateGame, 20);
    document.getElementById("startButton").disabled = true;
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw player
    drawPlayer();

    // Generate obstacles
    if (Math.random() < 0.02) {
        createObstacle();
    }

    // Move and draw obstacles
    moveObstacles();

    // Check collision
    checkCollision();

    // Update score less frequently
    scoreInterval++;
    if (scoreInterval % 50 === 0) { // Adjust this value to control the rate
        score++;
        document.getElementById("score").textContent = score;
    }
}

function drawPlayer() {
    // Draw player with gradient
    let gradient = ctx.createLinearGradient(player.x, player.y, player.x + player.width, player.y + player.height);
    gradient.addColorStop(0, "#00ff00");
    gradient.addColorStop(1, "#009900");
    ctx.fillStyle = gradient;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function createObstacle() {
    let x = Math.random() * (canvas.width - 40);
    obstacles.push({ x: x, y: -40, width: 40, height: 40, speed: 2 + score / 500 });
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacles[i].speed;

        // Draw obstacle with shadow effect
        ctx.fillStyle = "#ff0000";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y) {
            gameOver();
            break;
        }
    }
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    alert("Game Over! Your score: " + score);
    document.getElementById("startButton").disabled = false;
}

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});
