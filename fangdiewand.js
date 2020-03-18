

var Wall = [];
var Field = [];
var canvas = document.querySelector("canvas")

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
        event.currentTarget.strokeColor = "red";
        this.bringToFront()
    }
    return wand
}

start = () => {

    document.title = "Fang die Wand!"

    rahmenAussen = new Path.Rectangle(new Point(64, 64), new Size(830, 830));
    rahmenAussen.strokeColor = "black";
    rahmenAussen.strokeWidth = 15;

    var i = 0;

    for (var breite = 88; breite < 800; breite = breite+100) {
        for (var hoehe = 88; hoehe < 800; hoehe = hoehe + 100) {
            Field[i] = new Path.Rectangle(new Point(breite, hoehe), new Size(90, 90));
            Field[i].fillColor = "white";
            //Field[i].onMouseEnter = function (event) {canvas.style.cursor = "pointer";}
            //Field[i].onMouseLeave = function (event) {canvas.style.cursor = "default";}
            Field[i].onclick = function (event) {
                Field[i].strokeColor = "white";
                Field[i].strokeWidth = 3;
                Field[i].fillColor = "black";
            }
            i++;
        }
    }


    for (var x = 0; x < 8; x++) {
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
