/*
function shopCube(len,wid,thk){
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
*/


function shopCube(len,wid,thk){
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
