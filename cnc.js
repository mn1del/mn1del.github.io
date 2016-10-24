//var clock = new THREE.Clock();

//var container, stats;

var camera, cameraTarget, scene, renderer, controls;

init();
animate();

function dims(){
    this.basL = 2000;
    this.basW = 1100;

}

function init() {
    //define a few colors
    var colWhite = new THREE.Color("rgb(100%, 100%, 100%)");
    var colMetal = new THREE.Color("rgb(90%, 90%, 90%)");
    var colConcrete = new THREE.Color("rgb(30%, 30%, 30%)");

    //make materials
    var matConcrete = new THREE.MeshPhongMaterial( { color: colConcrete , specular: 0x111111, shininess: 50 } );
    var matAluminium = new THREE.MeshPhongMaterial( { color: colMetal , specular: 0x111111, shininess: 200 } );
    var matMelamine = new THREE.MeshPhongMaterial( { color: colWhite , specular: 0x111111, shininess: 100 } );
    
    //dimensions
    //main base
    var basL = 1900;
    var basW = 1000;
    var basH = 18;
    
    //x carriage angle
    var xCAL = 300;
    var xCAW = 76.2;
    var xCAH = 101.6;
    var xCAT = 6.35
    
    //side bed (which the xRails and x ballscrew are seated on
    var sideBedL = basL;
    var sideBedW = 150;
    var sideBedH = 15;
    var sideBedO = xCAW - xCAT; //amount the sideBed overhangs the sides of the base by. Assumes inset by inner width of xCarAngl - for easy measuring
    
    //x rail
    var xRL = 1900;
    var xRD = 20;

    //x ballscrew
    var xBSD = 20;
    var xBSL = 1900;
    
    //Gantry side
    var gSL = 300; //gantry side length
    var gSX = 100; //x-location of the gantry
    
    //y rail
    var yRL = 1004;
    var yRD = 16;

    //y ballscrew
    var yBSD = 16;
    var yBSL = 1000;
    
    //html container div - to house the WebGL content
    //already made in index.html... an alternative would be to make on the fly here
    var container = document.getElementById("container");

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );
    
    //create scene (global scope)
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.add(new THREE.AxisHelper(3000)); //axis helper

    //create camera (global scope)
    //and add to scene
    camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 1, 3000 );
    //camera.position.y = -1000;
    //camera.lookAt(new THREE.Vector3(0,0,0));
    //camera.position.z = 200;
    scene.add( camera );

    //add TrackBall controls to the camera
    controls = new THREE.TrackballControls( camera);
    controls.position0.set( -200, -850, 400 ); // set a new desired position
    controls.target0.set(0,0,100);
    controls.up0.set( 0, 0, 1 ); // set a new up vector
    controls.reset();
    controls.rotateSpeed = 10.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 1;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 1.1;
    controls.maxDistance = 10000;
    controls.keys = [ 16, 17, 18 ]; // [ rotateKey, zoomKey, panKey ]

    //create light(s)
    var dirLight = new THREE.DirectionalLight(colWhite , 0.95);
    dirLight.position.set(-200, -1000, 1000);
    dirLight.position.normalize();
    scene.add(dirLight);

    var pointLight = new THREE.PointLight(colWhite , 5, 50);
    pointLight.position.set(10, 20, -10);
    scene.add(pointLight);
    
    //Make part objects (from shop.js)
    var baseObj = new shopSheet(basL,basW,basH); 
    var sideBedObj = new shopSheet(sideBedL,sideBedW,sideBedH); 
    var xRailObj = new shopSbrxx(xRL,xRD); 
    var xLinBearObj = new shopSbrxxuu(xRD);
    var xBScrwObj = new shopRmxx05(xBSD, xBSL);
    var xBScrwFixSuppObj = new shopBkxx(xBSD);
    var xCarAngObj = shopAluAngle(xCAW,xCAH,xCAT,xCAL);
    var yRailObj = new shopSbrxx(yRL,yRD); 
    
    //make CSGs, and where applicable copies, to be merged into a single geometry
    var baseCsg = baseObj.makeCsg();
        baseCsg = baseCsg.center("y");
    var sideBedCsg = sideBedObj.makeCsg();
        sideBedCsg = sideBedCsg.union(sideBedCsg.translate([0,baseObj.width - sideBedObj.width + 2*sideBedO,0])); 
        sideBedCsg = sideBedCsg.center("y");
    var xRailCsg = xRailObj.makeCsg();
        xRailCsg = xRailCsg.union(xRailCsg.translate([0,yRailObj.length - xLinBearObj.width,0])); //outside of linear bearings set equal to yRail length
        xRailCsg = xRailCsg.center("y");
    var xLinBearCsg = xLinBearObj.makeCsg();
        xLinBearCsg = xLinBearCsg.union(xLinBearCsg.translate([gSL - xLinBearObj.length,0,0])); 
        xLinBearCsg = xLinBearCsg.union(xLinBearCsg.translate([0,yRailObj.length - xLinBearObj.width,0])).center("y");
    var xCarAngCsg = xCarAngObj.makeCsg();
        xCarAngCsg = xCarAngCsg.union(xCarAngCsg.mirroredY().translate([0,yRailObj.length + 2*xCAT,0])).center("y");
    var xBScrwFixSuppCsg = xBScrwFixSuppObj.makeCsg();
        xBScrwFixSuppCsg = xBScrwFixSuppCsg.union(xBScrwFixSuppCsg.translate([0,yRailObj.length + xBScrwFixSuppObj.width,0])).center("y");
    var xBScrwCsg = xBScrwObj.makeCsg();
        xBScrwCsg = xBScrwCsg.union(xBScrwCsg.translate([0,yRailObj.length + xBScrwFixSuppObj.width,0])).center("y");
                                     
    //make THREE meshes, assemble and position                                     
    var geom3;
    //base                                 
    geom3 = THREE.CSG.fromCSG(baseCsg);
    var base = new THREE.Mesh(geom3,matConcrete);
    scene.add(base);                                       
    //side Bed
    geom3 = THREE.CSG.fromCSG(sideBedCsg);
    var sideBed = new THREE.Mesh(geom3,matMelamine);
    base.add(sideBed);  
    sideBed.position.set(0,0,baseObj.thickness);
    //xRails
    geom3 = THREE.CSG.fromCSG(xRailCsg);
    var xRails = new THREE.Mesh(geom3,matAluminium);
    sideBed.add(xRails);  
    xRails.position.set(0,0,sideBedObj.thickness);
    //xLinBears
    geom3 = THREE.CSG.fromCSG(xLinBearCsg);
    var xLinBears = new THREE.Mesh(geom3,matAluminium);
    xRails.add(xLinBears);
    xLinBears.position.set(gSX,0,xRailObj.railZPos - xLinBearObj.railZPos);
    //xCarAng
    geom3 = THREE.CSG.fromCSG(xCarAngCsg);
    var xCarAng = new THREE.Mesh(geom3,matAluminium);
    xLinBears.add(xCarAng);
    xCarAng.position.set(0,-xCAT,xLinBearObj.height);
    
    // Make base
//     var geom = baseObj.makeCsg().center("y");
//     var geom3 = THREE.CSG.fromCSG(geom);
//     base = new THREE.Mesh(geom3,matConcrete);
//     scene.add(base);

    //make xR
//     geom = xRailObj.makeCsg().translate([0,-basW/2 + xRailObj.width/2,basH]);
//     geom = geom.union(geom.mirroredY());
//     geom3 = THREE.CSG.fromCSG(geom);
//     var xR0 = new THREE.Mesh(geom3,matAluminium);
    //var xR1 = xR0.clone(false);
    //xR1.position.set(0,basW,0);
    
    //make xLinBear
//     geom = xLinBearObj.makeCsg().translate([0,0,xRailObj.railZPos - xLinBearObj.railZPos])
//     geom3 = THREE.CSG.fromCSG(geom);
//     var xLB = new THREE.Mesh(geom3,matAluminium);
    
//     xR0.add(xLB);
//     base.add(xR0);
    //xR0.add(ranSh);

}

//animation loop
function animate() {
    //var delta = clock.getDelta();
    requestAnimationFrame( animate );    

    camera.up.set(0,0,1);
    controls.update();
    render();
    
}

//render function
function render() {

    renderer.render( scene, camera );
}
