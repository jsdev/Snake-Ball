//GLOBAL CONSTANTS
var SNAKE_IMAGES = ['ball','ball2','ball4','ball5','ball6','ball7','ball8','ball9','ball10','ball11', 'ball12','ball13','ball15','ball16','ball17','ball18','ball19','ball20','ball21','ball22','ball23'];
var EYE = 'eyeball2';
var EYE_SIZE = 20;
var CANDY = 'candy2';
var EXPIRED_FOOD = 'candy4';
var FOOD_SIZE = 40;
var DISTANCE = 20;
var centerX = this.width()/2, centerY = this.height()/2;
var MSG1 = text('TAP TO SPAWN',centerX, centerY - 22,'lime',CENTER);
var MSG2 = text('DRAG TO MOVE',centerX, centerY + 22,'junglegreen',CENTER);
//GLOBAL VARIABLES
var PLAYER;
var opponents = [];
var n = 5;
var food = stamp(CANDY,0,0,2);

fill('space4');

function buildSnake() {
    var SNAKE = {
        IMG: random(SNAKE_IMAGES),
        consumed: 0,
        SIZE:60,
        SPEED: 15
    };
    var x = random([random(-20,-100),random(800,900)]);
    var y = random([random(-20,-100),random(1070,1150)]);
    var tempY;
    SNAKE.head = stamp(SNAKE.IMG,x,y, SNAKE.SIZE);
    SNAKE.LEFT_EYE = stamp(EYE,SNAKE.head.x-10,SNAKE.head.y,EYE_SIZE);
    SNAKE.RIGHT_EYE = stamp(EYE,SNAKE.head.x+10,SNAKE.head.y,EYE_SIZE);
    SNAKE.body = [];
    while (SNAKE.body.length < n) {
        tempY = SNAKE.head.y + ((n- SNAKE.body.length) * DISTANCE);
        SNAKE.body.push(stamp(SNAKE.IMG,SNAKE.head.x,tempY,SNAKE.SIZE));
    }
    SNAKE.head.front();
    SNAKE.head.aim(400,500);
    return SNAKE
}

function hideEyes(SNAKE) {
    if (SNAKE.RIGHT_EYE) SNAKE.RIGHT_EYE.hide();
    if (SNAKE.LEFT_EYE) SNAKE.LEFT_EYE.hide();
}

function buildAI() {
    opponents.push(buildSnake());
}

function setStage(){
    song('bumblebee')
    MSG1.hide();
    MSG2.hide();
}

function notifyLaunch () {
    var x = PLAYER.head.x+0;
    var y = PLAYER.head.y+0;
    x = x < 0 ? x + 200 : x > 750 ? x - 200 : x
    y = y < 0 ? y + 200 : y > 1050 ? y - 200 : y
    arrow = stamp('arrow', x, y,0)
    arrow.aim(PLAYER.head)
    arrow.size(150)
    arrow.size(0,2000)
}

function setBG(){
    fill([PLAYER.IMG].includes('ball8') ? 'park' : 'space4');
}

function gameLoop () {
    var temp;
    opponents.concat(PLAYER).forEach(function(s){
        if (s !== PLAYER) aimHead(s,food.x,food.y);
        if (s.body && s.body.length) slither(s);
    });
}

function deadOpponent (s) {
    opponents = opponents.filter(function(o) { return o !== s });
    setBG();
    buildAI();
}

function deadPLAYER () {
    silence();
    MSG1.show();
    MSG2.show();
    this.touching = function () { };
    this.tap = init;
}
function hitSNAKE(SNAKE, s) {
//  var bodyPartHitHead = bod => bod.hits(SNAKE.head.x,SNAKE.head.y);
    var bodyPartHitHead = bod => bod.hits(SNAKE.head);
    return s.body.some(bodyPartHitHead);
}

function init() {
    setStage();
    spawnFood()
    buildAI();
    PLAYER = buildSnake()
    setBG();
    notifyLaunch();
    this.tap = function () { };
    this.touching = navigate;
    this.loop = gameLoop;
}

function navigate() {
    if (PLAYER.head.hits(x,y) || PLAYER.body.some(function(body){return body.hits(x,y) }) ) return;
    aimHead(PLAYER,x,y);
}

this.tap = init;

function rotateHead(SNAKE) {
    var head = SNAKE.head;
    var r = head.rotation;
    head.size(SNAKE.SIZE);
    head.rotate(r);
    SNAKE.LEFT_EYE.rotate(r);
    SNAKE.RIGHT_EYE.rotate(r);
}

function moveHead(SNAKE) {
    SNAKE.head.move(UP,SNAKE.SPEED);
    SNAKE.RIGHT_EYE.move(UP,SNAKE.SPEED);
    SNAKE.LEFT_EYE.move(UP,SNAKE.SPEED);
    SNAKE.head.front();
    SNAKE.LEFT_EYE.front();
    SNAKE.RIGHT_EYE.front();
}

function slither(SNAKE) {
    if(!!SNAKE.ate) SNAKE.ate = undefined
    else {
        var s = SNAKE.body.shift();
        s.hide();
    }
    SNAKE.body.push(stamp(SNAKE.IMG,SNAKE.head.x,SNAKE.head.y, SNAKE.SIZE))
    rotateHead(SNAKE);
    moveHead(SNAKE);

    var anyHasEaten = false;
//    var chance = false;//random(0,1)
    if (SNAKE.head.hits(food.x,food.y)) {
        food.size(0,30)
        anyHasEaten = true
        SNAKE.ate = true
        spawnFood()
        SNAKE.SIZE = SNAKE.SIZE + 1;
        SNAKE.consumed = SNAKE.consumed + 1;
        SNAKE.SPEED = SNAKE.SPEED + .1;
    }

    opponents.concat(PLAYER).forEach(function(s) {
        if (s === SNAKE) return;
        if (anyHasEaten) {
            s.SIZE = s.SIZE - 1;
            s.SPEED = s.SPEED + .1;
        }
        if (hitSNAKE(SNAKE, s)) {
            die(SNAKE)
            if (SNAKE === PLAYER) deadPLAYER();
            else {
                deadOpponent()
//                if (chance) buildAI()
            }
        }


    });
}

function die(SNAKE) {
    hideEyes(SNAKE);
    SNAKE.body.concat(SNAKE.head).map(function(s){
        s.size(FOOD_SIZE);
        s.change(CANDY);
        s.size(0,3000);
    });
    SNAKE.body = [];
}

function aimHead (SNAKE,x,y) {
    SNAKE.head.aim(x,y);
}

function spawnFood() {
    var x = random(10, 740);
    var y = random(10, 1000);
    food.size(FOOD_SIZE,500);
    food.move(x,y)
    food.dance();
    food.dance();
}
