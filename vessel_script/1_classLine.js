class Line {
  constructor(index){
    this.index = index;

    this.text = inputText[this.index];
    this.count = this.text.length;

    this.baseX = 0;
    this.baseY = -(inputText.length - 1) * pgTextSize * fontFactor[fontSel]/2;
    this.baseY += index * pgTextSize * fontFactor[fontSel];
    this.baseY += pgTextSize * fontFactor[fontSel]/2;
    
    this.fullW = textWidth(this.text);

    this.preBudgeOrg = 0;
    this.preBudge = 0;
    this.preBudgeTarget = 0;
    this.postBudgeOrg = 0;
    this.postBudge = 0;
    this.postBudgeTarget = 0;

    this.lets = [];
    
    this.ticker = [];
    this.xTarget = [];
    this.yTarget = [];
    this.rTarget = [];
    this.shearTarget = [];
    this.shearXtarget = [];
    this.hTarget = [];

    this.motionType = "";

    this.build();
    this.pickMotion();
  }

  build(){
    textAlign(CENTER);

    for(var m = 0; m < this.count; m++){
      var currentString = textWidth(this.text.substring(0, m + 1));
      var currentLetter = textWidth(this.text.charAt(m));

      var thisDiff = currentString - currentLetter/2 - this.fullW/2;
      var x_ = thisDiff;

      this.lets[m] = {
        x: x_,
        y: 0,
        orgX: x_,
        orgY: 0,
        coreX: x_,
        coreY: 0,
        h: 1,
        orgH: 1,
        r: 0,
        orgR: 0,
        shear: 0,
        orgShear: 0,
        shearX: 0,
        orgShearX: 0,
        w: currentLetter,
        thisH: pgTextSize * (fontHeightFactor[fontSel]),
        letter: this.text.charAt(m)
      }
    }
  }

  pickMotion(){
    this.resetValues();

    if(animSelects[this.index][animCounter%circuitCount] == 0){
      this.makeOrig();

    } else if(animSelects[this.index][animCounter%circuitCount] == 1){
      this.makeAngles1();

    } else if(animSelects[this.index][animCounter%circuitCount] == 2){
      this.makeZigZag1();

    } else if(animSelects[this.index][animCounter%circuitCount] == 3){
      this.makeDiag1();

    } else if(animSelects[this.index][animCounter%circuitCount] == 4){
      this.makeBolt1();

    } else if(animSelects[this.index][animCounter%circuitCount] == 5){
      this.makeArc();

    } else if(animSelects[this.index][animCounter%circuitCount] == 6){
      this.makeRays();

    } else {
      this.makeLean();

    }
    // this.makeBowtie(); //////// DISTORTS LETTER SIZE

    ////////////////////// CHANGES CENTER TOO MUCH
    //////////////////////////////////////////////

    // if(this.index == 0 && random(10) < 5 && !centerOn){
    //   this.resetValues();

    //   var rs1;
    //   if(this.fullW < textWidth(inputText[1])){
    //     rs1 = random(25);
    //   } else {
    //     rs1 = random(20);
    //   }
    //   if(rs1 < 10){
    //     this.makeDiagOutside(true);
    //   } else if(rs1 < 20){
    //     this.makeArcOutside(true);
    //   } else if(rs1 < 25){
    //     this.makeCornerOutside(true);
    //   }
    // }
    // if(this.index == inputText.length - 1 && random(10) < 5 && !centerOn){
    //   this.resetValues();
    //   var rs1;

    //   if(this.fullW < textWidth(inputText[inputText.length - 2])){
    //     rs1 = random(25);
    //   } else {
    //     rs1 = random(20);
    //   }
    //   if(rs1 < 10){
    //     this.makeDiagOutside(false);
    //   } else if(rs1 < 20){
    //     this.makeArcOutside(false);
    //   } else if(rs1 < 25){
    //     this.makeCornerOutside(false);
    //   }
    // }

    peakY += this.preBudgeTarget + this.postBudgeTarget;

    for(var m = 0; m < this.count; m++){
      var xDist = abs(this.xTarget[m]);
      if(xDist > boxWmeas){
        boxWmeas = xDist;
      }
    }
  }

  resetMain(){
    for(var m = 0; m < this.count; m++){
      this.lets[m].orgX = this.xTarget[m];
      this.lets[m].orgY = this.yTarget[m];
      this.lets[m].orgR = this.rTarget[m];
      this.lets[m].orgShear = this.shearTarget[m];
      this.lets[m].orgShearX = this.shearXtarget[m];
      this.lets[m].orgH = this.hTarget[m];
    }

    this.preBudgeOrg = this.preBudgeTarget;
    this.postBudgeOrg = this.postBudgeTarget;

    this.resetValues();
    this.pickMotion();
  }

  resetValues(){
    for(var m = 0; m < this.count; m++){
      this.ticker[m] = m * charDelay + this.index * lineDelay; 
      this.xTarget[m] = this.lets[m].coreX;
      this.yTarget[m] = this.lets[m].coreY;
      this.rTarget[m] = 0;
      this.shearTarget[m] = 0;
      this.shearXtarget[m] = 0;
      this.hTarget[m] = 1;

      if(this.ticker[m] < cTickerMeasure){
        cTickerMeasure = this.ticker[m];
      }
    }
    this.preBudgeTarget = 0;
    this.postBudgeTarget = 0;
  }

  run(){
    this.update();

    translate(0, this.preBudge);

    if(debugOn){
      this.displayDebug();
    }
    this.display();

    translate(0, this.postBudge);

    centerY += this.preBudge + this.postBudge;

    for(var m = 0; m < this.count; m++){
      if(this.lets[m].x < leftX){
        leftX = this.lets[m].x;
      }
      if(this.lets[m].x > rightX){
        rightX = this.lets[m].x;
      }
    }
  }

  update(){
    for(var m = 0; m < this.count; m++){
      this.ticker[m] ++;

      if(this.ticker[m] < 0){

        this.lets[m].x = this.lets[m].orgX;
        this.lets[m].y = this.lets[m].orgY;
        this.lets[m].r = this.lets[m].orgR;
        this.lets[m].shear = this.lets[m].orgShear;
        this.lets[m].shearX = this.lets[m].orgShearX;
        this.lets[m].h = this.lets[m].orgH;

        if(m == round(this.count/2)){
          this.preBudge = this.preBudgeOrg;
          this.postBudge = this.postBudgeOrg;
        }
      } else if(this.ticker[m] < stageA){
        var tk0 = map(this.ticker[m], 0, stageA - 1, 0, 1);

        this.lets[m].x = map(stageAaccel(tk0), 0, 1, this.lets[m].orgX, this.xTarget[m]);
        this.lets[m].y = map(stageAaccel(tk0), 0, 1, this.lets[m].orgY, this.yTarget[m]);
        this.lets[m].r = map(stageAaccel(tk0), 0, 1, this.lets[m].orgR, this.rTarget[m]);
        this.lets[m].shear = map(stageAaccel(tk0), 0, 1, this.lets[m].orgShear, this.shearTarget[m]);
        this.lets[m].shearX = map(stageAaccel(tk0), 0, 1, this.lets[m].orgShearX, this.shearXtarget[m]);
        this.lets[m].h = map(stageAaccel(tk0), 0, 1, this.lets[m].orgH, this.hTarget[m]);

        if(m == round(this.count/2)){
          this.preBudge = map(stageAaccel(tk0), 0, 1, this.preBudgeOrg, this.preBudgeTarget);
          this.postBudge = map(stageAaccel(tk0), 0, 1, this.postBudgeOrg, this.postBudgeTarget);
        }
      } else {
        this.lets[m].x = this.xTarget[m];
        this.lets[m].y = this.yTarget[m];
        this.lets[m].r = this.rTarget[m];
        this.lets[m].shear = this.shearTarget[m];
        this.lets[m].shearX = this.shearXtarget[m];
        this.lets[m].h = this.hTarget[m];

        if(m == round(this.count/2)){
          this.preBudge = this.preBudgeTarget;
          this.postBudge = this.postBudgeTarget;
        }
      }
    }

    // this.resetMain();
  }

  display(){
    noStroke();
    textAlign(CENTER);

    push();
      translate(this.baseX, this.baseY);

      for(var m = 0; m < this.count; m++){
        var l = this.lets[m];

        push();
          translate(l.x, l.y);
          
          shearY(l.shear);
          shearX(l.shearX);
          rotate(l.r);
          
          translate(0, -l.thisH/2);
          scale(1, l.h);

          textSize(pgTextSize);

          if(crestType == 2){
            fill(bkgdColor);
          } else {
            fill(foreColor);
          }

          if(svgSaveOn){
            print("SVG!");

            let points = tFont[fontSel].textToPoints(l.letter, -l.w/2, l.thisH/2, pgTextSize, { sampleFactor:  0.9 });

            beginShape()
              for(let p of points){
                vertex(p.x, p.y);
              }
            endShape(CLOSE);
          } else {
            text(l.letter, 0, l.thisH/2); 
          }
        pop();
      }
    pop();
  }

  displayDebug(){
    push();
      translate(this.baseX, this.baseY);

      noFill();
      stroke(accentColor);
      strokeWeight(1);

      line(-10, 0, 10, 0);
      line(0, this.postBudge + this.lets[0].thisH/2, 0, -this.preBudge - this.lets[0].thisH/2);

      line(-5, this.postBudgeTarget - this.postBudge - 5, 5, this.postBudgeTarget - this.postBudge + 5);
      line(5, this.postBudgeTarget - this.postBudge - 5, -5, this.postBudgeTarget - this.postBudge + 5);

      strokeWeight(0.25);
      line(0, 0, width/4, 0);

      for(var m = 0; m < this.count; m++){
        var l = this.lets[m];
        ellipse(l.orgX, l.orgY, 5, 5);

        rect(l.x, l.y, 10, 10);

        line(l.orgX, l.orgY, this.xTarget[m], this.yTarget[m]);
        
        strokeWeight(0.25);                 ////////// CURRENT to TARGET DEBUG
        push();
          translate(l.orgX, l.orgY);
          line(-5, 0, 5, 0);
          line(0, -5, 0, 5);

          shearY(l.orgShear);
          shearX(l.orgShearX);
          rotate(l.orgR);
          
          translate(0, -l.thisH/2);
          scale(1, l.orgH);

          stroke(accentColor);
          noFill();
          rect(0, 0, l.w, l.thisH);

          rect(0, pgTextSize * fontHeightFactor[fontSel]/2 - pgTextSize * fontXheight[fontSel]/2, l.w, pgTextSize * fontXheight[fontSel]);   ///// X HEIGHT          
        pop();

        strokeWeight(1.25);                 ////////// DEBUG to CURRENT DEBUG
        push();
          translate(this.xTarget[m], this.yTarget[m]);
          line(-5, -5, 5, 5);
          line(5, -5, -5, 5);

          shearY(this.shearTarget[m]);
          shearX(this.shearXtarget[m]);
          rotate(this.rTarget[m]);
          
          translate(0, -l.thisH/2);
          scale(1, this.hTarget[m]);

          stroke(accentColor);
          noFill();
          rect(0, 0, l.w, l.thisH);

          rect(0, pgTextSize * fontHeightFactor[fontSel]/2 - pgTextSize * fontXheight[fontSel]/2, l.w, pgTextSize * fontXheight[fontSel]);   ///// X HEIGHT          
        
          if(m == 0){
            this.drawDebugLabels(m);
          }
          if(m == this.count - 1){
            this.drawDebugValues(m);
          }
        pop();
      }

    pop();
  }

  drawDebugLabels(m){
    var l = this.lets[m];

    ///////////// BASELINE
    textFont(tFont[0]);
    textSize(8);
    textAlign(RIGHT);

    push();
      translate(-l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, -10, 0);

      noStroke();
      fill(accentFadeColor);
      text("baseline", -15, 0);
    pop();

    ///////////// X-HEIGHT
    push();
      translate(-l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, -pgTextSize * fontXheight[fontSel]);               // UP TO X-HEIGHT

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, -10, 0);

      noStroke();
      fill(accentFadeColor);
      text("x-height", -15, 0);
    pop();

    ///////////// CAP HEIGHT
    push();
      translate(-l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, -pgTextSize * fontHeightFactor[fontSel]);          // UP TO CAP HEIGHT

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, -10, 0);

      noStroke();
      fill(accentFadeColor);
      text("cap height", -15, 0);
    pop();

    ///////////// DESCENDER
    push();
      translate(-l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, pgTextSize * fontDesc[fontSel]);                   // DOWN TO DESCENDER

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(l.w, 0, 0, 0);
      
      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      line(0, 0, -10, 0);

      noStroke();
      fill(accentFadeColor);
      text("descender", -15, 0);
    pop();
  }

  drawDebugValues(m){
    var l = this.lets[m];

    ///////////// BASELINE
    textFont(tFont[0]);
    textSize(8);
    textAlign(LEFT);

    push();
      translate(l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, 10, 0);

      noStroke();
      fill(accentFadeColor);
      text("PT SIZE: " + round(pgTextSize), 15, 0);
    pop();

    ///////////// X-HEIGHT
    push();
      translate(l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, -pgTextSize * fontXheight[fontSel]);               // UP TO X-HEIGHT

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, 10, 0);

      noStroke();
      fill(accentFadeColor);
      text("PT SIZE * " + round(fontXheight[fontSel], 2), 15, 0);
    pop();

    ///////////// CAP HEIGHT
    push();
      translate(l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, -pgTextSize * fontHeightFactor[fontSel]);          // UP TO CAP HEIGHT

      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(0, 0, 10, 0);

      noStroke();
      fill(accentFadeColor);
      text("PT SIZE * " + round(fontHeightFactor[fontSel], 2), 15, 0);
    pop();

    ///////////// DESCENDER
    push();
      translate(l.w/2, pgTextSize * fontHeightFactor[fontSel]/2);     // DOWN TO ORIGIN
      translate(0, pgTextSize * fontDesc[fontSel]);                   // DOWN TO DESCENDER

      noFill();
      stroke(accentColor);
      strokeWeight(0.5);
      line(-l.w, 0, 0, 0);
      
      shearY(-this.shearTarget[m]);
      shearX(-this.shearXtarget[m]);
      rotate(-this.rTarget[m]);

      line(0, 0, 10, 0);

      noStroke();
      fill(accentFadeColor);
      text("PT SIZE * " + round(fontDesc[fontSel],2), 15, 0);
    pop();
  }

  makeOrig(){
    for(var m = 0; m < this.count; m++){
      this.xTarget[m] = this.lets[m].coreX;
      this.yTarget[m] = this.lets[m].coreY;
      this.rTarget[m] = 0;
      this.shearTarget[m] = 0;
      this.shearXtarget[m] = 0;
    }

    this.postBudgeTarget = 0;
    this.preBudgeTarget = 0;
  }

  makeArcOutside(top){
    this.motionType = "Arc, Outside"

    var rotOn = true;
    if(random(10) < 5){
      rotOn = false;
    }

    var direct = 1;
    if(!top){
      direct *= -1;
    }

    var rad = this.fullW/(PI/2);
    var altSagitta = rad/(cos(PI/4));

    for(var m = 0; m < this.count; m++){
      var ang = -direct * PI * 3/4 + direct * map(m, 0, this.count-1, 0, PI/2);

      this.xTarget[m] = cos(ang) * (this.fullW/2 + this.lets[m].thisH/2);
      this.yTarget[m] = sin(ang) * (this.fullW/2 + this.lets[m].thisH/2) + direct * altSagitta/2;

      if(rotOn){
        this.rTarget[m] = ang + direct * PI/2;
      }
    }

    this.postBudgeTarget = this.lets[0].thisH/4;
    this.preBudgeTarget = this.lets[0].thisH/4;
  }

  makeDiagOutside(top){
    this.motionType = "Diagonal, Outside"

    var angOn = true;
    if(random(10) < 5){
      angOn = false;
    }
    var direct = 1;
    var bottomFlip = 1;
    if(random(10) < 5){
      direct *= -1;
    }
    var shiftOver;
    if(top){
      shiftOver = textWidth(inputText[1])/4;
    } else {
      shiftOver = textWidth(inputText[inputText.length - 2])/4;
      bottomFlip *= -1;
    }

    var ang = direct * atan2(this.lets[0].thisH/2, this.fullW);
    var spread = direct * this.lets[0].thisH/4;
    for(var m = 0; m < this.count; m++){
      this.xTarget[m] = this.lets[m].coreX + bottomFlip * direct * shiftOver;
      this.yTarget[m] = map(m, 0, this.count - 1, -spread, spread);

      if(angOn){
        this.shearTarget[m] = ang;      
      }
    }

    this.postBudgeTarget = this.lets[0].thisH/4;
    this.preBudgeTarget = this.lets[0].thisH/4;
  }

  makeCornerOutside(top){
    this.motionType = "Corner, Outside"

    var rotOn = true;
    if(random(10) < 5){
      rotOn = false;
    }

    var direct = 1;
    if(!top){
      direct *= -1;
    }

    var rad = this.fullW/(PI/2);
    var altSagitta = rad/(cos(PI/4));

    var shiftOver;
    if(top){
      shiftOver = textWidth(inputText[1])/3;
    } else {
      shiftOver = textWidth(inputText[inputText.length - 2])/3;
    }

    for(var m = 0; m < this.count; m++){
      var ang;
      if(top){
        ang = -PI + map(m, 0, this.count-1, 0, PI/2);
      } else {
        ang = PI/2 + map(m, 0, this.count-1, 0, -PI/2);
      }

      this.xTarget[m] = cos(ang) * (this.fullW/2 + this.lets[m].thisH/2) - direct * shiftOver;
      this.yTarget[m] = sin(ang) * (this.fullW/2 + this.lets[m].thisH/2) + direct * this.lets[0].thisH/2 + direct * altSagitta/2;

      if(rotOn){
        this.rTarget[m] = ang + direct * PI/2;
      }
    }

    this.postBudgeTarget = this.lets[0].thisH/4;
    this.preBudgeTarget = this.lets[0].thisH/4;
  }

  makeAngles1(){
    this.motionType = "Angles"

    var altOn = true;
    if(random(10) < 5){
      altOn = false;
    }

    for(var m = 0; m < this.count; m++){
      this.shearTarget[m] = -PI/8;

      if(altOn && m%2 == 0){
        this.shearTarget[m] *= -1;
      }
    }
    this.preBudgeTarget = this.lets[0].thisH/4;
    this.postBudgeTarget = this.lets[0].thisH/4;
  }

  makeRays(){
    this.motionType = "Rays"

    for(var m = 0; m < this.count; m++){
      if(m == (this.count + 1)/2 - 1){
        this.rTarget[m] = 0;
      } else if(m < this.count/2){
        this.rTarget[m] = map(m, 0, this.count/2 - 1, -PI/8, 0);
      } else if(m > this.count/2){
        this.rTarget[m] = map(m, this.count/2, this.count - 1, 0, PI/8);
      }
    }
  }

  makeLean(){
    this.motionType = "Lean"

    var angOn = true;
    if(random(10) < 5){
      angOn = false;
    }

    for(var m = 0; m < this.count; m++){
      if(m == (this.count + 1)/2 - 1){
        this.shearXtarget[m] = 0;
      } else if(m < this.count/2){
        this.shearXtarget[m] = map(m, 0, this.count/2 - 1, -PI/8, 0);
      } else if(m > this.count/2){
        this.shearXtarget[m] = map(m, this.count/2, this.count - 1, 0, PI/8);
      }

      if(angOn){
        this.shearXtarget[m] *= -1;
      }
    }
  }

  makeZigZag1(){
    this.motionType = "ZigZag"

    for(var m = 0; m < this.count; m++){
      this.yTarget[m] = this.lets[m].thisH/4;

      if(m%2 == 0){
        this.yTarget[m] *= -1;
      }
    }

    this.preBudgeTarget = this.lets[0].thisH/4;
    this.postBudgeTarget = this.lets[0].thisH/4;
  }

  makeDiag1(){
    this.motionType = "Diagonal"

    var angOn = true;
    if(random(10) < 5){
      angOn = false;
    }
    var flipOn = true;
    if(random(10) < 5){
      flipOn = false;
    }

    var ang = atan2(this.lets[0].thisH/2, this.fullW);
    var spread = this.lets[0].thisH/4;
    if(flipOn){
      ang *= -1;
      spread *= -1;
    }

    for(var m = 0; m < this.count; m++){
      this.yTarget[m] = map(m, 0, this.count - 1, -spread, spread);

      if(angOn){
        this.shearTarget[m] = ang;      
      }
    }

    this.preBudgeTarget = this.lets[0].thisH/4;
    this.postBudgeTarget = this.lets[0].thisH/4;
  }

  makeBolt1(){
    this.motionType = "Bolt"

    var angOn = true;
    if(random(10) < 5){
      angOn = false;
    }

    var ang = atan2(this.lets[0].thisH/2, this.fullW);
    var spread = this.lets[0].thisH/4;

    for(var m = 0; m < this.count; m++){
      if(m < ((this.count + 1)/2)){
        this.yTarget[m] = map(m, 0, this.count/2, -spread, spread);
      } else {
        this.yTarget[m] = map(m, this.count/2, this.count - 1, -spread, spread);
      }

      if(angOn){
        this.shearTarget[m] = ang;      
      }
    }

    this.preBudgeTarget = this.lets[0].thisH/4;
    this.postBudgeTarget = this.lets[0].thisH/4;
  }

  makeArc(){
    this.motionType = "Arc"

    var direct = 1;
    if(!top){
      direct *= -1;
    }

    var rad = this.fullW/(PI/2);
    var altSagitta = rad/(cos(PI/4));

    for(var m = 0; m < this.count; m++){
      var ang = -direct * PI * 3/4 + direct * map(m, 0, this.count-1, 0, PI/2);

      this.xTarget[m] = cos(ang) * (this.fullW/2 + this.lets[m].thisH/2);
      this.yTarget[m] = sin(ang) * (this.fullW/2 + this.lets[m].thisH/2) + rad - altSagitta/8;

      this.rTarget[m] = ang + direct * PI/2;
    }

    this.preBudgeTarget = this.lets[0].thisH/2;
    this.postBudgeTarget = this.lets[0].thisH;
  }

  // DISTORTS TYPE
  // makeBowtie(){
  //   this.motionType = "Bowtie"

  //   var altOn = true;
  //   if(random(10) < 5){
  //     altOn = false;
  //   }

  //   for(var m = 0; m < this.count; m++){
  //     if(altOn){
  //       if(m == (this.count + 1)/2 - 1){
  //         this.hTarget[m] = 1.5;
  //       } else if(m < this.count/2){
  //         this.hTarget[m] = map(m, 0, this.count/2 - 1, 1.1, 1.5);
  //       } else if(m > this.count/2){
  //         this.hTarget[m] = map(m, this.count/2, this.count - 1, 1.5, 1.1);
  //       }
  //     } else {
  //       if(m == (this.count + 1)/2 - 1){
  //         this.hTarget[m] = 1.0;
  //       } else if(m < this.count/2){
  //         this.hTarget[m] = map(m, 0, this.count/2 - 1, 1.5, 1.1);
  //       } else if(m > this.count/2){
  //         this.hTarget[m] = map(m, this.count/2, this.count - 1, 1.1, 1.5);
  //       }
  //     }
  //   }
  //   this.preBudgeTarget = this.lets[0].thisH/4;
  //   this.postBudgeTarget = this.lets[0].thisH/4;
  // }
}