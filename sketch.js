class gameState{
  gameStarted;
  roomIndex;
}
class player{
 xPos;
 yPos;
 happiness;
 standLeft;
 standRight;
}


function preload() {
  testImage = loadImage("assets/gambler.png");
  guy = loadImage("assets/walkRight/1.png");
}

function setup() {
  createCanvas(1508, 612);
  
}


  

function draw() {
  clear();
  background(200);
  image(guy, 100, 200, 600, 450);
}
