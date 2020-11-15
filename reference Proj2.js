//Creating sprite using sprite sheets for animation

let museum;
let bgX = 0, bgY = 0;
let pX = 250, pY = 250;
let pW = 200, pH = 200;
let speed = 5;
let fullscreenImage = -1;
let disasterHappened = false;
let direction = 1; // One is right, 0 is Left
let gameOver = false;
let revealTime = false;

class Art{
  loadedImage;
  paintX;
  paintY;
  analysis;
  constructor(img, x, y, s){
    this.loadedImage = img;
    this.paintX = x;
    this.paintY = y;
    this.analysis = s;
  }
  placeOnWall(){
    image(this.loadedImage, this.paintX, this.paintY);
  }
  moveWithWall(amount){
    this.paintX = this.paintX + amount;
  }
  displayText(){
    //textSize(24);
    //fill(0, 0, 0);
    //text(this.analysis, 10, 530, 700, 200); 
    textBox(this.analysis);
  }
  
}

class Painting extends Art{
  displayBigArt(){
    image(this.loadedImage, 250, 100, 272, 272);
    this.displayText();
  }
}
class Sculpture extends Art{
  displayBigArt(){
    image(this.loadedImage, 250, 100, 272, 544);
    this.displayText();
  }
}

function preload() {
  // Load the json for the tiles sprite sheet
  museum = loadImage("assets/museumP.png");
  guy_stand = loadImage("assets/guy_stand.png");
  guy_standL = loadImage("assets/standL.png");
  guy_back = loadImage("assets/viewWall.png");
  objective1 = loadImage("assets/objective.png");
  walk_right_sheet = loadSpriteSheet('assets/walk_right.png', 200, 200, 5);
  walk_left_sheet = loadSpriteSheet('assets/walk_left.png', 200, 200, 5);
  walkingAnimationR = loadAnimation(walk_right_sheet);
  walkingAnimationL = loadAnimation(walk_left_sheet);
  run_left_sheet = loadSpriteSheet('assets/guyRunL.png', 200, 200, 5);
  run_right_sheet = loadSpriteSheet('assets/guyRunR.png', 200, 200, 5);
  runAnimationR = loadAnimation(run_right_sheet);
  runAnimationL = loadAnimation(run_left_sheet);
  moveAnimL = walkingAnimationL;
  moveAnimR = walkingAnimationR;

  stressedStandL = loadImage("assets/sGuyStandLeft.png");
  stressedStandR = loadImage("assets/sGuyStandRight.png");

  securityGuard1 = loadImage("assets/security1.png");

  imageRuined = loadImage("assets/damagedPainting.png");

  img1 = loadImage("assets/painting1.png");
  painting1 = new Painting(img1, 400, 140, "It is definitely forboding, but I'm not sure what I'm looking at. I'll find something else. (<space> to exit)");
  img2 = loadImage("assets/umbrellaPainting.png");
  painting2 = new Painting(img2, 1000, 140, "This umbrella seems sad and... thats all I've got. I'll find something else. (<Space> to exit)");
  img3 = loadImage("assets/belly.png");
  painting3 = new Painting(img3, 1600, 140, "This is too painful right now. I'll find something else. (<Space> to exit)");
  img4 = loadImage("assets/lombo.png");
  sculpt1 = new Sculpture(img4, 2200, 110, "This guy looks weird, but he is still pleasant to look at. I haven't studied enough about aesthetics to know why. I'll find something else. (<Space> to exit)");
  img5 = loadImage("assets/sculpture.png");
  sculpt2 = new Sculpture(img5, 2800, 110, "I'm not old enough to speak to the nostalgia this collection of toys evokes. I'll find something else. (<Space> to exit)");
  img6 = loadImage("assets/gambler.png");
  painting4 = new Painting(img6, 3700, 140, "Whelp, this is the last one. Might as well give it a go. (Mouse over to analyze)");
  allart = [painting1, painting2, painting3, sculpt1, sculpt2, painting4];
  alarm = loadSound('assets/siren.wav');

  escapeBg = loadImage("assets/escape.png");
  wink = loadImage("assets/gamblerWink.png");
}

function setup() {
  createCanvas(704, 612);

}

// This handles Controls
function movePlayer(){
  //MOVE RIGHT
  if (keyIsDown(68)){
    direction = 1;
      if  (bgX > -3392 && pX >= 250){
        bgX = bgX - speed;
        relocateArts(-1 * speed);
        animation(moveAnimR, pX + 100, pY + 100);

    } else if ( pX < 550){
        pX = pX + speed;
        animation(moveAnimR, pX + 100, pY + 100);
    } else {
      image(guy_stand, pX, pY);
    }
  }
  //MOVE LEFT
  else if (keyIsDown(65)){
    direction = 0;
    if (bgX < 0 && pX <= 250){
      bgX = bgX + speed;
      relocateArts(speed);
      animation(moveAnimL, pX + 100, pY + 100);
    } else if (pX > -20){
      pX = pX - speed;
      animation(moveAnimL, pX + 100, pY + 100);
    } else {
      image(guy_standL, pX, pY);
    }
  }
  //MOVE DOWN
  else if (keyIsDown(83)){
    if (pY <= 370){
      pY = pY + speed;
      if(direction == 1){
        animation(moveAnimR, pX + 100, pY + 100);
      } else {
        animation(moveAnimL, pX + 100, pY + 100);
      }
    } else {
      if(direction == 1){
        animation(moveAnimR, pX + 100, pY + 100);
      } else {
        animation(moveAnimL, pX + 100, pY + 100);
      }
    }
    //MOVE Up
  } else if (keyIsDown(87)){
    if (pY >= 200){
      pY = pY - speed;
      if(direction == 1){
        animation(moveAnimR, pX + 100, pY + 100);
      } else {
        animation(moveAnimL, pX + 100, pY + 100);
      }
    } else {
      if (direction == 1){
        image(guy_stand, pX, pY);
      } else {
        image(guy_standL, pX, pY);
      }
    }
  }else{
    if(direction == 0){
      image(guy_standL, pX, pY)
    } else {
      image(guy_stand, pX, pY);
    }
  }
  return false;
}

function keyPressed(){
  if (keyCode === 32){
    //Turn around
    image(guy_back, pX, pY);
    interactElement();
  }
  return false;
}


//THIS handles the player viewing things on the wall
function interactElement(){
  if(fullscreenImage >= 0){
    fullscreenImage = -1;
    cursor();
  } else if(-30 >= bgX && bgX >= -200){
    //allart[0].displayBigArt();
    fullscreenImage = 0;
  } else if(-600 >= bgX && bgX >= -825){
    //allart[1].displayBigArt();
    fullscreenImage = 1;
  } else if(-1220 >= bgX && bgX >= -1430){
    //allart[2].displayBigArt();
    fullscreenImage = 2;
  } else if(-1840 >= bgX && bgX >= -1995){
    //allart[3].displayBigArt();
    fullscreenImage = 3;
  } else if(-2450 >= bgX && bgX >= -2585){
    //allart[4].displayBigArt();
    fullscreenImage = 4;
  } else if (-3315 >= bgX && bgX >= -3395){
    fullscreenImage = 5;
  }
}

//This handles the display of the objective overhead
function displayObjective(){
  if(!disasterHappened){
    image(objective1, 100, 10);
  } else {

  }
}

//This makes art move alongside the wall
function relocateArts(speed){
  painting1.moveWithWall(speed);
  painting2.moveWithWall(speed);
  painting3.moveWithWall(speed);
  sculpt1.moveWithWall(speed);
  sculpt2.moveWithWall(speed);
  painting4.moveWithWall(speed);
}
//THis displays the art every drawCycle
function displayArts(){
  painting1.placeOnWall();
  painting2.placeOnWall();
  painting3.placeOnWall();
  sculpt1.placeOnWall();
  sculpt2.placeOnWall();
  painting4.placeOnWall();
}
//This is responsible for drawing security guards.
function securityDraw(){
  image(securityGuard1, bgX + 10, bgY + 210);
  //image(angryEmote, bgX + 90, bgY + 190);
}

function textBox(txt){
  fill(245, 240, 206);
  rect(1, 512, 702, 100, 10, 10, 10, 10);
  textSize(24);
  fill(0, 0, 0);
  text(txt, 10, 530, 700, 200);
}
// The logic for the disaster
function disasterCheck(){
  if (512> mouseX && mouseX > 413 && 174 > mouseY && mouseY > 98){
    //imageRuined = loadImage("assets/damagedPainting.png");
    allart[5].loadedImage = imageRuined;
    allart[5].analysis = "I MESSED UP (press <space> to run)";
    speed = speed * 2;
    // ADD ANIMATION CHANGES
    moveAnimL = runAnimationL;
    moveAnimR = runAnimationR;
    guy_stand = stressedStandR;
    guy_standL = stressedStandL;
    disasterHappened = true;
  }
 
}
  

function draw() {
  if(revealTime){
    clear();
    image(museum, bgX, bgY);
    securityDraw();
    displayArts();
    if(bgX > -3400){
      bgX = bgX - 5;
      relocateArts(-5);
      
    }
    
    

  } else if(gameOver){
    clear();
    alarm.stop();
    image(escapeBg, -500, bgY, 1048, 512);
    animation(moveAnimL, pX, 290);
    pX = pX - speed;
    if(pX < -700) {
      reveal();
    }
    

  } else if (!disasterHappened){
    clear();
    image(museum, bgX, bgY);
    securityDraw();
    displayObjective();
    displayArts();
  
    if (fullscreenImage >= 0){
      image(guy_back, pX, pY);
      allart[fullscreenImage].displayBigArt();
      //textBox("");
      allart[fullscreenImage].displayText();

      if(fullscreenImage == 5){
        cursor("assets/magnifying.png");
        disasterCheck();
        
      }
    } else {
      movePlayer();
      textBox("Press <space> to interact with exhibits");
    }
  } else {
    if(!alarm.isPlaying()){
      alarm.play();
    }
    cursor();
    clear();
    image(museum, bgX, bgY);
    securityDraw();
    displayObjective();
    displayArts();
    if (fullscreenImage == 5){
      image(guy_back, pX, pY);
      allart[fullscreenImage].displayBigArt();
      //textBox("");
      allart[fullscreenImage].displayText();
    } else {
      movePlayer();
      textBox("RUN AWAY!!!");
    }
    exitMuseum();
    
  }
  //console.log(pX);
    
}
function reveal(){
  allart[5].loadedImage = wink;
  revealTime = true;
}
//console.log(mouseX, mouseY)
function exitMuseum(){
  if (pX <= -20 && 270>= pY && pY >= 220){
    pX = 500;
    pY = 290;
    gameOver = true;
  }
  return;
}
