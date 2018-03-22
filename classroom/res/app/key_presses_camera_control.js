/* CAMERA */
// Camera
CG.xAxisRot          = CG.NUM_CONSTS.camera.axisRotation.x.INITIAL;
CG.yAxisRot          = CG.NUM_CONSTS.camera.axisRotation.y.INITIAL;
CG.lookSpeed         = CG.NUM_CONSTS.camera.lookSpeed;
CG.cameraPosition    = CG.NUM_CONSTS.camera.position.INITIAL;
CG.cameraOrientation = CG.NUM_CONSTS.camera.orientation.INITIAL;

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
        Math.cos(CG.yAxisRot) * Math.sin(CG.xAxisRot),
        Math.cos(CG.xAxisRot),
        Math.sin(CG.yAxisRot) * Math.sin(CG.xAxisRot)
    ];
}

/* KEY PRESSES */
CG.checkKeys = function(keys) {
    if (keys[87]) {
        // "w" key
        // Move forward
        CG.cameraPosition[0] += CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[1] += CG.cameraOrientation[1] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[2] += CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
    }

    if (keys[83]) {
        // "s" key
        // Move backward
        CG.cameraPosition[0] -= CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[1] -= CG.cameraOrientation[1] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[2] -= CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
    }

    if (keys[68]) {
        // "d" key
        // Move right
        CG.cameraPosition[0] -= CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[2] += CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
    }

    if (keys[65]) {
        // "a" key
        // Move left
        CG.cameraPosition[0] += CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        CG.cameraPosition[2] -= CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
    }

    if (keys[81]) {
        // "q" key
        // Move down
        CG.cameraPosition[1] -= CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
    }

    if (keys[69]) {
        // "e" key
        // Move up
        CG.cameraPosition[1] += CG.NUM_CONSTS.moveStep;
        console.log(CG.cameraPosition);
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

/* OPEN / CLOSE BLINDS */

CG.blindSize = CG.NUM_CONSTS.blindSize.INITIAL;

// Open the blinds when the room first loads
CG.blindMove = setInterval(function () {CG.openBlinds()}, CG.NUM_CONSTS.animFreq);

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
