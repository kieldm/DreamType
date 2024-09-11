var bkgdColor, foreColor, accentColor, accentFadeColor;

var inputText = [];
var starterText = "Dream Type\nMakes a\nType Dream";

var tFont = [];
var pgTextSize = 90;
var pgBkgd = [];
var fontHeightFactor = [];
var fontXheight = [];
var fontDesc = [];
var coreBase;

var animSelects = [];
var animCounter = 0;
var circuitCount;

var fontFactor = [];
var vesselSW = 2;

var wWindow;
var textScale = 1.5;
var saveMode = 0;

// var centerX = 0;
var centerY = 0;
var leftX = 0;
var rightX = 0;
var culmYtarget = 0;

var stageA = 30;
var stageB = 45;

var stageAdirect = 2;
var stageAstrength = 3;
var stageBdirect = 2;
var stageBstrength = 3;

var cTickerMeasure = 0;
var cTicker = 0;

var boxWmeas, boxW, boxWorg, boxWtarget = 0;
var peakY, boxH, boxHorg, boxHtarget = 0;
var boxRTop, boxRTopOrg, boxRTopTarget = 0;
var boxRBot, boxRBotOrg, boxRBotTarget = 0;

var charDelay = -2;
var lineDelay = -3;

var fontSel = 0;
var crestType = 0;

var widgetOn = true;

var debugOn = true;
var centerOn = false;

var svgSaveOn = false;
var recording = false;

var cwidth, cheight
var recMessageOn = false;
var frate = 30;
var recordedFrames = 0;
var numFrames = 300;

var thisDensity = 1;

function preload(){
  tFont[0] = loadFont("vessel_resources/Mirage-Medium.otf");
  fontFactor[0] = 0.8;
  fontHeightFactor[0] = 0.70489;
  fontXheight[0] = 0.522949;
  fontDesc[0] = 0.18632;
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  thisDensity = pixelDensity();

  cwidth = width;
  cheight = height;

  if(width < 500){
    wWindow = width/2;
  } else {
    wWindow = width/3;
  }

  accentColor = '#0afe54';
  accentFadeColor = color(10, 254, 84, 150);
  foreColor = '#ffffff';
  bkgdColor = '#081d0b';

  document.getElementById('foreColor').value = foreColor;
  document.getElementById('bkgdColor').value = bkgdColor;

  rectMode(CENTER);
  frameRate(frate);

  document.getElementById("textArea").value = starterText;
  setText();

  runCoreReset();
}

function draw(){
  background(bkgdColor);

  drawMain();

  cTicker++;

  if(cTicker > stageB){
    animCounter ++;

    runCoreReset();

  } else {
    runBorderAnim();

  }

  runRecording();
}

function drawMain(){
  push();
    translate(width/2, height/2);

    if(crestType == 1){
      stroke(foreColor);
      strokeWeight(vesselSW);
      noFill();
      rect(0, 0, boxW, boxH, boxRTop, boxRTop, boxRBot, boxRBot);
    } else if(crestType == 2){
      noStroke();
      fill(foreColor);
      rect(0, 0, boxW, boxH, boxRTop, boxRTop, boxRBot, boxRBot);
    }

    //DEBUG
    if(debugOn && crestType > 0){
      noFill();

      stroke(accentColor);
      strokeWeight(0.5);
      line(boxWorg/2 - boxRTopOrg, -boxHorg/2,
          boxWtarget/2 - boxRTopTarget, -boxHtarget/2);
      line(boxWorg/2, -boxHorg/2 + boxRTopOrg,
          boxWtarget/2, -boxHtarget/2 + boxRTopTarget);
      line(-boxWorg/2 + boxRTopOrg, -boxHorg/2,
          -boxWtarget/2 + boxRTopTarget, -boxHtarget/2);
      line(-boxWorg/2, -boxHorg/2 + boxRTopOrg,
          -boxWtarget/2, -boxHtarget/2 + boxRTopTarget);

      line(boxWorg/2 - boxRBotOrg, boxHorg/2,
          boxWtarget/2 - boxRBotTarget, boxHtarget/2);
      line(boxWorg/2, boxHorg/2 - boxRBotOrg,
          boxWtarget/2, boxHtarget/2 - boxRBotTarget);
      line(-boxWorg/2 + boxRBotOrg, boxHorg/2,
          -boxWtarget/2 + boxRBotTarget, boxHtarget/2);
      line(-boxWorg/2, boxHorg/2 - boxRBotOrg,
          -boxWtarget/2, boxHtarget/2 - boxRBotTarget);

      strokeWeight(1);
      rect(0, 0, boxWorg, boxHorg, boxRTopOrg, boxRTopOrg, boxRBotOrg, boxRBotOrg);
      rect(0, 0, boxWtarget, boxHtarget, boxRTopTarget, boxRTopTarget, boxRBotTarget, boxRBotTarget);
    }
        
    translate(0, -centerY/2);
    translate(-(leftX + rightX)/2, 0);
    // translate(-centerX, 0);

    centerY = 0;
    // centerX = 0;
    leftX = 0;
    rightX = 0;
    coreBase.run();
  pop();
}

function configAnimSelects(){
  circuitCount = floor(300/stageB);
  numFrames = round(circuitCount * stageB) + 1;
  
  for(var p = 0; p < inputText.length; p++){
    animSelects[p] = [];

    for(var m = 0; m < circuitCount - 1; m++){
      var rs0 = random(80);
      if(rs0 < 10){
        animSelects[p][m] = 0; //this.makeOrig();
      } else if(rs0 < 20){
        animSelects[p][m] = 1; //this.makeAngles1();
      } else if(rs0 < 30){
        animSelects[p][m] = 2; //this.makeZigZag1();
      } else if(rs0 < 40){
        animSelects[p][m] = 3; //this.makeDiag1();
      } else if(rs0 < 50){
        animSelects[p][m] = 4; //this.makeBolt1();
      } else if(rs0 < 60){
        animSelects[p][m] = 5; //this.makeArc();
      } else if(rs0 < 70){
        animSelects[p][m] = 6; //this.makeRays();
      } else {
        animSelects[p][m] = 7; //this.makeLean();
      }
    }

    animSelects[p][circuitCount - 1] = animSelects[p][0];

  }


  console.log("NUMBER OF CIRCUITS IN 300 FRAMES: " + circuitCount);
  console.log("EXACT NUMBER OF FRAME WITH THIS AMOUNT OF CIRCUITS: " + numFrames);
  console.log("RESULTING IN:");
  console.log(animSelects);

  animCounter = 0;
}

function runBorderAnim(){
  if(cTicker < cTickerMeasure){
    boxW = boxWorg;
    boxH = boxHorg;
    boxRTop = boxRTopOrg;
    boxRBot = boxRBotOrg;

  } else if(cTicker < stageA){
    var tk0 = map(cTicker, cTickerMeasure, stageA - 1, 0, 1);
    boxW = map(stageAaccel(tk0), 0, 1, boxWorg, boxWtarget);
    boxH = map(stageAaccel(tk0), 0, 1, boxHorg, boxHtarget);
    boxRTop = map(stageAaccel(tk0), 0, 1, boxRTopOrg, boxRTopTarget);
    boxRBot = map(stageAaccel(tk0), 0, 1, boxRBotOrg, boxRBotTarget);

    boxRTop = constrain(boxRTop,0, 2000);
    boxRBot = constrain(boxRBot,0, 2000);
  } else {
    boxW = boxWtarget;
    boxH = boxHtarget;
    boxRTop = boxRTopTarget;
    boxRBot = boxRBotTarget;

  }
}

function runCoreReset(){
  cTicker = cTickerMeasure;

  boxWorg = boxWtarget;
  boxHorg = boxHtarget;
  boxRTopOrg = boxRTopTarget;
  boxRBotOrg = boxRBotTarget;

  boxWmeas = 0;
  peakY = 0;

  coreBase.resetMain();

  boxWtarget = boxWmeas + pgTextSize * fontFactor[fontSel];
  boxHtarget = peakY + (inputText.length) * pgTextSize * fontFactor[fontSel];

  // boxWtarget += pgTextSize * fontFactor[fontSel];
  boxWtarget *= 2;
  boxHtarget += 2.5 * pgTextSize * fontFactor[fontSel];

  boxRTopTarget = random(boxWtarget/2);
  boxRBotTarget = random(boxWtarget/2);

}

function createAnimation(){
  findMaxSize();

  textFont(tFont[fontSel]);
  textSize(pgTextSize);

  cTickerMeasure = 0;
  boxWmeas = 0;
  peakY = 0;

  coreBase = null;
  coreBase = new Base();

  cTicker = cTickerMeasure;
  boxWtarget = boxWmeas + pgTextSize * fontFactor[fontSel];
  boxHtarget = peakY + (inputText.length) * pgTextSize * fontFactor[fontSel];

  // boxWtarget += pgTextSize * fontFactor[fontSel];
  boxWtarget *= 2;
  boxHtarget += 2.5 * pgTextSize * fontFactor[fontSel];

  boxW = boxWtarget;
  boxH = boxHtarget;
  boxWorg = boxW;
  boxHorg = boxH;
}

function windowResized(){
  resizeForPreview();
}

function resizeForPreview(){
  var tempWidth, tempHeight;

  if(saveMode == 0){
    resizeCanvas(windowWidth, windowHeight);
  } else if(saveMode == 1){
    if(windowWidth > windowHeight * 9/16){
      tempHeight = windowHeight;
      tempWidth = windowHeight * 9/16;
    } else {
      tempWidth = windowWidth;
      tempHeight = windowWidth * 16/9;
    }
    resizeCanvas(tempWidth, tempHeight);
  } else if(saveMode == 2){
    if(windowWidth < windowHeight){
      tempWidth = windowWidth;
      tempHeight = windowWidth;
    } else {
      tempHeight = windowHeight;
      tempWidth = windowHeight;
    }
    resizeCanvas(tempWidth, tempHeight);
  }

  cwidth = width;
  cheight = height;

  if(width < 500){
    wWindow = width/2;
  } else {
    wWindow = width/3;
  }

  createAnimation();
}

function resizeForSave(){
  if(saveMode == 0){
    resizeCanvas(windowWidth, windowHeight);
  } else if(saveMode == 1){
    resizeCanvas(1080, 1920);
  } else if(saveMode == 2){
    resizeCanvas(1080, 1080);
  }

  if(width < 500){
    wWindow = width/2;
  } else {
    wWindow = width/3;
  }

  createAnimation();
}