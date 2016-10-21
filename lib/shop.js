
function shopBase(len,wid,thk){
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
function shopSuppRail(len,diam){
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
    
    this.makeCsg = function(){
        var cyl = new CSG.cylinder({start:[0,0,dimh],end:[len ,0,dimh],radius:diam /2,resolution:16});
        var cube0 = new CSG.cube({corner1:[0,dimB/2,0],corner2:[len,-dimB/2,dimT]});
        var cube1 = new CSG.cube({corner1:[0,dimh1/2,0],corner2:[len,-dimh1/2,dimh]});
        return cyl.union([cube0,cube1]);
    }
}

//linear bearing
//oriented so that open side faced down, and slide direction is along X axis
function shopOpenLinBear(diam) {
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
    //properties
    this.innerWidth = width - thick;
    this.innerHeigth = height - thick;

    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,0,0], corner2: [len,width,thick]});
        var cube1 = new CSG.cube({corner1: [0,0,0], corner2: [len,thick,height]});
        return cube0.union(cube1);
    }
}

//ball screw fixed support
function shopBscrewFixSupp(diam){
    //define dimensions according to diam
    switch (diam) {
        case 12:
            var dimB = 60;
            var dimH1 = 32.5;
            var dimH = 43;
            var dimh = 25;
            var dimB1 = 34;
            var dimL = 25;
            var dimL1 = 5;
        case 15:
             var dimB = 70;
            var dimH1 = 38;
            var dimH = 48;
            var dimh = 28;
            var dimB1 = 40;
            var dimL = 27;
            var dimL1 = 6
        default:
           var dimB = 70;
            var dimH1 = 38;
            var dimH = 48;
            var dimh = 28;
            var dimB1 = 40;
            var dimL = 27;
            var dimL1 = 6
    } 
    
    //define properties
    this.specUrl = "";
    this.width = dimB;
    this.bscrewZPos = dimh;
    this.thick = dimL;

    //return csg
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1: [0,-dimB/2,0], corner2:[dimL,dimB/2,dimH1]});
        var cube1 = new CSG.cube({corner1: [-dimL1,-dimB1/2,0], corner2:[dimL,dimB1/2,dimH]});
        var cylCutout = new CSG.cylinder({start: [-dimL1,0,dimh], end: [dimL,0,dimh]});
        return cube0.union(cube1).subtract(cylCutout);
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
