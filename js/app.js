// Element class for extend the render function to Player and Enemy classes;
var Element = function (sprite, x, y) {
    this.sprite = sprite;
    this.x = (x || 0);
    this.y = (y || 0);
};

Element.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// extend render method from element class
Enemy.prototype = new Element();

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, pause) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (!pause) {
        this.x += this.speed * dt;

        // make enemies loop to left side of canvas after reaching canvas.width
        if (this.x >= 505) {
            this.x = -100;
        }

        // Check for collision with enemies or barrier-walls
        this.checkCollision(this);
    } else {
        this.x = this.x;
    }

};

Enemy.prototype.checkCollision =  function(enemy){
        // check for collision between enemy and player
    if (
        player.y + 131 >= enemy.y + 90 &&
        player.x + 25 <= enemy.x + 88 &&
        player.y + 73 <= enemy.y + 135 &&
        player.x + 76 >= enemy.x + 11) {
        player.x = 202.5;
        player.y = 383;

        if (score === 0) {
            score = 0;
        } else {
            score--;
        }

    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
    this.players = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ]
};

// extend render method from element class
Player.prototype = new Element();

Player.prototype.update = function() {
    player.checkWin();
}


Player.prototype.checkWin =  function(){

    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    if (player.y + 63 <= 0) {
        player.x = 202.5;
        player.y = 383;

        score++;
        gameLevel++;
        console.log('current score: ' + score + ', current level: ' + gameLevel);
        increaseDifficulty(score);
    }
}


Player.prototype.handleInput = function(keyPress, pause) {
    if (!pause || keyPress === "space") {
        switch (keyPress) {
            case 'left':
                player.x -= player.speed;
                break;
            case 'right':
                player.x += player.speed;
                break;
            case 'up':
                player.y -= player.speed - 20;
                break;
            case 'down':
                player.y += player.speed - 20;
                break;
            case 'space':
                pauseGame();
                break;
            case 'enter':
                changePlayer();
                break;
            default:
                break;
        }
    };

    // check if player runs into left, bottom, or right canvas walls
    // prevent player from moving beyond canvas wall boundaries
    if (player.y > 383) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }

};

// Function to display player's score
var displayScoreLevel = function(aScore, aLevel) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player score and level to div element created
    scoreLevelDiv.innerHTML = 'Score: ' + aScore +
        ' / ' + 'Level: ' + aLevel;
    document.body.insertBefore(scoreLevelDiv, firstCanvasTag[0]);
};

// Function to change the player
var n = 0;
var changePlayer = function() {
    n = (n + 1) % player.players.length;
    player.sprite = player.players[n];
};

// Function to draw text
function drawText(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "42px sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 4;
    ctx.strokeText(text, (canvas.width / 2), 35);
    ctx.fillStyle = "lightcoral";
    ctx.fillText(text, (canvas.width / 2), 35);
}
var textDefault = "Bug Game";
var text = textDefault;

// Function to pause game
var pause = false;
var pauseGame = function() {
    pause = !pause;
    text = text !== textDefault ? textDefault : "Pause";
    drawText(text);
};

// Increase number of enemies on screen based on player's score
var increaseDifficulty = function(numEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Enemy randomly placed vertically within section of canvas
// Declare new score and gameLevel variables to store score and level
var allEnemies = [];
var player = new Player(202.5, 383, 50);
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.createElement('div');
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    e.preventDefault();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode], pause);
});
