let player;
let game;
let debugMode = true;


class GameState{
  gameStarted;
  roomIndex;
  roomArray;
  nextRoomIndex;
  constructor(){
    this.gameStarted = true;
    this.roomIndex = 6;
    this.roomArray = [new Room(), new DiningRoom(), new CommonRoom(), new HallWay1(), new HallWay2(), new HallWay3(), new NurseStation];
  }
  runCurrentRoom(){
    this.roomArray[this.roomIndex].runRoom();
  }
}
class Room{
  background;
  horizontalLength;
  arrows;
  constructor(){
    this.arrows = [];
  }
  runRoom(){
    this.drawArrows();
    player.queryMovementAndDisplay(this);
    
  }

  isValidPosition(vx, vy){
    if(vx < 34 || vx > 1460){
      console.log("invalidPos");
      return false;
    } else if (vy > 502 ||vy < 206){
      return false;
    }
    else {
      return true;
    }
  }
  drawArrows(){
    let i;
    let totboo = false;
    let currBoo;
    for(i = 0; i < this.arrows.length; i++){
      currBoo= this.arrows[i].displayArrow();
      totboo = totboo || currBoo
      if (currBoo){
        game.nextRoomIndex = this.arrows[i].nextRoom;
      }
    }
    if (totboo == false){
      game.nextRoomIndex = false;
    }

  }

}
class HallWay extends Room{
  constructor(){
    super();
    this.horizontalLength = 1500;
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    let yValueMin = (-6/7) * vx +540;
    let otherYValueMin = .742268 * vx - 589.711340;
    let valid = vy > yValueMin && vy > otherYValueMin;
    return super.isValidPosition(vx, vy) && valid;
  }

}
class HallWay1 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/HallWay1.png");
    this.arrows = [new arrow("leftArrow", 232, 393, 0), new arrow("forwardArrow", 728, 226,  4)];
  }
  runRoom(){
    super.runRoom();
  }
}
class HallWay2 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway2.png");
    this.arrows = [new arrow("leftArrow", 232, 293, 6), new arrow("forwardArrow", 728, 226,  5), new arrow("rightDoorArrow", 1196, 394, 0), new arrow("backArrow", 731, 558, 3)];
  }
}
class HallWay3 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway3.png");
    this.arrows = [new arrow("backArrow", 731, 558, 4), new arrow("leftDoorArrow", 286, 397, 0), new arrow("rightDoorArrow", 1171, 425, 0)];
  }
}
class NurseStation extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/nurseStation.png");
    this.arrows = [new arrow("leftArrow", 63, 338, 1, 150), new arrow("rightArrow", 1300, 405, 4, 0, -80)]
    
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    return super.isValidPosition(vx, vy) && ((vx > 960) || vy > 380);
  }
}
class CommonRoom extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/commonRoom.png");
    this.arrows = [new arrow("backArrow", 709, 542, 1), new arrow("leftDoorArrow", 169, 266, 0 ,10, 200)]
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    let guyLeg = (vx >=274|| (vx < 274 && vy < 300));
    let guyHead = (vx >=510|| (vx < 510 && vy < 320));
    let chairback = (vx < 702 || vx > 950) || vy > 270;
    let chairfront = (vx < 774 || vx > 874) || vy > 302;;
    return super.isValidPosition(vx, vy) && guyLeg && guyHead && chairback && chairfront;
  }
}
class DiningRoom extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/diningRoom.png");
    this.arrows = [new arrow("rightArrow", 1386, 314, 6), new arrow("forwardArrow", 745, 210, 2)];
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    
    return super.isValidPosition(vx, vy) && (vx >=785|| (vx < 785 && vy < 292));
  }
}
class arrow{
  xPos;
  yPos;
  imgFile;
  imgFileM;
  mouseOverFile;
  nextRoom;
  apparentX;
  apparentY;
  constructor(imageName, x, y, nextRoom, xOffset = 0, yOffset = 0){
    this.imgFile = loadImage(`assets/arrows/${imageName}.png`);
    this.imgFileM = loadImage(`assets/arrows/${imageName}M.png`);
    this.xPos = 0 - xOffset;
    this.yPos = 0 - yOffset;
    this.apparentX = x;
    this.apparentY = y;
    this.xWidth = width;
    this.yHeight = height;
    this.nextRoom = nextRoom;
  }
  displayArrow(){
    if(this.distanceFromCenter(player) < 200){
      image(this.imgFileM, this.xPos, this.yPos);
      return true;
    } else {
      image(this.imgFile, this.xPos, this.yPos);
      return false;
    }
  }
  distanceFromCenter(player){
    return Math.abs(this.apparentX - player.xPos) + Math.abs(this.apparentY - player.yPos);
  }
}

class Player{
  speed = 4;
  direction; //-1 = Left 1 = Right
  xPos;
  yPos;
  stress;
  standLeft;
  standRight;
  walkLeft;
  walkRight;
  higherStressStandL;
  higherStressStandR;
  higherStressWalkL;
  higherStressWalkR;
  lowerStressStandL;
  lowerStressStandR;
  lowerStressWalkL;
  lowerStressWalkR;

  constructor(){
    this.xPos = 800;
    this.yPos = 400;
    this.stress = 1;
    this.direction = 0;
    this.standLeft = this.createAnimation("stand","Left", this.stress);
    this.standRight = this.createAnimation("stand","Right", this.stress);
    this.walkLeft = this.createAnimation("walk","Left", this.stress);
    this.walkRight = this.createAnimation("walk","Right", this.stress);
    this.higherStressStandL = this.createAnimation("stand","Left", this.stress + 1);
    this.higherStressStandR = this.createAnimation("stand","Right", this.stress +1);
    this.higherStressWalkL  = this.createAnimation("walk","Left", this.stress + 1);
    this.higherStressWalkR = this.createAnimation("walk","Right", this.stress + 1);
    this.lowerStressStandL = this.createAnimation("stand", "Left", this.stress - 1);
    this.lowerStressStandR = this.createAnimation("stand", "Right", this.stress - 1);
    this.lowerStressWalkL = this.createAnimation("walk", "Left", this.stress - 1);
    this.lowerStressWalkR = this.createAnimation("walk", "Right", this.stress - 1);
  }
  incrementStress(){
    if(this.stress < 15){
      this.stress = this.stress + 1;
      console.log("Incrementing stress to: ", this.stress);
      this.lowerStressStandL = this.standLeft;
      this.lowerStressStandR = this.standRight;
      this.lowerStressWalkL = this.walkLeft;
      this.lowerStressWalkR = this.walkRight;
      this.standLeft = this.higherStressStandL;
      this.standRight = this.higherStressStandR;
      this.walkLeft = this.higherStressWalkL;
      this.walkRight = this.higherStressWalkR;
      this.higherStressStandL = this.createAnimation("stand", "Left", this.stress +1);
      this.higherStressStandR = this.createAnimation("stand", "Right", this.stress +1);
      this.higherStressWalkL = this.createAnimation("walk", "Left", this.stress +1);
      this.higherStressWalkR = this.createAnimation("walk", "Right", this.stress +1);
    } else {
      console.log("Attempted to raise stress, but stress is at Max!");
    }
  }
  decrementStress(){
    if(this.stress > 1){
      this.stress = this.stress - 1;
      console.log("Decrementing stress to: ", this.stress);
      this.higherStressStandL = this.standLeft;
      this.higherStressStandR = this.standRight;
      this.higherStressWalkL = this.walkLeft;
      this.higherStressWalkR = this.walkRight;
      this.standLeft = this.lowerStressStandL;
      this.standRight = this.lowerStressStandR;
      this.walkLeft = this.lowerStressWalkL;
      this.walkRight = this.lowerStressWalkR;
      this.lowerStressStandL = this.createAnimation("stand", "Left", this.stress -1);
      this.lowerStressStandR = this.createAnimation("stand", "Right", this.stress -1);
      this.lowerStressWalkL = this.createAnimation("walk", "Left", this.stress -1);
      this.lowerStressWalkR = this.createAnimation("walk", "Right", this.stress -1);
    } else {
      console.log("Attempted to lower stress, but stress is at Min!");
    }
  }
  setStress(value){
    if(value < 1 || value > 15){
      console.count("Invalid Stress level set!");
    } else {
      this.stress = value;
      this.standLeft = this.createAnimation("stand", "Left", this.stress);
      this.standRight = this.createAnimation("stand", "Right", this.stress);
      this.walkLeft = this.createAnimation("walk", "Left", this.stress);
      this.walkRight = this.createAnimation("walk", "Right", this.stress);
      this.higherStressStandL = this.createAnimation("stand", "Left", this.stress + 1);
      this.higherStressStandR = this.createAnimation("stand", "Right", this.stress + 1);
      this.higherStressWalkL = this.createAnimation("walk", "Left", this.stress + 1);
      this.higherStressWalkR = this.createAnimation("walk", "Right", this.stress + 1);
      this.lowerStressStandL = this.createAnimation("stand", "Left", this.stress - 1);
      this.lowerStressStandR = this.createAnimation("stand", "Right", this.stress - 1);
      this.lowerStressWalkL = this.createAnimation("walk", "Left", this.stress - 1);
      this.lowerStressWalkR = this.createAnimation("walk", "Right", this.stress - 1);
    }
  }
  displayPlayer(){
    console.log(mouseX, mouseY);
    if(this.direction < 0){
      animation(this.standLeft, this.xPos, this.yPos);
    } else {
      animation(this.standRight, this.xPos, this.yPos)
    }
  }

  createAnimation(type, direction, stress){
    let numOfFrames;
    if(stress > 15 || stress < 1){
      return null;
    }
    if(type == "stand")
      numOfFrames = 3;
    else if(type =="walk"){
      numOfFrames = 12;
    } else{
      console.log(`invalid type: ${type}`);
    }
    return loadAnimation(`assets/${type}${direction}/sl${stress}/${(0 % numOfFrames) + 1}.png`,
      `assets/${type}${direction}/sl${stress}/${(1 % numOfFrames) + 1}.png`,
      `assets/${type}${direction}/sl${stress}/${(2 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(3 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(4 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(5 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(6 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(7 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(8 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(9 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(10 % numOfFrames) + 1}.png`, 
      `assets/${type}${direction}/sl${stress}/${(11 % numOfFrames) + 1}.png`);

  }
  queryMovementAndDisplay(room){
    //MOVE RIGHT
    if (keyIsDown(68) && room.isValidPosition(this.xPos + this.speed, this.yPos)){
      this.direction = 1;
      console.log("RIGHT");
      this.xPos = this.xPos + this.speed;
      animation(this.walkRight, this.xPos, this.yPos);
    }
    //MOVE LEFT
    else if (keyIsDown(65) && room.isValidPosition(this.xPos - this.speed, this.yPos)){
      this.direction = -1;
      console.log("LEFT");
      this.xPos = this.xPos - this.speed;
      animation(this.walkLeft, this.xPos, this.yPos)
    }
    //MoveDown
    else if (keyIsDown(83) && room.isValidPosition(this.xPos, this.yPos + this.speed)){
      console.log("DOWN");
      this.yPos = this.yPos + this.speed;
      if(this.direction > 0){
        animation(this.walkRight, this.xPos, this.yPos)
      } else {
        animation(this.walkLeft, this.xPos, this.yPos)
      }
    }
    //MOVE Up
    else if (keyIsDown(87) && room.isValidPosition(this.xPos, this.yPos - this.speed)){
      console.log("UP");
      this.yPos = this.yPos - this.speed;
      if(this.direction > 0){
        animation(this.walkRight, this.xPos, this.yPos)
      } else {
        animation(this.walkLeft, this.xPos, this.yPos)
      }
    }
    //DO NOTHING
    else{
      this.displayPlayer();
    }
  }


}

function keyPressed(){
  if(debugMode && keyCode == 69){
    player.incrementStress();
  }
  else if(debugMode && keyCode == 81){
    player.decrementStress();
  } else if(debugMode && keyCode ==73){
    game.roomIndex = (game.roomIndex + 1) % game.roomArray.length;
    console.log(game.roomIndex);
  } else if(keyCode == 32 && game.nextRoomIndex){
    console.log("move?");
    game.roomIndex = game.nextRoomIndex;
    player.yPos = 400;
    player.xPos = 800;
  }
}


function preload() {
  game = new GameState();
  player = new Player();
}

function setup() {
  createCanvas(1500, 625);
  
}


  

function draw() {
  clear();
  background(200);
  game.runCurrentRoom();
  
}
