// Wrapper object for all our named stuff
window.CG = {
    "hardURL": {
        // "sky": "res/tex/durham.png",
        // "sky": "res/tex/rainbow.png",
        "sky": "res/tex/long-thin.jpg",
        "board": "res/tex/board_grad1.jpg"
    },
    draw: {}
};

// Canvas
CG.canvas = document.getElementById("classroom");

function main() {

    CG.canvas.width  = window.innerWidth;
    CG.canvas.height = window.innerHeight;

    window.gl = CG.canvas.getContext("webgl2");

    if (!window.gl) {
        console.error("Failed to get the rendering context for WebGL2, falling back on WebGL1");
        window.gl = CG.canvas.getContext("webgl");
    }

    if (!window.gl) {
        console.error("Failed to get the rendering context for WebGL, falling back on experimental");
        window.gl = CG.canvas.getContext("experimental-webgl");
    }

    if (!window.gl) {
        console.error("Browser does not support WebGL");
        alert("Your browser does not support WebGL.");
        return;
    }

    console.log("Got some WebGL context.");

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
    gl.uniform3f(u_AmbientLight, CG.ambLight, CG.ambLight, CG.ambLight + 0.2);

    n        = CG.makeCube(gl);
    texCube  = CG.texturedCube(gl, CG.hardURL.sky);
    texCube2 = CG.texturedCube(gl, CG.hardURL.board);
    if (n < 0) {
        console.error("Failed to set the vertex information");
        return;
    }

    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();

    // Key press handling
    var keys = {};
    window.onkeydown = function(e) {
        keys[e.keyCode] = true;
    }
    window.onkeyup = function(e) {
        keys[e.keyCode] = false;
    }

    // Setup introductory Lights
    CG.staggerLighting();

    // Update scene and draw every frame
    updateCanvas();

    function updateCanvas() {
        requestAnimFrame(updateCanvas);
        CG.findFps();

        // Start drawing
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Initially set camera
        CG.updateCameraDirection();
        updateLights();

        viewProjMatrix.setPerspective(50.0, CG.canvas.width / CG.canvas.height, 1.0, 700.0);
        viewProjMatrix.lookAt(CG.cameraPosition[0], CG.cameraPosition[1], CG.cameraPosition[2],
            CG.cameraPosition[0] + CG.cameraOrientation[0],
            CG.cameraPosition[1] + CG.cameraOrientation[1],
            CG.cameraPosition[2] + CG.cameraOrientation[2],
            0.0, 1.0, 0);

        // Draw scene
        CG.draw.all(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Handle key presses
        CG.checkKeys(keys);
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


/*========================= FPS Checking ========================= */
CG.fps         = 30;
CG.currentTime =  0;
CG.currentFps  =  0;
CG.oldTime     =  0;

CG.findFps = function() {
    CG.currentTime = new Date().getTime();
    CG.currentFps++;
    if (CG.currentTime - CG.oldTime >= 1000) {
        // document.getElementById("fps_counter").innerHTML = "<b>FPS: </b>" + Number(CG.currentFps * 1000.0 / (CG.currentTime - CG.oldTime)).toPrecision( 5 );
        //Reset for next calc
        CG.oldTime    = CG.currentTime;
        CG.currentFps = 0;
    }
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || function(callback) { setTimeout(callback, 1000 / CG.fps); };
})();

/*========================= Camera Handling ========================= */
// Camera
CG.yAxisRot          = -Math.PI;
CG.xAxisRot          = Math.PI/2;
CG.lookSpeed         = 0.8;
CG.cameraPosition    = [-10.0, 30.0, -10.0];
CG.cameraOrientation = [  0.0,  0.0,   0.0];

// Start pointer lock
CG.canvas.onclick = function() {
    CG.canvas.requestPointerLock();
}

CG.lockChangeAlert = function() {
    if (document.pointerLockElement === CG.canvas) {
        console.log("Pointer locked");
        document.addEventListener("mousemove", CG.changeCameraView, false);
    } else {
        console.log("Pointer unlocked");
        document.removeEventListener("mousemove", CG.changeCameraView, false);
    }
}

// Listen for pointer lock change
document.addEventListener("pointerlockchange", CG.lockChangeAlert, false);

// Changes camera view based on mouse position changes
CG.changeCameraView = function(e) {
    CG.yAxisRot += e.movementX * CG.lookSpeed * 0.005;
    CG.xAxisRot += e.movementY * CG.lookSpeed * 0.005;
}

// Update the camera's position and orientation
CG.updateCameraDirection = function() {
    CG.cameraOrientation = [
        Math.cos(CG.yAxisRot)*Math.sin(CG.xAxisRot),
        Math.cos(CG.xAxisRot),
        Math.sin(CG.yAxisRot)*Math.sin(CG.xAxisRot)
    ];
}

/*========================= Key Handling ========================= */
// Movement variables
CG.moveSpeed = 1;

CG.checkKeys = function(keys) {
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
// Open / close doors
CG.openDoor = function() {
    CG.doorAngle +=0.05
    if (CG.doorAngle >= 3*Math.PI/4 + 0.1) {
        clearInterval(CG.doorMove);
    }
}
CG.closeDoor = function() {
    CG.doorAngle -= 0.05
    if (CG.doorAngle <= 0.1) {
        CG.doorAngle = 0
        clearInterval(CG.doorMove);
    }
}

// Open / close blinds
CG.blindSize = 20;
CG.blindMove = setInterval(function () {CG.closeBlinds()}, 50);

CG.openBlinds = function() {
    CG.blindSize -= 0.1
    if (CG.blindSize < 0.1) {
        CG.blindSize = 0;
        clearInterval(CG.blindMove);
    }
    CG.ambLight += 0.003
    if (CG.ambLight >= 0.4) {
        CG.ambLight = 0.4;
    }
}
CG.closeBlinds = function() {
    CG.blindSize += 0.1;
    if (CG.blindSize > 20) {
        CG.blindSize = 20
        clearInterval(CG.blindMove);
    }
    CG.ambLight -= 0.003;
    if (CG.ambLight <= 0) {
        CG.ambLight = 0;
    }
}


CG.staggerLighting = function() {
    CG.yAxisRot += 0.4;
    setTimeout(function() { CG.toggleSpecificLights([ 1,  2,  3,  4]); }, 1000);
    setTimeout(function() { CG.toggleSpecificLights([ 5,  6,  7,  8]); },  800);
    setTimeout(function() { CG.toggleSpecificLights([ 9, 10, 11, 12]); },  600);
    setTimeout(function() { CG.toggleSpecificLights([13, 14, 15, 16]); },  400);
    setTimeout(function() { CG.toggleSpecificLights([17, 18, 19, 20]); },  200);
}

// Disco light functionality
CG.discoLights = function() {
    console.log("Disco lights");
    CG.redMod   =  CG.randomIntFromInterval(-1, 1);//Math.random() * (2 - 0) - 1;
    CG.greenMod =  CG.randomIntFromInterval(-1, 1);//Math.random() * (2 - 0) - 1;
    CG.blueMod  =  CG.randomIntFromInterval(-1, 1);//Math.random() * (2 - 0) - 1;
}

CG.normalLights = function() {
    console.log("norm");
    CG.redMod   =  0.05;
    CG.greenMod =  0.00;
    CG.blueMod  = -0.10;
}


/*========================= Cube handling (coloured and textured) ========================= */
CG.makeCube = function(gl) {
    // Coordinates (cube of side length 1, origin on the centre of the bottom)
    var c = {};

    var vertices = new Float32Array([
         0.5,  1.0,  0.5,    -0.5,  1.0,  0.5,    -0.5,  0.0,  0.5,     0.5,  0.0,  0.5,  // V0 V1 V2 V3 Front
         0.5,  1.0,  0.5,     0.5,  0.0,  0.5,     0.5,  0.0, -0.5,     0.5,  1.0, -0.5,  // V0 V3 V4 V5 Right
         0.5,  1.0,  0.5,     0.5,  1.0, -0.5,    -0.5,  1.0, -0.5,    -0.5,  1.0,  0.5,  // V0 V5 V6 V1 Up
        -0.5,  1.0,  0.5,    -0.5,  1.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  0.0,  0.5,  // V1 V6 V7 V2 Left
        -0.5,  0.0, -0.5,     0.5,  0.0, -0.5,     0.5,  0.0,  0.5,    -0.5,  0.0,  0.5,  // V7 V4 V3 V2 Down
         0.5,  0.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  1.0, -0.5,     0.5,  1.0, -0.5   // V4 V7 V6 V5 Back
    ]);

    // Normals
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
         0,  1,  2,     0,  2,  3,    // Front
         4,  5,  6,     4,  6,  7,    // Right
         8,  9, 10,     8, 10, 11,    // Up
        12, 13, 14,    12, 14, 15,    // Left
        16, 17, 18,    16, 18, 19,    // Down
        20, 21, 22,    20, 22, 23     // Back
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
    // Coordinates (cube of side length 1, origin on the centre of the bottom)
    var t = {};

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

    t.vertexBuffer   = CG.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    t.normalBuffer   = CG.initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    t.texCoordBuffer = CG.initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    t.indexBuffer    = CG.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    t.texture        = CG.initTextures(gl, imagePath)
    t.numIndices     = indices.length;
    t.isTextured     = true;

    if (!t.vertexBuffer || !t.texCoordBuffer || !t.indexBuffer || !t.normalBuffer) {
        return null;
    }
    return t;
}

// Coordinate transformation matrix
CG.g_modelMatrix = new Matrix4();
CG.g_mvpMatrix = new Matrix4();

/*========================= DrawShapes ========================= */
// Door position
CG.doorAngle = 0;

CG.draw.all = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);

    CG.draw.floor   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.walls   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.blinds  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.stage   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.sliders (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.boards  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.lights  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.tables  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.chairs  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.skyPlane(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.draw.door    (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, CG.doorAngle);
    CG.g_modelMatrix = CG.popMatrix();

}

/*========================= Draw Tables ========================= */
CG.draw.tables = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 6; j++) {
            CG.draw.table(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix,
                -14 -15*j, 15 - 3*j, -37.5 - 75*i);
        }
    }

    CG.draw.podium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160.0, 2.0, -35.0);

    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.table = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    CG.g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);

    // Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            CG.pushMatrix(CG.g_modelMatrix);
            CG.g_modelMatrix.translate(3.5 - 7*i, 0.0, 30.5 - 61*j);
            CG.draw.box(gl, n, 0.5, 9.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            CG.g_modelMatrix = CG.popMatrix();
        }
    }

    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);

    // Top
    // Move to table centre
    CG.g_modelMatrix.translate(0.0, 9.0, 0.0);
    CG.pushMatrix(CG.g_modelMatrix);
    CG.draw.box(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();

    // Front
    CG.g_modelMatrix.rotate(90.0, 0.0, 0.0, 90.0);
    CG.g_modelMatrix.translate(-3.5, 3.0, 0.0);
    CG.pushMatrix(CG.g_modelMatrix);
    CG.draw.box(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.podium = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    CG.g_modelMatrix.setTranslate(x, y, z);

    // Top
    // Move to table centre
    CG.g_modelMatrix.translate(0.0, 10.0, 0.0);
    CG.pushMatrix(CG.g_modelMatrix);
    CG.draw.box(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();

    // Front
    CG.g_modelMatrix.rotate(90.0, 0.0, 0.0, 90.0);
    CG.g_modelMatrix.translate(-7.0, -7.0, 0.0);
    CG.pushMatrix(CG.g_modelMatrix);
    CG.draw.box(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();

    // Sides
    CG.g_modelMatrix.rotate(90.0, 9.0, 0.0, 0.0);
    CG.g_modelMatrix.translate(0.0, 30.5, -7.0);
    for (var i = 0; i < 2; i++) {
        CG.g_modelMatrix.translate(0.0, -61.5*i, 0.0);
        CG.pushMatrix(CG.g_modelMatrix);
        CG.draw.box(gl, n, 14.0, 0.5, 14.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_modelMatrix = CG.popMatrix();
    }
}

/*========================= Draw Chairs ========================= */
CG.draw.chairs = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 6; j++) {
            for (var k = 0; k < 7; k++) {
                CG.draw.chair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix,
                    -10 + j*-15, 15-(3*j), -12.5 - i*75 - k*8.5, 10*j);
            }
        }
    }
    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.chair = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    CG.g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);

    // Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            CG.pushMatrix(CG.g_modelMatrix);
            CG.g_modelMatrix.translate(2.5 - (5 * i), 0.0, 2.5 - (5 * j));
            CG.draw.box(gl, n, 0.5, 5.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            CG.g_modelMatrix = CG.popMatrix();
        }
    }

    // Move to the centre of chair
    CG.g_modelMatrix.translate(0.0, 5.0, 0.0);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.purple[0], CG.COLORS.purple[1], CG.COLORS.purple[2]);

    // Draw seat of chair
    CG.pushMatrix(CG.g_modelMatrix);
    CG.draw.box(gl, n, 6.0, 0.5, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();

    // Move to back of chair
    CG.g_modelMatrix.translate(2.5, 0.5, 0.0);

    // Draw back of chair
    CG.pushMatrix(CG.g_modelMatrix);
    CG.g_modelMatrix.rotate(90.0, 0.0, 0.5, 0.0);  // Rotate around the y-axis
    CG.draw.box(gl, n, 6.0, 7.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();
}

/*========================= Draw Floor/Steps ========================= */
CG.draw.floor = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    CG.g_modelMatrix.setTranslate(-100, -1, -75);
    CG.draw.box(gl, n, 200.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.green[0], CG.COLORS.green[1], CG.COLORS.green[2]);
    CG.g_modelMatrix.setTranslate(-100, -2, -75);
    CG.draw.box(gl, n, 500.0, 1.0, 500.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    CG.draw.steps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.draw.steps = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    CG.pushMatrix(CG.g_modelMatrix);
    for (var i = 1; i < 6; i++) {
        CG.draw.step(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, 3.95 - 15*i, 13 - 3*i, -77.5, n);
    };
    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.step = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    CG.g_modelMatrix.setTranslate(x, y, z);
    CG.pushMatrix(CG.g_modelMatrix);
    CG.g_modelMatrix.translate(2.5, 0.0, 2.5);
    CG.draw.box(gl, n, 19, 5.0, 149, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.stage = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkGrey[0], CG.COLORS.darkGrey[1], CG.COLORS.darkGrey[2]);
    CG.g_modelMatrix.setTranslate(-174.5, 0, -75);
    CG.draw.box(gl, n, 49.0, 2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}


/*========================= Draw Room ========================= */
CG.draw.walls = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.cream[0], CG.COLORS.cream[1], CG.COLORS.cream[2]);

    // Back part of door wall
    CG.g_modelMatrix.setTranslate(-56, 0.0, -149.5);
    CG.draw.box(gl, n, 112.0, 26.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Door wall top panel
    CG.g_modelMatrix.setTranslate(-100, 26, -149.5);
    CG.draw.box(gl, n, 200.0, 24.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Door wall front panel
    CG.g_modelMatrix.setTranslate(-164, 0, -149.5);
    CG.draw.box(gl, n, 72.0, 26.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Opposite door wall
    CG.g_modelMatrix.setTranslate(-10, 0.0, -0.5);
    for (var i = 0; i < 9; i++) {
        CG.draw.box(gl, n, 20.0, 50.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        if (i == 8) {
            break;
        }
        for (var j = 0; j < 2; j++) {
            CG.g_modelMatrix.setTranslate(-22.5 -25*i, 0 + 35*j, -0.5);
            CG.draw.box(gl, n, 5.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        }
        CG.g_modelMatrix.setTranslate(-10.0 -25*i, 0.0, -0.5);
    }

    // Front wall
    CG.g_modelMatrix.setTranslate(-199.5, 0, -75);
    CG.g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    CG.draw.box(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Back wall
    CG.g_modelMatrix.setTranslate(0,0,-75);
    CG.g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    CG.draw.box(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Roof
    CG.g_modelMatrix.setTranslate(-100, 50, -75);
    CG.draw.box(gl, n, 200.0, 1, 150, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.draw.sliders = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.lightBrown[0], CG.COLORS.lightBrown[1], CG.COLORS.lightBrown[2]);

    CG.g_modelMatrix.setTranslate(-198, 10, -75);
    CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    CG.g_modelMatrix.translate(0, 0, -69.5)
    CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    CG.g_modelMatrix.translate(0, 0, 139)
    CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.draw.boards = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.g_modelMatrix.setTranslate(-198.5, 11, -109.75);
    CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    CG.g_modelMatrix.translate(0, 0, 69.5)
    CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // CG.g_modelMatrix.translate(1, 19.5, 0);
    // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //
    // CG.g_modelMatrix.translate(0, 0, -69.5)
    // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.draw.board = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
    CG.draw.box(gl, texCube2, 0.3, 36, 68, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);

    // Bottom frame
    CG.g_modelMatrix.translate(0, 0, 0);
    CG.draw.box(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Top frame
    CG.g_modelMatrix.translate(0, 36, 0);
    CG.draw.box(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Left frame
    CG.g_modelMatrix.translate(0, -36, 34);
    CG.draw.box(gl, n, 0.5, 36, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    // Right frame
    CG.g_modelMatrix.translate(0, 0, -68);
    CG.draw.box(gl, n, 0.5, 36, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    CG.g_modelMatrix = CG.popMatrix();
}
/*========================= Draw Dynamic Elements ========================= */
CG.draw.blinds = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
    for (var i = 0; i < 8; i++) {
        CG.g_modelMatrix.setTranslate(-22.5 - 25*i, 35 - CG.blindSize, -0.5);
        CG.draw.box(gl, n, 5, CG.blindSize, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    };
};

CG.draw.door = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle) {
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);
    CG.g_modelMatrix.setTranslate(0, 0, 0);
    CG.g_modelMatrix.translate(-128 + Math.cos(CG.doorAngle)*8, 0, -149.5 - Math.sin(CG.doorAngle)*8);
    CG.g_modelMatrix.rotate(CG.doorAngle * 360 / (2*Math.PI), 0, 1, 0);
    CG.draw.box(gl, n, 16.0, 26, 0.7, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

CG.draw.lights = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            CG.g_modelMatrix.setTranslate(-20 - 40*i, 49.5, -15 - 40*j);
            CG.draw.box(gl, n, 2.6, 0.4, 13, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        };
    };
    CG.g_modelMatrix = CG.popMatrix();
}

CG.draw.skyPlane = function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);
    gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
    CG.g_modelMatrix.setTranslate(-200, -20, 200);
    CG.draw.box(gl, texCube, 16000, 400, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    CG.g_modelMatrix = CG.popMatrix();
}


/*========================= Draw Matrix ========================= */

CG.g_matrixStack = []; // Array for storing a matrix
CG.pushMatrix = function(m) { // Store the specified matrix to the array
    var _m = new Matrix4(m);
    CG.g_matrixStack.push(_m);
}

CG.popMatrix = function() { // Retrieve the matrix from the array
    return CG.g_matrixStack.pop();
}

// Co-ordinate transformation matrix for normals
CG.g_normalMatrix = new Matrix4();

/*========================= Draw Box ========================= */
CG.draw.box = function(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    CG.pushMatrix(CG.g_modelMatrix);   // Save the model matrix
    CG.initAttributeVariable(gl, CG.a_Position, n.vertexBuffer);    // Vertex coordinates
    CG.initAttributeVariable(gl, CG.a_Normal, n.normalBuffer);  // Texture coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, n.indexBuffer);

    // Scale a cube and draw
    CG.g_modelMatrix.scale(width, height, depth);

    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, CG.g_modelMatrix.elements);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    CG.g_mvpMatrix.set(viewProjMatrix);
    CG.g_mvpMatrix.multiply(CG.g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, CG.g_mvpMatrix.elements);

    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    CG.g_normalMatrix.setInverseOf(CG.g_modelMatrix);
    CG.g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, CG.g_normalMatrix.elements);

    if (n.isTextured != false) {
        gl.uniform1i(CG.u_IsTexture, true);
        CG.initAttributeVariable(gl, CG.a_TexCoord, n.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, n.texture);
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
        gl.uniform1i(CG.u_IsTexture, false);
    } else {
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
    }

    // Retrieve the model matrix
    CG.g_modelMatrix = CG.popMatrix();
}


/*========================= Init Arrays ========================= */
CG.initArrayBufferForLaterUse = function(gl, data, num, type) {
    // Create a buffer object
    var buf = gl.createBuffer();
    if (!buf) {
        console.error("Failed to create the buffer object");
        return null;
    }

    // Write data into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Store the necessary information to assign the object to the attribute variable later
    buf.num = num;
    buf.type = type;

    return buf;
}

CG.initElementArrayBufferForLaterUse = function(gl, data, type) {
    // Create a buffer object
    var buf = gl.createBuffer();
    if (!buf) {
        console.error("Failed to create the buffer object");
        return null;
    }

    // Write data into the buffer object
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
    // Create a texture object
    var tex = gl.createTexture();
    if (!tex) {
        console.error("Failed to create the Texture object");
        return null;
    }

    // Create image object
    var img = new Image();
    if (!img) {
        console.error("Failed to create the Image object");
        return null;
    }

    // Register the event handler to be called when image loading is completed
    img.onload = function() {
        // NOTE: We know that we will always use power-of-two images, so we can use mips
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

        // Write image data to texture object

        // Flip the image around the horizontal axis
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // Unbind the texture object
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    // Tell the browser to load an image
    img.src = imagePath;
    return tex;
}

/* Source: https://stackoverflow.com/a/7228322/2176546, retrieved 21/03/2018 */
CG.randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
