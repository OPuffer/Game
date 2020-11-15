let player;
let game;

class GameState{
  gameStarted;
  roomIndex;
  constructor(){
    this.gameStarted = true;
    this.roomIndex = 0;
  }
}

class Player{
  direction; //0 = Left 1 = Right
  xPos;
  yPos;
  stress;
  standLeft;
  standRight;
  higherStressStandL;
  higherStressStandR;
  higherStressWalkL;
  higherStressWalkR;

  constructor(){
    this.xPos = 100;
    this.yPos = 400;
    this.stress = 1;
    this.direction = 0;
    this.standLeft = this.createAnimation("stand","Left", this.stress);
    /*
    this.standRight = this.createAnimation("stand","Right", this.stress);
    this.higherStressStandL = this.createAnimation("stand","Left", this.stress + 1);;
    this.higherStressStandR = this.createAnimation("stand","Right", this.stress +1);;
    this.higherStressWalkL  = this.createAnimation("walk","Left", this.stress);;
    this.higherStressWalkR = this.createAnimation("walk","Left", this.stress);;
    */
  }
  displayPlayer(){
    if(this.direction == 0){
      animation(this.standLeft, this.xPos, this.yPos);
    } else {
      animation(this.standRight,this.xPos, this.yPos)
    }
  }
  createAnimation(type, direction, stress){
    let numOfFrames;
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
  quereyMovement(){
    //MOVE RIGHT
    if (keyIsDown(68)){
      //direction = 1;
      console.log("RIGHT");
    
    }
    //MOVE LEFT
    else if (keyIsDown(65)){
      console.log()
      //direction = 0;
      console.log("LEFT");
    }
    //MoveDown
    else if (keyIsDown(83)){
      console.log("DOWN");
    }
    //MOVE Up
    else if (keyIsDown(87)){
      console.log("UP");
    }
    //DO NOTHING
    else{
      this.displayPlayer();
    }
  }


}



function preload() {
  game = new GameState();
  player = new Player();
}

function setup() {
  createCanvas(1508, 612);
  
}


  

function draw() {
  clear();
  background(200);
  player.displayPlayer();
  
}
