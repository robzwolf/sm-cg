// classroom.js

function main() {
    console.log("Doc ready");

    window.canvas = document.getElementById("classroom");

    window.gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("canvas WebGL context not found, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        // If the context _still_ hasn't been found
        console.error("Browser does not support WebGL.");
        alert("Your browser does not support WebGL.");
        return;
    }

    // Scale the canvas to the size of the window
    cWidth = window.innerWidth;
    cHeight = window.innerHeight;

    canvas.width = cWidth;
    canvas.height = cHeight;
    gl.viewport(0, 0, cWidth / cHeight, window.innerHeight);

    // Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error("Failed to initialise shaders.");
        return;
    }

    // Set the clear canvas colour, enable the depth test
    gl.clearColor(COLORS.sky[0], COLORS.sky[1], COLORS.sky[2], 0.7);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_ModelMatrix  = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    var u_MvpMatrix    = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");

    // Light colours
    var u_LightColor   = get.getUniformLocation(gl.program, "u_LightColor");
    var u_LightColor2  = get.getUniformLocation(gl.program, "u_LightColor2");
    var u_LightColor3  = get.getUniformLocation(gl.program, "u_LightColor3");
    var u_LightColor4  = get.getUniformLocation(gl.program, "u_LightColor4");
    var u_LightColor5  = get.getUniformLocation(gl.program, "u_LightColor5");
    var u_LightColor6  = get.getUniformLocation(gl.program, "u_LightColor6");
    var u_LightColor7  = get.getUniformLocation(gl.program, "u_LightColor7");
    var u_LightColor8  = get.getUniformLocation(gl.program, "u_LightColor8");
    var u_LightColor9  = get.getUniformLocation(gl.program, "u_LightColor9");
    var u_LightColor10 = get.getUniformLocation(gl.program, "u_LightColor10");
    var u_LightColor11 = get.getUniformLocation(gl.program, "u_LightColor11");
    var u_LightColor12 = get.getUniformLocation(gl.program, "u_LightColor12");
    var u_LightColor13 = get.getUniformLocation(gl.program, "u_LightColor13");
    var u_LightColor14 = get.getUniformLocation(gl.program, "u_LightColor14");
    var u_LightColor15 = get.getUniformLocation(gl.program, "u_LightColor15");
    var u_LightColor16 = get.getUniformLocation(gl.program, "u_LightColor16");
    var u_LightColor17 = get.getUniformLocation(gl.program, "u_LightColor17");
    var u_LightColor18 = get.getUniformLocation(gl.program, "u_LightColor18");
    var u_LightColor19 = get.getUniformLocation(gl.program, "u_LightColor19");
    var u_LightColor20 = get.getUniformLocation(gl.program, "u_LightColor20");

    // Light positions
    var u_LightPos   = gl.getUniformLocation(gl.program,  "u_LightPos");
    var u_LightPos2  = gl.getUniformLocation(gl.program,  "u_LightPos2");
    var u_LightPos3  = gl.getUniformLocation(gl.program,  "u_LightPos3");
    var u_LightPos4  = gl.getUniformLocation(gl.program,  "u_LightPos4");
    var u_LightPos5  = gl.getUniformLocation(gl.program,  "u_LightPos5");
    var u_LightPos6  = gl.getUniformLocation(gl.program,  "u_LightPos6");
    var u_LightPos7  = gl.getUniformLocation(gl.program,  "u_LightPos7");
    var u_LightPos8  = gl.getUniformLocation(gl.program,  "u_LightPos8");
    var u_LightPos9  = gl.getUniformLocation(gl.program,  "u_LightPos9");
    var u_LightPos10 = gl.getUniformLocation(gl.program, "u_LightPos10");
    var u_LightPos11 = gl.getUniformLocation(gl.program, "u_LightPos11");
    var u_LightPos12 = gl.getUniformLocation(gl.program, "u_LightPos12");
    var u_LightPos13 = gl.getUniformLocation(gl.program, "u_LightPos13");
    var u_LightPos14 = gl.getUniformLocation(gl.program, "u_LightPos14");
    var u_LightPos15 = gl.getUniformLocation(gl.program, "u_LightPos15");
    var u_LightPos16 = gl.getUniformLocation(gl.program, "u_LightPos16");
    var u_LightPos17 = gl.getUniformLocation(gl.program, "u_LightPos17");
    var u_LightPos18 = gl.getUniformLocation(gl.program, "u_LightPos18");
    var u_LightPos19 = gl.getUniformLocation(gl.program, "u_LightPos19");
    var u_LightPos20 = gl.getUniformLocation(gl.program, "u_LightPos20");

    var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");

    u_isTexture = gl.getUniformLocation(gl.program, "u_isTexture");
    a_Color     = gl.getAttribLocation(gl.program,  "a_Color");
    a_Position  = gl.getAttribLocation(gl.program,  "a_Position");
    a_Normal    = gl.getAttribLocation(gl.program,  "a_Normal");
    a_TexCoord  = gl.getAttribLocation(gl.program,  "a_TexCoord");
    u_Sampler   = gl.getAttribLocation(gl.program,  "u_Sampler");
    u_scale     = gl.getAttribLocation(gl.program,  "u_scale");

    gl.uniform1i(u_isTexture, false);
    gl.uniform1f(u_scale, 1.0);

    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColour || !u_LightPos || !u_LightPos2
        || !u_LightPos3 || !u_LightPos4 || !u_LightPos5 || !u_LightPos6 || !u_AmbientLight) {
        console.error("Failed to get a storage location.");
        return;
    }

    // Update Lights
    function update_lights() {
        gl.uniform3f(u_LightColor,
            (lightColor[0]   + redMod)   * LIGHT_ON[1],
            (lightColor[1]   + greenMod) * LIGHT_ON[1],
            (lightColor[2]   + blueMod)  * LIGHT_ON[1]);
        gl.uniform3f(u_LightColor2,
            (lightColor2[0]  + redMod)   * LIGHT_ON[2],
            (lightColor2[1]  + greenMod) * LIGHT_ON[2],
            (lightColor2[2]  + blueMod)  * LIGHT_ON[2]);
        gl.uniform3f(u_LightColor3,
            (lightColor3[0]  + redMod)   * LIGHT_ON[3],
            (lightColor3[1]  + greenMod) * LIGHT_ON[3],
            (lightColor3[2]  + blueMod)  * LIGHT_ON[3]);
        gl.uniform3f(u_LightColor4,
            (lightColor4[0]  + redMod)   * LIGHT_ON[4],
            (lightColor4[1]  + greenMod) * LIGHT_ON[4],
            (lightColor4[2]  + blueMod)  * LIGHT_ON[4]);
        gl.uniform3f(u_LightColor5,
            (lightColor5[0]  + redMod)   * LIGHT_ON[5],
            (lightColor5[1]  + greenMod) * LIGHT_ON[5],
            (lightColor5[2]  + blueMod)  * LIGHT_ON[5]);
        gl.uniform3f(u_LightColor6,
            (lightColor6[0]  + redMod)   * LIGHT_ON[6],
            (lightColor6[1]  + greenMod) * LIGHT_ON[6],
            (lightColor6[2]  + blueMod)  * LIGHT_ON[6]);
        gl.uniform3f(u_LightColor7,
            (lightColor7[0]  + redMod)   * LIGHT_ON[7],
            (lightColor7[1]  + greenMod) * LIGHT_ON[7],
            (lightColor7[2]  + blueMod)  * LIGHT_ON[7]);
        gl.uniform3f(u_LightColor8,
            (lightColor8[0]  + redMod)   * LIGHT_ON[8],
            (lightColor8[1]  + greenMod) * LIGHT_ON[8],
            (lightColor8[2]  + blueMod)  * LIGHT_ON[8]);
        gl.uniform3f(u_LightColor9,
            (lightColor9[0]  + redMod)   * LIGHT_ON[9],
            (lightColor9[1]  + greenMod) * LIGHT_ON[9],
            (lightColor9[2]  + blueMod)  * LIGHT_ON[9]);
        gl.uniform3f(u_LightColor10,
            (lightColor10[0] + redMod)   * LIGHT_ON[10],
            (lightColor10[1] + greenMod) * LIGHT_ON[10],
            (lightColor10[2] + blueMod ) * LIGHT_ON[10]);
        gl.uniform3f(u_LightColor11,
            (lightColor11[0] + redMod)   * LIGHT_ON[11],
            (lightColor11[1] + greenMod) * LIGHT_ON[11],
            (lightColor11[2] + blueMod)  * LIGHT_ON[11]);
        gl.uniform3f(u_LightColor12,
            (lightColor12[0] + redMod)   * LIGHT_ON[12],
            (lightColor12[1] + greenMod) * LIGHT_ON[12],
            (lightColor12[2] + blueMod)  * LIGHT_ON[12]);
        gl.uniform3f(u_LightColor13,
            (lightColor13[0] + redMod)   * LIGHT_ON[13],
            (lightColor13[1] + greenMod) * LIGHT_ON[13],
            (lightColor13[2] + blueMod)  * LIGHT_ON[13]);
        gl.uniform3f(u_LightColor14,
            (lightColor14[0] + redMod)   * LIGHT_ON[14],
            (lightColor14[1] + greenMod) * LIGHT_ON[14],
            (lightColor14[2] + blueMod)  * LIGHT_ON[14]);
        gl.uniform3f(u_LightColor15,
            (lightColor15[0] + redMod)   * LIGHT_ON[15],
            (lightColor15[1] + greenMod) * LIGHT_ON[15],
            (lightColor15[2] + blueMod)  * LIGHT_ON[15]);
        gl.uniform3f(u_LightColor16,
            (lightColor16[0] + redMod)   * LIGHT_ON[16],
            (lightColor16[1] + greenMod) * LIGHT_ON[16],
            (lightColor16[2] + blueMod)  * LIGHT_ON[16]);
        gl.uniform3f(u_LightColor17,
            (lightColor17[0] + redMod)   * LIGHT_ON[17],
            (lightColor17[1] + greenMod) * LIGHT_ON[17],
            (lightColor17[2] + blueMod)  * LIGHT_ON[17]);
        gl.uniform3f(u_LightColor18,
            (lightColor18[0] + redMod)   * LIGHT_ON[18],
            (lightColor18[1] + greenMod) * LIGHT_ON[18],
            (lightColor18[2] + blueMod)  * LIGHT_ON[18]);
        gl.uniform3f(u_LightColor19,
            (lightColor19[0] + redMod)   * LIGHT_ON[19],
            (lightColor19[1] + greenMod) * LIGHT_ON[19],
            (lightColor19[2] + blueMod)  * LIGHT_ON[19]);
        gl.uniform3f(u_LightColor20,
            (lightColor20[0] + redMod)   * LIGHT_ON[20],
            (lightColor20[1] + greenMod) * LIGHT_ON[20],
            (lightColor20[2] + blueMod)  * LIGHT_ON[20]);
    }

    // Set the light direction in the world co-ordinates
    gl.uniform3f(u_LightPos,    -20, 45,  -15);
    gl.uniform3f(u_LightPos2,   -20, 45,  -55);
    gl.uniform3f(u_LightPos3,   -20, 45,  -95);
    gl.uniform3f(u_LightPos4,   -20, 45, -135);
    gl.uniform3f(u_LightPos5,   -60, 45,  -15);
    gl.uniform3f(u_LightPos6,   -60, 45,  -55);
    gl.uniform3f(u_LightPos7,   -60, 45,  -95);
    gl.uniform3f(u_LightPos8,   -60, 45, -135);
    gl.uniform3f(u_LightPos9,  -100, 45,  -15);
    gl.uniform3f(u_LightPos10, -100, 45,  -55);
    gl.uniform3f(u_LightPos11, -100, 45,  -95);
    gl.uniform3f(u_LightPos12, -100, 45, -135);
    gl.uniform3f(u_LightPos13, -140, 45,  -15);
    gl.uniform3f(u_LightPos14, -140, 45,  -55);
    gl.uniform3f(u_LightPos15, -140, 45,  -95);
    gl.uniform3f(u_LightPos16, -140, 45, -135);
    gl.uniform3f(u_LightPos17, -180, 45,  -15);
    gl.uniform3f(u_LightPos18, -180, 45,  -55);
    gl.uniform3f(u_LightPos19, -180, 45,  -95);
    gl.uniform3f(u_LightPos20, -180, 45, -135);

    // Set the ambient light level
    gl.uniform3f(u_AmbientLight, ambLight, ambLight, ambLight - 0.2);

    n = makeCube(gl);
    texCube = texturedCube(gl, "textures/durham.png");
    texCube2 = texturedCube(gl, "textures/board.png");
    texCube3 = texturedCube(gl, "textures/slender.jpg");
    if (n < 0) {
        console.error("Failed to set the vertex information.");
        return;
    }

    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();

    // Key handling
    var keys = {};
    window.onkeydown = function(e) {
        keys[e.keyCode] = true;
    }
    window.onkeyup = function(e) {
        keys[e.keyCode] = false;
    }

    // Introduction lighting
    introLights();

    // Update scene and draw every frame
    updateCanvas();

    function updateCanvas() {
        requestAnimFrame(updateCanvas);
        findFps();

        // Start drawing
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Initially set camera
        updateCameraDirection();

        update_lights();

        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 700.0);
        viewProjMatrix.lookAt(cameraPosition[0], cameraPosition[1], cameraPosition[2],
            cameraPosition[0] + cameraOrientation[0],
            cameraPosition[1] + cameraOrientation[1],
            cameraPosition[2] + cameraOrientation[2],
            0.0, 1.0, 0);

        // Draw
        draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        checkKeys(keys);
        // checkSlender();
    }

}

/* LIGHTING */
// Colour variable definitions
window.COLORS = {
    "green"     : [0.30, 0.80, 0.50],
    "greyGreen" : [0.23, 0.60, 0.40],
    "grey"      : [0.50, 0.50, 0.50],
    "darkGrey"  : [0.40, 0.40, 0.40],
    "black"     : [0.00, 0.00, 0.00],
    "cream"     : [0.95, 0.90, 0.95],
    "purple"    : [0.60, 0.30, 0.60],
    "brown"     : [0.80, 0.60, 0.43],
    "lightBrown": [0.66, 0.50, 0.30],
    "sky"       : [0.40, 0.90, 0.95]
}
var green = [0.3, 0.8, 0.5];
var greyGreen = [0.23, 0.6, 0.4];


// Light states
window.LIGHT_ON = [null]
for (var i = 1; i <= 20; i++) {
    LIGHT_ON.push(false);
}
console.log(LIGHT_ON);

// Light/colour modifiers
var redMod         =  0.05;
var greenMod       =  0.00;
var blueMod        = -0.10;
var ambLight       =  0.00;
var lightIntensity =  0.50;
var lightColour    = [lightIntensity, lightIntensity, lightIntensity];
var lightColour2   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour3   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour4   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour5   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour6   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour7   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour8   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour9   = [lightIntensity, lightIntensity, lightIntensity];
var lightColour10  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour11  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour12  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour13  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour14  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour15  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour16  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour17  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour18  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour19  = [lightIntensity, lightIntensity, lightIntensity];
var lightColour20  = [lightIntensity, lightIntensity, lightIntensity];


/* FPS CHECKING */
var fps = 30;
var currentTime = 0;
var currentFps = 0;
var oldTime = 0;

function findFps() {
    currentTime = new Date().getTime();
    currentFps++;
    if (currentTime - oldTime >= 1000) {
        // document.getElementById("fps_counter").innerHTML
        // Reset for next calc
        oldTime = currentTime;
        currentFps = 0;
    }
}
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || // || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / fps);
    }
})();


/* CAMERA HANDLING */
// Camera
var yAxisRot          = -Math.PI;
var xAxisRot          = MATH.PI/2;
var lookSpeed         = 1;
var cameraPosition    = [-10.0, 30.0, -10.0];
var cameraOrientation = [  0.0,  0.0,   0.0];

// Lock camera to mouse movement
canvas.requestPointerLock = canvas.requestPointerLock;// || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
document.exitPointerLock  = document.exitPointerLock;//  || document.mozExitPointerLock  || document.webkitExitPointerLock;

// Start pointer lock
canvas.onclick = function() {
    canvas.requestPointerLock();
}

// Hook pointer lock state change events for different browsers
document.addEventListener("pointerlockchange", lockChangeAlert, false);
// document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
// document.addEventListener("webkitpointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas) {
       // || document.mozPointerLockElement === canvas
       // || document.webkitPointerLockElement === canvas) {
        console.log("Pointer lock status now locked.");
        document.addEventListener("mousemove", changeCameraView, false);
    } else {
        console.log("Pointer lock status now unlocked.");
        document.removeEventListener("mousemove", changeCameraView, false);
    }
}

// Changes camera view based on mouse position change
function changeCameraView(e) {
    console.log("changecameraview event e is", e);
    var movementX = e.movementX;
    var movementY = e.movementY;
    yAxisRot += movementX * lookSpeed * 0.005;
    xAxisRot += movementY * lookSpeed * 0.005;
}

// Update's the camera's position + orientation
function updateCameraDirection() {
    cameraOrientation = [Math.sin(xAxisRot) * Math.cos(yAxisRot),
        Math.cos(xAxisRot),
        Math.sin(xAxisRot) * Math.sin(yAxisRot)
    ];
}

/* KEY HANDLING */
// Movement variables
var moveSpeed = 1.2;
var doorMove;
var blindMove;

function checkKeys(keys) {
    if (keys[87]) {
        // "w" key
        // Move forward at camera direction
        cameraPosition[0] += cameraOrientation[0] * moveSpeed;
        cameraPosition[1] += cameraOrientation[1] * moveSpeed;
        cameraPosition[2] += cameraOrientation[2] * moveSpeed;
    }

    if (keys[83]) {
        // "s" key
        // Move backward at camera direction
        cameraPosition[0] -= cameraOrientation[0] * moveSpeed;
        cameraPosition[1] -= cameraOrientation[1] * moveSpeed;
        cameraPosition[2] -= cameraOrientation[2] * moveSpeed;
    }

    if (keys[68]) {
        // "d" key
        // Move right relative to camera direction
        cameraPosition[0] -= cameraOrientation[2] * moveSpeed;
        cameraPosition[2] += cameraOrientation[0] * moveSpeed;
    }

    if (keys[65]) {
        // "a" key
        // Move left relative to camera direction
        cameraPosition[0] += cameraOrientation[2] * moveSpeed;
        cameraPosition[2] -= cameraOrientation[0] * moveSpeed;
    }

    if (keys[81]) {
        // "q" key
        // Move camera down
        cameraPosition[1] -= moveSpeed;
    }

    if (keys[69]) {
        // "e" key
        // Move camera up
        cameraPosition[1] += moveSpeed;
    }

    if (keys[79]) {
        // "o" key
        // Open door
        clearInterval(doorMove);
        doorMove = setInterval(openDoor, 50);
        keys[79] = false;
    }

    if (keys[80]) {
        // "p" key
        // Close door
        clearInterval(doorMove);
        doorMove = setInterval(closeDoor, 50);
        keys[80] = false;
    }

    if (keys[78]) {
        // "n" key
        // Open blind
        clearInterval(blindMove);
        blindMove = setInterval(openBlinds, 50);
        keys[78] = false;
    }

    if (keys[66]) {
        // "b" key
        // Close blind
        clearInterval(blindMove);
        blindMove = setInterval(closeBlinds, 50);
        keys[66] = false;
    }

    if (keys[49]) {
        // "1" key
        // Toggle lights 1-4
        toggleSpecificLights([1, 2, 3, 4])
        keys[49] = false;
    }

    if (keys[50]) {
        // "2" key
        // Toggle lights 5-8
        toggleSpecificLights([5, 6, 7, 8])
        keys[50] = false;
    }

    if (keys[51]) {
        // "3" key
        // Toggle lights 9-12
        toggleSpecificLights([9, 10, 11, 12])
        keys[51] = false;
    }

    if (keys[52]) {
        // "4" key
        // Toggle lights 13-16
        toggleSpecificLights([13, 14, 15, 16])
        keys[52] = false;
    }

    if (keys[53]) {
        // "5" key
        // Toggle lights 17-20
        toggleSpecificLights([17, 18, 19, 20])
        keys[53] = false;
    }

    if (keys[77]) {
        // "m" key
        // Disco lights on
        discoLights();
    }

    if (keys[78]) {
        // "n" key
        // Normal lights
        normalLights();
    }
}

function toggleSpecificLights(lightsList) {
    lightsList.forEach(function(i) {
        LIGHT_ON[i] = !LIGHT_ON[i];
    });
}


/* DYNAMIC OBJECTS */
// Open/close doors
function openDoor() {
    doorAngle += 0.05;
    fullyOpenAngle = 3/4 * Math.PI - 0.1; // Roughly 130°
    if (doorAngle >= fullyOpenAngle) {
        clearInterval(doorMove);
    }
}
function closeDoor() {
    doorAngle -= 0.05;
    almostClosedAngle = 0.1; // Roughly 6°
    if (doorAngle <= almostClosedAngle) {
        doorAngle = 0;
        clearInterval(doorMove);
    }
}

// Open/close blinds
function openBlinds() {
    // Adjust blind height
    blindSize       -= 0.1;
    almostOpenAmount = 0.1;
    if (blindSize < almostOpenAmount) {
        blindSize = 0;
        clearInterval(blindMove);
    }

    // Adjust ambient lighting to match blind size
    ambLight   += 0.003;
    ambLightMax = 0.4;
    if (ambLight >= ambLightMax) {
        ambLight = ambLightMax;
    }
}

function closeBlinds() {
    // Adjust blind height
    blindSize -= 0.1;
    blindSizeMax = 20;
    if (blindSize > blindSizeMax) {
        blindSize = blindSizeMax;
        clearInterval(blindMove);
    }

    // Adjust ambient lighting to match blind size
    ambLight   -= 0.003;
    ambLightMin = 0;
    if(ambLight <= ambLightMin) {
        ambLight = ambLightMin;
    }
}

function introLights() {
    yAxisRot += 0.4;
    setTimeout(function() { toggleSpecificLights([ 1,  2,  3,  4]); }, 5000);
    setTimeout(function() { toggleSpecificLights([ 5,  6,  7,  8]); }, 4000);
    setTimeout(function() { toggleSpecificLights([ 9, 10, 11, 12]); }, 3000);
    setTimeout(function() { toggleSpecificLights([13, 14, 15, 16]); }, 2000);
    setTimeout(function() { toggleSpecificLights([17, 18, 19, 20]); }, 1000);
}

// Disco light functionality
function discoLights() {
    console.log("Disco lights");
    redMod   = randomIntFromInterval(-1, 1);
    greenMod = randomIntFromInterval(-1, 1);
    blueMod  = randomIntFromInterval(-1, 1);
}

function normalLights() {
    console.log("Normal lights");
    redMod   =  0.05;
    greenMod =  0.00;
    blueMod  = -0.10;
}

/* CUBE HANDLING (coloured and textured) */
function makeCube(gl) {
    // Coordinates (cube, side length 1, origin on centre of bottom)
    var c = {};
    var vertices = new Float32Array([
         0.5,  1.0,  0.5,    -0.5,  1.0,  0.5,    -0.5,  0.0,  0.5,     0.5,  0.0,  0.5, // v0 v1 v2 v3 Front
         0.5,  1.0,  0.5,     0.5,  0.0,  0.5,     0.5,  0.0, -0.5,     0.5,  1.0, -0.5, // v0 v3 v4 v5 Right
         0.5,  1.0,  0.5,     0.5,  1.0, -0.5,    -0.5,  1.0, -0.5,    -0.5,  1.0,  0.5, // v0 v5 v6 v1 Top
        -0.5,  1.0,  0.5,    -0.5,  1.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  0.0,  0.5, // v1 v6 v7 v2 Left
        -0.5,  0.0, -0.5,     0.5,  0.0, -0.5,     0.5,  0.0,  0.5,    -0.5,  0.0,  0.5, // v7 v4 v3 v2 Bottom
         0.5,  0.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  1.0, -0.5,     0.5,  1.0, -0.5  // v4 v7 v6 v5 Back
    ]);
    var normals = new Float32Array([
         0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0, // v0 v1 v2 v3 Front
         1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0, // v0 v3 v4 v5 Right
         0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0, // v0 v5 v6 v1 Top
        -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0, // v1 v6 v7 v2 Left
         0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0, // v7 v4 v3 v2 Bottom
         0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0  // v4 v7 v6 v5 Back
    ]);
    var indices = new Uint8Array([
         0,  1,  2,     0,  2,  3,    // Front
         4,  5,  6,     4,  6,  7,    // Right
         8,  9, 10,     8, 10, 11,    // Top
        12, 13, 14,    12, 14, 15,    // Left
        16, 17, 18,    16, 18, 19,    // Bottom
        20, 21, 22,    20, 22, 23     // Back
    ]);
    c.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    c.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    c.indexBuffer  = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    c.numIndices   = indices.length;
    c.isTextured   = false;

    if (!c.vertexBuffer || !c.indexBuffer || !c.normalBuffer) {
        return null;
    }
    return c;
}

function texturedCube(gl, imagePath) {
    var t = {};
    // Coordinates (cube, side length 1, origin on centre of bottom)
    var vertices = new Float32Array([
         0.5,  1.0,  0.5,    -0.5,  1.0,  0.5,    -0.5,  0.0,  0.5,     0.5,  0.0,  0.5, // v0 v1 v2 v3 Front
         0.5,  1.0,  0.5,     0.5,  0.0,  0.5,     0.5,  0.0, -0.5,     0.5,  1.0, -0.5, // v0 v3 v4 v5 Right
         0.5,  1.0,  0.5,     0.5,  1.0, -0.5,    -0.5,  1.0, -0.5,    -0.5,  1.0,  0.5, // v0 v5 v6 v1 Top
        -0.5,  1.0,  0.5,    -0.5,  1.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  0.0,  0.5, // v1 v6 v7 v2 Left
        -0.5,  0.0, -0.5,     0.5,  0.0, -0.5,     0.5,  0.0,  0.5,    -0.5,  0.0,  0.5, // v7 v4 v3 v2 Bottom
         0.5,  0.0, -0.5,    -0.5,  0.0, -0.5,    -0.5,  1.0, -0.5,     0.5,  1.0, -0.5  // v4 v7 v6 v5 Back
    ]);
    var normals = new Float32Array([
         0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0,     0.0,  0.0,  1.0, // v0 v1 v2 v3 Front
         1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0,     1.0,  0.0,  0.0, // v0 v3 v4 v5 Right
         0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0,     0.0,  1.0,  0.0, // v0 v5 v6 v1 Top
        -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0,    -1.0,  0.0,  0.0, // v1 v6 v7 v2 Left
         0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0,     0.0, -1.0,  0.0, // v7 v4 v3 v2 Bottom
         0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0,     0.0,  0.0, -1.0  // v4 v7 v6 v5 Back
    ]);
    var texCoords = new Float32Array([
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0 v1 v2 v3 Front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0 v3 v4 v5 Right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0 v5 v6 v1 Top
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1 v6 v7 v2 Left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7 v4 v3 v2 Bottom
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4 v7 v6 v5 Back
    ]);
    var indices = new Uint8Array([
         0,  1,  2,     0,  2,  3,    // Front
         4,  5,  6,     4,  6,  7,    // Right
         8,  9, 10,     8, 10, 11,    // Top
        12, 13, 14,    12, 14, 15,    // Left
        16, 17, 18,    16, 18, 19,    // Bottom
        20, 21, 22,    20, 22, 23     // Back
    ]);

    t.vertexBuffer   = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    t.normalBuffer   = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    t.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    t.indexBuffer    = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    t.texture        = initTextures(gl, imagePath);
    t.numIndices     = indices.length;
    t.isTextured(true);

    if (!t.vertexBuffer || !t.texCoordBuffer || !t.indexBuffer || !t.normalBuffer) {
        return null;
    }
    return t;
}

// Co-ordinate transformation matrix
var g_ModelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

/* DRAW SHAPES */
// Door position
var doorAngle = 0;

function draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_ModelMatrix);
    drawFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawWalls(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawBlinds(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawStage(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawDoor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle);
    drawSliders(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawBoards(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawLights(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawTables(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawChairs(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawSkyPlane(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();

    // document.getElementById("speed").inner
}

/* DRAW TABLES */
function drawTables(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_ModelMatrix);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 6; j++) {
            drawTable(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -14 + -15*k, 15-(3*k), -37.5 - 75*i);
        }
    }
    drawPodium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160, 2, -35);
    g_ModelMatrix = popMatrix();
}

function drawTable(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_ModelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(a_Color, COLORS.black[0], COLORS.black[1], COLORS.black[2]);

    // Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            pushmatrix(g_ModelMatrix);
            g_ModelMatrix.translate(3.5 - (7 * i), 0.0, 30.5 - 61*j);
            drawBox(gl, n, 0.5, 9.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_ModelMatrix = popMatrix();
        }
    }
    gl.vertexAttrib3f(a_Color, COLORS.brown[0], COLORS.brown[1], COLORS.brown[2]);

    // Top
    // Move to table centre
    g_ModelMatrix.translate(0.0, 9.0, 0.0);
    pushMatrix(g_ModelMatrix);
    drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();

    // Front
    g_ModelMatrix.rotate(90.0, 0.0, 0.0, 90.0);
    g_ModelMatrix.translate(-3.5, 3.0, 0.0);
    pushMatrix(g_ModelMatrix);
    drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();
}

function drawPodium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_ModelMatrix.setTranslate(x, y, z);

    // Top
    // Move to podium centre
    g_ModelMatrix.translate(0.0, 10.0, 0.0);
    pushMatrix(g_ModelMatrix);
    drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();

    // Front
    g_ModelMatrix.rotate(90.0, 0.0, 0, 90.0);
    g_ModelMatrix.translate(-7, -7, 0.0);
    pushMatrix(g_ModelMatrix);
    drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();

    // Sides
    g_ModelMatrix.rotate(90.0, 9.0, 0.0, 0.0);
    g_ModelMatrix.translate(0.0, 30.5, -7.0);
    for (var i = 0; i < 2; i++) {
        g_ModelMatrix.translate(0.0, -61.5*i, 0.0);
        pushMatrix(g_ModelMatrix);
        drawBox(gl, n, 14.0, 0.5, 14.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        g_ModelMatrix = popMatrix();
    }
}

/* DRAW CHAIRS */
function drawChairs(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_ModelMatrix);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 6; j++) {
            for (var k = 0; k < 7; k++) {
                drawChair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -10 - 15*j, 15 - 3*j, -12.5 - 75*i - 8.5*k, 10*j)
            }
        }
    }
    g_ModelMatrix = popMatrix();
}

function drawChair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_ModelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(a_Color, COLORS.black[0], COLORS.black[1], COLORS.black[2]);

    // Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            pushMatrix(g_ModelMatrix);
            g_ModelMatrix.translate(2.5 - 5*l, 0.0, 2.5 - 5*k);
            drawBox(gl, n, 0.5, 5.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_ModelMatrix = popMatrix();
        }
    }

    // Move to chair centre
    g_ModelMatrix.translate(0.0, 5.0, 0.0);
    gl.vertexAttrib3f(a_Color, COLORS.purple[0], COLORS.purple[1], COLORS.purple[2]);

    // Draw seat
    drawBox(gl, n, 6.0, 0.5, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();

    // Move to back ot chair
    g_ModelMatrix.translate(2.0, 0.5, 0.0);

    // Draw back of chair
    pushMatrix(g_ModelMatrix);
    g_ModelMatrix.rotate(90.0, 0.0, 0.5, 0.0); // Rotate around the y-axis
    drawBox(gl, n, 6.0, 7.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();
}

/* DRAW FLOOR/STEPS */
function drawFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(a_Color, COLORS.grey[0], COLORS.grey[1], COLORS.grey[2]);
    g_ModelMatrix.setTranslate(-100, -1, -75);
    drawBox(gl, n, 200.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    gl.vertexAttrib3f(a_Color, COLORS.green[0], COLORS.green[1], COLORS.green[2]);
    g_ModelMatrix.setTranslate(-100, -2, -75);
    drawBox(gl, n, 500.0, 1.0, 500.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawSteps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawSteps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(a_Color, COLORS.grey[0], COLORS.grey[1], COLORS.grey[2]);
    pushMatrix(g_ModelMatrix);
    for (var i = 0; i < 6; i++) {
        drawStep(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, 3.95 - 15*p, 13 - 3*p, -77.5, n);
    }
    g_ModelMatrix = popMatrix();
}

function drawStep(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_ModelMatrix.setTranslate(x, y, z);
    pushMatrix(g_ModelMatrix);
    g_ModelMatrix.translate(2.5, 0.0, 2.5);
    drawBox(gl, n, 19.0, 5.0, 149.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_ModelMatrix = popMatrix();
}

function drawStage(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(a_Color, COLORS.darkGrey[0], COLORS.darkGrey[1], COLORS.darkGrey[2]);
    g_ModelMatrix.setTranslate(-174.5, 0.0, -75.0);
    drawBox(gl, n, 49.0, 2.0, 148.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}




function randomIntFromInterval(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
