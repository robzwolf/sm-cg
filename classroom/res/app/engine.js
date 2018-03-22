/* engine.js
 * Computes all the geometry, lightning etc before drawing it
 */

/* LIGHTING */
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
CG.ambLight       = CG.NUM_CONSTS.ambLight.INITIAL;
CG.lightIntensity = CG.NUM_CONSTS.lightIntensity.INITIAL;


CG.lightColor = [null];
for (var j = 1; j <= 20; j++) {
    CG.lightColor.push([CG.lightIntensity, CG.lightIntensity, CG.lightIntensity]);
}


window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || function(callback) { setTimeout(callback, 50); };
})();


/* CUBES */
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
    t.texture        = CG.initTextures(gl, imagePath);
    t.numIndices     = indices.length;
    t.isTextured     = true;

    if (!t.vertexBuffer || !t.texCoordBuffer || !t.indexBuffer || !t.normalBuffer) {
        return null;
    }
    return t;
}

// Coordinate transformation matrix
CG.g_ModelMatrix = new Matrix4();
CG.g_mvpMatrix = new Matrix4();

// Door position
CG.doorAngle = CG.NUM_CONSTS.doorAngle.INITIAL;


/* MATRIX FOR DRAWING */
// Array for storing the matrix(/-ces)
CG.g_matrixStack = [];

// Store a matrix in the array
CG.pushMatrix = function(m) {
    var _m = new Matrix4(m);
    CG.g_matrixStack.push(_m);
}

// Retrieve the matrix from the array
CG.popMatrix = function() {
    return CG.g_matrixStack.pop();
}

// Co-ordinate transformation matrix for normals
CG.g_normalMatrix = new Matrix4();


/* ARRAY INITIALISERS */
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
    var img = document.querySelectorAll("[src='" + imagePath + "']")[0];
    if (!img) {
        console.error("Failed to create the Image object");
        return null;
    }

    console.log(img);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

    // Flip the image around the horizontal axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Bind and prep the texture
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Unbind the texture object
    gl.bindTexture(gl.TEXTURE_2D, null);

    return tex;
}
