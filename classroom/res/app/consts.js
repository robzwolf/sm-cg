// Wrapper object for all our named stuff

window.CG = {

    "hardURL": {
        // "sky": "res/tex/durham.png",
        // "sky": "res/tex/rainbow.png",
        "sky": "res/tex/long-thin.jpg",
        "board": "res/tex/board_grad1.jpg"
    },

    "draw": {},

    "NUM_CONSTS": {
        "ambLight": {
            "INITIAL": 0.150,
            "MIN"    : 0.150,
            "MAX"    : 0.450,
            "STEP"   : 0.002,
        },
        "redMod": {
            "INITIAL": 0.02
        },
        "greenMod": {
            "INITIAL": 0.00
        },
        "blueMod": {
            "INITIAL": -0.06,
        },
        "lightIntensity": {
            "INITIAL": 0.60
        },
        "doorAngle": {
            "INITIAL": 0.00
        },
        "blindSize": {
            "INITIAL"       : 20.0,
            "LOW_THRESHOLD" :  0.1,
            "MIN"           :  0.0,
            "HIGH_THRESHOLD": 20.0,
            "MAX"           : 20.0,
            "STEP"          :  0.4
        },
        "animFreq": 5,
        "doorAngle": {
            "INITIAL"       : 0.4,
            "LOW_THRESHOLD" : 0.1,
            "MIN"           : 0.0,
            "HIGH_THRESHOLD": 3*Math.PI/4 - 0.2,
            "MAX"           : 3*Math.PI/4 - 0.2,
            "STEP"          : 0.01
        }
    },

    "shaders": {},

    // Colour variable definitions
    "COLORS": {
        "green"     : [0.30, 0.80, 0.50],
        "greyGreen" : [0.23, 0.60, 0.40],
        "grey"      : [0.50, 0.50, 0.50],
        "darkGrey"  : [0.40, 0.40, 0.40],
        "black"     : [0.00, 0.00, 0.00],
        "cream"     : [0.95, 0.90, 0.95],
        "purple"    : [0.60, 0.30, 0.60],
        "brown"     : [0.80, 0.60, 0.43],
        "lightBrown": [0.66, 0.50, 0.30],
        "sky"       : [0.40, 0.90, 0.95],
        "white"     : [1.00, 1.00, 1.00]
    }

};
