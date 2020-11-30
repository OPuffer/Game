let player;
let game;
let debugMode = true;


class GameState{
  gameStarted;
  roomIndex;
  roomArrayTest;
  nextRoomIndex;
  headsUp;
  currentTime;
  closestElement;
  earlySet;
  breakfastSet;
  activitySet;
  lunchSet;
  evaluationSet;
  timeIndex;
  timesArray;
  inDialog;
  //dialogSet;
  constructor(){
    this.gameStarted = true;
    this.roomIndex = 6;
    this.roomArrayTestSet = ["Test", new BreakfastDR(), new CommonRoom(), new HallWay1(), new HallWay2(), new HallWay3(), new NurseStation(), new Bedroom()];
    this.headsUp = new HUD(player);
    this.closestElement = false;
    this.inDialog = false;
    //this.dialogSet = [];
    //INIT ACTUAL ROOMSETS
    this.earlySet =["Early\nMorning\nCheck \nVitals!", new Room(), new Room(), new HallWay1(), new HallWay2(), new HallWay3(), new earlyMorningNS, new EarlyBR()];
    this.breakfastSet = ["Breakfast\n\nGet \nFood!", new BreakfastDR(), new MorningCR(), new HallWay1(), new NoRoomHW2(), new NoBathroomHW3(), new NurseStation(), new Bedroom()];
    this.activitySet=["Activity Time\n\nDo \nActivity!", new DiningRoom(), new ActivityCR(), new HallWay1(), new HallWay2(), new NoBathroomHW3(), new NurseStation(), new ActivityBR()];
    this.lunchSet = ["Lunch Time\n\nGet \nFood!", new LunchDR(), new AfternoonCR(), new HallWay1(), new NoRoomHW2(), new NoBathroomHW3(), new NurseStation(), new Bedroom()];
    this.evaluationSet =["Psych Eval\n\nGet \nEval!", new DiningRoom(), new AfternoonCR(), new HallWay1(), new NoRoomHW2(), new NoBathroomHW3(), new EvalNS(), new Bedroom()];
    //SET "TIME" TO FIRST ROOMSET AT START
    this.timeIndex = 4;
    this.timesArray=[this.earlySet, this.breakfastSet, this.activitySet, this.lunchSet, this.evaluationSet];
    this.currentTime = this.timesArray[this.timeIndex];
  }
  displayDialog(){
    if(this.inDialog){
      //RunDialog
      if(this.closestElement != null){
        this.closestElement.talk();
      } else{
        this.inDialog = false;
      }
      //this.closestElement.talk();
    }
  }
  runCurrentRoom(){
    this.currentTime = this.timesArray[this.timeIndex];
    this.currentTime[this.roomIndex].runRoom();
    //this.displayDialog();
  }
  runGame(){
    this.runCurrentRoom();
    this.headsUp.displayHUD();
    this.displayDialog();
  }
  timeStep(){
    this.timeIndex++;
    //player.spoons = 3;
  }
}

class RoomElement{
  imgFile;
  xPos;
  yPos;
  behindPlayer;
  constructor(imgName, x, y, behind = true){
    this.imgFile = loadImage(`assets/roomElem/${imgName}.png`);
    this.xPos = x;
    this.yPos = y;
    this.behindPlayer = behind;
  }
  talk(){
    console.log("This Element has Nothing To Say!");
  }
  drawElem(){
    image(this.imgFile, this.xPos, this.yPos);
  }
  displayElem(){
    
    if (!this.behindPlayer){
      this.drawElem();
    }
  }
  displayBehind(){
    
    if (this.behindPlayer){
      this.drawElem();
    }
  }
  distanceFromCenter(player){
    return Math.pow(10, 1000); //Largest Possible positive number
  }
  interact(){
    console.log("This has no interaction!");
  }

}
class InteractableElement extends RoomElement{
  imgFileM;
  apparentX;
  apparentY;
  interacted;

  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, x, y, behind);
    this.imgFileM = loadImage(`assets/roomElem/${imgName}M.png`);
    this.apparentX= appX;
    this.apparentY= appY;
    this.interacted = false;
  }
  drawElemM(){
    image(this.imgFileM, this.xPos, this.yPos);
  }

  displayElem(){
    if (this.distanceFromCenter(player) < 200){
      game.closestElement = this;
      if (!this.behindPlayer){
        this.drawElemM();
      }

    } else {
        //game.closestElement = null;
      super.displayElem();
    }
  }
  displayBehind(){
    if (this.distanceFromCenter(player) < 200){
      game.closestElement = this;
      if (this.behindPlayer){
        this.drawElemM();
      }
    } else{
        //game.closestElement = null;
      super.displayBehind();
    }
  }
  distanceFromCenter(player){
    return Math.abs(this.apparentX - player.xPos) + Math.abs(this.apparentY - player.yPos);
  }

}
class breakfastTable extends InteractableElement{
  dialogSet;
  doublePressLock;
  currentWordIndex;
  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, appX, appY, x, y, behind);
    this.dialogSet=["You need to get food first!\n Y) OK!"];
    this.doublePressLock = true;
    this.currentWordIndex = 0;
  }
  /*
  actualInteract(){
    let item = player.searchInv("foodCabinet");
    if(item){
      game.timeStep();
    }
  }
  */
  talk(){
    if(!this.interacted){
      game.headsUp.displayBottomBox(500);
      game.headsUp.displayText(this.dialogSet[this.currentWordIndex]);
      if(keyIsDown(89) && !this.doublePressLock){
        //this.interacted = true;
        game.inDialog = false;
      }else if(!keyIsDown(78)) {
        this.doublePressLock = false;
      }
    } else {
      game.inDialog = false;
    }
  }
  interact(){
    let item = player.searchInv("foodCabinet");
    if(item){
      this.interacted = true;
      game.timeStep();
    } else{
      game.inDialog = true;
    }
  }

}
class activityBed extends InteractableElement{
  dialogSet;
  doublePressLock;
  currentWordIndex;
  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, appX, appY, x, y, behind);
    this.dialogSet=["Would you like to spend Activity Time in your room? \n Y)Yes N)Not Sure", "You sat in bed by yourself\n Y)Okay", "You read the book!\n Y)Nice!"];
    this.doublePressLock = true;
    this.currentWordIndex = 0;
  }

  talk(){
    if(!this.interacted){
      game.headsUp.displayBottomBox(500);
      game.headsUp.displayText(this.dialogSet[this.currentWordIndex]);
      if(this.currentWordIndex > 0){

        if(keyIsDown(89) && !this.doublePressLock){
          this.doublePressLock = true;
          if(this.currentWordIndex ==1){
            player.decrementStress();
            this.interacted = true;
          } else {
            player.decrementStress();
            player.decrementStress();
            player.decrementStress();
            this.interacted = true;
          }
          game.inDialog = false;
          game.timeStep();
        } else if(!keyIsDown(89)){
          this.doublePressLock = false;
        }

      } else {
        let hasItem = player.haveItem("book");
        
        if(keyIsDown(89) && !this.doublePressLock){
          this.doublePressLock = true;
          if(hasItem){
            this.currentWordIndex = 2;
          }else {
            this.currentWordIndex = 1;
          }
        }else if(keyIsDown(78) && !this.doublePressLock){
          this.doublePressLock = true;
          game.inDialog = false;
        }else if(!keyIsDown(78) && !keyIsDown(89)) {
          this.doublePressLock = false;
        }
      }
    } else {
      game.inDialog = false;
    }
  }
  interact(){
    game.inDialog = true;
  }
  
}
class InteractablePerson extends InteractableElement{
  underImg;
  constructor(imgName, appX, appY, x, y, behind = true){
    super("speechBubble", appX, appY, x, y, behind);
    this.underImg= loadImage(`assets/roomElem/${imgName}.png`);
  }
  drawElem(){
    image(this.underImg, 0, 0);
    super.drawElem();
    
  }
  drawElemM(){
    image(this.underImg, 0, 0);
    super.drawElemM();
  }
}
class VitalsCart extends InteractablePerson{
  dialogSet;
  doublePressLock;
  currentWordIndex;
  constructor(imgName, appX, appY, x, y, behind = true){
    super(imgName, appX, appY, x, y, behind = true);
    this.dialogSet=["Hello, Are you ready to check your vitals?\n Y)Yes N)No"];
    this.doublePressLock = false;
    this.currentWordIndex = 0;
  }
  actualInteract(){
    if(!this.interacted){
      
      this.interacted = true;
      game.timeStep();
    }
  }
  talk(){
    if(!this.interacted){
    game.headsUp.displayBottomBox(500);
    game.headsUp.displayText(this.dialogSet[this.currentWordIndex]);
    if(keyIsDown(89) && !this.doublePressLock){
      this.doublePressLock = true;
      game.inDialog = false;
      this.actualInteract();
    } else if(keyIsDown(78) && !this.doublePressLock){
      game.inDialog = false;
    }else{
      this.doublePressLock = false;
    }
  } else{
    game.inDialog = false;
  }

  }
  interact(){
    game.inDialog = true;
  }
}
class NSPersonEval extends InteractablePerson{
  constructor(imgName, appX, appY, x, y, behind = true){
    super(imgName, appX, appY, x, y, behind = true);
  }
  interact(){
    game.inDialog = true;
  }
  talk(){
    if(!this.interacted){

      let boxColor = color(255, 255, 255)
      boxColor.setAlpha(500);
      fill(boxColor);
      rect(50, 10, 1400, 600, 10, 10, 10, 10);
      textSize(30);
      fill(0,0, 0);
      text("GameOver", 650, 50, 1450, 400);
      if(player.stress <= 9){
        fill(8, 138, 36);
        text("Reccomendation: Discharge Patient", 515, 200, 1450, 400);
      } else{
        fill(176, 9, 39);
        text("Reccomendation: Extend term", 515, 200, 1450, 400);
      }
      fill(0, 0, 0);
      text("Stats:", 200, 250, 1450, 400);

    } else {
      game.inDialog = false;
    }
  }
}
class CollectableElement extends InteractableElement{
  //collected;
  itemName;
  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, appX, appY, x, y, behind);
    //this.collected = false;
    this.interacted=false;
    this.itemName = imgName;
  }
  displayElem(){
    if(!this.interacted){
      super.displayElem();
    }
  }
  displayBehind(){
    if(!this.interacted){
      super.displayBehind();
    }
  }
  interact(){
    if(!this.interacted){
      this.interacted = true;
      player.inventory.push(new invItem(this.itemName));
      player.decrementStress();
    }
  }
}
class Dispenser extends CollectableElement{
  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, appX, appY, x, y, behind);
  }


  displayElem(){
    if (this.distanceFromCenter(player) < 200 && !this.interacted){
      game.closestElement = this;
      if (!this.behindPlayer){
        this.drawElemM();
      }

    } else {
      if (!this.behindPlayer){
        this.drawElem();
      }
    }
  }
  displayBehind(){
    if (this.distanceFromCenter(player) < 200 && !this.interacted){
      game.closestElement = this;
      if (this.behindPlayer){
        this.drawElemM();
      }
    } else{
      if (this.behindPlayer){
        this.drawElem();
      }
    }
  }
  
  
  interact(){
    if(!this.interacted){
      this.interacted = true;
      player.inventory.push(new invItem(this.itemName));
    }
  }

}

class ARARROW extends InteractableElement{
  dialogSet;
  doublePressLock;
  currentWordIndex;
  constructor(imgName, appX, appY, x, y, behind){
    super(imgName, appX, appY, x, y, behind);
    this.dialogSet=["Would you like to participate today, or stay in your room?\n Y)Participate N)Not Sure", "What Do you want to Paint?\n Y)Something Funny N)Something Sad", "Sombody Said your painting looked ugly :(\n Y)okay...", "Someone Liked your Painting! \n Y)YES!"];
    this.doublePressLock = true;
    this.currentWordIndex = 0;
  }
  /*
  actualInteract(){
    let item = player.searchInv("foodCabinet");
    if(item){
      game.timeStep();
    }
  }
  */
  runPaintingActivity(){
    let ranNum = Math.floor(Math.random() * 10);
    if(keyIsDown(89) && !this.doublePressLock){
      this.doublePressLock = true;
      if(ranNum > 7){
        this.currentWordIndex = 3;
      } else {
        this.currentWordIndex = 2
      }
    }else if(keyIsDown(78) && !this.doublePressLock){
      this.doublePressLock = true;
      if(ranNum > 6){
        this.currentWordIndex = 3;
      } else {
        this.currentWordIndex = 2
      }
    }else if(!keyIsDown(78) && !keyIsDown(89)) {
          this.doublePressLock = false;
    }
  }
  runJudgement(){
    if(keyIsDown(89) && !this.doublePressLock){
      this.doublePressLock = true;
      game.inDialog = false;
      if(this.currentWordIndex == 3){
        player.decrementStress();
        player.decrementStress();
        player.decrementStress();
        player.decrementStress();
      } else {
        player.incrementStress();
        player.incrementStress();
        player.incrementStress();
      }
      game.timeStep();
      this.interacted = true;
    } else if(!keyIsDown(89)) {
      this.doublePressLock = false;
    }
  }
  talk(){
    if(!this.interacted){
      game.headsUp.displayBottomBox(500);
      game.headsUp.displayText(this.dialogSet[this.currentWordIndex]);
      if(this.currentWordIndex == 1){
        this.runPaintingActivity();
      } else if (this.currentWordIndex > 1){
        this.runJudgement();
      } else {

        if(keyIsDown(89) && !this.doublePressLock){
          this.doublePressLock = true;
          this.currentWordIndex++;
        }else if(keyIsDown(78) && !this.doublePressLock){
          this.doublePressLock = true;
          game.inDialog = false;
        }else if(!keyIsDown(78) && !keyIsDown(89)) {
          this.doublePressLock = false;
        }
      }
    } else {
      game.inDialog = false;
    }
  }
  interact(){
    /*let item = player.searchInv("foodCabinet");
    if(item){
      this.interacted = true;
      game.timeStep();
    } else{*/
    game.inDialog = true;
    //}
  }

}


class Room{
  background;
  horizontalLength;
  arrows;
  roomElems;
  
  constructor(){
    this.arrows = [];
    this.roomElems = [];
  }
  runRoom(){
    this.drawArrows();
    this.displayElemsBehind();
    player.queryMovementAndDisplay(this);
    this.displayElems();
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
    let totboo = false;
    let currBoo;
    for(let i = 0; i < this.arrows.length; i++){
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

  displayElemsBehind(){
    for(let i = 0; i < this.roomElems.length; i++){
      this.roomElems[i].displayBehind();
    }
  }
  displayElems(){
    for(let i = 0; i < this.roomElems.length; i++){
      this.roomElems[i].displayElem();
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
    this.background = loadImage("assets/rooms/hallway1.png");
    this.arrows = [new arrow("forwardArrow", 728, 226,  4)];
  }
  runRoom(){
    super.runRoom();
  }
}
class HallWay2 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway2.png");
    this.arrows = [new arrow("leftArrow", 232, 293, 6), new arrow("forwardArrow", 728, 226,  5), new arrow("rightDoorArrow", 1196, 394, 7), new arrow("backArrow", 731, 558, 3)];
  }
}
class NoRoomHW2 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway2.png");
    this.arrows = [new arrow("leftArrow", 232, 293, 6), new arrow("forwardArrow", 728, 226,  5), new arrow("backArrow", 731, 558, 3)];
  }
}
class HallWay3 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway3.png");
    this.arrows = [new arrow("backArrow", 731, 558, 4), new arrow("leftDoorArrow", 286, 397, 0), new arrow("rightDoorArrow", 1171, 425, 0)];
  }
}
class NoBathroomHW3 extends HallWay{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/hallway3.png");
    this.arrows = [new arrow("backArrow", 731, 558, 4)];
  }
}
class NurseStation extends Room{
  deskCorner;
  constructor(){
    super();
    this.background = loadImage("assets/rooms/nurseStation.png");
    this.deskCorner = loadImage("assets/roomElem/deskCorner.png");
    this.arrows = [new arrow("leftArrow", 63, 338, 1, 150), new arrow("rightArrow", 1300, 405, 4, 0, -80)];
    this.roomElems = [new RoomElement("deskNurse", 0, 0, true), new RoomElement("computer", 0, 0, true)];
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
    if((player.xPos > (player.yPos + 617.6)/.86)){
      image(this.deskCorner, 0, 0);
    }
  }
  isValidPosition(vx, vy){
    return super.isValidPosition(vx, vy) && ((vx > (vy +617.6)/.86) || vy > 380);
  }

}
class breakfastSetNS extends NurseStation{
  constructor(){
    super();
  }
}
class earlyMorningNS extends NurseStation{
  constructor(){
    super();
    this.arrows = [new arrow("rightArrow", 1300, 405, 4, 0, -80)];
    this.roomElems.push(new VitalsCart("vitalsCart", 608, 384, 500, 200));
  }
}
class EvalNS extends NurseStation{
  constructor(){
    super();
    this.roomElems[0] = new NSPersonEval("deskNurse", 848, 384, 760, 190, true);
  }
}
class CommonRoom extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/commonRoom.png");
    this.arrows = [new arrow("backArrow", 709, 542, 1)]
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
class AfternoonCR extends CommonRoom{
  constructor(){
    super();
  }
}
class ActivityCR extends AfternoonCR{
  constructor(){
    super();
    this.roomElems.push(new ARARROW("leftDoorArrow", 169, 266, -30 , -100, 200));
  }
}
class MorningCR extends CommonRoom{
  constructor(){
    super();
  }
}
class DiningRoom extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/diningRoom.png");
    this.arrows = [new arrow("rightArrow", 1386, 314, 6), new arrow("forwardArrow", 745, 210, 2)];
    this.roomElems =[new RoomElement("diningTable", 0, 0, false), new RoomElement("foodCabinet", 600, -175, true)];
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    return super.isValidPosition(vx, vy) && (vx >=785|| (vx < 785 && vy < 292));
  }
}
class BreakfastDR extends DiningRoom{
  constructor(){
    super()
    this.roomElems[1] = new Dispenser("foodCabinet", 1140, 208, 600, -175, true);
    this.roomElems[0] = new breakfastTable("diningTable", 440, 288, 0, 0, false);
  }
}
class LunchDR extends DiningRoom{
  constructor(){
    super();
    this.background =loadImage("assets/rooms/afternoonDR.png");
    this.roomElems[1] = new Dispenser("foodCabinet", 1140, 208, 600, -175, true);
    this.roomElems[0] = new breakfastTable("diningTable", 440, 288, 0, 0, false);
  }
}
class Bedroom extends Room{
  constructor(){
    super();
    this.background = loadImage("assets/rooms/bedroom.png");
    this.arrows = [new arrow("leftDoorArrow", 308, 312, 4)];
  }
  runRoom(){
    image(this.background, 0, 0);
    super.runRoom();
  }
  isValidPosition(vx, vy){
    return super.isValidPosition(vx, vy) && (vy > 306) && (vy> -0.875*vx + 530) && (vy > 0.7741*vx - 630);
  }
}
class ActivityBR extends Bedroom{
  constructor(){
    super();
    this.roomElems.push(new activityBed("bed", 1080, 400, 0, 0, true));
  }
}
class EarlyBR extends Bedroom{
  constructor(){
    super();
    this.roomElems.push(new RoomElement("bed", 0, 0, true));
    this.roomElems.push(new CollectableElement("whale", 180, 428, 0, 0, true));
  }
}

class arrow{
  xPos;
  yPos;
  imgFile;
  imgFileM;
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
class invItem{
  name;
  imgFile;
  constructor(name){
    this.name = name;
    this.imgFile = loadImage(`assets/inventory/${name}.png`);
  }
  displayItem(x, y){
    image(this.imgFile, x, y, 75, 75);
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
  spoons;
  inventory;
  higherStressStandL;
  higherStressStandR;
  higherStressWalkL;
  higherStressWalkR;
  lowerStressStandL;
  lowerStressStandR;
  lowerStressWalkL;
  lowerStressWalkR;

  keyReleased;

  constructor(){
    this.xPos = 800;
    this.yPos = 400;
    this.stress = 10;
    this.direction = 0;
    this.spoons = 3;
    this.keyReleased = true;
    this.inventory = [];
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
  haveItem(name){
    for(let i = 0; i < this.inventory.length; i++){
      let elem = this.inventory[i];
      if(elem.name ==name){
        return true;
      }
    }
    return false;
  }
  searchInv(name){
    for(let i = 0; i < this.inventory.length; i++){
      let elem = this.inventory[i];
      if(elem.name ==name){
        return this.inventory.splice(i, i+1);
      }
    }
    return false;
  }
  setPos(x, y){
    this.xPos = x;
    this.yPos = y;
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
    //console.log(mouseX, mouseY);
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
    //SimplyDisplay if in Dialog
    if(game.inDialog){
      this.keyReleased = true;
      this.displayPlayer();
    //MOVE RIGHT
    } else if (keyIsDown(68) && room.isValidPosition(this.xPos + this.speed, this.yPos)){
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

    //This will handle INTERACTIONS!
    } else if(keyIsDown(32)) {
      this.displayPlayer();
      if(this.keyReleased == true){
        this.keyReleased = false;
        if(game.closestElement != false){
          game.closestElement.interact();
        }
        console.log(game.closestElement);
      }
    }
    //DO NOTHING
    else{
      this.keyReleased = true;
      this.displayPlayer();
    }
  }


}

class HUD{
  ply;
  spoonIMG;
  noSpoon;
  constructor(player){
    this.ply = player
    this.spoonIMG = loadImage("assets/spoon.png");
    this.noSpoon = loadImage("assets/noSpoon.png");
  }
  displaySpoons(){
    //console.log("displaySppon");
    this.displayText("Spoons:", 1175, 560);
    for(let i = 0; i < 3; i++){
      if( i < this.ply.spoons){
        image(this.spoonIMG, 1300 + i * 50, 550, 50, 50);
      } else {
        image(this.noSpoon, 1300 + i * 50, 550, 50, 50);
      }
    }
  }
  displayTime(){
    let boxColor = color(255, 255, 255)
    boxColor.setAlpha(200);
    fill(boxColor);
    rect(1, 1, 150, 200, 10, 10, 10, 10);
    textSize(30);
    fill(0, 0, 0);
    text("Time: \n" + game.currentTime[0], 0, 10, 1450, 400);
  }
  
  displayBottomBox(alpha = 200){
    let boxColor = color(255, 255, 255)
    boxColor.setAlpha(alpha);
    fill(boxColor);
    rect(1, 525, 1499, 100, 10, 10, 10, 10);
  }
  displayText(txt, x = 20, y = 560){
    textSize(24);
    fill(0, 0, 0);
    text(txt, x, y, 1450, 400);
  }
  displayInv(){
    this.displayText("Inventory:");
    for(let i = 0; i < this.ply.inventory.length; i++){
      this.ply.inventory[i].displayItem(130 + i*50, 530);
    }
  }
  displayHUD(){
    //console.log("displayingHUD");
    this.displayBottomBox();
    this.displaySpoons();
    this.displayInv();
    this.displayTime();
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
  player = new Player();
  game = new GameState();
}

function setup() {
  createCanvas(1500, 625);
  
}


  

function draw() {
  clear();
  background(200);
  game.runGame();
  console.log(player.xPos, player.yPos);
}
