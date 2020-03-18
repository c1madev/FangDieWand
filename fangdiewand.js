

var Wall = [];
var Field = [];
var canvas = document.querySelector("canvas")

const zeichneFeld = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    feld.onMouseEnter = function (event) {
        canvas.style.cursor = "pointer";
    }
    feld.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
    }
    feld.onClick = function (event) {
            event.currentTarget.fillColor = "black";
            event.currentTarget.strokeWidth = 2;
    }
}

const zeichneWand = (x, y, hoehe, breite, farbe) => {
    let wand = new Path.Rectangle(new Point(x, y), new Size(hoehe, breite));
    wand.strokeColor = farbe;
    wand.strokeWidth = 5;
    wand.onMouseEnter = function (event) {
        canvas.style.cursor = "pointer";
    }
    wand.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
    }
    wand.onClick = function (event) {
        event.currentTarget.strokeColor = "red"
        event.currentTarget.bringToFront()
    }
    return wand
}

start = () => {

    document.title = "Fang die Wand!"

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
