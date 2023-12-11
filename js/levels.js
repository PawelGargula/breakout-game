class Level {
    paddleSrc = "";
    ballSrc = "";
    bricks = new Map();
}

const cosmos = new Level();
cosmos.paddleSrc = "img/cosmos/paddle.bmp";
cosmos.ballSrc = "img/cosmos/ball.bmp";
cosmos.bricks.set("0,3", "yellowBrick");
cosmos.bricks.set("0,4", "grayBrick");
cosmos.bricks.set("0,5", "grayBrick");
cosmos.bricks.set("0,6", "grayBrick");
cosmos.bricks.set("0,7", "grayBrick");
cosmos.bricks.set("1,2", "orangeBrick");
cosmos.bricks.set("1,3", "yellowBrick");
cosmos.bricks.set("1,4", "lightGrayBrick");
cosmos.bricks.set("1,5", "lightGrayBrick");
cosmos.bricks.set("1,6", "lightGrayBrick");
cosmos.bricks.set("1,7", "lightGrayBrick");
cosmos.bricks.set("1,8", "grayBrick");
cosmos.bricks.set("2,1", "redBrick");
cosmos.bricks.set("2,2", "orangeBrick");
cosmos.bricks.set("2,3", "yellowBrick");
cosmos.bricks.set("2,4", "lightGrayBrick");
cosmos.bricks.set("2,5", "lightGrayBrick");
cosmos.bricks.set("2,6", "lightGrayBrick");
cosmos.bricks.set("2,7", "lightGrayBrick");
cosmos.bricks.set("2,8", "lightGrayBrick");
cosmos.bricks.set("2,9", "grayBrick");
cosmos.bricks.set("3,0", "redBrick");
cosmos.bricks.set("3,1", "redBrick");
cosmos.bricks.set("3,2", "orangeBrick");
cosmos.bricks.set("3,3", "yellowBrick");
cosmos.bricks.set("3,4", "lightGrayBrick");
cosmos.bricks.set("3,5", "blueBrick");
cosmos.bricks.set("3,6", "lightGrayBrick");
cosmos.bricks.set("3,7", "lightGrayBrick");
cosmos.bricks.set("3,8", "lightGrayBrick");
cosmos.bricks.set("3,9", "lightGrayBrick");
cosmos.bricks.set("3,10", "grayBrick");
cosmos.bricks.set("4,1", "redBrick");
cosmos.bricks.set("4,2", "orangeBrick");
cosmos.bricks.set("4,3", "yellowBrick");
cosmos.bricks.set("4,4", "lightGrayBrick");
cosmos.bricks.set("4,5", "lightGrayBrick");
cosmos.bricks.set("4,6", "lightGrayBrick");
cosmos.bricks.set("4,7", "lightGrayBrick");
cosmos.bricks.set("4,8", "lightGrayBrick");
cosmos.bricks.set("4,9", "grayBrick");
cosmos.bricks.set("5,2", "orangeBrick");
cosmos.bricks.set("5,3", "yellowBrick");
cosmos.bricks.set("5,4", "lightGrayBrick");
cosmos.bricks.set("5,5", "lightGrayBrick");
cosmos.bricks.set("5,6", "lightGrayBrick");
cosmos.bricks.set("5,7", "lightGrayBrick");
cosmos.bricks.set("5,8", "grayBrick");
cosmos.bricks.set("6,3", "yellowBrick");
cosmos.bricks.set("6,4", "grayBrick");
cosmos.bricks.set("6,5", "grayBrick");
cosmos.bricks.set("6,6", "grayBrick");
cosmos.bricks.set("6,7", "grayBrick");

export const levels = {
    cosmos
}