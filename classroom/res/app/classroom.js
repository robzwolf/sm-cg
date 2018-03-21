// Wrapper object for all our named stuff
window.CG = {};

// Canvas
CG.canvas = document.getElementById("classroom");

function main() {

    CG.canvas.width  = window.innerWidth;
    CG.canvas.height = window.innerHeight;

    var gl = getWebGLContext(CG.canvas, false); // Remove false to enable debug
    if (!gl) {
        console.error("Failed to get the rendering context for WebGL, falling back on experimental");
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        console.error("Browser does not support WebGL");
        alert("Your browser does not support WebGL.")
    }

    // Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error("Failed to intialise shaders.");
        return;
    }

    // Set the clear canvas colour and enable the depth test
    gl.clearColor(CG.COLORS.sky[0], CG.COLORS.sky[1], CG.COLORS.sky[2], 0.7);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_ModelMatrix  = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    var u_MvpMatrix    = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");

    // Light Colours
    var u_LightColorArr = [null];
    for (var i = 1; i <= 20; i++) {
        u_LightColorArr.push(gl.getUniformLocation(gl.program, "u_LightColor" + i));
    }

    // Light Positions
    var u_LightPosArr = [null];
    for (var i = 1; i <= 20; i++) {
        u_LightPosArr.push(gl.getUniformLocation(gl.program, "u_LightPos" + i));
    }

    var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");

    CG.u_IsTexture = gl.getUniformLocation(gl.program, "u_IsTexture");
    CG.a_Color     = gl.getAttribLocation (gl.program, "a_Color")
    CG.a_Position  = gl.getAttribLocation (gl.program, "a_Position");
    CG.a_Normal    = gl.getAttribLocation (gl.program, "a_Normal");
    CG.a_TexCoord  = gl.getAttribLocation (gl.program, "a_TexCoord");
    CG.u_Sampler   = gl.getUniformLocation(gl.program, "u_Sampler");
    CG.u_Scale     = gl.getUniformLocation(gl.program, "u_Scale")

    gl.uniform1i(CG.u_IsTexture, false);
    gl.uniform1f(CG.u_Scale, 1.0);

    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_AmbientLight) {
        console.error("Failed to get at least one storage location");
        return;
    }

    // Update lights
    function updateLights() {
        for (var i = 1; i <= 20; i++) {
            gl.uniform3f(u_LightColorArr[i],
            (CG.lightColor[i][0]   + CG.redMod)   * CG.LIGHT_ON[i],
            (CG.lightColor[i][1]   + CG.greenMod) * CG.LIGHT_ON[i],
            (CG.lightColor[i][2]   + CG.blueMod)  * CG.LIGHT_ON[i]);
        }
        // gl.uniform3f(u_LightColorArr[1],
        //     (CG.lightColor[1][0]   + CG.redMod)   * CG.LIGHT_ON[1],
        //     (CG.lightColor[1][1]   + CG.greenMod) * CG.LIGHT_ON[1],
        //     (CG.lightColor[2][2]   + CG.blueMod)  * CG.LIGHT_ON[1]);
        // gl.uniform3f(u_LightColorArr[2],
        //     (CG.lightColor[2][0]  + CG.redMod)   * CG.LIGHT_ON[2],
        //     (CG.lightColor[2][1]  + CG.greenMod) * CG.LIGHT_ON[2],
        //     (CG.lightColor[2][2]  + CG.blueMod)  * CG.LIGHT_ON[2]);
        // gl.uniform3f(u_LightColorArr[3],
        //     (CG.lightColor[3][0]  + CG.redMod)   * CG.LIGHT_ON[3],
        //     (CG.lightColor[3][1]  + CG.greenMod) * CG.LIGHT_ON[3],
        //     (CG.lightColor[3][2]  + CG.blueMod)  * CG.LIGHT_ON[3]);
        // gl.uniform3f(u_LightColorArr[4],
        //     (CG.lightColor[4][0]  + CG.redMod)   * CG.LIGHT_ON[4],
        //     (CG.lightColor[4][1]  + CG.greenMod) * CG.LIGHT_ON[4],
        //     (CG.lightColor[4][2]  + CG.blueMod)  * CG.LIGHT_ON[4]);
        // gl.uniform3f(u_LightColorArr[5],
        //     (CG.lightColor[5][0]  + CG.redMod)   * CG.LIGHT_ON[5],
        //     (CG.lightColor[5][1]  + CG.greenMod) * CG.LIGHT_ON[5],
        //     (CG.lightColor[5][2]  + CG.blueMod)  * CG.LIGHT_ON[5]);
        // gl.uniform3f(u_LightColorArr[6],
        //     (CG.lightColor[6][0]  + CG.redMod)   * CG.LIGHT_ON[6],
        //     (CG.lightColor[6][1]  + CG.greenMod) * CG.LIGHT_ON[6],
        //     (CG.lightColor[6][2]  + CG.blueMod)  * CG.LIGHT_ON[6]);
        // gl.uniform3f(u_LightColorArr[7],
        //     (CG.lightColor[7][0]  + CG.redMod)   * CG.LIGHT_ON[7],
        //     (CG.lightColor[7][1]  + CG.greenMod) * CG.LIGHT_ON[7],
        //     (CG.lightColor[7][2]  + CG.blueMod)  * CG.LIGHT_ON[7]);
        // gl.uniform3f(u_LightColorArr[8],
        //     (CG.lightColor[8][0]  + CG.redMod)   * CG.LIGHT_ON[8],
        //     (CG.lightColor[8][1]  + CG.greenMod) * CG.LIGHT_ON[8],
        //     (CG.lightColor[8][2]  + CG.blueMod)  * CG.LIGHT_ON[8]);
        // gl.uniform3f(u_LightColorArr[9],
        //     (CG.lightColor[9][0]  + CG.redMod)   * CG.LIGHT_ON[9],
        //     (CG.lightColor[9][1]  + CG.greenMod) * CG.LIGHT_ON[9],
        //     (CG.lightColor[9][2]  + CG.blueMod)  * CG.LIGHT_ON[9]);
        // gl.uniform3f(u_LightColorArr[10],
        //     (CG.lightColor[10][0] + CG.redMod)   * CG.LIGHT_ON[10],
        //     (CG.lightColor[10][1] + CG.greenMod) * CG.LIGHT_ON[10],
        //     (CG.lightColor[10][2] + CG.blueMod ) * CG.LIGHT_ON[10]);
        // gl.uniform3f(u_LightColorArr[11],
        //     (CG.lightColor[11][0] + CG.redMod)   * CG.LIGHT_ON[11],
        //     (CG.lightColor[11][1] + CG.greenMod) * CG.LIGHT_ON[11],
        //     (CG.lightColor[11][2] + CG.blueMod)  * CG.LIGHT_ON[11]);
        // gl.uniform3f(u_LightColorArr[12],
        //     (CG.lightColor[12][0] + CG.redMod)   * CG.LIGHT_ON[12],
        //     (CG.lightColor[12][1] + CG.greenMod) * CG.LIGHT_ON[12],
        //     (CG.lightColor[12][2] + CG.blueMod)  * CG.LIGHT_ON[12]);
        // gl.uniform3f(u_LightColorArr[13],
        //     (CG.lightColor[13][0] + CG.redMod)   * CG.LIGHT_ON[13],
        //     (CG.lightColor[13][1] + CG.greenMod) * CG.LIGHT_ON[13],
        //     (CG.lightColor[13][2] + CG.blueMod)  * CG.LIGHT_ON[13]);
        // gl.uniform3f(u_LightColorArr[14],
        //     (CG.lightColor[14][0] + CG.redMod)   * CG.LIGHT_ON[14],
        //     (CG.lightColor[14][1] + CG.greenMod) * CG.LIGHT_ON[14],
        //     (CG.lightColor[14][2] + CG.blueMod)  * CG.LIGHT_ON[14]);
        // gl.uniform3f(u_LightColorArr[15],
        //     (CG.lightColor[15][0] + CG.redMod)   * CG.LIGHT_ON[15],
        //     (CG.lightColor[15][1] + CG.greenMod) * CG.LIGHT_ON[15],
        //     (CG.lightColor[15][2] + CG.blueMod)  * CG.LIGHT_ON[15]);
        // gl.uniform3f(u_LightColorArr[16],
        //     (CG.lightColor[16][0] + CG.redMod)   * CG.LIGHT_ON[16],
        //     (CG.lightColor[16][1] + CG.greenMod) * CG.LIGHT_ON[16],
        //     (CG.lightColor[16][2] + CG.blueMod)  * CG.LIGHT_ON[16]);
        // gl.uniform3f(u_LightColorArr[17],
        //     (CG.lightColor[17][0] + CG.redMod)   * CG.LIGHT_ON[17],
        //     (CG.lightColor[17][1] + CG.greenMod) * CG.LIGHT_ON[17],
        //     (CG.lightColor[17][2] + CG.blueMod)  * CG.LIGHT_ON[17]);
        // gl.uniform3f(u_LightColorArr[18],
        //     (CG.lightColor[18][0] + CG.redMod)   * CG.LIGHT_ON[18],
        //     (CG.lightColor[18][1] + CG.greenMod) * CG.LIGHT_ON[18],
        //     (CG.lightColor[18][2] + CG.blueMod)  * CG.LIGHT_ON[18]);
        // gl.uniform3f(u_LightColorArr[19],
        //     (CG.lightColor[19][0] + CG.redMod)   * CG.LIGHT_ON[19],
        //     (CG.lightColor[19][1] + CG.greenMod) * CG.LIGHT_ON[19],
        //     (CG.lightColor[19][2] + CG.blueMod)  * CG.LIGHT_ON[19]);
        // gl.uniform3f(u_LightColorArr[20],
        //     (CG.lightColor[20][0] + CG.redMod)   * CG.LIGHT_ON[20],
        //     (CG.lightColor[20][1] + CG.greenMod) * CG.LIGHT_ON[20],
        //     (CG.lightColor[20][2] + CG.blueMod)  * CG.LIGHT_ON[20]);

        gl.uniform3f(u_AmbientLight, CG.ambLight, CG.ambLight, CG.ambLight);
    }

    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosArr[1],   -20.0, 45.0,  -15.0);
    gl.uniform3f(u_LightPosArr[2],   -20.0, 45.0,  -55.0);
    gl.uniform3f(u_LightPosArr[3],   -20.0, 45.0,  -95.0);
    gl.uniform3f(u_LightPosArr[4],   -20.0, 45.0, -135.0);
    gl.uniform3f(u_LightPosArr[5],   -60.0, 45.0,  -15.0);
    gl.uniform3f(u_LightPosArr[6],   -60.0, 45.0,  -55.0);
    gl.uniform3f(u_LightPosArr[7],   -60.0, 45.0,  -95.0);
    gl.uniform3f(u_LightPosArr[8],   -60.0, 45.0, -135.0);
    gl.uniform3f(u_LightPosArr[9],  -100.0, 45.0,  -15.0);
    gl.uniform3f(u_LightPosArr[10], -100.0, 45.0,  -55.0);
    gl.uniform3f(u_LightPosArr[11], -100.0, 45.0,  -95.0);
    gl.uniform3f(u_LightPosArr[12], -100.0, 45.0, -135.0);
    gl.uniform3f(u_LightPosArr[13], -140.0, 45.0,  -15.0);
    gl.uniform3f(u_LightPosArr[14], -140.0, 45.0,  -55.0);
    gl.uniform3f(u_LightPosArr[15], -140.0, 45.0,  -95.0);
    gl.uniform3f(u_LightPosArr[16], -140.0, 45.0, -135.0);
    gl.uniform3f(u_LightPosArr[17], -180.0, 45.0,  -15.0);
    gl.uniform3f(u_LightPosArr[18], -180.0, 45.0,  -55.0);
    gl.uniform3f(u_LightPosArr[19], -180.0, 45.0,  -95.0);
    gl.uniform3f(u_LightPosArr[20], -180.0, 45.0, -135.0);

    // Set the ambient light level
    gl.uniform3f(u_AmbientLight, CG.ambLight, CG.ambLight, CG.ambLight - 0.2);

    n        = CG.makeCube(gl);
    texCube  = CG.texturedCube(gl, "res/tex/durham.png");
    texCube2 = CG.texturedCube(gl, "res/tex/board.png");
    // texCube3 = CG.texturedCube(gl, "res/tex/slender.jpeg");
    if (n < 0) {
        console.error("Failed to set the vertex information");
        return;
    }

    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();

    // Key Handling
    var keys = {};
    document.onkeydown = function(ev){
        keys[ev.keyCode] = true;
    }
    document.onkeyup = function(ev){
        keys[ev.keyCode] = false;
    }

    // Introduction Lighting
    CG.setupLights();

    // Update scene and draw every frame
    updateCanvas();
    function updateCanvas() {
        requestAnimFrame(updateCanvas);
        findFps();
        // Start drawing
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        CG.updateCameraDirection(); // Initially set camera
        updateLights();
        viewProjMatrix.setPerspective(50.0, CG.canvas.width / CG.canvas.height, 1.0, 700.0);
        viewProjMatrix.lookAt(CG.cameraPosition[0], CG.cameraPosition[1], CG.cameraPosition[2],
            CG.cameraPosition[0] + CG.cameraOrientation[0],
            CG.cameraPosition[1] + CG.cameraOrientation[1],
            CG.cameraPosition[2] + CG.cameraOrientation[2],
            0.0, 1.0, 0);
        // console.log("first time thing", gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw
        CG.checkKeys(keys);
        // checkSlender()
    }
}

/*========================= Lighting ========================= */
// Colour variable definitions
CG.COLORS = {
    "green"     : [0.30, 0.80, 0.50],
    "greyGreen" : [0.23, 0.60, 0.40],
    "grey"      : [0.50, 0.50, 0.50],
    "darkGrey"  : [0.40, 0.40, 0.40],
    "black"     : [0.00, 0.00, 0.00],
    "cream"     : [0.95, 0.90, 0.95],
    "purple"    : [0.60, 0.30, 0.60],
    "brown"     : [0.80, 0.60, 0.43],
    "lightBrown": [0.66, 0.50, 0.30],
    "sky"       : [0.40, 0.90, 0.95],
    "white"     : [1.00, 1.00, 1.00]
}
// var green = [0.3, 0.8, 0.5];
// var greyGreen = [0.23, 0.6, 0.4];
// var grey = [0.5, 0.5, 0.5];
// var darkGrey = [0.4, 0.4, 0.4];
// var black = [0, 0, 0];
// var cream = [0.95, 0.9, 0.95];
// var purple = [0.6, 0.3, 0.6];
// var brown = [0.8, 0.6, 0.43];
// var lightBrown = [0.66, 0.5, 0.3];
// var sky = [0.4, 0.9, 0.95];

//Lights states
// var lightOn = false;
// var lightOn2 = false;
// var lightOn3 = false;
// var lightOn4 = false;
// var lightOn5 = false;
// var lightOn6 = false;
// var lightOn7 = false;
// var lightOn8 = false;
// var lightOn9 = false;
// var lightOn10 = false;
// var lightOn11 = false;
// var lightOn12 = false;
// var lightOn13 = false;
// var lightOn14 = false;
// var lightOn15 = false;
// var lightOn16 = false;
// var lightOn17 = false;
// var lightOn18 = false;
// var lightOn19 = false;
// var lightOn20 = false;

// Light states
CG.LIGHT_ON = [null]
for (var i = 1; i <= 20; i++) {
    CG.LIGHT_ON.push(false);
}

CG.toggleSpecificLights = function(lightsList) {
    lightsList.forEach(function(i) {
        CG.LIGHT_ON[i] = !CG.LIGHT_ON[i];
    });
}

// Light / colour modifiers
CG.redMod         =  0.05;
CG.greenMod       =  0.00;
CG.blueMod        = -0.10;
CG.ambLight       =  0.00;
CG.lightIntensity =  0.50;


CG.lightColor = [null];
for (var j = 1; j <= 20; j++) {
    CG.lightColor.push([CG.lightIntensity, CG.lightIntensity, CG.lightIntensity]);
}

// var lightColor     = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor2    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor3    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor4    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor5    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor6    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor7    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor8    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor9    = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor10   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor11   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor12   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor13   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor14   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor15   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor16   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor17   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor18   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor19   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];
// var lightColor20   = [CG.lightIntensity, CG.lightIntensity, CG.lightIntensity];



/*========================= FPS Checking ========================= */
CG.fps         = 30;
CG.currentTime =  0;
CG.currentFps  =  0;
CG.oldTime     =  0;

function findFps() {
    CG.currentTime = new Date().getTime();
    CG.currentFps++;
    if (CG.currentTime - CG.oldTime >= 1000) {
        // document.getElementById("fps_counter").innerHTML = "<b>FPS: </b>" + Number(CG.currentFps * 1000.0 / (CG.currentTime - CG.oldTime)).toPrecision( 5 );
        //Reset for next calc
        CG.oldTime    = CG.currentTime;
        CG.currentFps = 0;
    }
}

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame /*      ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    */||
    function(callback){
        window.setTimeout(callback, 1000 / CG.fps);
    };
})();

/*========================= Camera Handling ========================= */
// Camera
CG.yAxisRot          = -Math.PI;
CG.xAxisRot          = Math.PI/2;
CG.lookSpeed         = 0.8;
CG.cameraPosition    = [-10.0, 30.0, -10.0];
CG.cameraOrientation = [  0.0,  0.0,   0.0];

// Lock camera to mouse movements
CG.canvas.requestPointerLock = CG.canvas.requestPointerLock;/* ||
CG.canvas.mozRequestPointerLock ||
CG.canvas.webkitRequestPointerLock;*/
document.exitPointerLock = document.exitPointerLock;/* ||
document.mozExitPointerLock ||
document.webkitExitPointerLock;*/
// Start pointer lock
CG.canvas.onclick = function() {
    CG.canvas.requestPointerLock();
}


CG.lockChangeAlert = function() {
    if(document.pointerLockElement === CG.canvas/* ||
       document.mozPointerLockElement === CG.canvas ||
       document.webkitPointerLockElement === CG.canvas*/) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", CG.changeCameraView, false);
    } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", CG.changeCameraView, false);
    }
}

// Hook pointer lock state change events for different browsers
document.addEventListener("pointerlockchange", CG.lockChangeAlert, false);
// document.addEventListener("mozpointerlockchange", CG.lockChangeAlert, false);
// document.addEventListener("webkitpointerlockchange", CG.lockChangeAlert, false);

// Changes camera view based on mouse position changes
CG.changeCameraView = function(e) {
    console.log(e);
    // var movementX = e.movementX; // || e.mozMovementX || e.webkitMovementX || 0;
    // var movementY = e.movementY; // || e.mozMovementY || e.webkitMovementY || 0;
    CG.yAxisRot += e.movementX * CG.lookSpeed * 0.005;
    CG.xAxisRot += e.movementY * CG.lookSpeed * 0.005;
}

// Updates the camera's position + orientation
CG.updateCameraDirection = function() {
    CG.cameraOrientation = [Math.cos(CG.yAxisRot)*Math.sin(CG.xAxisRot), Math.cos(CG.xAxisRot), Math.sin(CG.yAxisRot)*Math.sin(CG.xAxisRot)];
}

// /*========================= Audio ========================= */
// var audio = new Audio("audio/lightOn.mp3");
// var audio2 = new Audio("audio/lightOn2.mp3");
// var audio3 = new Audio("audio/lightOn.mp3");
// var bgNoise = new Audio("audio/faintBuzz.mp3");
// bgNoise.loop = true;
// bgNoise.play();

/*========================= Key Handling ========================= */
// Movement variables
CG.moveSpeed = 1;
CG.doorMove;
CG.blindMove;

CG.checkKeys = function(keys) {
    // console.log(keys);
// function checkKeys(keys) {
    if (keys[87]) {
        // "w" key
        // Move forward at camera direction
        CG.cameraPosition[0] += CG.cameraOrientation[0] * CG.moveSpeed;
        CG.cameraPosition[1] += CG.cameraOrientation[1] * CG.moveSpeed;
        CG.cameraPosition[2] += CG.cameraOrientation[2] * CG.moveSpeed;
    }

    if (keys[83]) {
        // "s" key
        // Move backward at camera direction
        CG.cameraPosition[0] -= CG.cameraOrientation[0] * CG.moveSpeed;
        CG.cameraPosition[1] -= CG.cameraOrientation[1] * CG.moveSpeed;
        CG.cameraPosition[2] -= CG.cameraOrientation[2] * CG.moveSpeed;
    }

    if (keys[68]) {
        // "d" key
        // Move right relative to camera direction
        CG.cameraPosition[0] -= CG.cameraOrientation[2] * CG.moveSpeed;
        CG.cameraPosition[2] += CG.cameraOrientation[0] * CG.moveSpeed;
    }

    if (keys[65]) {
        // "a" key
        // Move left relative to camera direction
        CG.cameraPosition[0] += CG.cameraOrientation[2] * CG.moveSpeed;
        CG.cameraPosition[2] -= CG.cameraOrientation[0] * CG.moveSpeed;
    }

    if (keys[81]) {
        // "q" key
        // Move camera down
        CG.cameraPosition[1] -= CG.moveSpeed;
    }

    if (keys[69]) {
        // "e" key
        // Move camera up
        CG.cameraPosition[1] += CG.moveSpeed;
    }

    if (keys[79]) {
        // "o" key
        // Open door
        clearInterval(CG.doorMove);
        CG.doorMove = setInterval(CG.openDoor, 50);
        keys[79] = false;
    }

    if (keys[80]) {
        // "p" key
        // Close door
        clearInterval(CG.doorMove);
        CG.doorMove = setInterval(CG.closeDoor, 50);
        keys[80] = false;
    }

    if (keys[78]) {
        // "n" key
        // Open blind
        clearInterval(CG.blindMove);
        CG.blindMove = setInterval(CG.openBlinds, 50);
        keys[78] = false;
    }

    if (keys[66]) {
        // "b" key
        // Close blind
        clearInterval(CG.blindMove);
        CG.blindMove = setInterval(CG.closeBlinds, 50);
        keys[66] = false;
    }

    if (keys[49]) {
        // "1" key
        // Toggle lights 1-4
        CG.toggleSpecificLights([1, 2, 3, 4])
        keys[49] = false;
    }

    if (keys[50]) {
        // "2" key
        // Toggle lights 5-8
        CG.toggleSpecificLights([5, 6, 7, 8])
        keys[50] = false;
    }

    if (keys[51]) {
        // "3" key
        // Toggle lights 9-12
        CG.toggleSpecificLights([9, 10, 11, 12])
        keys[51] = false;
    }

    if (keys[52]) {
        // "4" key
        // Toggle lights 13-16
        CG.toggleSpecificLights([13, 14, 15, 16])
        keys[52] = false;
    }

    if (keys[53]) {
        // "5" key
        // Toggle lights 17-20
        CG.toggleSpecificLights([17, 18, 19, 20])
        keys[53] = false;
    }

    if (keys[75]) {
        // "k" key
        // Disco lights on
        CG.discoLights();
    }

    if (keys[76]) {
        // "l" key
        // Normal lights
        CG.normalLights();
    }
}

/*========================= Dynamic Objects ========================= */
//Open / close doors
CG.openDoor = function() {
// function CG.openDoor(){
    doorAngle +=0.05
    if(doorAngle >= 3*Math.PI/4 + 0.1){
        clearInterval(CG.doorMove);
    }
}
CG.closeDoor = function() {
    doorAngle -=0.05
    if(doorAngle <= 0.1){
        doorAngle = 0
        clearInterval(CG.doorMove);
    };
}

//Open/Close blinds
CG.blindSize = 20;
CG.blindMove = setInterval(function () {CG.closeBlinds()}, 50);

CG.openBlinds = function() {
    CG.blindSize -=0.1
    if(CG.blindSize < 0.1) {
        CG.blindSize = 0
        clearInterval(CG.blindMove);
    }
    CG.ambLight +=0.003
    if (CG.ambLight >= 0.4) {
        CG.ambLight = 0.4;
    }
}
CG.closeBlinds = function() {
    CG.blindSize +=0.1
    if(CG.blindSize > 20){
        CG.blindSize = 20
        clearInterval(CG.blindMove);
    };
    CG.ambLight -=0.003
    if (CG.ambLight <= 0){
        CG.ambLight = 0;
    };
}

// setInterval(function () {flickerLight()}, 13000);
// setInterval(function () {flickerLight2()}, 19000);
//
// function flickerLight(){
//     audio2.play();
//     if (lightOn7 = true){
//         lightOn7 = !lightOn7;
//         setTimeout(function(){
//             lightOn7 = !lightOn7;
//         },200);
//     };
// }
//
// function flickerLight2(){
//     audio.play();
//     if (lightOn7 = true){
//         lightOn13 = !lightOn13;
//         setTimeout(function(){
//             lightOn13 = !lightOn13;
//         },200);
//     };
// }

CG.setupLights = function() {
    CG.yAxisRot += 0.4;
    setTimeout(function() { CG.toggleSpecificLights([ 1,  2,  3,  4]); }, 5000);
    setTimeout(function() { CG.toggleSpecificLights([ 5,  6,  7,  8]); }, 4000);
    setTimeout(function() { CG.toggleSpecificLights([ 9, 10, 11, 12]); }, 3000);
    setTimeout(function() { CG.toggleSpecificLights([13, 14, 15, 16]); }, 2000);
    setTimeout(function() { CG.toggleSpecificLights([17, 18, 19, 20]); }, 1000);
}

// Disco Light functionality
CG.discoLights = function() {
    console.log("Disco lights");
    CG.redMod =  Math.random() * (2 - 0) - 1;
    CG.greenMod =  Math.random() * (2 - 0) - 1;
    CG.blueMod =  Math.random() * (2 - 0) - 1;
}
CG.normalLights = function() {
    console.log("norm");
    CG.redMod   =  0.05;
    CG.greenMod =  0.00;
    CG.blueMod  = -0.10;
}

// //Slender Note
// function checkSlender(){
//     if (CG.cameraPosition[0]>-168 && CG.cameraPosition[0]<-153){
//         if (CG.cameraPosition[1]>7.5 && CG.cameraPosition[1]<17.5){
//             if (CG.cameraPosition[2]>-43 && CG.cameraPosition[2]<-27){
//                 console.log("did");
//                 showSlender();
//                 return } } }
//                 hideSlender();
//             }
//
// //Overlay CSS editing
// function showSlender(){
//     document.getElementById("slenderNoteBG").style.position="absolute";
//     document.getElementById("slenderNoteBG").style.top="0";
//     document.getElementById("slenderNoteBG").style.left="0";
//     document.getElementById("slenderNoteBG").style.display="block";
//     document.getElementById("slenderNoteBG").style.paddingLeft="40%";
//     document.getElementById("slenderNoteBG").style.paddingTop="20%";
//     document.getElementById("slenderNoteBG").style.width="100%";
//     document.getElementById("slenderNoteBG").style.height="100%";
//     document.getElementById("slenderNoteBG").style.height="100%";
//     document.getElementById("slenderNoteBG").style.backgroundColor="rgba(1,1,1,0.5)";
//     document.getElementById("slenderNote").style.display="block";
//     document.getElementById("slenderNote").style.width="181px";
//     document.getElementById("slenderNote").style.height="257px";
//     document.getElementById("slenderNote").style.backgroundImage="url(\"textures/slender2.jpeg\")";
//     document.getElementById("slenderNote").style.backgroundSize="100%";
// }
// function hideSlender(){
//     document.getElementById("slenderNoteBG").style.display="none";
//     document.getElementById("slenderNote").style.display="none";
// }

/*========================= Cube handling (coloured and textured) ========================= */
CG.makeCube = function(gl) {
    // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
    var c = {};
    var vertices = new Float32Array([
         0.5,  1.0,  0.5,    -0.5,  1.0,  0.5,    -0.5,  0.0,  0.5,     0.5,  0.0,  0.5,  // V0 V1 V2 V3 Front
         0.5,  1.0,  0.5,     0.5,  0.0,  0.5,     0.5,  0.0, -0.5,     0.5,  1.0, -0.5,  // V0 V3 V4 V5 Right
         0.5,  1.0,  0.5,     0.5,  1.0, -0.5,    -0.5,  1.0, -0.5,    -0.5,  1.0,  0.5,  // V0 V5 V6 V1 Up
        -0.5,  1.0,  0.5,    -0.5,  1.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  0.0,  0.5,  // V1 V6 V7 V2 Left
        -0.5,  0.0, -0.5,     0.5,  0.0, -0.5,     0.5,  0.0,  0.5,    -0.5,  0.0,  0.5,  // V7 V4 V3 V2 Down
         0.5,  0.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  1.0, -0.5,     0.5,  1.0, -0.5   // V4 V7 V6 V5 Back
    ]);

    // Normal
    var normals = new Float32Array([
         0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,  // V0 V1 V2 V3 Front
         1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,  // V0 V3 V4 V5 Right
         0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,  // V0 V5 V6 V1 Up
        -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,  // V1 V6 V7 V2 Left
         0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,  // V7 V4 V3 V2 Down
         0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0   // V4 V7 V6 V5 Back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
         0,  1,  2,    0,  2,  3,    // Front
         4,  5,  6,    4,  6,  7,    // Right
         8,  9, 10,    8, 10, 11,    // Up
        12, 13, 14,   12, 14, 15,    // Left
        16, 17, 18,   16, 18, 19,    // Down
        20, 21, 22,   20, 22, 23     // Back
    ]);
    c.vertexBuffer = CG.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    c.normalBuffer = CG.initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    c.indexBuffer = CG.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    c.numIndices = indices.length;
    c.isTextured = false;

    if (!c.vertexBuffer || !c.indexBuffer || !c.normalBuffer) {
        return null;
    }
    return c;
}

CG.texturedCube = function(gl, imagePath) {
    var t = {};
    // Coordinates (Cube which length of one side is 1 with the origin on the center of the bottom)
    var vertices = new Float32Array([
         0.5,  1.0,  0.5,    -0.5,  1.0,  0.5,    -0.5,  0.0,  0.5,     0.5,  0.0,  0.5,  // V0 V1 V2 V3 Front
         0.5,  1.0,  0.5,     0.5,  0.0,  0.5,     0.5,  0.0, -0.5,     0.5,  1.0, -0.5,  // V0 V3 V4 V5 Right
         0.5,  1.0,  0.5,     0.5,  1.0, -0.5,    -0.5,  1.0, -0.5,    -0.5,  1.0,  0.5,  // V0 V5 V6 V1 Up
        -0.5,  1.0,  0.5,    -0.5,  1.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  0.0,  0.5,  // V1 V6 V7 V2 Left
        -0.5,  0.0, -0.5,     0.5,  0.0, -0.5,     0.5,  0.0,  0.5,    -0.5,  0.0,  0.5,  // V7 V4 V3 V2 Down
         0.5,  0.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  1.0, -0.5,     0.5,  1.0, -0.5   // V4 V7 V6 V5 Back
    ]);

    // Normal
    var normals = new Float32Array([
         0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,  // V0 V1 V2 V3 Front
         1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,  // V0 V3 V4 V5 Right
         0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,  // V0 V5 V6 V1 Up
        -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,  // V1 V6 V7 V2 Left
         0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,  // V7 V4 V3 V2 Down
         0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0   // V4 V7 V6 V5 Back
    ]);

    // Texture coordinates
    var texCoords = new Float32Array([
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // V0 V1 V2 V3 Front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // V0 V3 V4 V5 Right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // V0 V5 V6 V1 Up
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // V1 V6 V7 V2 Left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // V7 V4 V3 V2 Down
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // V4 V7 V6 V5 Back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
         0,  1,  2,    0,  2,  3,    // Front
         4,  5,  6,    4,  6,  7,    // Right
         8,  9, 10,    8, 10, 11,    // Up
        12, 13, 14,   12, 14, 15,    // Left
        16, 17, 18,   16, 18, 19,    // Down
        20, 21, 22,   20, 22, 23     // Back
    ]);

    t.vertexBuffer = CG.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    t.normalBuffer = CG.initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    t.texCoordBuffer = CG.initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    t.indexBuffer = CG.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    t.texture = CG.initTextures(gl, imagePath)
    t.numIndices = indices.length;
    t.isTextured = true;

    if (!t.vertexBuffer || !t.texCoordBuffer || !t.indexBuffer || !t.normalBuffer) {
        return null;
    }
    return t;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

/*========================= DrawShapes ========================= */
//Door position
var doorAngle = 0;

function draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(g_modelMatrix);
    CG.drawFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawWalls(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawBlinds(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawStage(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawDoor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle);
    CG.drawSliders(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawBoards(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawLights(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawTables(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawChairs(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawSkyPlane(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    // drawNote(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();

    // document.getElementById("speed").innerHTML = "<b>Speed (Camera Sensitivity): </b>" + CG.lookSpeed;
    // document.getElementById("camera_coords").innerHTML = "<b>Camera Coordinates: </b>" + CG.cameraPosition[0].toFixed(2) + ", " + CG.cameraPosition[1].toFixed(2) + ", " + CG.cameraPosition[2].toFixed(2);
}

/*========================= Draw Tables ========================= */
CG.drawTables = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(g_modelMatrix);
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 6; k++) {
            CG.drawTable(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -14 + k*-15, 15-(3*k), -37.5 -(75*l));
        };
    };
    CG.drawPodium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160,2,-35);
    g_modelMatrix = CG.popMatrix();
}

CG.drawTable = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);
    //Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            CG.pushMatrix(g_modelMatrix); // Draw Leg 1
            g_modelMatrix.translate(3.5 - (7 * i), 0.0, 30.5 - (61 * j));
            CG.drawBox(gl, n, 0.5, 9.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_modelMatrix = CG.popMatrix();
        };
    };
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);
    // Top
    g_modelMatrix.translate(0.0, 9.0, 0.0); //move to table centre
    CG.pushMatrix(g_modelMatrix);
    CG.drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();

    // Front
    g_modelMatrix.rotate(90.0, 0.0, 0, 90.0);
    g_modelMatrix.translate(-3.5, 3.0, 0.0);
    CG.pushMatrix(g_modelMatrix);
    CG.drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
}

CG.drawPodium = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    // Top
    g_modelMatrix.translate(0.0, 10.0, 0.0); //move to table centre
    CG.pushMatrix(g_modelMatrix);
    CG.drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
    // Front
    g_modelMatrix.rotate(90.0, 0.0, 0, 90.0);
    g_modelMatrix.translate(-7, -7, 0.0);
    CG.pushMatrix(g_modelMatrix);
    CG.drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
    // Sides
    g_modelMatrix.rotate(90.0, 9.0, 0, 0.0);
    g_modelMatrix.translate(0.0, 30.5, -7.0);
    for (var i = 0; i < 2; i++) {
        g_modelMatrix.translate(0.0, -(61.5*i), 0.0);
        CG.pushMatrix(g_modelMatrix);
        CG.drawBox(gl, n, 14.0, 0.5, 14.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        g_modelMatrix = CG.popMatrix();
    };
}

/*========================= Draw Chairs ========================= */
CG.drawChairs = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(g_modelMatrix);
    for (var h = 0; h < 2; h++) {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                CG.drawChair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -10 + i*-15, 15-(3*i),
                -12.5 - (h * 75) + (j * -8.5), 10*i);
            };
        };
    };
    g_modelMatrix = CG.popMatrix();
}

CG.drawChair = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);
    //Legs
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 2; k++) {
            CG.pushMatrix(g_modelMatrix); // Draw Leg 1
            g_modelMatrix.translate(2.5 - (5 * l), 0.0, 2.5 - (5 * k));
            CG.drawBox(gl, n, 0.5, 5.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_modelMatrix = CG.popMatrix();
        };
    };
    // Move to the centre of chair
    g_modelMatrix.translate(0.0, 5.0, 0.0);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.purple[0], CG.COLORS.purple[1], CG.COLORS.purple[2]);
    // Draw Seat
    //gl.uniform1f(CG.u_Scale, 1.0);//change scale
    CG.pushMatrix(g_modelMatrix);
    CG.drawBox(gl, n, 6.0, 0.5, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
    //gl.uniform1f(CG.u_Scale, 1.0);//change back

    // Move back of chair
    g_modelMatrix.translate(2.5, 0.5, 0.0);

    // Draw back of chair
    CG.pushMatrix(g_modelMatrix);
    g_modelMatrix.rotate(90.0, 0.0, 0.5, 0.0);  // Rotate around the y-axis
    CG.drawBox(gl, n, 6.0, 7.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
}

/*========================= Draw Floor/Steps ========================= */
CG.drawFloor = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    g_modelMatrix.setTranslate(-100, -1, -75);
    CG.drawBox(gl, n, 200.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.green[0], CG.COLORS.green[1], CG.COLORS.green[2]);
    g_modelMatrix.setTranslate(-100, -2, -75);
    CG.drawBox(gl, n, 500.0, 1.0, 500.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.drawSteps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.drawSteps = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    CG.pushMatrix(g_modelMatrix);
    for (var p = 1; p < 6; p++) {
        CG.drawStep(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, 3.95 + (p *-15), 13-(3*p), -77.5, n);
    };
    g_modelMatrix = CG.popMatrix();
}

CG.drawStep = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z){
    g_modelMatrix.setTranslate(x, y, z);
    CG.pushMatrix(g_modelMatrix);// Draw Leg 1
    g_modelMatrix.translate(2.5, 0.0, 2.5);
    CG.drawBox(gl, n, 19, 5.0, 149, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
}

CG.drawStage = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkGrey[0], CG.COLORS.darkGrey[1], CG.COLORS.darkGrey[2]);
    g_modelMatrix.setTranslate(-174.5, 0, -75);
    CG.drawBox(gl, n, 49.0, 2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}


/*========================= Draw Room ========================= */
CG.drawWalls = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.cream[0], CG.COLORS.cream[1], CG.COLORS.cream[2]);
    //Back part of door wall
    g_modelMatrix.setTranslate(-56, 0, -149.5);
    CG.drawBox(gl, n, 112.0, 26, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Door wall top panel
    g_modelMatrix.setTranslate(-100, 26, -149.5);
    CG.drawBox(gl, n, 200.0, 24, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Door wall front panel
    g_modelMatrix.setTranslate(-164, 0, -149.5);
    CG.drawBox(gl, n, 72.0, 26, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    //Not door wall
    g_modelMatrix.setTranslate(-10, 0, -0.5);
    for (var i = 0; i < 9; i++) {
        CG.drawBox(gl, n, 20.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        if (i==8){
            break;
        }
        for (var j = 0; j < 2; j++) {
            g_modelMatrix.setTranslate(-22.5 -(25* i), 0 + (j*35), -0.5);
            CG.drawBox(gl, n, 5, 15, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        };
        g_modelMatrix.setTranslate(-10 -(25 * i), 0, -0.5);
    };
    //Front wall
    g_modelMatrix.setTranslate(-199.5, 0, -75);
    g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    CG.drawBox(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Back wall
    g_modelMatrix.setTranslate(0,0,-75);
    g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    CG.drawBox(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //roof
    g_modelMatrix.setTranslate(-100, 50, -75);
    CG.drawBox(gl, n, 200.0, 1, 150, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.drawSliders = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.lightBrown[0], CG.COLORS.lightBrown[1], CG.COLORS.lightBrown[2]);
    g_modelMatrix.setTranslate(-198, 10, -75);
    CG.drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -69.5)
    CG.drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, 139)
    CG.drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.drawBoards = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    g_modelMatrix.setTranslate(-198.5, 11, -109.75);
    CG.drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, 69.5)
    CG.drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(1, 19.5, 0);
    CG.drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -69.5)
    CG.drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.drawBoard = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    CG.pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.greyGreen[0], CG.COLORS.greyGreen[1], CG.COLORS.greyGreen[2]);
    CG.drawBox(gl, texCube2, 0.3, 16, 68, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    g_modelMatrix.translate(0, 0, 0);// Bottom frame
    CG.drawBox(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 16, 0);// Top frame
    CG.drawBox(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, -16, 34); //Left frame
    CG.drawBox(gl, n, 0.5, 16, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -68); //Right frame
    CG.drawBox(gl, n, 0.5, 16, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
}
/*========================= Draw Dynamic Elements ========================= */
CG.drawBlinds = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    for (var i = 0; i < 8; i++) {
        g_modelMatrix.setTranslate(-22.5 -(25* i), 35-(CG.blindSize), -0.5);
        CG.drawBox(gl, n, 5, CG.blindSize, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    };
};

CG.drawDoor = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle){
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);
    g_modelMatrix.setTranslate(0, 0, 0);
    g_modelMatrix.translate(-128 +Math.cos(doorAngle)*8, 0, -149.5 -Math.sin(doorAngle)*8);
    g_modelMatrix.rotate(doorAngle*360/(2*Math.PI), 0, 1, 0);
    CG.drawBox(gl, n, 16.0, 26, 0.7, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.drawLights = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    CG.pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            g_modelMatrix.setTranslate(-20-(40*i), 49.5, -15-(40*j));
            CG.drawBox(gl, n, 2.6, 0.4, 13, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        };
    };
    g_modelMatrix = CG.popMatrix();
}

CG.drawSkyPlane = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    CG.pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
    g_modelMatrix.setTranslate(-200,-20,200);
    CG.drawBox(gl, texCube, 16000, 400, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = CG.popMatrix();
}

// function drawNote(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
//     CG.pushMatrix(g_modelMatrix);
//     gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
//     g_modelMatrix.setTranslate(-160,12.5,-35);
//     g_modelMatrix.rotate(90.0, 0.0, 0.5, 0.0);
//     // CG.drawBox(gl, texCube3, 2.1, 0.05, 2.97, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
//     g_modelMatrix = CG.popMatrix();
// }

/*========================= Draw Matrix ========================= */

CG.g_matrixStack = []; // Array for storing a matrix
CG.pushMatrix = function(m) { // Store the specified matrix to the array
    var _m = new Matrix4(m);
    CG.g_matrixStack.push(_m);
}

CG.popMatrix = function() { // Retrieve the matrix from the array
    return CG.g_matrixStack.pop();
}

// Coordinate transformation matrix for normals
CG.g_normalMatrix = new Matrix4();

/*========================= Draw Box ========================= */
CG.drawBox = function(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(g_modelMatrix);   // Save the model matrix
    // console.log("g_MM is ", g_modelMatrix);
    CG.initAttributeVariable(gl, CG.a_Position, n.vertexBuffer);    // Vertex coordinates
    // console.log("n is ", n);
    CG.initAttributeVariable(gl, CG.a_Normal, n.normalBuffer);  // Texture coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, n.indexBuffer);
    // Scale a cube and draw
    g_modelMatrix.scale(width, height, depth);
    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    CG.g_normalMatrix.setInverseOf(g_modelMatrix);
    CG.g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, CG.g_normalMatrix.elements);

    // console.log("the mysterious "n" is", n);

    if (n.isTextured != false){
        gl.uniform1i(CG.u_IsTexture, true);
        CG.initAttributeVariable(gl, CG.a_TexCoord, n.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, n.texture);
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
        gl.uniform1i(CG.u_IsTexture, false);
    }
    else{
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
    }
    g_modelMatrix = CG.popMatrix();   // Retrieve the model matrix
}
/*========================= Init Arrays ========================= */
CG.initArrayBufferForLaterUse = function(gl, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to create the buffer object");
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Store the necessary information to assign the object to the attribute variable later
    buffer.num = num;
    buffer.type = type;

    return buffer;
}

CG.initElementArrayBufferForLaterUse = function(gl, data, type) {
    // Create a buffer object
    var buf = gl.createBuffer();
    if (!buf) {
        console.error("Failed to create the buf object");
        return null;
    }
    // Write date into the buf object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buf.type = type;

    return buf;
}

CG.initAttributeVariable = function(gl, a_attribute, buf) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(a_attribute, buf.num, buf.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

CG.initTextures = function(gl, imagePath) {
    var tex = gl.createTexture();   // Create a tex object
    if (!tex) {
        console.error("Failed to create the Texture object");
        return null;
    }
    // if (!CG.u_Sampler) {
    //   console.error("Failed to get the storage location of CG.u_Sampler");
    //   return null;
    // }
    var img = new Image();  // Create img object
    if (!img) {
        console.error("Failed to create the Image object");
        return null;
    }
    // Register the event handler to be called when img loading is completed
    img.onload = function() {
        // Write img data to tex object
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the img Y coordinate
        //gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // Pass the tex unit 0 to CG.u_Sampler
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(CG.u_Sampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the tex object
    };

    // Tell the browser to load an Image
    img.src = imagePath;
    return tex;
}
