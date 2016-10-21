
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
    this.railZPos = dimG - dimh2; //height of the centre of the rail
    
    this.makeCsg = function() {
        var cube0 = new CSG.cube({corner1:[0,-dimB/2,0],corner2:[dimM,dimB/2,dimG]}); 
        var cube1 = new CSG.cube({corner1:[0,-dimW/2,dimG - dimI],corner2:[dimM,dimW/2,dimG]}); 
        var cylCutout = new CSG.cylinder({start: [0,0,this.railZPos], end: [dimM,0,this.railZPos], radius: diam/2, resolution:16});
        var cubeCutOut = new CSG.cube({corner1:[0,-dimh1/2,0],corner2:[dimM,dimh1/2,this.railZPos]}); 
        return cube0.union(cube1).subtract([cylCutout,cubeCutOut]);
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
