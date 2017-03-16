//GLOBAL CONSTANTS
var SNAKE_IMAGES = ['ball','ball2','ball4','ball5','ball6','ball7','ball8','ball9','ball10','ball11', 'ball12','ball13','ball15','ball16','ball17','ball18','ball19','ball20','ball21','ball22','ball23']
var EYE = 'eyeball2'
var EYE_SIZE = 20
var FOOD_IMG = 'candy2'
var FOOD_SIZE = 40
var DISTANCE = 20
var START_GAME = 'TAP TO START'
var MSG = text(START_GAME,'lime',CENTER)
//GLOBAL VARIABLES
var PLAYER = {
  SIZE:75,
  SPEED: 15,
  SCORE: text('0', 737, 1015,40, 'lime',RIGHT)
}
var AI = {
  SIZE:75,
  SPEED: 15,
  SCORE: text('0', 30, 1015,40, 'pink',LEFT)
}
var n = 5, y, food
var start = init
fill('space4')

function buildSnake(SNAKE,x,y) {
  SNAKE.consumed = 0
  SNAKE.SCORE.change('')
  SNAKE.head = stamp(SNAKE.IMG,x,y, SNAKE.SIZE)
  SNAKE.LEFT_EYE = stamp(EYE,SNAKE.head.x-10,SNAKE.head.y-20,EYE_SIZE)
  SNAKE.RIGHT_EYE = stamp(EYE,SNAKE.head.x+10,SNAKE.head.y-20,EYE_SIZE)
  SNAKE.body = []
  while (SNAKE.body.length < n) {
    y = SNAKE.head.y - ((n- SNAKE.body.length) * DISTANCE)
    SNAKE.body.push(stamp(SNAKE.IMG,SNAKE.head.x,y,SNAKE.SIZE))
  }
  SNAKE.body.push(SNAKE.head);
  SNAKE.head.front()
}
function buildPlayer() {
  buildSnake(PLAYER,400,400)
}
function hideEyes(SNAKE) {
  if (SNAKE.RIGHT_EYE) SNAKE.RIGHT_EYE.hide()
  if (SNAKE.LEFT_EYE) SNAKE.LEFT_EYE.hide()
}
function buildAI() {
  hideEyes(AI)
  if (AI.body && AI.body.length) AI.body.forEach(function(s){ s.hide() })
  var randomX = random([random(-20,-100),random(800,900)])
  var randomY = random([random(-20,-100),random(1070,1150)])
  buildSnake(AI,randomX,randomY)
}
function setStage(){
  song('bumblebee')
  MSG.change('')
}
function setBG(){
  PLAYER.IMG = random(SNAKE_IMAGES)
  AI.IMG = random(SNAKE_IMAGES.filter(function(s){return s!==PLAYER.IMG}))
  fill([PLAYER.IMG,AI.IMG].includes('ball8') ? 'park' : 'space4');
}
function gameLoop () {
  var collisions
  if (!food) { spawnFood() }
  aimHead(AI,food.x,food.y)
  if (AI.body && AI.body.length) {
      slither(AI)
  }
  if (PLAYER.body && PLAYER.body.length) slither(PLAYER)

  collisions = PLAYER.body.filter(hitAI)
  if (collisions.length) {
    console.log(collisions)
    die(AI)
    setBG()
    buildAI()
  }
  
  collisions = AI.body.filter(hitPLAYER)
  if (collisions.length) {
    console.log(collisions)
    die(PLAYER)
    silence()
    MSG.change(START_GAME)
	this.touching = function () { }
	this.tap = init
    return
  }
}
function hitPLAYER(bodyPart) {
 return (bodyPart.hits(PLAYER.LEFT_EYE) || bodyPart.hits(PLAYER.RIGHT_EYE)) && bodyPart != AI.head 
}

function hitAI(bodyPart) {
 return (bodyPart.hits(AI.LEFT_EYE) || bodyPart.hits(AI.RIGHT_EYE)) && bodyPart != AI.head 
}

function init() {
  find(FOOD_IMG).forEach(function(f){f.hide()})
  setStage()
  setBG()
  food = null
  buildAI()
  buildPlayer()
  this.tap = function () { }
  this.touching = function () { aimHead(PLAYER,x,y) }
  this.loop = gameLoop
}

tap = init

function slither(SNAKE) {
    var r = SNAKE.head.rotation
	SNAKE.head = stamp(SNAKE.IMG,SNAKE.head.x,SNAKE.head.y, SNAKE.SIZE)
    SNAKE.head.rotate(r)
    SNAKE.LEFT_EYE.rotate(r)
    SNAKE.RIGHT_EYE.rotate(r)
    SNAKE.head.move(UP,SNAKE.SPEED)
    SNAKE.RIGHT_EYE.move(UP,SNAKE.SPEED)
    SNAKE.LEFT_EYE.move(UP,SNAKE.SPEED)
    SNAKE.LEFT_EYE.front()
    SNAKE.RIGHT_EYE.front()
    SNAKE.body.push(SNAKE.head)
    var hasEaten = false
    var candies = find(FOOD_IMG)
    candies.forEach(function(candy) {
      if (SNAKE.head.hits(candy.x,candy.y)) {
        if (candy == food) {
          food = null
        	SNAKE.consumed = SNAKE.consumed + 0.9
        }
        candy.hide()
        SNAKE.consumed = SNAKE.consumed + 0.1
        SNAKE.SCORE.change(Math.floor(SNAKE.consumed))
        //sound('chomp')
        hasEaten = true
      }
    });
    if (hasEaten) return
  	var s = SNAKE.body.shift();
    s.hide()
}

function die(SNAKE) {
  hideEyes(SNAKE)
  SNAKE.body.map(function(s){ 
    s.size(FOOD_SIZE)
    s.change(FOOD_IMG)
    s.size(0,3000)
  })
  SNAKE.body = []
}

function aimHead (SNAKE,x,y) {
  SNAKE.head.aim(x,y)
}

function spawnFood() {
	var x = random(10, 740)
    var y = random(10, 1000)
    food = stamp(FOOD_IMG,x,y,FOOD_SIZE)
    food.dance()
}