import { levels } from "./levels.js";

const startPageDom = document.querySelector(".start-page");
const hideStartPage = () => startPageDom.classList.add("hide");
const showStartPage = () => startPageDom.classList.remove("hide");

const levelsDom = document.querySelectorAll("[data-level]");
levelsDom.forEach(levelDom => {
    levelDom.addEventListener("click", () => {
        const level = levels[levelDom.dataset.level];
        generateLevel(level, levelDom.dataset.level);
    });
});

const wonLevelsKey = "wonLevels";
const getWonLevelsString = () => localStorage.getItem(wonLevelsKey);
getWonLevelsString() === null && localStorage.setItem(wonLevelsKey, "");
const markWonLevels = () => {
    const wonLevelsArr = getWonLevelsString().split(",");
    levelsDom.forEach(levelDom => {
        wonLevelsArr.includes(levelDom.dataset.level) && levelDom.classList.add("won");
    });
};
markWonLevels();

let ballVelocity = 600;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    ballVelocity = 350;
}

function generateLevel(level, name) {
    hideStartPage();
    const game = new Phaser.Game(560, 720, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
    window.addEventListener("deviceorientation", handleOrientation, true);
    let ball;
    let brickInfo;
    let bricks;
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;
    let keys;
    let left;
    let lives = 3;
    let lifeLostText;
    let hearts;
    let newBrick;
    let paddle;
    let playing = false;
    let phone;
    let right;
    let scoreText;
    let score = 0;
    let startButton;
    let levelsButton;
    const levelBricks = level.bricks;

    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = level.backgroundColor;
        game.load.image('paddle', level.paddleSrc, 104, 24);
        game.load.image('beigeBrick', 'img/brick_beige.bmp');
        game.load.image('blackBrick', 'img/brick_black.bmp');
        game.load.image('blueBrick', 'img/brick_blue.bmp');
        game.load.image('brick', 'img/brick.bmp');
        game.load.image('brownBrick', 'img/brick_brown.bmp');
        game.load.image('grayBrick', 'img/brick_gray.bmp');
        game.load.image('greenBrick', 'img/brick_green.bmp');
        game.load.image('lightGrayBrick', 'img/brick_light_gray.bmp');
        game.load.image('orangeBrick', 'img/brick_orange.bmp');
        game.load.image('redBrick', 'img/brick_red.bmp');
        game.load.image('yellowBrick', 'img/brick_yellow.bmp');
        game.load.image('ball', level.ballSrc, 16, 16);
        game.load.image('button', 'img/start-button.png', 120, 40);
        game.load.image('levels', 'img/levels-button.png', 90, 30);
        game.load.image('heart', 'img/heart.png', 20, 20);
        game.load.image('right', 'img/right.png', 50, 30);
        game.load.image('left', 'img/left.png', 50, 30);
        game.load.image('phone', 'img/phone.png', 130, 106);
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

        const textStyle = { font: '18px Arial', fill: '#FFF' };
        scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
        hearts = game.add.group();
        for (let i = 1; i <= lives; i++) {
            const heart = game.add.sprite(game.world.width - 25 * i, 5, "heart");
            hearts.add(heart);
        }
        lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, tap to continue', textStyle);
        lifeLostText.anchor.set(0.5);
        lifeLostText.visible = false;

        startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame);
        startButton.anchor.set(0.5);

        levelsButton = game.add.button(game.world.width * 0.5, 5, 'levels', destroyGame);
        levelsButton.anchor.set(0.5, 0);

        const margin = 150;
        left = game.add.sprite(game.world.width * 0.5 - margin, game.world.height * 0.5 + margin, 'left');
        left.anchor.set(0.5);
        right = game.add.sprite(game.world.width * 0.5 + margin, game.world.height * 0.5 + margin, 'right');
        right.anchor.set(0.5);
        phone = game.add.sprite(game.world.width * 0.5, game.world.height * 0.5 + margin, 'phone');
        phone.anchor.set(0.5);

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
            padding: 8
        }
        bricks = game.add.group();
        for (let c = 0; c < brickInfo.count.row; c++) {
            for (let r = 0; r < brickInfo.count.col; r++) {
                const coordinates = `${c},${r}`;
                if (levelBricks.has(coordinates)) {
                    const brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
                    const brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
                    newBrick = game.add.sprite(brickX, brickY, levelBricks.get(coordinates));
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
        if (score === levelBricks.size * 10) {
            showNotification('You won the game, congratulations!', true);
            destroyGame();

            const wonLevelsString = getWonLevelsString();
            if (!wonLevelsString.includes(name)) {
                localStorage.setItem(wonLevelsKey, `${wonLevelsString}${name},`);
                markWonLevels();
            }
        }
    }

    function ballLeaveScreen() {
        lives--;
        playing = false;
        if (lives) {
            hearts.children[lives].kill();
            lifeLostText.visible = true;
            ball.reset(game.world.width * 0.5, game.world.height - 52);
            paddle.reset(game.world.width * 0.5, game.world.height - 20);
            game.input.onDown.addOnce(function () {
                lifeLostText.visible = false;
                playing = true;
                ball.body.velocity.set(ballVelocity, -ballVelocity);
            }, this);
        }
        else {
            showNotification('You lost, try again!');
            destroyGame();
        }
    }

    function ballHitPaddle(ball, paddle) {
        ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
    }

    function startGame() {
        startButton.destroy();
        levelsButton.destroy();
        left.destroy();
        right.destroy();
        phone.destroy();

        ball.body.velocity.set(ballVelocity, -ballVelocity);
        playing = true;
    }

    function destroyGame() {
        game.destroy();
        window.removeEventListener("deviceorientation", handleOrientation);
        setTimeout(showStartPage, 10);
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
}

function showNotification(message, isSuccess) {
    const notification = document.createElement("span");
    notification.classList.add("notification");
    isSuccess && notification.classList.add("success");
    notification.textContent = message;
    const body = document.body;
    body.appendChild(notification);
    setTimeout(() => body.removeChild(notification), 5000);
}