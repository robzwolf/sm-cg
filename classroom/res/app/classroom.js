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
    gl.clearColor(sky[0], sky[1], sky[2], 0.7);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_ModelMatrix  = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    var u_MvpMatrix    = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");

    // Light Colours
    var u_LightColor   = gl.getUniformLocation(gl.program, "u_LightColor");
    var u_LightColor2  = gl.getUniformLocation(gl.program, "u_LightColor2");
    var u_LightColor3  = gl.getUniformLocation(gl.program, "u_LightColor3");
    var u_LightColor4  = gl.getUniformLocation(gl.program, "u_LightColor4");
    var u_LightColor5  = gl.getUniformLocation(gl.program, "u_LightColor5");
    var u_LightColor6  = gl.getUniformLocation(gl.program, "u_LightColor6");
    var u_LightColor7  = gl.getUniformLocation(gl.program, "u_LightColor7");
    var u_LightColor8  = gl.getUniformLocation(gl.program, "u_LightColor8");
    var u_LightColor9  = gl.getUniformLocation(gl.program, "u_LightColor9");
    var u_LightColor10 = gl.getUniformLocation(gl.program, "u_LightColor10");
    var u_LightColor11 = gl.getUniformLocation(gl.program, "u_LightColor11");
    var u_LightColor12 = gl.getUniformLocation(gl.program, "u_LightColor12");
    var u_LightColor13 = gl.getUniformLocation(gl.program, "u_LightColor13");
    var u_LightColor14 = gl.getUniformLocation(gl.program, "u_LightColor14");
    var u_LightColor15 = gl.getUniformLocation(gl.program, "u_LightColor15");
    var u_LightColor16 = gl.getUniformLocation(gl.program, "u_LightColor16");
    var u_LightColor17 = gl.getUniformLocation(gl.program, "u_LightColor17");
    var u_LightColor18 = gl.getUniformLocation(gl.program, "u_LightColor18");
    var u_LightColor19 = gl.getUniformLocation(gl.program, "u_LightColor19");
    var u_LightColor20 = gl.getUniformLocation(gl.program, "u_LightColor20");

    // Light Positions
    var u_LightPos     = gl.getUniformLocation(gl.program, "u_LightPos");
    var u_LightPos2    = gl.getUniformLocation(gl.program, "u_LightPos2");
    var u_LightPos3    = gl.getUniformLocation(gl.program, "u_LightPos3");
    var u_LightPos4    = gl.getUniformLocation(gl.program, "u_LightPos4");
    var u_LightPos5    = gl.getUniformLocation(gl.program, "u_LightPos5");
    var u_LightPos6    = gl.getUniformLocation(gl.program, "u_LightPos6");
    var u_LightPos7    = gl.getUniformLocation(gl.program, "u_LightPos7");
    var u_LightPos8    = gl.getUniformLocation(gl.program, "u_LightPos8");
    var u_LightPos9    = gl.getUniformLocation(gl.program, "u_LightPos9");
    var u_LightPos10   = gl.getUniformLocation(gl.program, "u_LightPos10");
    var u_LightPos11   = gl.getUniformLocation(gl.program, "u_LightPos11");
    var u_LightPos12   = gl.getUniformLocation(gl.program, "u_LightPos12");
    var u_LightPos13   = gl.getUniformLocation(gl.program, "u_LightPos13");
    var u_LightPos14   = gl.getUniformLocation(gl.program, "u_LightPos14");
    var u_LightPos15   = gl.getUniformLocation(gl.program, "u_LightPos15");
    var u_LightPos16   = gl.getUniformLocation(gl.program, "u_LightPos16");
    var u_LightPos17   = gl.getUniformLocation(gl.program, "u_LightPos17");
    var u_LightPos18   = gl.getUniformLocation(gl.program, "u_LightPos18");
    var u_LightPos19   = gl.getUniformLocation(gl.program, "u_LightPos19");
    var u_LightPos20   = gl.getUniformLocation(gl.program, "u_LightPos20");

    var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");

    u_IsTexture = gl.getUniformLocation(gl.program, "u_IsTexture");
    a_Color     = gl.getAttribLocation (gl.program, "a_Color")
    a_Position  = gl.getAttribLocation (gl.program, "a_Position");
    a_Normal    = gl.getAttribLocation (gl.program, "a_Normal");
    a_TexCoord  = gl.getAttribLocation (gl.program, "a_TexCoord");
    u_Sampler   = gl.getUniformLocation(gl.program, "u_Sampler");
    u_Scale     = gl.getUniformLocation(gl.program, "u_Scale")

    gl.uniform1i(u_IsTexture, false);
    gl.uniform1f(u_Scale, 1.0);

    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPos || !u_LightPos2 || !u_LightPos3 || !u_LightPos4 || !u_LightPos5 || !u_LightPos6 || !u_AmbientLight) {
        console.error("Failed to get at least one storage location");
        return;
    }

    // Update lights
    function update_lights(){
        gl.uniform3f(u_LightColor,
            (lightColor[0]+redMod)*lightOn,
            (lightColor[1]+greenMod)*lightOn,
            (lightColor[2]+blueMod)*lightOn);
        gl.uniform3f(u_LightColor2,
            (lightColor2[0]+redMod)*lightOn2,
            (lightColor2[1]+greenMod)*lightOn2,
            (lightColor2[2]+blueMod)*lightOn2);
        gl.uniform3f(u_LightColor3,
            (lightColor3[0]+redMod)*lightOn3,
            (lightColor3[1]+greenMod)*lightOn3,
            (lightColor3[2]+blueMod)*lightOn3);
        gl.uniform3f(u_LightColor4,
            (lightColor4[0]+redMod)*lightOn4,
            (lightColor4[1]+greenMod)*lightOn4,
            (lightColor4[2]+blueMod)*lightOn4);
        gl.uniform3f(u_LightColor5,
            (lightColor5[0]+redMod)*lightOn5,
            (lightColor5[1]+greenMod)*lightOn5,
            (lightColor5[2]+blueMod)*lightOn5);
        gl.uniform3f(u_LightColor6,
            (lightColor6[0]+redMod)*lightOn6,
            (lightColor6[1]+greenMod)*lightOn6,
            (lightColor6[2]+blueMod)*lightOn6);
        gl.uniform3f(u_LightColor7,
            (lightColor7[0]+redMod)*lightOn7,
            (lightColor7[1]+greenMod)*lightOn7,
            (lightColor7[2]+blueMod)*lightOn7);
        gl.uniform3f(u_LightColor8,
            (lightColor8[0]+redMod)*lightOn8,
            (lightColor8[1]+greenMod)*lightOn8,
            (lightColor8[2]+blueMod)*lightOn8);
        gl.uniform3f(u_LightColor9,
            (lightColor9[0]+redMod)*lightOn9,
            (lightColor9[1]+greenMod)*lightOn9,
            (lightColor9[2]+blueMod)*lightOn9);
        gl.uniform3f(u_LightColor10,
            (lightColor10[0]+redMod)*lightOn10,
            (lightColor10[1]+greenMod)*lightOn10,
             (lightColor10[2]+blueMod)*lightOn10);
        gl.uniform3f(u_LightColor11,
            (lightColor11[0]+redMod)*lightOn11,
            (lightColor11[1]+greenMod)*lightOn11,
            (lightColor11[2]+blueMod)*lightOn11);
        gl.uniform3f(u_LightColor12,
            (lightColor12[0]+redMod)*lightOn12,
            (lightColor12[1]+greenMod)*lightOn12,
            (lightColor12[2]+blueMod)*lightOn12);
        gl.uniform3f(u_LightColor13,
            (lightColor13[0]+redMod)*lightOn13,
            (lightColor13[1]+greenMod)*lightOn13,
            (lightColor13[2]+blueMod)*lightOn13);
        gl.uniform3f(u_LightColor14,
            (lightColor14[0]+redMod)*lightOn14,
            (lightColor14[1]+greenMod)*lightOn14,
            (lightColor14[2]+blueMod)*lightOn14);
        gl.uniform3f(u_LightColor15,
            (lightColor15[0]+redMod)*lightOn15,
            (lightColor15[1]+greenMod)*lightOn15,
            (lightColor15[2]+blueMod)*lightOn15);
        gl.uniform3f(u_LightColor16,
            (lightColor16[0]+redMod)*lightOn16,
            (lightColor16[1]+greenMod)*lightOn16,
            (lightColor16[2]+blueMod)*lightOn16);
        gl.uniform3f(u_LightColor17,
            (lightColor17[0]+redMod)*lightOn17,
            (lightColor17[1]+greenMod)*lightOn17,
            (lightColor17[2]+blueMod)*lightOn17);
        gl.uniform3f(u_LightColor18,
            (lightColor18[0]+redMod)*lightOn18,
            (lightColor18[1]+greenMod)*lightOn18,
            (lightColor18[2]+blueMod)*lightOn18);
        gl.uniform3f(u_LightColor19,
            (lightColor19[0]+redMod)*lightOn19,
            (lightColor19[1]+greenMod)*lightOn19,
            (lightColor19[2]+blueMod)*lightOn19);
        gl.uniform3f(u_LightColor20,
            (lightColor20[0]+redMod)*lightOn20,
            (lightColor20[1]+greenMod)*lightOn20,
            (lightColor20[2]+blueMod)*lightOn20);
        
        gl.uniform3f(u_AmbientLight, ambLight, ambLight, ambLight);
    }
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPos, -20, 45, -15);
    gl.uniform3f(u_LightPos2, -20, 45, -55);
    gl.uniform3f(u_LightPos3, -20, 45, -95);
    gl.uniform3f(u_LightPos4, -20, 45, -135);
    gl.uniform3f(u_LightPos5, -60, 45, -15);
    gl.uniform3f(u_LightPos6, -60, 45, -55);
    gl.uniform3f(u_LightPos7, -60, 45, -95);
    gl.uniform3f(u_LightPos8, -60, 45, -135);
    gl.uniform3f(u_LightPos9, -100, 45, -15);
    gl.uniform3f(u_LightPos10, -100, 45, -55);
    gl.uniform3f(u_LightPos11, -100, 45, -95);
    gl.uniform3f(u_LightPos12, -100, 45, -135);
    gl.uniform3f(u_LightPos13, -140, 45, -15);
    gl.uniform3f(u_LightPos14, -140, 45, -55);
    gl.uniform3f(u_LightPos15, -140, 45, -95);
    gl.uniform3f(u_LightPos16, -140, 45, -135);
    gl.uniform3f(u_LightPos17, -180, 45, -15);
    gl.uniform3f(u_LightPos18, -180, 45, -55);
    gl.uniform3f(u_LightPos19, -180, 45, -95);
    gl.uniform3f(u_LightPos20, -180, 45, -135);
    // Set the ambient light level
    gl.uniform3f(u_AmbientLight, ambLight, ambLight, ambLight-0.2);

    n = makeCube(gl);
    texCube = texturedCube(gl, "res/tex/durham.png");
    texCube2 = texturedCube(gl, "res/tex/board.png");
    texCube3 = texturedCube(gl, "res/tex/slender.jpeg");
    if (n < 0) {
        console.error("Failed to set the vertex information");
        return;
    }
    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();

    //Key Handling
    var keys = {};
    document.onkeydown = function(ev){
        keys[ev.keyCode] = true;
    }
    document.onkeyup = function(ev){
        keys[ev.keyCode] = false;
    }

    //Introduction Lighting
    introLights();

    //Update scene and draw every frame
    updateCanvas();
    function updateCanvas() {
        requestAnimFrame(updateCanvas);
        findFps();
        // Start drawing
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        updateCameraDirection(); // Initially set camera
        update_lights();
        viewProjMatrix.setPerspective(50.0, CG.canvas.width / CG.canvas.height, 1.0, 700.0);
        viewProjMatrix.lookAt(cameraPosition[0], cameraPosition[1], cameraPosition[2],
            cameraPosition[0] + cameraOrientation[0],
            cameraPosition[1] + cameraOrientation[1],
            cameraPosition[2] + cameraOrientation[2],
            0.0, 1.0, 0);
        // console.log("first time thing", gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw
        checkKeys(keys);
        checkSlender()
    }
}

/*========================= Lighting ========================= */
// Colour variable definitions
// CG.COLORS = {
//     "green"     : [0.30, 0.80, 0.50],
//     "greyGreen" : [0.23, 0.60, 0.40],
//     "grey"      : [0.50, 0.50, 0.50],
//     "darkGrey"  : [0.40, 0.40, 0.40],
//     "black"     : [0.00, 0.00, 0.00],
//     "cream"     : [0.95, 0.90, 0.95],
//     "purple"    : [0.60, 0.30, 0.60],
//     "brown"     : [0.80, 0.60, 0.43],
//     "lightBrown": [0.66, 0.50, 0.30],
//     "sky"       : [0.40, 0.90, 0.95],
//     "white"     : [1.00, 1.00, 1.00]
// }
var green = [0.3, 0.8, 0.5];
var greyGreen = [0.23, 0.6, 0.4];
var grey = [0.5, 0.5, 0.5];
var darkGrey = [0.4, 0.4, 0.4];
var black = [0, 0, 0];
var cream = [0.95, 0.9, 0.95];
var purple = [0.6, 0.3, 0.6];
var brown = [0.8, 0.6, 0.43];
var lightBrown = [0.66, 0.5, 0.3];
var sky = [0.4, 0.9, 0.95];

//Lights states
var lightOn = false;
var lightOn2 = false;
var lightOn3 = false;
var lightOn4 = false;
var lightOn5 = false;
var lightOn6 = false;
var lightOn7 = false;
var lightOn8 = false;
var lightOn9 = false;
var lightOn10 = false;
var lightOn11 = false;
var lightOn12 = false;
var lightOn13 = false;
var lightOn14 = false;
var lightOn15 = false;
var lightOn16 = false;
var lightOn17 = false;
var lightOn18 = false;
var lightOn19 = false;
var lightOn20 = false;

//Light/Color modifiers
var redMod = 0.05;
var greenMod = 0;
var blueMod = -0.1;
var ambLight = 0;
var lightIntensity = 0.5;
var lightColor = [lightIntensity, lightIntensity, lightIntensity];
var lightColor2 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor3 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor4 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor5 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor6 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor7 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor8 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor9 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor10 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor11 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor12 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor13 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor14 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor15 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor16 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor17 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor18 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor19 = [lightIntensity, lightIntensity, lightIntensity];
var lightColor20 = [lightIntensity, lightIntensity, lightIntensity];



/*========================= FPS Checking ========================= */
var fps = 30;
var currentTime=0;
var currentFps=0;
var oldTime=0;

function findFps() {
    currentTime = new Date().getTime();
    currentFps++;
    if (currentTime - oldTime >= 1000) {
        // document.getElementById("fps_counter").innerHTML = "<b>FPS: </b>" + Number(currentFps * 1000.0 / (currentTime - oldTime)).toPrecision( 5 );
        //Reset for next calc
        oldTime = currentTime;
        currentFps = 0;
    }
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
        window.setTimeout(callback, 1000 / fps);
    };
})();

/*========================= Camera Handling ========================= */
// Camera
var yAxisRot = -Math.PI;
var xAxisRot = Math.PI/2;
var lookSpeed = 1;
var cameraPosition = [-10.0, 30.0, -10.0];
var cameraOrientation = [0.0, 0.0, 0.0];

// Lock camera to mouse movements
CG.canvas.requestPointerLock = CG.canvas.requestPointerLock ||
CG.canvas.mozRequestPointerLock ||
CG.canvas.webkitRequestPointerLock;
document.exitPointerLock = document.exitPointerLock ||
document.mozExitPointerLock ||
document.webkitExitPointerLock;
//Start pointer lock
CG.canvas.onclick = function() {
    CG.canvas.requestPointerLock();
}
// Hook pointer lock state change events for different browsers
document.addEventListener("pointerlockchange", lockChangeAlert, false);
document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
document.addEventListener("webkitpointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
    if(document.pointerLockElement === CG.canvas ||
        document.mozPointerLockElement === CG.canvas ||
        document.webkitPointerLockElement === CG.canvas) {
            console.log("The pointer lock status is now locked");
            document.addEventListener("mousemove", changeCameraView, false);
        } else {
            console.log("The pointer lock status is now unlocked");
            document.removeEventListener("mousemove", changeCameraView, false);
        }
    }
    // Changes camera view based on mouse position changes
    function changeCameraView(e) {
        console.log(e);
        var movementX = e.movementX ||
        e.mozMovementX          ||
        e.webkitMovementX       ||
        0;
        var movementY = e.movementY ||
        e.mozMovementY      ||
        e.webkitMovementY   ||
        0;
        yAxisRot += movementX * lookSpeed * 0.005;
        xAxisRot += movementY * lookSpeed * 0.005;
    }
    // Updates the camera"s position + orientation
    function updateCameraDirection() {
        cameraOrientation = [Math.cos(yAxisRot)*Math.sin(xAxisRot), Math.cos(xAxisRot), Math.sin(yAxisRot)*Math.sin(xAxisRot)];
    }

    /*========================= Audio ========================= */
    var audio = new Audio("audio/lightOn.mp3");
    var audio2 = new Audio("audio/lightOn2.mp3");
    var audio3 = new Audio("audio/lightOn.mp3");
    var bgNoise = new Audio("audio/faintBuzz.mp3");
    bgNoise.loop = true;
    bgNoise.play();

    /*========================= Key Handling ========================= */
    //Movement vars
    var moveSpeed = 1;
    var doorMove;
    var blindMove;

    function checkKeys(keys) {
        if (keys[87]){ // "w"key -> Move forward at camera direction
        cameraPosition[0] += cameraOrientation[0]*moveSpeed;
        cameraPosition[1] += cameraOrientation[1]*moveSpeed;
        cameraPosition[2] += cameraOrientation[2]*moveSpeed;
    }
    if (keys[83]){ // "s"key -> Move backward at camera direction
    cameraPosition[0] -= cameraOrientation[0]*moveSpeed;
    cameraPosition[1] -= cameraOrientation[1]*moveSpeed;
    cameraPosition[2] -= cameraOrientation[2]*moveSpeed;
}
if (keys[68]){ // "d"key -> Move right relative to camera direction
cameraPosition[0] -= cameraOrientation[2]*moveSpeed;
cameraPosition[2] += cameraOrientation[0]*moveSpeed;
}
if (keys[65]){ // "a"key -> Move left relative to camera direction
cameraPosition[0] += cameraOrientation[2]*moveSpeed;
cameraPosition[2] -= cameraOrientation[0]*moveSpeed;
}
if (keys[81]){ // "q"key -> Drop camera height
cameraPosition[1] -= moveSpeed;
}
if (keys[69]){ // "e"key -> Increase camera height
cameraPosition[1] += moveSpeed;
}
if (keys[79]){ // "o"key -> Open door
clearInterval(doorMove);
doorMove = setInterval(function () {openDoor()}, 50);
keys[79]=false;
}
if (keys[80]){ // "p"key -> Close door
clearInterval(doorMove);
doorMove = setInterval(function () {closeDoor()}, 50);
keys[80]=false;
}
if (keys[78]){ // "n"key -> Open blind
clearInterval(blindMove);
blindMove = setInterval(function () {openBlinds()}, 50);
keys[78]=false;
}
if (keys[66]){ // "b"key -> Close blind
clearInterval(blindMove);
blindMove = setInterval(function () {closeBlinds()}, 50);
keys[66]=false;
}
if (keys[49]){ // "1"key -> Toggle Light 1+2
lightOn = !lightOn;
lightOn2 = !lightOn2;
lightOn3 = !lightOn3;
lightOn4 = !lightOn4;
audio.play();
keys[49]=false;
}
if (keys[50]){ // "2"key -> Toggle Light 3+4
lightOn5 = !lightOn5;
lightOn6 = !lightOn6;
lightOn7 = !lightOn7;
lightOn8 = !lightOn8;
audio.play();
keys[50]=false;
}
if (keys[51]){ // "3"key -> Toggle Light 5+6
lightOn9 = !lightOn9;
lightOn10 = !lightOn10;
lightOn11 = !lightOn11;
lightOn12 = !lightOn12;
audio2.play();
keys[51]=false;
}
if (keys[52]){ // "4"key -> Toggle Light 5+6
lightOn13 = !lightOn13;
lightOn14 = !lightOn14;
lightOn15 = !lightOn15;
lightOn16 = !lightOn16;
audio2.play();
keys[52]=false;
}
if (keys[53]){ // "5"key -> Toggle Light 5+6
lightOn17 = !lightOn17;
lightOn18 = !lightOn18;
lightOn19 = !lightOn19;
lightOn20 = !lightOn20;
audio.play();
keys[53]=false;
}
if (keys[77]){ // "m"key -> Toggle Light 5+6
discoLights();
}
if (keys[75]){ // "n"key -> Toggle Light 5+6
normalLights();
}
}

/*========================= Dynamic Objects ========================= */
//Open/Close Doors
function openDoor(){
    doorAngle +=0.05
    if(doorAngle >= 3*Math.PI/4 + 0.1){
        clearInterval(doorMove);
    }
}
function closeDoor(){
    doorAngle -=0.05
    if(doorAngle <= 0.1){
        doorAngle = 0
        clearInterval(doorMove);
    };
}

//Open/Close blinds
var blindSize = 20;
blindMove = setInterval(function () {closeBlinds()}, 50);

function openBlinds(){
    blindSize -=0.1
    if(blindSize < 0.1){
        blindSize = 0
        clearInterval(blindMove);
    };
    ambLight +=0.003
    if (ambLight >= 0.4){
        ambLight = 0.4;
    };
}
function closeBlinds(){
    blindSize +=0.1
    if(blindSize > 20){
        blindSize = 20
        clearInterval(blindMove);
    };
    ambLight -=0.003
    if (ambLight <= 0){
        ambLight = 0;
    };
}

setInterval(function () {flickerLight()}, 13000);
setInterval(function () {flickerLight2()}, 19000);

function flickerLight(){
    audio2.play();
    if (lightOn7 = true){
        lightOn7 = !lightOn7;
        setTimeout(function(){
            lightOn7 = !lightOn7;
        },200);
    };
}

function flickerLight2(){
    audio.play();
    if (lightOn7 = true){
        lightOn13 = !lightOn13;
        setTimeout(function(){
            lightOn13 = !lightOn13;
        },200);
    };
}

function introLights(){
    yAxisRot+=0.4
    setTimeout(function(){
        lightOn = !lightOn;
        lightOn2 = !lightOn2;
        lightOn3 = !lightOn3;
        lightOn4 = !lightOn4;
        audio.play();
    },5000);
    setTimeout(function(){
        lightOn5 = !lightOn5;
        lightOn6 = !lightOn6;
        lightOn7 = !lightOn7;
        lightOn8 = !lightOn8;
        audio2.play();
    },4000);
    setTimeout(function(){
        lightOn9 = !lightOn9;
        lightOn10 = !lightOn10;
        lightOn11 = !lightOn11;
        lightOn12 = !lightOn12;
        audio3.play();
    },3000);
    setTimeout(function(){
        lightOn13 = !lightOn13;
        lightOn14 = !lightOn14;
        lightOn15 = !lightOn15;
        lightOn16 = !lightOn16;
        audio.play();
    },2000);
    setTimeout(function(){
        lightOn17 = !lightOn17;
        lightOn18 = !lightOn18;
        lightOn19 = !lightOn19;
        lightOn20 = !lightOn20;
        audio2.play();
    },1000);
}

//Disco Light functionality
function discoLights(){
    redMod =  Math.random() * (2 - 0) - 1;
    greenMod =  Math.random() * (2 - 0) - 1;
    blueMod =  Math.random() * (2 - 0) - 1;
}
function normalLights(){
    console.log("norm");
    redMod = 0.05;
    greenMod = 0;
    blueMod = -0.1;
}

//Slender Note
function checkSlender(){
    if (cameraPosition[0]>-168 && cameraPosition[0]<-153){
        if (cameraPosition[1]>7.5 && cameraPosition[1]<17.5){
            if (cameraPosition[2]>-43 && cameraPosition[2]<-27){
                console.log("did");
                showSlender();
                return } } }
                hideSlender();
            }

//Overlay CSS editing
function showSlender(){
    document.getElementById("slenderNoteBG").style.position="absolute";
    document.getElementById("slenderNoteBG").style.top="0";
    document.getElementById("slenderNoteBG").style.left="0";
    document.getElementById("slenderNoteBG").style.display="block";
    document.getElementById("slenderNoteBG").style.paddingLeft="40%";
    document.getElementById("slenderNoteBG").style.paddingTop="20%";
    document.getElementById("slenderNoteBG").style.width="100%";
    document.getElementById("slenderNoteBG").style.height="100%";
    document.getElementById("slenderNoteBG").style.height="100%";
    document.getElementById("slenderNoteBG").style.backgroundColor="rgba(1,1,1,0.5)";
    document.getElementById("slenderNote").style.display="block";
    document.getElementById("slenderNote").style.width="181px";
    document.getElementById("slenderNote").style.height="257px";
    document.getElementById("slenderNote").style.backgroundImage="url(\"textures/slender2.jpeg\")";
    document.getElementById("slenderNote").style.backgroundSize="100%";
}
function hideSlender(){
    document.getElementById("slenderNoteBG").style.display="none";
    document.getElementById("slenderNote").style.display="none";
}

/*========================= Cube handling (coloured and textured) ========================= */
function makeCube(gl) {
    // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
    var c = new Object();
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);
    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);
    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);
    c.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    c.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    c.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    c.numIndices = indices.length;
    c.isTextured = false;

    if (!c.vertexBuffer || !c.indexBuffer || !c.normalBuffer) return null;
    return c;
}

function texturedCube(gl, imagePath) {
    var o = new Object();
    // Coordinatesï¼ˆCube which length of one side is 1 with the origin on the center of the bottom)
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);
    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);
    // Texture coordinates
    var texCoords = new Float32Array([
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ]);
    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    o.texture = initTextures(gl, imagePath)
    o.numIndices = indices.length;
    o.isTextured = true;

    if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer || !o.normalBuffer) return null;
    return o;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

/*========================= DrawShapes ========================= */
//Door position
var doorAngle = 0;

function draw(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_modelMatrix);
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
    drawNote(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();

    // document.getElementById("speed").innerHTML = "<b>Speed (Camera Sensitivity): </b>" + lookSpeed;
    // document.getElementById("camera_coords").innerHTML = "<b>Camera Coordinates: </b>" + cameraPosition[0].toFixed(2) + ", " + cameraPosition[1].toFixed(2) + ", " + cameraPosition[2].toFixed(2);
}

/*========================= Draw Tables ========================= */
function drawTables(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_modelMatrix);
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 6; k++) {
            drawTable(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -14 + k*-15, 15-(3*k), -37.5 -(75*l));
        };
    };
    drawPodium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160,2,-35);
    g_modelMatrix = popMatrix();
}

function drawTable(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(a_Color, black[0], black[1], black[2]);
    //Legs
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            pushMatrix(g_modelMatrix); // Draw Leg 1
            g_modelMatrix.translate(3.5 - (7 * i), 0.0, 30.5 - (61 * j));
            drawBox(gl, n, 0.5, 9.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_modelMatrix = popMatrix();
        };
    };
    gl.vertexAttrib3f(a_Color, brown[0], brown[1], brown[2]);
    // Top
    g_modelMatrix.translate(0.0, 9.0, 0.0); //move to table centre
    pushMatrix(g_modelMatrix);
    drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();

    // Front
    g_modelMatrix.rotate(90.0, 0.0, 0, 90.0);
    g_modelMatrix.translate(-3.5, 3.0, 0.0);
    pushMatrix(g_modelMatrix);
    drawBox(gl, n, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}

function drawPodium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    // Top
    g_modelMatrix.translate(0.0, 10.0, 0.0); //move to table centre
    pushMatrix(g_modelMatrix);
    drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
    // Front
    g_modelMatrix.rotate(90.0, 0.0, 0, 90.0);
    g_modelMatrix.translate(-7, -7, 0.0);
    pushMatrix(g_modelMatrix);
    drawBox(gl, n, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
    // Sides
    g_modelMatrix.rotate(90.0, 9.0, 0, 0.0);
    g_modelMatrix.translate(0.0, 30.5, -7.0);
    for (var i = 0; i < 2; i++) {
        g_modelMatrix.translate(0.0, -(61.5*i), 0.0);
        pushMatrix(g_modelMatrix);
        drawBox(gl, n, 14.0, 0.5, 14.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        g_modelMatrix = popMatrix();
    };
}

/*========================= Draw Chairs ========================= */
function drawChairs(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_modelMatrix);
    for (var h = 0; h < 2; h++) {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                drawChair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -10 + i*-15, 15-(3*i),
                -12.5 - (h * 75) + (j * -8.5), 10*i);
            };
        };
    };
    g_modelMatrix = popMatrix();
}

function drawChair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
    g_modelMatrix.setTranslate(x, y, z);
    gl.vertexAttrib3f(a_Color, black[0], black[1], black[2]);
    //Legs
    for (var l = 0; l < 2; l++) {
        for (var k = 0; k < 2; k++) {
            pushMatrix(g_modelMatrix); // Draw Leg 1
            g_modelMatrix.translate(2.5 - (5 * l), 0.0, 2.5 - (5 * k));
            drawBox(gl, n, 0.5, 5.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            g_modelMatrix = popMatrix();
        };
    };
    // Move to the centre of chair
    g_modelMatrix.translate(0.0, 5.0, 0.0);
    gl.vertexAttrib3f(a_Color, purple[0], purple[1], purple[2]);
    // Draw Seat
    //gl.uniform1f(u_Scale, 1.0);//change scale
    pushMatrix(g_modelMatrix);
    drawBox(gl, n, 6.0, 0.5, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
    //gl.uniform1f(u_Scale, 1.0);//change back

    // Move back of chair
    g_modelMatrix.translate(2.5, 0.5, 0.0);

    // Draw back of chair
    pushMatrix(g_modelMatrix);
    g_modelMatrix.rotate(90.0, 0.0, 0.5, 0.0);  // Rotate around the y-axis
    drawBox(gl, n, 6.0, 7.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}

/*========================= Draw Floor/Steps ========================= */
function drawFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(a_Color, grey[0], grey[1], grey[2]);
    g_modelMatrix.setTranslate(-100, -1, -75);
    drawBox(gl, n, 200.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    gl.vertexAttrib3f(a_Color, green[0], green[1], green[2]);
    g_modelMatrix.setTranslate(-100, -2, -75);
    drawBox(gl, n, 500.0, 1.0, 500.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    drawSteps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawSteps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(a_Color, grey[0], grey[1], grey[2]);
    pushMatrix(g_modelMatrix);
    for (var p = 1; p < 6; p++) {
        drawStep(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, 3.95 + (p *-15), 13-(3*p), -77.5, n);
    };
    g_modelMatrix = popMatrix();
}

function drawStep(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z){
    g_modelMatrix.setTranslate(x, y, z);
    pushMatrix(g_modelMatrix);// Draw Leg 1
    g_modelMatrix.translate(2.5, 0.0, 2.5);
    drawBox(gl, n, 19, 5.0, 149, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}

function drawStage(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(a_Color, darkGrey[0], darkGrey[1], darkGrey[2]);
    g_modelMatrix.setTranslate(-174.5, 0, -75);
    drawBox(gl, n, 49.0, 2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}


/*========================= Draw Room ========================= */
function drawWalls(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(a_Color, cream[0], cream[1], cream[2]);
    //Back part of door wall
    g_modelMatrix.setTranslate(-56, 0, -149.5);
    drawBox(gl, n, 112.0, 26, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Door wall top panel
    g_modelMatrix.setTranslate(-100, 26, -149.5);
    drawBox(gl, n, 200.0, 24, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Door wall front panel
    g_modelMatrix.setTranslate(-164, 0, -149.5);
    drawBox(gl, n, 72.0, 26, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    //Not door wall
    g_modelMatrix.setTranslate(-10, 0, -0.5);
    for (var i = 0; i < 9; i++) {
        drawBox(gl, n, 20.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        if (i==8){
            break;
        }
        for (var j = 0; j < 2; j++) {
            g_modelMatrix.setTranslate(-22.5 -(25* i), 0 + (j*35), -0.5);
            drawBox(gl, n, 5, 15, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        };
        g_modelMatrix.setTranslate(-10 -(25 * i), 0, -0.5);
    };
    //Front wall
    g_modelMatrix.setTranslate(-199.5, 0, -75);
    g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    drawBox(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //Back wall
    g_modelMatrix.setTranslate(0,0,-75);
    g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    drawBox(gl, n, 149.0, 50, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    //roof
    g_modelMatrix.setTranslate(-100, 50, -75);
    drawBox(gl, n, 200.0, 1, 150, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawSliders(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    gl.vertexAttrib3f(a_Color, lightBrown[0], lightBrown[1], lightBrown[2]);
    g_modelMatrix.setTranslate(-198, 10, -75);
    drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -69.5)
    drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, 139)
    drawBox(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawBoards(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    g_modelMatrix.setTranslate(-198.5, 11, -109.75);
    drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, 69.5)
    drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(1, 19.5, 0);
    drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -69.5)
    drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawBoard(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(a_Color, greyGreen[0], greyGreen[1], greyGreen[2]);
    drawBox(gl, texCube2, 0.3, 16, 68, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    gl.vertexAttrib3f(a_Color, grey[0], grey[1], grey[2]);
    g_modelMatrix.translate(0, 0, 0);// Bottom frame
    drawBox(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 16, 0);// Top frame
    drawBox(gl, n, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, -16, 34); //Left frame
    drawBox(gl, n, 0.5, 16, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix.translate(0, 0, -68); //Right frame
    drawBox(gl, n, 0.5, 16, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}
/*========================= Draw Dynamic Elements ========================= */
function drawBlinds(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.vertexAttrib3f(a_Color, grey[0], grey[1], grey[2]);
    for (var i = 0; i < 8; i++) {
        g_modelMatrix.setTranslate(-22.5 -(25* i), 35-(blindSize), -0.5);
        drawBox(gl, n, 5, blindSize, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    };
};

function drawDoor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle){
    gl.vertexAttrib3f(a_Color, brown[0], brown[1], brown[2]);
    g_modelMatrix.setTranslate(0, 0, 0);
    g_modelMatrix.translate(-128 +Math.cos(doorAngle)*8, 0, -149.5 -Math.sin(doorAngle)*8);
    g_modelMatrix.rotate(doorAngle*360/(2*Math.PI), 0, 1, 0);
    drawBox(gl, n, 16.0, 26, 0.7, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function drawLights(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(a_Color, 1, 1, 1);
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            g_modelMatrix.setTranslate(-20-(40*i), 49.5, -15-(40*j));
            drawBox(gl, n, 2.6, 0.4, 13, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        };
    };
    g_modelMatrix = popMatrix();
}

function drawSkyPlane(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(a_Color, 1, 1, 1);
    g_modelMatrix.setTranslate(-200,-20,200);
    drawBox(gl, texCube, 16000, 400, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}

function drawNote(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix){
    pushMatrix(g_modelMatrix);
    gl.vertexAttrib3f(a_Color, 1, 1, 1);
    g_modelMatrix.setTranslate(-160,12.5,-35);
    g_modelMatrix.rotate(90.0, 0.0, 0.5, 0.0);
    drawBox(gl, texCube3, 2.1, 0.05, 2.97, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    g_modelMatrix = popMatrix();
}

/*========================= Draw Matrix ========================= */

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
    return g_matrixStack.pop();
}

// Coordinate transformation matrix for normals
var g_normalMatrix = new Matrix4();

/*========================= Draw Box ========================= */
function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    pushMatrix(g_modelMatrix);   // Save the model matrix
    // console.log("g_MM is ", g_modelMatrix);
    initAttributeVariable(gl, a_Position, n.vertexBuffer);    // Vertex coordinates
    // console.log("n is ", n);
    initAttributeVariable(gl, a_Normal, n.normalBuffer);  // Texture coordinates
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
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    // console.log("the mysterious "n" is", n);

    if (n.isTextured != false){
        gl.uniform1i(u_IsTexture, true);
        initAttributeVariable(gl, a_TexCoord, n.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, n.texture);
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
        gl.uniform1i(u_IsTexture, false);
    }
    else{
        gl.drawElements(gl.TRIANGLES, n.numIndices, n.indexBuffer.type, 0);
    }
    g_modelMatrix = popMatrix();   // Retrieve the model matrix
}
/*========================= Init Arrays ========================= */
function initArrayBufferForLaterUse(gl, data, num, type) {
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

function initElementArrayBufferForLaterUse(gl, data, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to create the buffer object");
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.type = type;

    return buffer;
}

function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

function initTextures(gl, imagePath) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.error("Failed to create the Texture object");
        return null;
    }
    // if (!u_Sampler) {
    //   console.error("Failed to get the storage location of u_Sampler");
    //   return null;
    // }
    var image = new Image();  // Create image object
    if (!image) {
        console.error("Failed to create the Image object");
        return null;
    }
    // Register the event handler to be called when image loading is completed
    image.onload = function() {
        // Write image data to texture object
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
        //gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // Pass the texture unit 0 to u_Sampler
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(u_Sampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the texture object
    };

    // Tell the browser to load an Image
    image.src = imagePath;
    return texture;
}
