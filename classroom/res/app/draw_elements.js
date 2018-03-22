/* draw_elements.js
 * Handles creating the geometry of the scene
 */

CG.draw = {

    "scene": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
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

    },

    /* TABLES */
    "tables": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_modelMatrix);

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 6; j++) {
                CG.draw.table(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix,
                    -14 -15*j, 15 - 3*j, -37.5 - 75*i);
            }
        }

        CG.draw.podium(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, -160.0, 2.0, -35.0);

        CG.g_modelMatrix = CG.popMatrix();
    },

    "table": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
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
    },

    "podium": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
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
    },

    /* CHAIRS */
    "chairs": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
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
    },

    "chair": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
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
    },

    /* FLOOR AND STEPS */
    "floor": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        // Room floor
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
        CG.g_modelMatrix.setTranslate(-100, -1, -75);
        CG.draw.box(gl, n, 200.0, 1.0, 150.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Outside grass
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.green[0], CG.COLORS.green[1], CG.COLORS.green[2]);
        CG.g_modelMatrix.setTranslate(-100, -2, -75);
        CG.draw.box(gl, n, 2000.0, 1.0, 2000.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.draw.steps(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "steps": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
        CG.pushMatrix(CG.g_modelMatrix);
        for (var i = 1; i < 6; i++) {
            CG.draw.step(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, 3.95 - 15*i, 13 - 3*i, -77.5, n);
        };
        CG.g_modelMatrix = CG.popMatrix();
    },

    "step": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, x, y, z) {
        CG.g_modelMatrix.setTranslate(x, y, z);
        CG.pushMatrix(CG.g_modelMatrix);
        CG.g_modelMatrix.translate(2.5, 0.0, 2.5);
        CG.draw.box(gl, n, 19, 5.0, 149, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_modelMatrix = CG.popMatrix();
    },

    "stage": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.darkGrey[0], CG.COLORS.darkGrey[1], CG.COLORS.darkGrey[2]);
        CG.g_modelMatrix.setTranslate(-174.5, 0, -75);
        CG.draw.box(gl, n, 49.0, 2, 148, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    /* ROOM */
    "walls": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.wallBlue[0], CG.COLORS.wallBlue[1], CG.COLORS.wallBlue[2]);

        // Back part of door wall
        // CG.g_modelMatrix.setTranslate(-81.0, 0.0, -149.5);
        CG.g_modelMatrix.setTranslate(-81.0, 0.0, -0.5);
        CG.draw.box(gl, n, 62.0, 31.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Top part of door wall
        // CG.g_modelMatrix.setTranslate(-125.0, 31.0, -149.5);
        CG.g_modelMatrix.setTranslate(-125.0, 31.0, -0.5);
        CG.draw.box(gl, n, 150.0, 44.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Front part of door wall
        // CG.g_modelMatrix.setTranslate(-164.0, 0.0, -149.5);
        CG.g_modelMatrix.setTranslate(-164.0, 0.0, -0.5);
        CG.draw.box(gl, n, 72.0, 31.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // // Opposite door wall
        // CG.g_modelMatrix.setTranslate(-10, 0.0, -0.5);
        // for (var i = 0; i < 9; i++) {
        //     CG.draw.box(gl, n, 20.0, 50.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        //     if (i == 8) {
        //         break;
        //     }
        //     for (var j = 0; j < 2; j++) {
        //         CG.g_modelMatrix.setTranslate(-22.5 -25*i, 0 + 35*j, -0.5);
        //         CG.draw.box(gl, n, 5.0, 15.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        //     }
        //     CG.g_modelMatrix.setTranslate(-10.0 -25*i, 0.0, -0.5);
        // }

        // Front wall
        CG.g_modelMatrix.setTranslate(-199.5, 0, -75.0);
        CG.g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
        CG.draw.box(gl, n, 149.0, 70.5, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Back wall
        CG.g_modelMatrix.setTranslate(-50.5, 0.0, -75.0);
        CG.g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0);  // Rotate around the y-axis
        CG.draw.box(gl, n, 149.0, 70.5, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // Roof
        CG.g_modelMatrix.setTranslate(-125, 70, -75);
        CG.draw.box(gl, n, 250.0, 1.0, 250.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "sliders": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.lightBrown[0], CG.COLORS.lightBrown[1], CG.COLORS.lightBrown[2]);

        CG.g_modelMatrix.setTranslate(-198, 10, -75);
        CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_modelMatrix.translate(0, 0, -69.5)
        CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_modelMatrix.translate(0, 0, 139)
        CG.draw.box(gl, n, 2, 38, 0.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "boards": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.g_modelMatrix.setTranslate(-198.5, 11, -109.75);
        CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        CG.g_modelMatrix.translate(0, 0, 69.5)
        CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

        // CG.g_modelMatrix.translate(1, 19.5, 0);
        // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        //
        // CG.g_modelMatrix.translate(0, 0, -69.5)
        // CG.draw.board(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "board": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_modelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        CG.draw.box(gl, boardTexCube, 0.3, 36, 68, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);

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
    },

    /* DYNAMIC ELEMENTS */
    "blinds": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        // gl.vertexAttrib3f(CG.a_Color, CG.COLORS.grey[0], CG.COLORS.grey[1], CG.COLORS.grey[2]);
        // for (var i = 0; i < 8; i++) {
        //     CG.g_modelMatrix.setTranslate(-22.5 - 25*i, 35 - CG.blindSize, -0.5);
        //     CG.draw.box(gl, n, 5, CG.blindSize, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        // }
    },

    "door": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, doorAngle) {
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.brown[0], CG.COLORS.brown[1], CG.COLORS.brown[2]);
        CG.g_modelMatrix.setTranslate(0, 0, 0);
        CG.g_modelMatrix.translate(-128 + Math.cos(CG.doorAngle)*8, 0, -0.5 - Math.sin(CG.doorAngle)*8);
        CG.g_modelMatrix.rotate(CG.doorAngle * 360 / (2*Math.PI), 0, 1, 0);
        CG.draw.box(gl, n, 16.0, 31, 0.7, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    },

    "lights": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_modelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 4; j++) {
                CG.g_modelMatrix.setTranslate(-25 - 40*i, 69.5, -15 - 40*j);
                CG.draw.box(gl, n, 2.6, 0.4, 13, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
            }
        }
        CG.g_modelMatrix = CG.popMatrix();
    },

    "skyPlane": function(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
        CG.pushMatrix(CG.g_modelMatrix);
        gl.vertexAttrib3f(CG.a_Color, CG.COLORS.white[0], CG.COLORS.white[1], CG.COLORS.white[2]);
        CG.g_modelMatrix.setTranslate(-200, -20, -500);
        CG.draw.box(gl, skyTexCube, 1600, 400, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
        CG.g_modelMatrix = CG.popMatrix();
    },

    /* GENERIC BOX */
    "box": function(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
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

}
