

var Wall = [];
var Wall2 = [];
var Field = [];
var Field2 = [];
var canvas = document.querySelector("canvas")
var Spielphase = "LabyrinthBauen";
var SchatzGelegt = "nein"
var Zug = "DuBistDran"

const zeichneFeld = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    feld.onMouseEnter = function (event) {
        if (Spielphase == "SchatzLegen") {
        canvas.style.cursor = "pointer";
        feld.strokeColor = "green"
        feld.strokeWidth = 5
    }
    }
    feld.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
        feld.strokeColor = null
        feld.strokeWidth = 0
    }
    feld.onClick = function (event) {
        if (Spielphase == "SchatzLegen") {
            if (feld.fillColor.equals("white")) {
                if(SchatzGelegt == "nein") {
                    event.currentTarget.fillColor = "black";
                    event.currentTarget.strokeWidth = 2;
                    feld.schatz = true
                    SchatzGelegt = "ja"
                } else {
                    alert("Entferne den Schatz, bevor du ihn an anderer Stelle plazierst")
                }
            } else {
                event.currentTarget.fillColor = "white"
                event.currentTarget.strokeWidth = 0;
                feld.schatz = false
                SchatzGelegt = "nein"
            }
        }
    }
}

const zeichneFeld2 = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    console.log(Spielphase)
    feld.onMouseEnter = function (event) {
        console.log("Enter")
        if (Spielphase == "SchatzSuchen" && Zug == "DuBistDran") {
            canvas.style.cursor = "pointer"
            feld.fillColor = "#e6f3f7"
        }
    }
    feld.onMouseLeave = function (event) {
        if (Spielphase == "SchatzSuchen" && Zug == "DuBistDran") {
            canvas.style.cursor = "default"
            feld.fillColor = "white"
        } 
    }
    feld.onClick = function (event) {
        if (Spielphase == "SchatzSuchen" && Zug == "DuBistDran") {
            if (feld.strokeColor.equals("white")) {
                event.currentTarget.strokeColor = "black"
                event.currentTarget.strokeWidth = 5
            } else {
                event.currentTarget.strokeColor = "white"
                event.currentTarget.strokeWidth = 0
            }
        }
    }
}

const zeichneWand = (x, y, hoehe, breite, farbe) => {
    let wand = new Path.Rectangle(new Point(x, y), new Size(hoehe, breite));
    wand.strokeColor = farbe;
    wand.strokeWidth = 2;
    wand.fillColor = farbe;
    wand.zu = false
    wand.onMouseEnter = function (event) {
        if (Spielphase == "LabyrinthBauen") {
        canvas.style.cursor = "pointer";
        wand.fillColor = "green"
        }
    }
    wand.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
        wand.fillColor = "#eaeaea"
    }
    wand.onClick = function (event) {
        if (Spielphase == "LabyrinthBauen") {
            if (wand.strokeColor.equals("red")) {
                event.currentTarget.strokeColor = "#eaeaea"
                event.currentTarget.strokeWidth = 2
                event.currentTarget.sendToBack()
                wand.zu = false;
                console.log(wand.zu)
            } else {
                event.currentTarget.strokeColor = "red"
                event.currentTarget.strokeWidth = 5
                event.currentTarget.bringToFront()
                wand.zu = true;
                console.log(wand.zu)
            }
        }
    }
    return wand
}

start = () => {

    document.title = "Fang die Wand!"


    weiter = new Path.Rectangle(new Point(944, 64), new Size(100, 50))
    weiter.fillColor = "white"
    weiter.strokeColor = "black";
    weiter.strokeWidth = 6
    weiter.onMouseDown = function (event) {
        event.currentTarget.strokeColor = "white"
        event.currentTarget.fillColor = "black"
    }
    weiter.onMouseUp = function (event) {
        event.currentTarget.strokeColor = "black"
        event.currentTarget.fillColor = "white"
    }
    weiter.onMouseLeave = function (event) {
        event.currentTarget.strokeColor = "black"
        event.currentTarget.fillColor = "white"
    }
    weiter.onClick = function (event) {
        if (Spielphase == "LabyrinthBauen") {
            Spielphase = "SchatzLegen"
        } else if (Spielphase == "SchatzLegen" && SchatzGelegt == "ja") {
            Spielphase = "SchatzSuchen"
            weiter.remove()
            text.remove()
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (y == 0) {
                        Field2[x] = [];
                    }
                    const punktX = 1087+100*x;
                    const punktY = 87+100*y;
                    Field2[x][y] = {
                        feld: zeichneFeld2(punktX, punktY, "white"),
                    }
                }
            }
        
        
            for (var x = 0; x < 7; x++) {
                for (var y = 0; y < 8; y++) {
                    if (y == 0) {
                        Wall2[x] = []
                    }
                    const punktX = 180 + 100*x
                    const punktY = 80 + 100*y
                    Wall2[x][y] = {
                        hoch: zeichneWand(punktX+1000, punktY, 5, 100, "#eaeaea"),
                        quer: zeichneWand(punktY+1000, punktX, 100, 5, "#eaeaea"),
                    }
                }
            }
            rahmenAussen = new Path.Rectangle(new Point(1064, 64), new Size(830, 830));
            rahmenAussen.strokeColor = "black";
            rahmenAussen.strokeWidth = 15;

            rahmenInnen = new Path.Rectangle(new Point(1082, 82), new Size(794,794));
            rahmenInnen.strokeColor = "red";
            rahmenInnen.strokeWidth = 10;
        }
    }

    var text = new PointText(new Point(994, 145));
    text.justification = "center";
    text.fillColor = "black";
    text.content = "WEITER";

    rahmenAussen = new Path.Rectangle(new Point(64, 64), new Size(830, 830));
    rahmenAussen.strokeColor = "black";
    rahmenAussen.strokeWidth = 15;

    var i = 0;

    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            if (y == 0) {
                Field[x] = [];
            }
            const punktX = 87+100*x;
            const punktY = 87+100*y;
            Field[x][y] = {
                feld: zeichneFeld(punktX, punktY, "white"),
            }
        }
    }


    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 8; y++) {
            if (y == 0) {
                Wall[x] = []
            }
            const punktX = 180 + 100*x
            const punktY = 80 + 100*y
            Wall[x][y] = {
                hoch: zeichneWand(punktX, punktY, 5, 100, "#eaeaea"),
                quer: zeichneWand(punktY, punktX, 100, 5, "#eaeaea"),
            }
        }
    }

    rahmenInnen = new Path.Rectangle(new Point(82, 82), new Size(794,794));
    rahmenInnen.strokeColor = "red";
    rahmenInnen.strokeWidth = 10;
}
