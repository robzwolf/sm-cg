/* draw_elements.js
 * Handles creating the geometry of the scene
 */

CG.draw = {

    "scene": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);

        CG.draw.floor    (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.walls    (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.blinds   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.darkFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.floorDivider(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.sliders  (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.boards   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.lights   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.tables   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.chairs   (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.skyPlane (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.corridor (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.draw.door     (gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, CG.doorAngle);
        CG.g_ModelMatrix = CG.popMatrix();

    },

    /* CORRIDOR */
    "corridor": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);

        // Big outside wall
        CG.draw.bigOutsideCorridorWall(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Floor
        CG.draw.corridorFloor(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Sign
        CG.draw.corridorSign(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_ModelMatrix = CG.popMatrix();
    },

    "bigOutsideCorridorWall": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.wallBlue[0], CG.COLORS.wallBlue[1], CG.COLORS.wallBlue[2]);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.g_ModelMatrix.translate(60.0, -12.0, 100.0);
        CG.draw.box(gl, plainCube, 200.0, 72.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    "corridorFloor": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkRed[0], CG.COLORS.darkRed[1], CG.COLORS.darkRed[2]);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.g_ModelMatrix.translate(60.0, -12.0, 70.0);
        CG.draw.box(gl, corrFloorTexCube, 200.0, 1.0, 60.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    "corridorSign": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        // corrSignTexCube
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkRed[0], CG.COLORS.darkRed[1], CG.COLORS.darkRed[2]);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.g_ModelMatrix.translate(70.0, 12.0, 99.4);
        CG.draw.box(gl, corrSignTexCube, 20.0, 10.0, 0.05, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    /* TABLES */
    "tables": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);

        for (var i = 0; i < 2; i++) {
            for (var j = 3; j < 6; j++) {
                CG.draw.table(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix,
                    -14 -15*j, 0, -37.5 - 75*i);
            }
        }

        CG.draw.podium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160.0, 2.0, -35.0);

        CG.g_ModelMatrix = CG.popMatrix();
    },

    "table": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
        CG.g_ModelMatrix.setTranslate(x, y, z);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);

        // Legs
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                CG.pushMatrix(CG.g_ModelMatrix);
                CG.g_ModelMatrix.translate(3.5 - 7*i, 0.0, 30.5);
                CG.draw.box(gl, plainCube, 0.5, 9.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
                CG.g_ModelMatrix = CG.popMatrix();
            }
        }

        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);

        // Top
        // Move to table centre
        CG.g_ModelMatrix.translate(0.0, 9.0, 0.0);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.draw.box(gl, plainCube, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();

        // Front
        CG.g_ModelMatrix.rotate(90.0, 0.0, 0.0, 90.0);
        CG.g_ModelMatrix.translate(-3.5, 3.0, 0.0);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.draw.box(gl, plainCube, 8.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    "podium": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
        CG.g_ModelMatrix.setTranslate(x, y, z);

        // Top
        // Move to table centre
        CG.g_ModelMatrix.translate(0.0, 10.0, 0.0);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.draw.box(gl, plainCube, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();

        // Front
        CG.g_ModelMatrix.rotate(90.0, 0.0, 0.0, 90.0);
        CG.g_ModelMatrix.translate(-7.0, -7.0, 0.0);
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.draw.box(gl, plainCube, 14.0, 0.5, 62.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();

        // Sides
        CG.g_ModelMatrix.rotate(90.0, 9.0, 0.0, 0.0);
        CG.g_ModelMatrix.translate(0.0, 30.5, -7.0);
        for (var i = 0; i < 2; i++) {
            CG.g_ModelMatrix.translate(0.0, -61.5*i, 0.0);
            CG.pushMatrix(CG.g_ModelMatrix);
            CG.draw.box(gl, plainCube, 14.0, 0.5, 14.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            CG.g_ModelMatrix = CG.popMatrix();
        }
    },

    /* CHAIRS */
    "chairs": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);
        for (var i = 0; i < 2; i++) {
            for (var j = 3; j < 6; j++) {
                for (var k = 0; k < 7; k++) {
                    CG.draw.chair(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix,
                        -10 + j*-15, 0, -12.5 - i*75 - k*8.5, 10*j);
                }
            }
        }
        CG.g_ModelMatrix = CG.popMatrix();
    },

    "chair": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
        CG.g_ModelMatrix.setTranslate(x, y, z);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.black[0], CG.COLORS.black[1], CG.COLORS.black[2]);

        // Legs
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                CG.pushMatrix(CG.g_ModelMatrix);
                CG.g_ModelMatrix.translate(2.5 - (5 * i), 0.0, 2.5 - (5 * j));
                CG.draw.box(gl, plainCube, 0.5, 5.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
                CG.g_ModelMatrix = CG.popMatrix();
            }
        }

        // Move to the centre of chair
        CG.g_ModelMatrix.translate(0.0, 5.0, 0.0);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.purple[0], CG.COLORS.purple[1], CG.COLORS.purple[2]);

        // Draw seat of chair
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.draw.box(gl, plainCube, 6.0, 0.5, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();

        // Move to back of chair
        CG.g_ModelMatrix.translate(2.5, 0.5, 0.0);

        // Draw back of chair
        CG.pushMatrix(CG.g_ModelMatrix);
        CG.g_ModelMatrix.rotate(90.0, 0.0, 0.5, 0.0);  // Rotate around the y-axis
        CG.draw.box(gl, plainCube, 6.0, 7.0, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    /* FLOOR AND STEPS */
    "floor": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        // Room floor
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
        CG.g_ModelMatrix.setTranslate(-125.0, -1, -75);
        CG.draw.box(gl, floorTexCube, 150.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Outside grass
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.green[0], CG.COLORS.green[1], CG.COLORS.green[2]);
        CG.g_ModelMatrix.setTranslate(-100, -2, -75);
        CG.draw.box(gl, plainCube, 2000.0, 1.0, 2000.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

    },

    "darkFloor": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkGrey[0], CG.COLORS.darkGrey[1], CG.COLORS.darkGrey[2]);
        CG.g_ModelMatrix.setTranslate(-174.5, -1.99, -75);
        CG.draw.box(gl, darkCarpetTexCube, 49.0, 2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "floorDivider": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkGrey[0], CG.COLORS.darkGrey[1], CG.COLORS.darkGrey[2]);
        CG.g_ModelMatrix.setTranslate(-149.5, 0.0, -75.0);
        CG.draw.box(gl, plainCube, 1.0, 0.2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    /* ROOM */
    "walls": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.wallBlue[0], CG.COLORS.wallBlue[1], CG.COLORS.wallBlue[2]);

        /* Door wall */
        // Back part of door wall
        CG.g_ModelMatrix.setTranslate(-81.0, 0.0, -0.5);
        CG.draw.box(gl, plainCube, 62.0, 32.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Top part of door wall
        CG.g_ModelMatrix.setTranslate(-125.0, 32.0, -0.5);
        CG.draw.box(gl, plainCube, 150.0, 38.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Front part of door wall
        CG.g_ModelMatrix.setTranslate(-164.0, 0.0, -0.5);
        CG.draw.box(gl, plainCube, 72.0, 32.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        /* Windowed wall */
        CG.g_ModelMatrix.setTranslate(-194.0, 0.0, -149.5);
        CG.draw.box(gl, plainCube, 10.0, 70.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Vertical bits
        (function(){for (var i = 0; i < 3; i++) {
            CG.g_ModelMatrix.setTranslate(-194.0 + 70*i, 0.0, -149.5);
            CG.draw.box(gl, plainCube, 10.0, 70.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        }})();

        // Bits above and below windows
        CG.g_ModelMatrix.setTranslate(-159.0, 55.0, -149.5);
        CG.draw.box(gl, plainCube, 60.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix.setTranslate(-89.0, 55.0, -149.5);
        CG.draw.box(gl, plainCube, 60.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix.setTranslate(-159.0, 0.0, -149.5);
        CG.draw.box(gl, plainCube, 60.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix.setTranslate(-89.0, 0.0, -149.5);
        CG.draw.box(gl, plainCube, 60.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Window sills
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.lightBrown[0], CG.COLORS.lightBrown[1], CG.COLORS.lightBrown[2]);
        CG.g_ModelMatrix.setTranslate(-159.0, 15.0, -147.5);
        CG.draw.box(gl, plainCube, 60.0, 1.0, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix.setTranslate(-89.0, 15.0, -147.5);
        CG.draw.box(gl, plainCube, 60.0, 1.0, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.wallBlue[0], CG.COLORS.wallBlue[1], CG.COLORS.wallBlue[2]);

        /* Front wall */
        CG.g_ModelMatrix.setTranslate(-199.5, 0, -45.0);
        CG.g_ModelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
        CG.draw.box(gl, plainCube, 329.0, 70.5, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        // former width 209

        /* Back wall */
        CG.g_ModelMatrix.setTranslate(-50.5, 0.0, -45.0);
        CG.g_ModelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
        CG.draw.box(gl, plainCube, 329.0, 70.5, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        // former width 209

        /* Roof */
        CG.g_ModelMatrix.setTranslate(-125, 70, -75);
        CG.draw.box(gl, ceilingTexCube, 270.0, 1.0, 270.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "sliders": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.lightBrown[0], CG.COLORS.lightBrown[1], CG.COLORS.lightBrown[2]);

        CG.g_ModelMatrix.setTranslate(-198, 10, -75);
        CG.draw.box(gl, plainCube, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_ModelMatrix.translate(0, 0, -69.5)
        CG.draw.box(gl, plainCube, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_ModelMatrix.translate(0, 0, 139)
        CG.draw.box(gl, plainCube, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "boards": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.g_ModelMatrix.setTranslate(-198.5, 11, -109.75);
        CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_ModelMatrix.translate(0, 0, 69.5)
        CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // CG.g_ModelMatrix.translate(1, 19.5, 0);
        // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        //
        // CG.g_ModelMatrix.translate(0, 0, -69.5)
        // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "board": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        CG.draw.box(gl, boardTexCube, 0.3, 36, 68, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);

        // Bottom frame
        CG.g_ModelMatrix.translate(0, 0, 0);
        CG.draw.box(gl, plainCube, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Top frame
        CG.g_ModelMatrix.translate(0, 36, 0);
        CG.draw.box(gl, plainCube, 0.5, 0.5, 69, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Left frame
        CG.g_ModelMatrix.translate(0, -36, 34);
        CG.draw.box(gl, plainCube, 0.5, 36, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Right frame
        CG.g_ModelMatrix.translate(0, 0, -68);
        CG.draw.box(gl, plainCube, 0.5, 36, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_ModelMatrix = CG.popMatrix();
    },

    /* DYNAMIC ELEMENTS */
    "blinds": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        // gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
        // for (var i = 0; i < 8; i++) {
        //     CG.g_ModelMatrix.setTranslate(-22.5 - 25*i, 35 - CG.blindSize, -0.5);
        //     CG.draw.box(gl, plainCube, 5, CG.blindSize, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        // }
    },

    "door": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);
        CG.g_ModelMatrix.setTranslate(0, 0, 0);
        CG.g_ModelMatrix.translate(-128 + Math.cos(CG.doorAngle)*8, 0, -0.5 - Math.sin(CG.doorAngle)*8);
        CG.g_ModelMatrix.rotate(CG.doorAngle * 360 / (2*Math.PI), 0, 1, 0);
        CG.draw.box(gl, doorTexCube, 16.0, 32, 0.7, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "lights": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 4; j++) {
                CG.g_ModelMatrix.setTranslate(-25 - 40*i, 69.5, -15 - 40*j);
                CG.draw.box(gl, plainCube, 2.6, 0.4, 13, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            }
        }
        CG.g_ModelMatrix = CG.popMatrix();
    },

    "skyPlane": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        CG.g_ModelMatrix.setTranslate(-200, -20, -500);
        CG.draw.box(gl, skyTexCube, 1600, 400, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_ModelMatrix = CG.popMatrix();
    },

    /* GENERIC BOX */
    "box": function(gl, plainCube, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_ModelMatrix);   // Save the model matrix
        CG.initAttributeVariable(gl, CG.a_Position, plainCube.vertexBuffer);    // Vertex coordinates
        CG.initAttributeVariable(gl, CG.a_Normal, plainCube.normalBuffer);  // Texture coordinates
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plainCube.indexBuffer);

        // Scale a cube and draw
        CG.g_ModelMatrix.scale(width, height, depth);

        // Pass the model matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, CG.g_ModelMatrix.elements);

        // Calculate the model view project matrix and pass it to u_MvpMatrix
        CG.g_mvpMatrix.set(viewProjMatrix);
        CG.g_mvpMatrix.multiply(CG.g_ModelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, CG.g_mvpMatrix.elements);

        // Calculate the normal transformation matrix and pass it to u_NormalMatrix
        CG.g_normalMatrix.setInverseOf(CG.g_ModelMatrix);
        CG.g_normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, CG.g_normalMatrix.elements);

        if (plainCube.isTextured != false) {
            gl.uniform1i(CG.u_IsTexture, true);
            CG.initAttributeVariable(gl, CG.a_TexCoord, plainCube.texCoordBuffer);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, plainCube.texture);
            gl.drawElements(gl.TRIANGLES, plainCube.numIndices, plainCube.indexBuffer.type, 0);
            gl.uniform1i(CG.u_IsTexture, false);
        } else {
            gl.drawElements(gl.TRIANGLES, plainCube.numIndices, plainCube.indexBuffer.type, 0);
        }

        // Retrieve the model matrix
        CG.g_ModelMatrix = CG.popMatrix();
    }

}
