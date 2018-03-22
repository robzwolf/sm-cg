/* CAMERA */
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

/* KEY PRESSES */
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
        CG.doorMove = setInterval(CG.openDoor, CG.NUM_CONSTS.animFreq);
        keys[79] = false;
    }

    if (keys[80]) {
        // "p" key
        // Close door
        clearInterval(CG.doorMove);
        CG.doorMove = setInterval(CG.closeDoor, CG.NUM_CONSTS.animFreq);
        keys[80] = false;
    }

    if (keys[78]) {
        // "n" key
        // Open blind
        clearInterval(CG.blindMove);
        CG.blindMove = setInterval(CG.openBlinds, CG.NUM_CONSTS.animFreq);
        keys[78] = false;
    }

    if (keys[66]) {
        // "b" key
        // Close blind
        clearInterval(CG.blindMove);
        CG.blindMove = setInterval(CG.closeBlinds, CG.NUM_CONSTS.animFreq);
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

/* DYNAMIC OBJECTS */
// Open / close doors
CG.openDoor = function() {
    CG.doorAngle += CG.NUM_CONSTS.doorAngle.STEP;
    if (CG.doorAngle >= CG.NUM_CONSTS.doorAngle.HIGH_THRESHOLD) {
        clearInterval(CG.doorMove);
    }
}
CG.closeDoor = function() {
    CG.doorAngle -= CG.NUM_CONSTS.doorAngle.STEP;
    if (CG.doorAngle <= CG.NUM_CONSTS.doorAngle.LOW_THRESHOLD) {
        CG.doorAngle = CG.NUM_CONSTS.doorAngle.MIN;
        clearInterval(CG.doorMove);
    }
}

// Open / close blinds
CG.blindSize = CG.NUM_CONSTS.blindSize.INITIAL;
CG.blindMove = setInterval(function () {CG.openBlinds()}, 100);

CG.openBlinds = function() {
    CG.blindSize -= CG.NUM_CONSTS.blindSize.STEP;
    if (CG.blindSize < CG.NUM_CONSTS.blindSize.LOW_THRESHOLD) {
        CG.blindSize = CG.NUM_CONSTS.blindSize.MIN;
        clearInterval(CG.blindMove);
    }
    CG.ambLight += CG.NUM_CONSTS.ambLight.STEP;
    if (CG.ambLight >= CG.NUM_CONSTS.ambLight.MAX) {
        CG.ambLight = CG.NUM_CONSTS.ambLight.MAX;
    }
}
CG.closeBlinds = function() {
    CG.blindSize += CG.NUM_CONSTS.blindSize.STEP;
    if (CG.blindSize > CG.NUM_CONSTS.blindSize.HIGH_THRESHOLD) {
        CG.blindSize = CG.NUM_CONSTS.blindSize.MAX;
        clearInterval(CG.blindMove);
    }
    CG.ambLight -= CG.NUM_CONSTS.ambLight.STEP;
    if (CG.ambLight <= CG.NUM_CONSTS.ambLight.MIN) {
        CG.ambLight = CG.NUM_CONSTS.ambLight.MIN;
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
    CG.redMod   =  CG.randomIntFromInterval(-1, 1);
    CG.greenMod =  CG.randomIntFromInterval(-1, 1);
    CG.blueMod  =  CG.randomIntFromInterval(-1, 1);
}

CG.normalLights = function() {
    console.log("norm");
    CG.redMod   =  0.05;
    CG.greenMod =  0.00;
    CG.blueMod  = -0.10;
}
