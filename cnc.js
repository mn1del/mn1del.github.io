///var clock = new THREE.Clock();
//test test test
//var container, stats;

var camera, cameraTarget, scene, renderer, controls;

init();
animate();

function init() {
    //define a few colors
    var colWhite = new THREE.Color("rgb(100%, 100%, 100%)");
    var colBrown = new THREE.Color("rgb(210,180,140)");
    var colMetal = new THREE.Color("rgb(70%, 70%, 70%)");
    var colConcrete = new THREE.Color("rgb(30%, 30%, 30%)");
    var colBlack = new THREE.Color("rgb(0,0,0)");

    //make materials
    var matConcrete = new THREE.MeshPhongMaterial( { color: colConcrete , specular: 0x111111, shininess: 50 } );
    var matAluminium = new THREE.MeshPhongMaterial( { color: colMetal , specular: 0x111111, shininess: 200 } );
    var matMelamine = new THREE.MeshPhongMaterial( { color: colWhite , specular: 0x111111, shininess: 100 } );
    var matPly = new THREE.MeshPhongMaterial( { color: colBrown , specular: 0x111111, shininess: 0 } );
    var matBlack = new THREE.MeshPhongMaterial( { color: colBlack , specular: 0x111111, shininess: 0 } );

    //dimensions
    //generic clearance - where a clearance gap between moving parts is required, default to this value
    var gClear = 5;

    //main base
    var basL = 1900;
    var basW = 1000;
    var basH = 18;

    //support base //(WICKES LISBURN INTERNAL PLY VENEER DOOR )
    var suppBasL = 1981;
    var suppBasW = 838;
    var suppBasH = 44;

    //x carriage angle
    var xCAW = 76.2;
    var xCAH = 127;
    var xCAT = 6.35;

    //x rail
    var xRL = 1900;
    var xRD = 20;

    //x rail angle
    var xRAL = xRL;
    var xRAH = 50.8;
    var xRAW = 63.5;
    var xRAT = 6.35;

    //x ballscrew mount (made from xCarAng angle)
    var bSMtL = 200;
    var bSMtW = xCAW;
    var bSMtH = xCAH;
    var bSMtT = xCAT;

    //x ballscrew
    var xBSD = 20;
    var xBSL = 1900;

    //x drive arm
    var xDAT = 18;

    //Gantry side - top of runner will reference against
    var gSL = 400; //gantry side length
    var gSRH = xCAH; //ganSide runner height
    var gSTH = 500; //ganSide top height... approximately 500mm above surface of the base
    var gSTW = 120; //top width
    var gST = 18; //thickness
    var gSR = gSTW; //radius of curved inside corner (of the "L" shaped ganSide)
    var gSX = 0; //x-location of the gantry

    //Gantry back
    var gBH = gSTH - (gSRH + gSR);
    var gBT = 18;

    // gantry side angle - angle aluminium
    var gSAH = xRAH;
    var gSAW = xRAW;
    var gSAT = xRAT;
    var gSAL = gSTH - xCAH + xCAT;

    //x drive angle
    var xDAL = gSL/3;

    //y rail
    var yRL = 1004;
    var yRD = 16;

    //y lin bear
    var yLBS = 200;
    var yLBY = yRL/2 - yLBS/2;

    //y ballscrew
    var yBSD = 16;
    var yBSL = 1000;

    //z ballscrew
    var zBSD = 16;
    var zBSL = 597;

    //y carriage angle: 2 pieces of the x carriage angle
    var yCAW = xCAH; //y gantry angle width
    var yCAH = xCAW;
    var yCAT = xCAT;
    var yCAL = 600;

    //z BScrew Mount
    var zBsMtW = xCAW;	
    var zBsMtH = xCAH;	
    var zBsMtT = xCAT;
    var zBsMtL = 100;	
	
    //z Bnut Mt
    var zBsMtW = xCAW;	
    var zBsMtH = xCAH;	
    var zBsMtT = xCAT;
    var zBsMtL = 100;	

    //z rail
    var zRL = 600;
    var zRD = 20;

    //z lin bearings
    var zLBS = 300; //outer span

    //z carriage angle
    var zCAW = xRAH;
    var zCAH = xRAW;
    var zCAT = xRAT;
    var zCAL = yCAL/2;
    var zCAZ = 0;

    //z carriage cap
    var yCCW = xCAW;
    var yCCH = xCAH;
    var yCCT = xCAT;
	
    //y carriage brace
    var yCBW = xRAW;
    var yCBH = xRAH;
    var yCBT = xRAT;	

    //x motor
    var xMotW = 56;
    var xMotL = 56;
    var xMotSD = 8;
    var xMotSL = 24;
    var xMotMtL = bSMtH;

    //y motor
    var yMotW = 56;
    var yMotL = 56;
    var yMotSD = 8;
    var yMotSL = 24;
    var yMotMtL = 150;

    //z motor
    var zMotW = 56;
    var zMotL = 56;
    var zMotSD = 8;
    var zMotSL = 24;
    var zMotMtL = 150;

    //x coupler
    var xCD = 25;
    var xCL = 30;

    //y coupler
    var yCD = 25;
    var yCL = 30;

    //z coupler
    var zCD = 25;
    var zCL = 30;

    //spindle
    var spinD = 80; //diameter


    //project helper functions
    //returns span between inside edges of gantry sides
        function ganSideInSpan() {
            return basW - 2*xRAW +2*(xCAW - xCAT) - 2*gST;
        }
    //outer span of gantry sides
        function ganSideOutSpan() {
            return basW - 2*xRAW +2*(xCAW - xCAT);
        }
    //height from bottom of rail to top of linear bearing
        function railTotHeight(railObject, linBearObject) {
            return railObject.railZPos + (linBearObject.height - linBearObject.railZPos);
        }
    //inner width of y carriage angle
        function yCAInWidth(railObject, linBearObject, spMtObj) {
            return 2*railTotHeight(railObject, linBearObject) + 2*zCAT + spMtObj.width;
        }
    //outer width of y carriage angle
        function yCAOutWidth(railObject, linBearObject, spMtObj) {
            return 2*railTotHeight(railObject, linBearObject) + 2*zCAT + spMtObj.width + 2*yCAT;
        }

    //html container div - to house the WebGL content
    //already made in index.html... an alternative would be to make on the fly here
    var container = document.getElementById("container");
    var cncspace = document.getElementById("cncspace");
    var wid = $("#cncspace").width(); // uses jquery $selector.action() syntax
    var hei =  wid/2; //$("#cncspace").height();

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(wid, hei);
	console.log("width: " + wid + " Height: " + hei);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    cncspace.appendChild( renderer.domElement );
    //container.appendChild( renderer.domElement );

    //create scene (global scope)
    scene = new THREE.Scene();
    scene.background = colWhite ;//new THREE.Color( 0xffffff );
    scene.add(new THREE.AxisHelper(3000)); //axis helper

    //create camera (global scope)
    //and add to scene
    camera = new THREE.PerspectiveCamera( 45, wid / hei, 1, 10000 );
    //camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );
    camera.position.y = -1500;
    //camera.lookAt(new THREE.Vector3(0,0,0));
    //camera.position.z = 200;
    scene.add( camera );

    //add TrackBall controls to the camera
    controls = new THREE.TrackballControls( camera, cncspace);
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
    dirLight.position.set(-500, -300, 1000);
    dirLight.position.normalize();
    scene.add(dirLight);

    var dirLight1 = new THREE.DirectionalLight(colWhite , 0.95);
    dirLight1.position.set(-200, -300, -1000);
    dirLight1.position.normalize();
    scene.add(dirLight1);

/*     var pointLight = new THREE.PointLight(colWhite , 5, 50);
    pointLight.position.set(10, 20, -1000);
    scene.add(pointLight); */

    //Make part objects (from shop.js)
    var baseObj = new shopSlate(basL,basW,basH);
    var suppBaseObj = new shopSheet(suppBasL, suppBasW, suppBasH);
    var xRailAngObj = new shopAluAngle(xRAW,xRAH,xRAT,xRAL);
    var xRailObj = new shopSbrxx(xRL,xRD);
    var xLinBearObj = new shopSbrxxuu(xRD);
    var xCarAngObj = new shopAluAngle(xCAW,xCAH,xCAT,gSL);
    var xBScrwMtObj = new shopAluAngle(bSMtW,bSMtH,bSMtT,bSMtL);
    var xBScrwObj = new shopRmxx05(xBSD, xBSL);
    var xBScrwFixSuppObj = new shopBkxx(xBSD);
    var xBScrwFltSuppObj = new shopBfxx(xBSD);
    var xCouplerObj = new shopCoupler(xMotSD, xBScrwObj.couplerDiam, xCD, xCL);
    var xMotorObj = new shopMotor(xMotW, xMotL, xMotSD, xMotSL);
    var xMotorMtObj = new shopAluAngle(xCAW,xCAH,xCAT,xMotMtL);
    var xBnutObj = new shopBallnut(xBSD);
    var xBnutMtObj = new shopBallnutMount(xBSD);
    var ganSideObj = new shopGantrySide(gSL, gSRH, gSTH, gSTW, gST, gSR);
    var ganBackObj = new shopSheet(ganSideInSpan(),gBT,gBH);
    var ganFrontObj = new shopSheet(ganSideInSpan() + 2*gST,gBT,gBH);
    var ganSideAngObj = new shopAluAngle(gSAW,gSAH,gSAT,gSAL);
    var xDriveArmObj = new shopGantrySide(gSL - (gSTW - gSAH), gSRH + xRAH + basH + xBScrwFixSuppObj.height + 20, gSTH, gSAH, xDAT, gSR);
    var xDriveAngObj = new shopAluAngle(xCAW,xCAH,xCAT,xDAL);
    var yRailObj = new shopSbrxx(yRL,yRD);
    var yLinBearObj = new shopSbrxxuu(yRD);
    var yBScrwObj = new shopRmxx05(yBSD, yBSL);
    var yBScrwFixSuppObj = new shopBkxx(yBSD);
    var yBScrwFltSuppObj = new shopBfxx(yBSD);
    var spMtObj = new shopSpindleMount(spinD);
    var yCarAngObj = new shopAluAngle(yCAW,yCAH,yCAT,yCAL);
    var zRailObj = new shopSbrxx(zRL,zRD);
    var zLinBearObj = new shopSbrxxuu(zRD);
    var zBScrwObj = new shopRmxx05(zBSD, zBSL);
    var zBScrwFixSuppObj = new shopBkxx(zBSD);
    var zBScrwFltSuppObj = new shopBfxx(zBSD);
    var zCarAngObj = new shopAluAngle(zCAW,zCAH,zCAT,zCAL);
    var yCarAngCapObj = new shopAluAngle(yCCW,yCCH,yCCT,yCAOutWidth(zRailObj,zLinBearObj,spMtObj));
    var yCarAngBrcObj = new shopAluAngle(yCBW,yCBH,yCBT,yCAOutWidth(zRailObj,zLinBearObj,spMtObj));
    var yBnutObj = new shopBallnut(yBSD);
    var yBnutMtObj = new shopBallnutMount(yBSD);
    var zBScrwMtObj =  new shopAluAngle(zBsMtW, zBsMtH, zBsMtT, zBsMtL);
    var zBnutObj = new shopBallnut(zBSD);
    var zBnutMtObj = new shopBallnutMount(zBSD);
	
    //make CSGs, and where applicable copies, to be merged into a single geometry
    var baseCsg = baseObj.makeCsg();
        baseCsg = baseCsg.center("y");
    var suppBaseCsg = suppBaseObj.makeCsg().center("x,","y");
    var xRailAngCsg = xRailAngObj.makeCsg();
        xRailAngCsg = xRailAngCsg.mirroredY().translate([0,xRailAngObj.width,0]);
        xRailAngCsg = xRailAngCsg.union(xRailAngCsg.mirroredY().translate([0,baseObj.width,0])).center("y");
    var xRailCsg = xRailObj.makeCsg();
        xRailCsg = xRailCsg.union(xRailCsg.translate([0,baseObj.width + xRailObj.width - 2*(xRailAngObj.inWidth - xRAT),0])).center("y"); //outside of linear bearings set equal to yRail length
    var xLinBearCsg = xLinBearObj.makeCsg();
        xLinBearCsg = xLinBearCsg.union(xLinBearCsg.translate([gSL - xLinBearObj.length,0,0]));
        xLinBearCsg = xLinBearCsg.union(xLinBearCsg.translate([0,baseObj.width + xRailObj.width - 2*(xRailAngObj.inWidth - xRAT),0])).center("y");
    var xCarAngCsg = xCarAngObj.makeCsg();
        xCarAngCsg = xCarAngCsg.union(xCarAngCsg.mirroredY().translate([0,ganSideOutSpan() + 2*xCAT])).center("y");
    var xBScrwFixSuppCsg = xBScrwFixSuppObj.makeCsg();
        xBScrwFixSuppCsg = xBScrwFixSuppCsg.union(xBScrwFixSuppCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y").mirroredZ().mirroredX();
    var xBScrwFltSuppCsg = xBScrwFltSuppObj.makeCsg();
        xBScrwFltSuppCsg = xBScrwFltSuppCsg.union(xBScrwFltSuppCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y").mirroredZ();
    var xBScrwCsg = xBScrwObj.makeCsg();
        xBScrwCsg = xBScrwCsg.union(xBScrwCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y").mirroredX();
    var xBScrwMtCsg = xBScrwMtObj.makeCsg();
        xBScrwMtCsg = xBScrwMtCsg.mirroredZ().mirroredY().translate([0,bSMtW,0]);
        xBScrwMtCsg = xBScrwMtCsg.union(xBScrwMtCsg.translate([xBSL - bSMtL + xBScrwFltSuppObj.thick - xBScrwObj.threadFltNub,0,0]));
//         xBScrwMtCsg = xBScrwMtCsg.union(xBScrwMtCsg.translate([suppBasL - bSMtL,0,0]));
        xBScrwMtCsg = xBScrwMtCsg.union(xBScrwMtCsg.mirroredY().translate([0,suppBasW + 2*bSMtW + 2*xCAT,0])).center("y");
    var xCouplerCsg = xCouplerObj.makeCsg();
        xCouplerCsg = xCouplerCsg.mirroredX().union(xCouplerCsg.mirroredX().translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y");
    var xMotorCsg = xMotorObj.makeCsg().mirroredX().translate([xMotL + xMotSL,0,0]);
        xMotorCsg = xMotorCsg.union(xMotorCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y");
    var xMotorMtCsg = xMotorMtObj.makeCsg().mirroredY().rotateY(-90);
        xMotorMtCsg = xMotorMtCsg.union(xMotorMtCsg.translate([0,suppBasW + xCAW,0])).center("y");
    var xBnutCsg = xBnutObj.makeCsg();
        xBnutCsg = xBnutCsg.union(xBnutCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y");
    var xBnutMtCsg = xBnutMtObj.makeCsg();
        xBnutMtCsg = xBnutMtCsg.union(xBnutMtCsg.translate([0,suppBasW + xBScrwFixSuppObj.width + 2*bSMtT + 2*xCAT,0])).center("y");
    var ganSideCsg = ganSideObj.makeCsg();
        ganSideCsg = ganSideCsg.union(ganSideCsg.translate([0, ganSideInSpan() + gST,0])).center("y");
    var ganBackCsg = ganBackObj.makeCsg().rotateZ(90).center("y");
    var ganFrontCsg = ganFrontObj.makeCsg().rotateZ(90).translate([gBT ,0,0]).center("y").mirroredX();
    var ganSideAngCsg = ganSideAngObj.makeCsg().rotateY(-90);
        ganSideAngCsg = ganSideAngCsg.union(ganSideAngCsg.mirroredY().translate([0,ganSideOutSpan()+ 2*gSAT,0])).center("y");
    var xDriveArmCsg = xDriveArmObj.makeCsg();
        xDriveArmCsg = xDriveArmCsg.union(xDriveArmCsg.translate([0,ganSideOutSpan() + gST + 2*gSAT,0])).center("y");
    var xDriveAngCsg = xDriveAngObj.makeCsg();
        xDriveAngCsg = xDriveAngCsg.union(xDriveAngCsg.mirroredY().translate([0,ganSideOutSpan() + 2*xCAT,0])).center("y");
    var yRailCsg = yRailObj.makeCsg();
        yRailCsg = yRailCsg.rotateX(-90).rotateZ(90);
        yRailCsg = yRailCsg.union(yRailCsg.translate([0,0,gBH - yRailObj.width])).center("y");
    var yLinBearCsg = yLinBearObj.makeCsg();
        yLinBearCsg = yLinBearCsg.union(yLinBearCsg.translate([yLBS - yLinBearObj.length,0,0]));
        yLinBearCsg = yLinBearCsg.union(yLinBearCsg.translate([0,gBH - yRailObj.width,0]));
        yLinBearCsg = yLinBearCsg.rotateX(90).rotateZ(90).mirroredX().center("y");
    var yBScrwFixSuppCsg = yBScrwFixSuppObj.makeCsg().rotateZ(-90).rotateY(-90);
    var yBScrwFltSuppCsg = yBScrwFltSuppObj.makeCsg().rotateZ(90).rotateY(-90);
    var yBScrwCsg = yBScrwObj.makeCsg().rotateZ(-90).mirroredY().translate([0, -yBSL +yBScrwObj.threadLength/2 + yBScrwObj.threadFltNub, 0]);
    var spMtCsg = spMtObj.makeCsg().rotateZ(-90).rotateY(-90).center("y");
    var zRailCsg = zRailObj.makeCsg().rotateY(-90).rotateZ(-90);
        zRailCsg = zRailCsg.union(zRailCsg.mirroredY().translate([0,yCAInWidth(zRailObj, zLinBearObj, spMtObj),0])).center("y");
    var zLinBearCsg = zLinBearObj.makeCsg().rotateY(-90).rotateZ(-90);
        zLinBearCsg = zLinBearCsg.union(zLinBearCsg.translate([0,0,zLBS - zLinBearObj.length]));
        zLinBearCsg = zLinBearCsg.union(zLinBearCsg.mirroredY().translate([0,yCAInWidth(zRailObj, zLinBearObj, spMtObj) - 2*(zRailObj.railZPos - zLinBearObj.railZPos),0])).center("y");
    var yCarAngCsg = yCarAngObj.makeCsg().rotateY(-90);
        yCarAngCsg = yCarAngCsg.union(yCarAngCsg.mirroredY().translate([0,2*yCAT + yCAInWidth(zRailObj, zLinBearObj, spMtObj),0])).center("y");
    var yCarAngCapCsg = yCarAngCapObj.makeCsg().mirroredZ().rotateZ(-90);	
    var yCarAngBrcCsg = yCarAngBrcObj.makeCsg().mirroredZ().rotateZ(-90).center("y");	
    var yBnutCsg = yBnutObj.makeCsg().rotateZ(90).rotateY(90);
    var yBnutMtCsg = yBnutMtObj.makeCsg().rotateZ(90).rotateY(90);
    var zCarAngCsg = zCarAngObj.makeCsg().rotateY(-90);
	zCarAngCsg = zCarAngCsg.union(zCarAngCsg.mirroredY().translate([0,yCAInWidth(zRailObj,zLinBearObj,spMtObj) - 2*railTotHeight(zRailObj,zLinBearObj),0])).center("y");
    var zBScrwMtCsg = zBScrwMtObj.makeCsg().rotateY(-90).rotateZ(90);
        zBScrwMtCsg = zBScrwMtCsg.union(zBScrwMtCsg.translate([0,0,yCAL - zBsMtL]));
    var zBScrwFixSuppCsg = zBScrwFixSuppObj.makeCsg().rotateY(-90);
    var zBScrwFltSuppCsg = zBScrwFltSuppObj.makeCsg().rotateY(-90);
    var zBScrwCsg = zBScrwObj.makeCsg().rotateY(90).translate([0,0,zBSL]);
    var zBnutCsg = zBnutObj.makeCsg().rotateY(90); //leaves flange at top for weight bearing
    var zBnutMtCsg = zBnutMtObj.makeCsg().rotateY(90);

    //make THREE meshes, assemble and position
    var geom3;
    //base
        geom3 = THREE.CSG.fromCSG(baseCsg);
        var base = new THREE.Mesh(geom3,matConcrete);
        scene.add(base);
    //support base
        geom3 = THREE.CSG.fromCSG(suppBaseCsg);
        var suppBase = new THREE.Mesh(geom3,matPly);
        base.add(suppBase);
        suppBase.position.set(0,0,-suppBasH);
    //xRailAng
        geom3 = THREE.CSG.fromCSG(xRailAngCsg);
        var xRailAng = new THREE.Mesh(geom3,matAluminium);
        base.add(xRailAng);
        xRailAng.position.set(0,0,baseObj.thick);
    //xRails
        geom3 = THREE.CSG.fromCSG(xRailCsg);
        var xRails = new THREE.Mesh(geom3,matAluminium);
        xRailAng.add(xRails);
        xRails.position.set(0,0,xRAT);
    //xLinBears
        geom3 = THREE.CSG.fromCSG(xLinBearCsg);
        var xLinBears = new THREE.Mesh(geom3,matAluminium);
        xRails.add(xLinBears);
        xLinBears.position.set(gSX,0,xRailObj.railZPos - xLinBearObj.railZPos);
    //x carriage angle
        geom3 = THREE.CSG.fromCSG(xCarAngCsg);
        var xCarAng = new THREE.Mesh(geom3,matAluminium);
        xLinBears.add(xCarAng);
        xCarAng.position.set(0,0,xLinBearObj.height);
    //x ballscrew mount
        geom3 = THREE.CSG.fromCSG(xBScrwMtCsg);
        var xBScrwMt = new THREE.Mesh(geom3,matAluminium);
        base.add(xBScrwMt);
    //x ballscrew fixed support
        geom3 = THREE.CSG.fromCSG(xBScrwFixSuppCsg);
        var xBScrwFixSupp = new THREE.Mesh(geom3,matAluminium);
        xBScrwMt.add(xBScrwFixSupp);
        xBScrwFixSupp.position.set(xBScrwFltSuppObj.thick + xBScrwFixSuppObj.thick + xBScrwObj.threadEnd - xBScrwObj.threadStart,0,-bSMtT);
    //x ballscrew floating support
        geom3 = THREE.CSG.fromCSG(xBScrwFltSuppCsg);
        var xBScrwFltSupp = new THREE.Mesh(geom3,matAluminium);
        xBScrwMt.add(xBScrwFltSupp);
        xBScrwFltSupp.position.set(0,0,-bSMtT);
    //x ballscrew
        geom3 = THREE.CSG.fromCSG(xBScrwCsg);
        var xBScrw = new THREE.Mesh(geom3,matAluminium);
        xBScrwFltSupp.add(xBScrw);
        xBScrw.position.set(xBScrwObj.length + xBScrwFltSuppObj.thick - xBScrwObj.threadFltNub,0,-xBScrwFixSuppObj.bscrewZPos);
    //x coupler
        geom3 = THREE.CSG.fromCSG(xCouplerCsg);
        var xCoupler = new THREE.Mesh(geom3,matAluminium);
        xBScrw.add(xCoupler);
    //x motor
        geom3 = THREE.CSG.fromCSG(xMotorCsg);
        var xMotor = new THREE.Mesh(geom3,matBlack);
        xBScrw.add(xMotor);
    //x motor mount
        geom3 = THREE.CSG.fromCSG(xMotorMtCsg);
        var xMotorMt = new THREE.Mesh(geom3,matAluminium);
        xMotor.add(xMotorMt);
        xMotorMt.position.set(xMotSL ,0,-xCAH + xBScrwFltSuppObj.bscrewZPos + bSMtT);
    //x ballnut
        geom3 = THREE.CSG.fromCSG(xBnutCsg);
        var xBnut = new THREE.Mesh(geom3,matAluminium);
        xBScrw.add(xBnut);
        xBnut.position.set(gSX + gSL/2 - xBnutObj.flangeThick - xBnutMtObj.length/2 - xBScrwObj.length,0,0);
    //x ballnut mount
        geom3 = THREE.CSG.fromCSG(xBnutMtCsg);
        var xBnutMt = new THREE.Mesh(geom3,matAluminium);
        xBnut.add(xBnutMt);
        xBnutMt.position.set(xBnutObj.flangeThick,0,0);
    //gantry sides
        geom3 = THREE.CSG.fromCSG(ganSideCsg);
        var ganSides = new THREE.Mesh(geom3,matPly);
        xCarAng.add(ganSides);
        ganSides.position.set(0,0,xCAT);
    //gantry back
        geom3 = THREE.CSG.fromCSG(ganBackCsg);
        var ganBack = new THREE.Mesh(geom3,matPly);
        ganSides.add(ganBack);
        ganBack.position.set(gSL,0,gSTH - gBH);
    //gantry front
        geom3 = THREE.CSG.fromCSG(ganFrontCsg);
        var ganFront = new THREE.Mesh(geom3,matPly);
        ganSides.add(ganFront);
        ganFront.position.set(gSL - gSTW,0,gSTH - gBH);
    //gantry side reinforcement angle
        geom3 = THREE.CSG.fromCSG(ganSideAngCsg);
        var ganSideAng = new THREE.Mesh(geom3,matAluminium);
        ganSides.add(ganSideAng);
        ganSideAng.position.set(gSL + gSAT,0,xCarAngObj.inHeight);
    //x drive arm
        geom3 = THREE.CSG.fromCSG(xDriveArmCsg);
        var xDriveArm = new THREE.Mesh(geom3,matPly);
        ganSides.add(xDriveArm);
        xDriveArm.position.set(gSTW - gSAH + gSAT, 0, gSRH - xDriveArmObj.runnerHeight -20);
    //x Drive angle
        geom3 = THREE.CSG.fromCSG(xDriveAngCsg);
        var xDriveAng = new THREE.Mesh(geom3,matAluminium);
        xBnutMt.add(xDriveAng);
        xDriveAng.position.set(xBnutMtObj.length/2 - xDAL/2, 0, - xBnutMtObj.height/2 -xCAT);
    //y Rails
        geom3 = THREE.CSG.fromCSG(yRailCsg);
        var yRails = new THREE.Mesh(geom3,matAluminium);
        ganFront.add(yRails);
        yRails.position.set(-gBT,0,yRailObj.width/2);
    //y lin bearings
        geom3 = THREE.CSG.fromCSG(yLinBearCsg);
        var yLinBears = new THREE.Mesh(geom3,matAluminium);
        yRails.add(yLinBears);
        yLinBears.position.set(-(yRailObj.railZPos - yLinBearObj.railZPos),yLBY - yBScrwObj.threadLength/2,0);
    //y ballscrew
        geom3 = THREE.CSG.fromCSG(yBScrwCsg);
        var yBScrw = new THREE.Mesh(geom3,matAluminium);
        ganFront.add(yBScrw);
        yBScrw.position.set(-gBT - yBScrwFixSuppObj.bscrewZPos,0,gBH/2);
    //y ballscrew floating support
        geom3 = THREE.CSG.fromCSG(yBScrwFltSuppCsg);
        var yBScrwFltSupp = new THREE.Mesh(geom3,matAluminium);
        yBScrw.add(yBScrwFltSupp);
        yBScrwFltSupp.position.set(yBScrwFltSuppObj.bscrewZPos, yBScrwObj.threadLength/2,0);
    //y ballscrew fixed support
        geom3 = THREE.CSG.fromCSG(yBScrwFixSuppCsg);
        var yBScrwFixSupp = new THREE.Mesh(geom3,matAluminium);
        yBScrwFltSupp.add(yBScrwFixSupp);
        yBScrwFixSupp.position.set(0, - yBScrwObj.threadLength - yBScrwFixSuppObj.thick2,0);
    //y carriage angle
        geom3 = THREE.CSG.fromCSG(yCarAngCsg);
        var yCarAng = new THREE.Mesh(geom3,matAluminium);
        yLinBears.add(yCarAng);
        yCarAng.position.set(-yLinBearObj.height,0,-yLinBearObj.width/2);
    //y carriage angle cap
        geom3 = THREE.CSG.fromCSG(yCarAngCapCsg);
        var yCarAngCap = new THREE.Mesh(geom3,matAluminium);
        yCarAng.add(yCarAngCap);
        yCarAngCap.position.set(0,yCAOutWidth(zRailObj,zLinBearObj,spMtObj)/2,yCAL);
    //y carriage angle brace 
        geom3 = THREE.CSG.fromCSG(yCarAngBrcCsg);
        var yCarAngBrc = new THREE.Mesh(geom3,matAluminium);
        yCarAng.add(yCarAngBrc);
        yCarAngBrc.position.set(0,0,gBH + yCBH + (yLinBearObj.width - yRailObj.width)/2 );
    //z rails
        geom3 = THREE.CSG.fromCSG(zRailCsg);
        var zRails = new THREE.Mesh(geom3,matAluminium);
        yCarAng.add(zRails);
        zRails.position.set(zRailObj.width/2 - yCAH,0,0); //positioning assumed to be one carriage angle thickness inside the yCA
    //z lin Bearings
        geom3 = THREE.CSG.fromCSG(zLinBearCsg);
        var zLinBears = new THREE.Mesh(geom3,matAluminium);
        zRails.add(zLinBears);
	zLinBears.position.set(0,0,zCAZ);
    //y ballnut
        geom3 = THREE.CSG.fromCSG(yBnutCsg);
        var yBnut = new THREE.Mesh(geom3,matAluminium);
        yBScrw.add(yBnut);
        yBnut.position.set(0, yLBY - yBScrwObj.threadLength/2 - yBnutObj.flangeThick + (yCAInWidth(zRailObj, zLinBearObj, spMtObj)/2 - yCAW - yCAT) + yBnutMtObj.length/2, 0);
    //y ballnut mount
        geom3 = THREE.CSG.fromCSG(yBnutMtCsg);
        var yBnutMt = new THREE.Mesh(geom3,matAluminium);
        yBnut.add(yBnutMt);
        yBnutMt.position.set(0,yBnutObj.flangeThick,0);
    //z carriage angle	
        geom3 = THREE.CSG.fromCSG(zCarAngCsg);
        var zCarAng = new THREE.Mesh(geom3,matAluminium);
        zLinBears.add(zCarAng);
        zCarAng.position.set(zCAH - zLinBearObj.width/2 ,0,0);
    // spindle mount
        geom3 = THREE.CSG.fromCSG(spMtCsg);
        var spMt = new THREE.Mesh(geom3,matAluminium);
        zCarAng.add(spMt);
        spMt.position.set(-zCAT,0,0);
    // z ballscrew mount
        geom3 = THREE.CSG.fromCSG(zBScrwMtCsg);
        var zBScrwMt = new THREE.Mesh(geom3,matAluminium);
        yCarAng.add(zBScrwMt);
        zBScrwMt.position.set(0,-yCAOutWidth(zRailObj, zLinBearObj, spMtObj)/2,0);
    //z ballscrew floating support
        geom3 = THREE.CSG.fromCSG(zBScrwFltSuppCsg);
        var zBScrwFltSupp = new THREE.Mesh(geom3,matAluminium);
        zBScrwMt.add(zBScrwFltSupp);
        zBScrwFltSupp.position.set(-zBsMtT, -zBsMtT - zBScrwFltSuppObj.width/2,0);
    //z ballscrew fixed support
        geom3 = THREE.CSG.fromCSG(zBScrwFixSuppCsg);
        var zBScrwFixSupp = new THREE.Mesh(geom3,matAluminium);
        zBScrwFltSupp.add(zBScrwFixSupp);
        zBScrwFixSupp.position.set(0, 0,  zBScrwObj.threadLength + zBScrwFixSuppObj.thick + zBScrwFixSuppObj.thick2,0);
    //z ballscrew
        geom3 = THREE.CSG.fromCSG(zBScrwCsg);
        var zBScrw = new THREE.Mesh(geom3,matAluminium);
        zBScrwFltSupp.add(zBScrw);
        zBScrw.position.set(-zBScrwFltSuppObj.bscrewZPos,0,zBScrwFltSuppObj.thick -zBScrwObj.threadFltNub);
    // ballnut
        geom3 = THREE.CSG.fromCSG(zBnutCsg);
        var zBnut = new THREE.Mesh(geom3,matAluminium);
        zBScrw.add(zBnut);
        zBnut.position.set(0,0,zLBS/2 + zBnutObj.flangeThick);
    //z ballnut mount
        geom3 = THREE.CSG.fromCSG(zBnutMtCsg);
        var zBnutMt = new THREE.Mesh(geom3,matAluminium);
        zBnut.add(zBnutMt);
        zBnutMt.position.set(0,-zBnutObj.flangeThick,0);
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

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    var wid = $("#cncspace").width(); // uses jquery $selector.action() syntax
    var hei =  wid/2; //$("#cncspace").height();
	
    camera.aspect = wid / hei;
    camera.updateProjectionMatrix();

    renderer.setSize( wid, hei );
}
