
function shopSheet(len,wid,thk){
    this.length = len;
    this.width = wid;
    this.thickness = thk;
    
    this.makeCsg = function() {
        var cube = new CSG.cube({corner1: [0,0,0], corner2: [len,wid,thk]});
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
            var dimh = 25;
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
        default: //assume default = 20mm diam
            var dimW = 48;
            var dimB = 45;
            var dimG = 39;
            var dimh2 = 23;
            var dimh1 = 10; 
            var dimM = 50;
            var dimI = 12;
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
        case 15:
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
        case 15:
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
    this.threadFltNub = dimE2;
    
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
        return cyl0.union(cyl1).subtract([hole,cutOut,cutOut.rotateX(180)]);
    }
}

//ballnut mount
function shopBallnutMount(diam) {
    //define dimensions according to ballscrew diameter
    switch(diam) {
        case 16:
            var dimW = 60;
            var dimH = 43;
            var dimT = 40;
            var dimD = 36;
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
    
    //create CSG
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,-dimW/2,-dimH/2], corner2: [dimT,dimW/2,dimH/2]});
        var hole = new CSG.cylinder({start: [0,0,0], end: [dimT,0,0], radius: dimD/2, resolution:16});
        return cube0.subtract(hole);
    }
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
