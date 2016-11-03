///generic cube/sheet
function shopSheet(len,wid,thk){
    this.length = len;
    this.width = wid;
    this.thick = thk;

    this.makeCsg = function() {
        var cube = new CSG.cube({corner1: [0,0,0], corner2: [len,wid,thk]});
        return cube;
    }
}

//pool table slate
function shopSlate(len,wid,thk){
    this.length = len;
    this.width = wid;
    this.thick = thk;

    this.makeCsg = function() {
        var cube = new CSG.cube({corner1: [0,0,0], corner2: [len,wid,thk]});
        var cylCutout = new CSG.cylinder({start: [0,0,0], end: [0,0,thk], radius: 70, resolution:16});
        var cylCutout1 = new CSG.cylinder({start: [0,0,0], end: [0,0,thk], radius: 35, resolution:16});
        cube = cube.subtract([
            cylCutout,
            cylCutout1.translate([len/2,0,0]),
            cylCutout.translate([len,0,0]),
            cylCutout.translate([len,wid,0]),
            cylCutout1.translate([len/2,wid,0]),
            cylCutout.translate([0,wid,0])
        ]);
        return cube;
    }
}

//supported rail
//linear slide direction along the x axis, bottom of the support sits on z=0
function shopSbrxx(len,diam){
    //define dimensions based on underlying real world spec sheet
    switch (diam) {
        case 16:
            var dimB = 40;
            var dimT = 5;
            var dimh = 25;
            var dimh1 = 10;
        case 20:
            var dimB = 45;
            var dimT = 5;
            var dimh = 27;
            var dimh1 = 10;
        default: //assume default = 20mm diam
            var dimB = 45;
            var dimT = 5;
            var dimh = 27;
            var dimh1 = 10;
    }

    this.specUrl = "http://cnc4you.co.uk/resources/SBRxxUU.pdf";
    this.width = dimB;
    this.railZPos = dimh; //height of the centre of the rail
    this.length = len;

    this.makeCsg = function(){
        var cyl = new CSG.cylinder({start:[0,0,dimh],end:[len ,0,dimh],radius:diam /2,resolution:16});
        var cube0 = new CSG.cube({corner1:[0,dimB/2,0],corner2:[len,-dimB/2,dimT]});
        var cube1 = new CSG.cube({corner1:[0,dimh1/2,0],corner2:[len,-dimh1/2,dimh]});
        return cyl.union([cube0,cube1]);
    }
}

//linear bearing
//oriented so that open side faced down, and slide direction is along X axis
function shopSbrxxuu(diam) {
        //define dimensions based on underlying real world spec sheet
    switch (diam) {
        case 16:
            var dimW = 45;
            var dimB = 40;
            var dimG = 33;
            var dimh2 = 20;
            var dimh1 = 10;
            var dimM = 45;
            var dimI = 12;
        case 20:
            var dimW = 48;
            var dimB = 45;
            var dimG = 39;
            var dimh2 = 23;
            var dimh1 = 10;
            var dimM = 50;
            var dimI = 12;
        default:
            console.log ("Fixed bearing for " + diam + "mm diameter linear bearing not yet set up!!");
    }

    this.specUrl = "http://cnc4you.co.uk/resources/SBRxxUU.pdf";
    this.width = dimW;
    this.length = dimM;
    this.railZPos = dimG - dimh2; //height of the centre of the rail
    this.height = dimG;

    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1:[0,-dimB/2,0],corner2:[dimM,dimB/2,dimG]});
        var cube1 = new CSG.cube({corner1:[0,-dimW/2,dimG - dimI],corner2:[dimM,dimW/2,dimG]});
        var cylCutout = new CSG.cylinder({start: [0,0,this.railZPos], end: [dimM,0,this.railZPos], radius: diam/2, resolution:16});
        var cubeCutOut = new CSG.cube({corner1:[0,-dimh1/2,0],corner2:[dimM,dimh1/2,this.railZPos]});
        return cube0.union(cube1).subtract([cylCutout,cubeCutOut]);
    }
}

// angle aluminium- width goes along y axis, height along z axis
function shopAluAngle(width,height,thick,len) {
    console.log ("w: " + width + ", h: " + height + ", t: " + thick + ", l: " + len)
    //properties
    this.inWidth = width - thick;
    this.inHeight = height - thick;
    this.width = width;
    this.height = height;
    this.length = len;

    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,0,0], corner2: [len,width,thick]});
        var cube1 = new CSG.cube({corner1: [0,0,0], corner2: [len,thick,height]});
        return cube0.union(cube1);
    }
}

//ball screw fixed support
//input is ballscrew diameter (NOT support inner diam)
function shopBkxx(diam){
    //define dimensions according to diam
    switch (diam) {
        case 16:
            var dimd1 = 12;
            var dimB = 60;
            var dimH1 = 32.5;
            var dimH = 43;
            var dimh = 25;
            var dimB1 = 34;
            var dimL = 25;
            var dimL1 = 5;
        case 20:
            var dimd1 = 15;
            var dimB = 70;
            var dimH1 = 38;
            var dimH = 48;
            var dimh = 28;
            var dimB1 = 40;
            var dimL = 27;
            var dimL1 = 6
        default:
           console.log ("Fixed bearing for " + diam + "mm diameter ballscrew not yet set up!!");
    }

    //define properties
    this.specUrl = "http://cnc4you.co.uk/resources/BK%20xx%20Fixed%20Bearing.pdf";
    this.width = dimB;
    this.bscrewZPos = dimh;
    this.thick = dimL;
    this.height = dimH;

    //return csg
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,-dimB/2,0], corner2:[dimL,dimB/2,dimH1]});
        var cube1 = new CSG.cube({corner1: [-dimL1,-dimB1/2,0], corner2:[dimL,dimB1/2,dimH]});
        var cylCutout = new CSG.cylinder({start: [-dimL1,0,dimh], end: [dimL,0,dimh], radius: dimd1/2, resolution:16});
        return cube0.union(cube1).subtract(cylCutout);
    }
}

//ball screw floating support
//input is ballscrew diameter (NOT support inner diam)
function shopBfxx(diam){
    //define dimensions according to diam
    switch (diam) {
        case 16:
            var dimd1 = 10;
            var dimB = 60;
            var dimB1 = 34;
            var dimH = 43;
            var dimH1 = 32.5;
            var dimh = 25;
            var dimL = 20;
        case 20:
            var dimd1 = 15;
            var dimB = 70;
            var dimB1 = 40;
            var dimH = 48;
            var dimH1 = 38;
            var dimh = 28;
            var dimL = 20;
        default:
           console.log ("Floating bearing for " + diam + "mm diameter ballscrew not yet set up!!");
    }

    //define properties
    this.specUrl = "http://cnc4you.co.uk/resources/BF%20xx%20Floating%20Bearing.pdf";
    this.width = dimB;
    this.bscrewZPos = dimh;
    this.thick = dimL;
    this.height = dimH;

    //return csg
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,-dimB/2,0], corner2:[dimL,dimB/2,dimH1]});
        var cube1 = new CSG.cube({corner1: [0,-dimB1/2,0], corner2:[dimL,dimB1/2,dimH]});
        var cylCutout = new CSG.cylinder({start: [0,0,dimh], end: [dimL,0,dimh], radius: dimd1/2, resolution:16});
        return cube0.union(cube1).subtract(cylCutout);
    }
}

//ballscrew, left end machined for BKxx fixed bearing, right end machined for BFxx floating bearing
//oriented along the x axis, starting at (0,0,0)
function shopRmxx05(diam, len) {
    //dimensions
    switch(diam) {
        case 16:
            var dimB = 10;
            var dimD = 12;
            var dimF = 15;
            var dimE = 36;
            var dimD2 = 10; //floating end
            var dimE2 = 11; //floating end
        case 20:
            var dimB = 12;
            var dimD = 15;
            var dimF = 20;
            var dimE = 40;
            var dimD2 = 15; //floating end
            var dimE2 = 13; //floating end
        default:
            console.log (diam + "mm diameter ballscrew not yet set up!!");
    }

    //define properties
    this.specUrl = "http://cnc4you.co.uk/resources/BK12+Machining.PDF";
    this.diam = diam;
    this.length = len;
    this.threadStart = dimF + dimE;
    this.threadEnd = len - dimE2;
    this.threadLength = this.threadEnd - this.threadStart;
    this.threadFltNub = dimE2;
    this.couplerDiam = dimB;

    //return csg
    this.makeCsg = function() {
        var cyl0 = new CSG.cylinder({start: [0,0,0], end: [dimF,0,0], radius: dimB/2, resolution:16});
        var cyl1 = new CSG.cylinder({start: [dimF,0,0], end: [this.threadStart,0,0], radius: dimD/2, resolution:16});
        var cyl2 = new CSG.cylinder({start: [this.threadStart,0,0], end: [this.threadEnd,0,0], radius: diam/2, resolution:16});
        var cyl3 = new CSG.cylinder({start: [this.threadEnd,0,0], end: [len,0,0], radius: dimD2/2, resolution:16});
        return cyl0.union([cyl1, cyl2, cyl3]);
    }
}

//ballnut
//diam = ballscrew diam
//aligned along X axis with the flange to the left
function shopBallnut(diam) {
    //define dimensions per diam
    switch(diam) {
        case 16:
            var dimA = 48;
            var dimH = 40;
            var dimB = 10;
            var dimL = 42;
            var dimD = 28;
        case 20:
            var dimA = 58;
            var dimH = 44;
            var dimB = 10;
            var dimL = 42;
            var dimD = 36;
        default:
            console.log (diam + "mm diameter ballscrew nut not yet set up!!");
    }

    //properties
    this.flangeThick = dimB;
    this.length = dimL;

    //return CSG
    this.makeCsg = function(){
        var cyl0 = new CSG.cylinder({start: [0,0,0], end: [dimB,0,0], radius: dimA/2, resolution:16});
        var cyl1 = new CSG.cylinder({start: [0,0,0], end: [dimL,0,0],radius: dimD/2, resolution:16});
        var hole = new CSG.cylinder({start: [0,0,0], end: [dimL,0,0],radius: diam/2, resolution:16});
        var cutOut = new CSG.cube({corner1:[0,dimH/2,-dimA], corner2: [dimB,dimA,dimA]});
        return cyl0.union(cyl1).subtract([hole,cutOut,cutOut.rotateX(180)]).rotateX(90);
    }
}

//ballnut mount
function shopBallnutMount(diam) {
    //define dimensions according to ballscrew diameter
    switch(diam) {
        case 16:
            var dimW = 52;
            var dimH = 42;
            var dimT = 40;
            var dimD = 28;
        case 20:
            var dimW = 60;
            var dimH = 43;
            var dimT = 40;
            var dimD = 36;
        default:
            console.log (diam + "mm diameter ballscrew nut mount not yet set up!!");
    }

    //properties
    this.width = dimW;
    this.height = dimH;
    this.length = dimT;

    //create CSG
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,-dimW/2,-dimH/2], corner2: [dimT,dimW/2,dimH/2]});
        var hole = new CSG.cylinder({start: [0,0,0], end: [dimT,0,0], radius: dimD/2, resolution:16});
        return cube0.subtract(hole);
    }
}

//gantry side
function shopGantrySide(length, runnerHeight, topHeight, topWidth, thick, crvRadius) {
    //define properties
    this.runnerHeight = runnerHeight;

    console.log ("length: " + length);
    console.log ("runnerHeight: " + runnerHeight);
    console.log ("topHeight: " + topHeight);
    console.log ("topWidth: " + topWidth);
    console.log ("thick: " + thick);
    console.log ("crvRadius: " + crvRadius);

    //make geometry
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,0,0], corner2: [length,thick,topHeight]});
        //var cube1 = new CSG.cube({corner1: [length - topWidth,0,runnerHeight], corner2: [length,thick,topHeight]});
        var cutOutCyl = new CSG.cylinder({
            start: [length - topWidth - crvRadius,0,runnerHeight + crvRadius],
            end: [length - topWidth - crvRadius,thick,runnerHeight + crvRadius], radius: crvRadius, resolution:16});
        var cutOut0 = new CSG.cube({
            corner1: [0,0,runnerHeight],
            corner2: [length - topWidth - crvRadius,thick,topHeight]});
        var cutOut1 = new CSG.cube({
            corner1: [0,0,runnerHeight + crvRadius],
            corner2: [length - topWidth,thick,topHeight]});
        return cube0.subtract([cutOutCyl, cutOut0, cutOut1]);
    }
}

//x drive arm
//attaches gantry side to the x ballnut mount via some aluminium angle
function shopXDriveArm(len, width, thick) {
    //define properties
    this.length = len;
    this.width = width;
    this.thick = thick;

    //make geometry
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,0,0], corner2: [len, width, thick]});
        return cube0;
    }
}

//flexible coupler
function shopCoupler(diam0, diam1, diam, len) {
    this.diam = diam;
    this.length = len;

    //make geometry
    this.makeCsg = function() {
        var cyl = new CSG.cylinder({start: [-len/2,0,0], end: [len/2, 0,0], radius: diam/2, resolution:16});
        var cutOut0 = new CSG.cylinder({start: [-len/2,0,0], end: [0, 0, 0], radius: diam0/2, resolution:16});
        var cutOut1 = new CSG.cylinder({start: [0,0,0], end: [len/2, 0, 0], radius: diam1/2, resolution:16});

        return cyl.subtract([cutOut0,cutOut1]);
    }
}

//makes a Nema stepper motor
function shopMotor(width, length, shaftDiam, shaftLen){

    //make geometry
    this.makeCsg = function() {
        var body = CSG.cube({corner1: [0,-width/2,-width/2],corner2:[length,width/2,width/2]});
        var shaft = CSG.cylinder({start:[length,0,0],end:[length + shaftLen,0,0],radius: shaftDiam/2,resolution:16});

        return body.union(shaft);

    }
}

//spindle mount
function shopSpindleMount(diam){
    //define dimensions
    var basWidth = 150;
    var bodyWidth = 113;
    var depth = 78;
    var footH = 12;
    var totHeight = 107;
    var shoulderH = 83;
    var wallThick = 12;

    this.width = basWidth;
    this.spinInset = totHeight - wallThick - diam/2;
    this.depth = depth;
    this.height = totHeight;

    //make geometry
    this.makeCsg = function() {
        var base0 = new CSG.cube({corner1: [0,0,0],corner2:[basWidth,depth,footH]});
        var body0 = new CSG.cube({corner1: [(basWidth - bodyWidth)/2,0,footH],corner2:[basWidth- (basWidth - bodyWidth)/2,depth,shoulderH]});
        var hole0  = new CSG.cylinder({start: [basWidth/2,0,totHeight - wallThick - diam/2], end: [basWidth/2,depth,totHeight - wallThick - diam/2], radius: diam/2, resolution:16});
        var cyl  = new CSG.cylinder({start: [basWidth/2,0,totHeight - wallThick - diam/2], end: [basWidth/2,depth,totHeight - wallThick - diam/2], radius: 12 + diam/2, resolution:16});

        return base0.union([body0,cyl]).subtract(hole0);
    }
}

//make spindle
function makeSpindle(inputs,spindleMount){
    //constituent parts
    var spinBody = CSG.cylinder({start: [0,0,0], end: [0, 0, inputs.properties.spinBodL], radius: inputs.properties.spinBD/2, resolution: res}).setColor([169/255,169/255,169/255]);
    var spinNeck = CSG.cylinder({start: [0,0,0], end: [0, 0, inputs.properties.spinNL], radius: inputs.properties.spinND/2, resolution: res}).setColor([169/255,169/255,169/255])
        .translate([0,0,-inputs.properties.spinNL]);
    var spinCollet = CSG.cylinder({start: [0,0,0], end: [0, 0, inputs.properties.spinCL], radius: inputs.properties.spinCD/2, resolution: res}).setColor([0,0,0])
        .translate([0,0,-inputs.properties.spinNL -inputs.properties.spinCL]);
    var spinBit = CSG.cylinder({start: [0,0,0], end: [0, 0, inputs.properties.spinBitL], radius: inputs.properties.spinBitD/2, resolution: res}).setColor([180/255,159/255,6/255])
        .translate([0,0,-inputs.properties.spinNL -inputs.properties.spinCL -inputs.properties.spinBitL]);

    // bring together
    spindle = spinBody.union([spinNeck,spinCollet,spinBit]);

    //define connector to spindle mount
    spindle.properties.cSpinMt = new CSG.Connector([0,-inputs.properties.spinBD/2,0],[0,1,0],[0,0,1]);

    //connect to spindle mount
    spindle = spindle.connectTo(spindle.properties.cSpinMt,spindleMount.properties.cSpindle,false,0);

    return spindle;
}

/*
function CNC4YOU() {

    this.shopCube = function(len,wid,thk){
        this.length = len;
        this.width = wid;
        this.thickness = thk;

        this.makeCsg = function() {
            var cube = new CSG.cube({corner1: [0,0,0], corner2: [len,wid,thk]});
            var cube1 = cube.rotateY(180);
            var cubes = cube.union(cube1);
            return cubes;
        }
    }

}
*/
