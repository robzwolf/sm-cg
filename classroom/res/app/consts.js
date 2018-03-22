// Wrapper object for all our named stuff

window.CG = {

    "hardURL": {
        // "sky": "res/tex/durham.png",
        // "sky": "res/tex/rainbow.png",
        "sky": "res/tex/wide_sky_tiled.jpg",
        "board": "res/tex/board_grad1.jpg",
        "floor": "res/tex/carpet.jpg",
        "ceiling": "res/tex/ceiling.jpg",
        "door": "res/tex/door.jpg",
        "darkCarpet": "res/tex/dark_carpet.jpg",
        "corridorFloor": "res/tex/corridor_floor.jpg",
        "corridorSign": "res/tex/do_not_leave.jpg",
        "bookCaseWood": "res/tex/book_case_wood.jpg",
        "du": "res/tex/du.jpg"
    },

    "draw": {},

    "NUM_CONSTS": {
        "ambLight": {
            "INITIAL": 0.570,
            "MIN"    : 0.150,
            "MAX"    : 0.570,
            "STEP"   : 0.006,
        },
        "lightIntensity": {
            "INITIAL": 0.35
        },
        "doorAngle": {
            "INITIAL": 0.00
        },
        "animFreq": 5,
        "doorAngle": {
            "INITIAL"       : 0.4,
            "LOW_THRESHOLD" : 0.1,
            "MIN"           : 0.05,
            "HIGH_THRESHOLD": Math.PI - 0.9,
            "MAX"           : Math.PI - 0.9,
            "STEP"          : 0.01
        },
        "camera": {
            "position": {
                "INITIAL": [-118, 30, -15],
                "limits": {
                    "x": {
                        "MIN": -190,
                        "MAX": -60,
                    },
                    "y": {
                        "MIN": 5,
                        "MAX": 60
                    },
                    "z": {
                        "MIN": -140,
                        "MAX": -10
                    }
                }
            },
            "orientation": {
                "INITIAL": [0.0, 0.0, 0.0],
            },
            "lookSpeed": 0.7,
            "axisRotation": {
                "x": {
                    "INITIAL": Math.PI/2
                },
                "y": {
                    "INITIAL": -Math.PI + 0.3
                }
            }
        },
        "moveStep": 0.6
    },

    "staggerLightingTimingInterval": 400,

    "shaders": {},

    // Colour variable definitions
    "COLORS": {
        "green"     : [0.30, 0.80, 0.50],
        "greyGreen" : [0.23, 0.60, 0.40],
        "grey"      : [0.50, 0.50, 0.50],
        "darkGrey"  : [0.40, 0.40, 0.40],
        "black"     : [0.88, 0.88, 0.90],
        "cream"     : [0.95, 0.90, 0.95],
        "wallBlue"  : [0.92, 0.98, 0.98],
        "purple"    : [0.15, 0.30, 0.15],
        "brown"     : [0.80, 0.60, 0.43],
        "lightBrown": [0.66, 0.50, 0.30],
        "skyBlue"       : [0.40, 0.90, 0.95],
        "white"     : [1.00, 1.00, 1.00],
        "darkRed"   : [0.30, 0.00, 0.00]
    },

    "cameraFovY": 65.0,

    "limitCamera": true,

};
