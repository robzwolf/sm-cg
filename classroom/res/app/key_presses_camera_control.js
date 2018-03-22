/* key_presses_camera_control.js
 * Handles key presses and moving the camera
 */

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

// Keep the camera inside the classroom at all times
CG.cameraSafeUpdate = function(xChange, yChange, zChange) {
    var newX = CG.cameraPosition[0] + xChange;
    var newY = CG.cameraPosition[1] + yChange;
    var newZ = CG.cameraPosition[2] + zChange;
    if (CG.limitCamera) {

        if (newX <= CG.NUM_CONSTS.camera.position.limits.x.MAX && newX >= CG.NUM_CONSTS.camera.position.limits.x.MIN) {
            CG.cameraPosition[0] = newX;
        }
        if (newY <= CG.NUM_CONSTS.camera.position.limits.y.MAX && newY >= CG.NUM_CONSTS.camera.position.limits.y.MIN) {
            CG.cameraPosition[1] = newY;
        }
        if (newZ <= CG.NUM_CONSTS.camera.position.limits.z.MAX && newZ >= CG.NUM_CONSTS.camera.position.limits.z.MIN) {
            CG.cameraPosition[2] = newZ;
        }
    } else {
        CG.cameraPosition[0] = newX;
        CG.cameraPosition[1] = newY;
        CG.cameraPosition[2] = newZ;
    }
}

/* KEY PRESSES */
CG.checkKeys = function(keys) {
    if (keys[87]) {
        // "w" key
        // Move forward
        var xChange = CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        var yChange = CG.cameraOrientation[1] * CG.NUM_CONSTS.moveStep;
        var zChange = CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(xChange, yChange, zChange);
    }

    if (keys[83]) {
        // "s" key
        // Move backward
        var xChange = -CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        var yChange = -CG.cameraOrientation[1] * CG.NUM_CONSTS.moveStep;
        var zChange = -CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(xChange, yChange, zChange);
    }

    if (keys[68]) {
        // "d" key
        // Move right
        var xChange = -CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        var zChange = CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(xChange, 0, zChange);
    }

    if (keys[65]) {
        // "a" key
        // Move left
        var xChange = CG.cameraOrientation[2] * CG.NUM_CONSTS.moveStep;
        var zChange = -CG.cameraOrientation[0] * CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(xChange, 0, zChange);
    }

    if (keys[81]) {
        // "q" key
        // Move down
        var yChange = -CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(0, yChange, 0);
    }

    if (keys[69]) {
        // "e" key
        // Move up
        var yChange = CG.NUM_CONSTS.moveStep;
        CG.cameraSafeUpdate(0, yChange, 0);
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

    if (keys[77]) {
        // "m" key
        // Make day time
        clearInterval(CG.dayNightSwap);
        CG.dayNightSwap = setInterval(CG.makeDayTime, CG.NUM_CONSTS.animFreq);
        keys[78] = false;
    }

    if (keys[78]) {
        // "n" key
        // Make night time
        clearInterval(CG.dayNightSwap);
        CG.dayNightSwap = setInterval(CG.makeNightTime, CG.NUM_CONSTS.animFreq);
        keys[66] = false;
    }

    if (keys[49]) {
        // "1" key
        // Toggle lights 5-8
        CG.toggleSpecificLights([5, 6, 7, 8])
        keys[49] = false;
    }

    if (keys[50]) {
        // "2" key
        // Toggle lights 9-12
        CG.toggleSpecificLights([9, 10, 11, 12])
        keys[50] = false;
    }

    if (keys[51]) {
        // "3" key
        // Toggle lights 13-16
        CG.toggleSpecificLights([13, 14, 15, 16])
        keys[51] = false;
    }

    if (keys[52]) {
        // "4" key
        // Toggle lights 17-20
        CG.toggleSpecificLights([17, 18, 19, 20])
        keys[52] = false;
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

/* DAY / NIGHT TIME */

// Make sure it's day time when the room first loads
CG.dayNightSwap = setInterval(function () {CG.makeDayTime()}, CG.NUM_CONSTS.animFreq);

CG.makeDayTime = function() {
    CG.ambLight += CG.NUM_CONSTS.ambLight.STEP;
    if (CG.ambLight >= CG.NUM_CONSTS.ambLight.MAX) {
        CG.ambLight = CG.NUM_CONSTS.ambLight.MAX;
        clearInterval(CG.dayNightSwap);
    }
}

CG.makeNightTime = function() {
    CG.ambLight -= CG.NUM_CONSTS.ambLight.STEP;
    if (CG.ambLight <= CG.NUM_CONSTS.ambLight.MIN) {
        CG.ambLight = CG.NUM_CONSTS.ambLight.MIN;
        clearInterval(CG.dayNightSwap);
    }
}


CG.staggerLighting = function() {
    CG.yAxisRot += 0.4;
    setTimeout(function() { CG.toggleSpecificLights([ 1,  2,  3,  4]); }, 0);
    setTimeout(function() { CG.toggleSpecificLights([ 5,  6,  7,  8]); }, CG.staggerLightingTimingInterval * 4);
    setTimeout(function() { CG.toggleSpecificLights([ 9, 10, 11, 12]); }, CG.staggerLightingTimingInterval * 3);
    setTimeout(function() { CG.toggleSpecificLights([13, 14, 15, 16]); }, CG.staggerLightingTimingInterval * 2);
    setTimeout(function() { CG.toggleSpecificLights([17, 18, 19, 20]); }, CG.staggerLightingTimingInterval * 1);
}
