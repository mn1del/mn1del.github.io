# cnc test test
Test commit
First gh project. Attempting to design a cnc machine using three.js and a version of CSG.js

workflow:
1) build geometry using the openjscad version of csg.js - this version has a few efficiency gains over the original, and a bit of additional functionality (like Connectors). For the individual parts the dimensions and geometry are held in a separate file: shop.js. a constructor creates the part object, and there is a makeCsg() method which returns the CSG.

2) Make copies and convert into THREE geometry using an old version of Chandler Prall's threeCSG.js (note that this isn't his latest version; his latest version uses native boolean functions, as opposed to relying solely on csg.js)

3) make THREE.mesh objects

4) add the mesh into the object hierarchy

5) transform the object in local space as required. transforms will cascade down the hierarchy (hence why CSG Connectors aren't required)

6) render using three.js

7) can manipulate the ciew in the browser via TrackballControls.js ... note that I've added camera.up(0,0,1) in the animation function to enforce gravity 
