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

    //dimensions
    var basL = 2000;
    var basW = 1100;
    var basH = 18;
    
    var xRL = 2000;
    var xRD = 25;
    var xRSW = 30;
    var xRSH = 25;
    var xRSSH = 6;

    var xLBL = 50;
    var xLBW = 30;
    var xLBH = 40;
    var xLBD = 20;
    var xLBI = 10;

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
    camera.position.y = -1000;
    camera.target.set(0,0,0);
    //camera.position.z = 200;
    scene.add( camera );
/*
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
  */

    //create light(s)
    var dirLight = new THREE.DirectionalLight(colWhite , 0.95);
    dirLight.position.set(-200, -1000, 1000);
    dirLight.position.normalize();
    scene.add(dirLight);

    var pointLight = new THREE.PointLight(colWhite , 5, 50);
    pointLight.position.set(10, 20, -10);
    scene.add(pointLight);

    //obj tree
    //var base = new THREE.Object3D();
    //scene.add(base);
        //var xR = new THREE.Object3D();
            //base.add(xR);
        //linear bearing
        //var linBear = new THREE.Object3D();
            //xR.add(linBear);
            //x carriage angle
            //var xCA = new THREE.Object3D();
            //linBear.add(xCA);


    // Make base
    var material = new THREE.MeshPhongMaterial( { color: colConcrete , specular: 0x111111, shininess: 50 } );
    var geom = new CSG.cube({corner1:[0,0,0],corner2:[basL,basW,basH]}).center("y");
    var geom3 = THREE.CSG.fromCSG(geom);
    base = new THREE.Mesh(geom3,material);
    scene.add(base);

    //make xR
    var material = new THREE.MeshPhongMaterial( { color: colMetal , specular: 0x111111, shininess: 200 } );
    var cyl = new CSG.cylinder({start:[0,0,xRSH],end:[xRL ,0,xRSH],radius:xRD /2,resolution:16});
    var cube0 = new CSG.cube({corner1:[0,xRSW/2,0],corner2:[xRL,-xRSW/2,xRSSH]});
    var cube1 = new CSG.cube({corner1:[-5,0.5,0],corner2:[xRL,-0.5,xRSH]});
    geom = cyl.union([cube0,cube1]).translate([0,-basW/2,basH]);
    geom = geom.union(geom.mirroredY());
    geom3 = THREE.CSG.fromCSG(geom);
    var xR0 = new THREE.Mesh(geom3,material);
    //var xR1 = xR0.clone(false);
    //xR1.position.set(0,basW,0);
    
    //make randomShape
    //var shop = new CNC4YOU();
    //var randomShape = new shop.shopCube(300,250,250);
    
    var randomShape = new shopCube(300,250,250);
    console.log("length: " + randomShape.length);
    geom = randomShape.makeCsg();
    geom3 = THREE.CSG.fromCSG(geom);
    var ranSh = new THREE.Mesh(geom3,material);

    base.add(xR0);
    xR0.add(ranSh);

    //test rotation... just to check object hierarchy
    //base = base.rotateY(THREE.Math.degToRad(45));
    //base.rotation.y = (THREE.Math.degToRad(45));
    //base.rotation.set(new THREE.Euler( 0, THREE.Math.degToRad(45), 0, 'XYZ' );

}

//animation loop
function animate() {
    //var delta = clock.getDelta();
    requestAnimationFrame( animate );    

    camera.up.set(0,0,1);
    //controls.update();
    render();
    
}

//render function
function render() {

    renderer.render( scene, camera );
}
