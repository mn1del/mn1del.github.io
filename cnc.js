//var clock = new THREE.Clock();

//var container, stats;

var camera, cameraTarget, scene, renderer, controls;

init();
animate();

function init() {
    //define a few colors
    var colWhite = new THREE.Color("rgb(100%, 100%, 100%)");
    var colMetal = new THREE.Color("rgb(70%, 70%, 70%)");
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
    var xCAT = 6.35;
    
    //side bed (which the xRails and x ballscrew are seated on
    var sideBedL = basL;
    var sideBedW = 75;
    var sideBedH = 15;
    var sideBedO = 0;(xCAW - xCAT); //amount the sideBed overhangs the sides of the base by. Assumes inset by inner width of xCarAngl - for easy measuring
    
    //x rail
    var xRL = 1900;
    var xRD = 20;
    
    //x carriage angle
    var xRAL = xRL;
    var xRAW = 50.8;
    var xRAH = 63.5;
    var xRAT = 6.35;
    
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
    scene.background = colWhite ;//new THREE.Color( 0xffffff );
    scene.add(new THREE.AxisHelper(3000)); //axis helper

    //create camera (global scope)
    //and add to scene
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );
    camera.position.y = -1500;
    //camera.lookAt(new THREE.Vector3(0,0,0));
    //camera.position.z = 200;
    scene.add( camera );

    //add TrackBall controls to the camera
    controls = new THREE.TrackballControls( camera);
    controls.position0.set( -200, -1500, 400 ); // set a new desired position
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
    var xRailAngObj = new shopAluAngle(xRAW,xRAH,xRAT,xRAL);
    var xRailObj = new shopSbrxx(xRL,xRD); 
    var xLinBearObj = new shopSbrxxuu(xRD);
    var xBScrwObj = new shopRmxx05(xBSD, xBSL);
    var xBScrwFixSuppObj = new shopBkxx(xBSD);
    var xBScrwFltSuppObj = new shopBfxx(xBSD);
    var xCarAngObj = new shopAluAngle(xCAW,xCAH,xCAT,xCAL);
    var yRailObj = new shopSbrxx(yRL,yRD); 
    
    //make CSGs, and where applicable copies, to be merged into a single geometry
    var baseCsg = baseObj.makeCsg();
        baseCsg = baseCsg.center("y");
//     var sideBedCsg = sideBedObj.makeCsg();
//         sideBedCsg = sideBedCsg.union(sideBedCsg.translate([0,baseObj.width - sideBedObj.width + 2*sideBedO,0])).center("y");
//         sideBedCsg = sideBedCsg.union(sideBedCsg.translate([0,0,-baseObj.thickness - sideBedObj.thickness]));
    var xRailAngCsg = xRailAngObj.makeCsg();
        xRailAngCsg = xRailAngCsg.mirroredY().mirroredZ().translate([0,-xRailAngObj.width,0]);
        xRailAngCsg = xRailAngCsg.union(xRailAngCsg.mirroredY().translate([0,baseObj.width,0])).center("y");
    var xRailCsg = xRailObj.makeCsg();
        xRailCsg = xRailCsg.rotateX(90).union(xRailCsg.rotateX(-90).translate([0,baseObj.width - 2*xRailAngObj.inWidth,0])).center("y"); //outside of linear bearings set equal to yRail length
    var xLinBearCsg = xLinBearObj.makeCsg();
        xLinBearCsg = xLinBearCsg.rotateX(90).union(xLinBearCsg.rotateX(90).translate([gSL - xLinBearObj.length,0,0])); 
        xLinBearCsg = xLinBearCsg.union(xLinBearCsg.rotateX(-90).translate([0,baseObj.width - 2*xRailAngObj.inWidth + xRailObj.railZPos - xLinBearObj.railZPos,0])).center("y");
//     var xCarAngCsg = xCarAngObj.makeCsg();
//         xCarAngCsg = xCarAngCsg.union(xCarAngCsg.mirroredY().translate([0,baseObj.width + 2*xCAT,0])).center("y");
//     var xBScrwFixSuppCsg = xBScrwFixSuppObj.makeCsg();
//         xBScrwFixSuppCsg = xBScrwFixSuppCsg.union(xBScrwFixSuppCsg.translate([0,baseObj.width  - xBScrwFixSuppObj.width,0])).center("y").mirroredZ().mirroredX();
//     var xBScrwFltSuppCsg = xBScrwFltSuppObj.makeCsg();
//         xBScrwFltSuppCsg = xBScrwFltSuppCsg.union(xBScrwFltSuppCsg.translate([0,baseObj.width  - xBScrwFltSuppObj.width,0])).center("y").mirroredZ();
//     var xBScrwCsg = xBScrwObj.makeCsg();
//         xBScrwCsg = xBScrwCsg.union(xBScrwCsg.translate([0,baseObj.width  - xBScrwFixSuppObj.width,0])).center("y").mirroredX();
                                     
    //make THREE meshes, assemble and position                                     
    var geom3;
    //base                                 
    geom3 = THREE.CSG.fromCSG(baseCsg);
    var base = new THREE.Mesh(geom3,matConcrete);
    scene.add(base);                                       
    //side Bed
//     geom3 = THREE.CSG.fromCSG(sideBedCsg);
//     var sideBed = new THREE.Mesh(geom3,matMelamine);
//     base.add(sideBed);  
//     sideBed.position.set(0,0,baseObj.thickness);
    //xRailAng
    geom3 = THREE.CSG.fromCSG(xRailAngCsg);
    var xRailAng = new THREE.Mesh(geom3,matAluminium);
    base.add(xRailAng);  
    //xRailAng.position.set(0,0,baseObj.thickness);
    //xRails
    geom3 = THREE.CSG.fromCSG(xRailCsg);
    var xRails = new THREE.Mesh(geom3,matAluminium);
    xRailAng.add(xRails);  
    xRails.position.set(0,0,xRailObj.width/2 - xRailAngObj.height);
    //xLinBears
    geom3 = THREE.CSG.fromCSG(xLinBearCsg);
    var xLinBears = new THREE.Mesh(geom3,matAluminium);
    xRails.add(xLinBears);
//     xLinBears.position.set(gSX,0,xRailObj.railZPos - xLinBearObj.railZPos);
    //xCarAng
//     geom3 = THREE.CSG.fromCSG(xCarAngCsg);
//     var xCarAng = new THREE.Mesh(geom3,matAluminium);
//     xLinBears.add(xCarAng);
//     xCarAng.position.set(0,-xCAT,xLinBearObj.height);
    //x ballscrew fixed support
//     geom3 = THREE.CSG.fromCSG(xBScrwFixSuppCsg);
//     var xBScrwFixSupp = new THREE.Mesh(geom3,matAluminium);
//     sideBed.add(xBScrwFixSupp);  
//     xBScrwFixSupp.position.set(xBScrwFltSuppObj.thick + xBScrwFixSuppObj.thick + xBScrwObj.threadEnd - xBScrwObj.threadStart,0,-baseObj.thickness -sideBedObj.thickness);
//     //x ballscrew floating support
//     geom3 = THREE.CSG.fromCSG(xBScrwFltSuppCsg);
//     var xBScrwFltSupp = new THREE.Mesh(geom3,matAluminium);
//     sideBed.add(xBScrwFltSupp);  
//     xBScrwFltSupp.position.set(0,0,-baseObj.thickness -sideBedObj.thickness);
//     //x ballscrew
//     geom3 = THREE.CSG.fromCSG(xBScrwCsg);
//     var xBScrw = new THREE.Mesh(geom3,matAluminium);
//     xBScrwFltSupp.add(xBScrw);  
//     xBScrw.position.set(xBScrwObj.length + xBScrwFltSuppObj.thick - xBScrwObj.threadFltNub,0,-xBScrwFixSuppObj.bscrewZPos);
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
