/* main.js
 * Draws everything on the screen
 */

// window.CG is first defined in index.html head script

// Canvas
CG.canvas = document.getElementById("classroom");

function main() {

    console.log("onload()");

    // Hide the loading screen and show the canvas
    document.getElementById("loading-overlay").className = "hidden";
    CG.canvas.className = "";

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
    if (!initShaders(gl, CG.shaders.VSHADER_SOURCE, CG.shaders.FSHADER_SOURCE)) {
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
            (CG.lightColor[i][0]) * CG.LIGHT_ON[i],
            (CG.lightColor[i][1]) * CG.LIGHT_ON[i],
            (CG.lightColor[i][2]) * CG.LIGHT_ON[i]);
        }

        gl.uniform3f(u_AmbientLight, CG.ambLight, CG.ambLight, CG.ambLight);
    }

    // Set the light positions, relative to the world co-ordinates
    gl.uniform3f(u_LightPosArr[1],   -25.0, 60.0,  -15.0);
    gl.uniform3f(u_LightPosArr[2],   -25.0, 60.0,  -55.0);
    gl.uniform3f(u_LightPosArr[3],   -25.0, 60.0,  -95.0);
    gl.uniform3f(u_LightPosArr[4],   -25.0, 60.0, -135.0);
    gl.uniform3f(u_LightPosArr[5],   -65.0, 60.0,  -15.0);
    gl.uniform3f(u_LightPosArr[6],   -65.0, 60.0,  -55.0);
    gl.uniform3f(u_LightPosArr[7],   -65.0, 60.0,  -95.0);
    gl.uniform3f(u_LightPosArr[8],   -65.0, 60.0, -135.0);
    gl.uniform3f(u_LightPosArr[9],  -105.0, 60.0,  -15.0);
    gl.uniform3f(u_LightPosArr[10], -105.0, 60.0,  -55.0);
    gl.uniform3f(u_LightPosArr[11], -105.0, 60.0,  -95.0);
    gl.uniform3f(u_LightPosArr[12], -105.0, 60.0, -135.0);
    gl.uniform3f(u_LightPosArr[13], -145.0, 60.0,  -15.0);
    gl.uniform3f(u_LightPosArr[14], -145.0, 60.0,  -55.0);
    gl.uniform3f(u_LightPosArr[15], -145.0, 60.0,  -95.0);
    gl.uniform3f(u_LightPosArr[16], -145.0, 60.0, -135.0);
    gl.uniform3f(u_LightPosArr[17], -185.0, 60.0,  -15.0);
    gl.uniform3f(u_LightPosArr[18], -185.0, 60.0,  -55.0);
    gl.uniform3f(u_LightPosArr[19], -185.0, 60.0,  -95.0);
    gl.uniform3f(u_LightPosArr[20], -185.0, 60.0, -135.0);

    // Set the ambient light level
    // + 0.2 on the blue channel to simulate daylight
    gl.uniform3f(u_AmbientLight, CG.ambLight, CG.ambLight, CG.ambLight + 0.2);


    // Prepare geometry
    plainCube    = CG.makeCube(gl);
    if (plainCube < 0) {
        console.error("Failed to set the vertex information");
        return;
    }

    skyTexCube        = CG.texturedCube(gl, CG.hardURL.sky);
    boardTexCube      = CG.texturedCube(gl, CG.hardURL.board);
    floorTexCube      = CG.texturedCube(gl, CG.hardURL.floor);
    ceilingTexCube    = CG.texturedCube(gl, CG.hardURL.ceiling);
    doorTexCube       = CG.texturedCube(gl, CG.hardURL.door);
    darkCarpetTexCube = CG.texturedCube(gl, CG.hardURL.darkCarpet);

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
        // CG.findFps();

        // Start drawing
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Initially set camera
        CG.updateCameraDirection();
        updateLights();

        viewProjMatrix.setPerspective(CG.cameraFovY, CG.canvas.width / CG.canvas.height, 1.0, 725.0);
        viewProjMatrix.lookAt(CG.cameraPosition[0], CG.cameraPosition[1], CG.cameraPosition[2],
            CG.cameraPosition[0] + CG.cameraOrientation[0],
            CG.cameraPosition[1] + CG.cameraOrientation[1],
            CG.cameraPosition[2] + CG.cameraOrientation[2],
            0.0, 1.0, 0);

        // Draw scene
        CG.draw.scene(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Handle key presses
        CG.checkKeys(keys);
    }
}

/* Source: https://stackoverflow.com/a/7228322/2176546, retrieved 21/03/2018 */
CG.randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
