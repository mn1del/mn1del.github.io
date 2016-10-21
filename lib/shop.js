
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
    
    this.makeCsg = function(){
        var cyl = new CSG.cylinder({start:[0,0,dimh],end:[len ,0,dimh],radius:diam /2,resolution:16});
        var cube0 = new CSG.cube({corner1:[0,dimB/2,0],corner2:[len,-dimB/2,dimT]});
        var cube1 = new CSG.cube({corner1:[0,dimh1/2,0],corner2:[len,-dimh1/2,dimh]});
        return cyl.union([cube0,cube1]);
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
