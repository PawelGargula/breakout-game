const game = new Phaser.Game(580, 720, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
window.addEventListener("deviceorientation", handleOrientation, true);
let ball;
const ballVelocity = 350;
let brickInfo;
let bricks;
let isPortrait = window.matchMedia("(orientation: portrait)").matches;
let keys;
let lives = 3;
let lifeLostText;
let livesText;
let newBrick;
let paddle;
let playing = false;
let scoreText;
let score = 0;
let startButton;

const cosmosArr = new Map();
cosmosArr.set("0,3", "yellowBrick");
cosmosArr.set("0,4", "grayBrick");
cosmosArr.set("0,5", "grayBrick");
cosmosArr.set("0,6", "grayBrick");
cosmosArr.set("0,7", "grayBrick");
cosmosArr.set("1,2", "orangeBrick");
cosmosArr.set("1,3", "yellowBrick");
cosmosArr.set("1,4", "lightGrayBrick");
cosmosArr.set("1,5", "lightGrayBrick");
cosmosArr.set("1,6", "lightGrayBrick");
cosmosArr.set("1,7", "lightGrayBrick");
cosmosArr.set("1,8", "grayBrick");
cosmosArr.set("2,1", "redBrick");
cosmosArr.set("2,2", "orangeBrick");
cosmosArr.set("2,3", "yellowBrick");
cosmosArr.set("2,4", "lightGrayBrick");
cosmosArr.set("2,5", "lightGrayBrick");
cosmosArr.set("2,6", "lightGrayBrick");
cosmosArr.set("2,7", "lightGrayBrick");
cosmosArr.set("2,8", "lightGrayBrick");
cosmosArr.set("2,9", "grayBrick");
cosmosArr.set("3,0", "redBrick");
cosmosArr.set("3,1", "redBrick");
cosmosArr.set("3,2", "orangeBrick");
cosmosArr.set("3,3", "yellowBrick");
cosmosArr.set("3,4", "lightGrayBrick");
cosmosArr.set("3,5", "blueBrick");
cosmosArr.set("3,6", "lightGrayBrick");
cosmosArr.set("3,7", "lightGrayBrick");
cosmosArr.set("3,8", "lightGrayBrick");
cosmosArr.set("3,9", "lightGrayBrick");
cosmosArr.set("3,10", "grayBrick");
cosmosArr.set("4,1", "redBrick");
cosmosArr.set("4,2", "orangeBrick");
cosmosArr.set("4,3", "yellowBrick");
cosmosArr.set("4,4", "lightGrayBrick");
cosmosArr.set("4,5", "lightGrayBrick");
cosmosArr.set("4,6", "lightGrayBrick");
cosmosArr.set("4,7", "lightGrayBrick");
cosmosArr.set("4,8", "lightGrayBrick");
cosmosArr.set("4,9", "grayBrick");
cosmosArr.set("5,2", "orangeBrick");
cosmosArr.set("5,3", "yellowBrick");
cosmosArr.set("5,4", "lightGrayBrick");
cosmosArr.set("5,5", "lightGrayBrick");
cosmosArr.set("5,6", "lightGrayBrick");
cosmosArr.set("5,7", "lightGrayBrick");
cosmosArr.set("5,8", "grayBrick");
cosmosArr.set("6,3", "yellowBrick");
cosmosArr.set("6,4", "grayBrick");
cosmosArr.set("6,5", "grayBrick");
cosmosArr.set("6,6", "grayBrick");
cosmosArr.set("6,7", "grayBrick");

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#000';
    game.load.image('paddle', 'img/kosmos/kosmos_paddle.bmp', 104, 24);
    game.load.image('redBrick', 'img/brick_red.bmp');
    game.load.image('orangeBrick', 'img/brick_orange.bmp');
    game.load.image('yellowBrick', 'img/brick_yellow.bmp');
    game.load.image('grayBrick', 'img/brick_gray.bmp');
    game.load.image('lightGrayBrick', 'img/brick_light_gray.bmp');
    game.load.image('blueBrick', 'img/brick_blue.bmp');
    game.load.spritesheet('ball', 'img/kosmos/ball.bmp', 16, 16);
    game.load.spritesheet('button', 'img/button.png', 120, 40);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 52, 'ball');
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 20, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

    textStyle = { font: '18px Arial', fill: '#FFF' };
    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
    livesText = game.add.text(game.world.width - 5, 5, 'Lives: ' + lives, textStyle);
    livesText.anchor.set(1, 0);
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, tap to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
    keys = game.input.keyboard.createCursorKeys();
    window.addEventListener("deviceorientation", handleOrientation, true);
    window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
        isPortrait = e.matches;
    });
}
function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    if (!playing) {
        return;
    } else if (keys.left.isDown && paddle.x > paddle.width / 2) {
        paddle.x -= 4;
    } else if (keys.right.isDown && paddle.x < game.width - paddle.width / 2) {
        paddle.x += 4;
    }
}
function initBricks() {
    brickInfo = {
        width: 36,
        height: 20,
        count: {
            col: 11,
            row: 9
        },
        offset: {
            top: 60,
            left: 60
        },
        padding: 10
    }
    bricks = game.add.group();
    for (c = 0; c < brickInfo.count.row; c++) {
        for (r = 0; r < brickInfo.count.col; r++) {
            const coordinates = `${c},${r}`;
            if (cosmosArr.has(coordinates)) {
                const brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
                const brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
                newBrick = game.add.sprite(brickX, brickY, cosmosArr.get(coordinates));
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                bricks.add(newBrick);
            }
        }
    }
}
function ballHitBrick(ball, brick) {
    brick.kill();
    score += 10;
    scoreText.setText('Points: ' + score);
    if (score === cosmosArr.size * 10) {
        alert('You won the game, congratulations!');
        location.reload();
    }
}
function ballLeaveScreen() {
    lives--;
    playing = false;
    if (lives) {
        livesText.setText('Lives: ' + lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width * 0.5, game.world.height - 40);
        paddle.reset(game.world.width * 0.5, game.world.height - 20);
        game.input.onDown.addOnce(function () {
            lifeLostText.visible = false;
            playing = true;
            ball.body.velocity.set(ballVelocity, -ballVelocity);
        }, this);
    }
    else {
        alert('You lost, game over!');
        location.reload();
    }
}
function ballHitPaddle(ball, paddle) {
    ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}
function startGame() {
    startButton.destroy();
    ball.body.velocity.set(ballVelocity, -ballVelocity);
    playing = true;
}

function handleOrientation(e) {
    const x = e.gamma;
    const y = e.beta;
    if (!playing) {
        return;
    } else if (isPortrait && (x < 0 && paddle.x > paddle.width / 2 || x > 0 && paddle.x < game.width - paddle.width / 2)) {
        paddle.x += x;
    } else if (!isPortrait && (y < 0 && paddle.x > paddle.width / 2 || y > 0 && paddle.x < game.width - paddle.width / 2)) {
        paddle.x += y;
    }
}