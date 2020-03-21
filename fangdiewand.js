

let Wall = [];
let Wall2 = [];
let Field = [];
let Field2 = [];
let canvas = document.querySelector("canvas")
let gameStage = "buildLabyrinth";
let treasureBuried = false
let turn = "computersTurn"

const computerPlays = () => {
    while (turn = "computersTurn") {
        Field[0][0].discovered = true
        Field[0][0].fillColor = "yellow"
        let Ausgangsfelder = AusgangsfeldFinden();
        AusgangsfeldRandom = Math.floor(Ausgangsfelder.length * Math.random())
        Ausgangsfeld = Ausgangsfelder[AusgangsfeldRandom]
        let nextFields = findUndiscoveredNeighbors(Ausgangsfeld.row, Ausgangsfeld.column);
        console.log(nextFields)
        nextFieldRandom = Math.floor(nextFields.length * Math.random())
        tryDiscoverField = nextFields[nextFieldRandom]
        tryDiscoverField.discovered = true
        tryDiscoverField.fillColor = "yellow"
        if (tryDiscoverField.treasure == true) {
            alert("Der Computer hat den Schatz gefunden.\r Du hast verloren")
            tryDiscoverField.fillCOlor = "orange"
            break
        }
    }
}

const AusgangsfeldFinden = () => {
    let discoveredFields = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (Field[x][y].discovered && hasUndiscoveredNeighbors(x, y)) {
                discoveredFields.push(Field[x][y])
            }
        }
    }
    return discoveredFields;
}

const hasUndiscoveredNeighbors = (x, y) => {
    let neighbors = [[x, y-1], [x, y+1], [x-1, y], [x+1, y]]
    for (coordinates of neighbors) {
        let checkX = coordinates[0]
        let checkY = coordinates[1]
        if (Field[checkX] && Field[checkX][checkY] && !(Field[checkX][checkY].discovered)) {
            return true
        }
    }
}

const findUndiscoveredNeighbors = (x, y) => {
    let neighbors = [[x, y-1], [x, y+1], [x-1, y], [x+1, y]]
    let undiscoveredNeighbors = []
    for (coordinates of neighbors) {
        let checkX = coordinates[0]
        let checkY = coordinates[1]
        if (Field[checkX] && Field[checkX][checkY] && !(Field[checkX][checkY].discovered)) {
            undiscoveredNeighbors.push(Field[checkX][checkY])
        }
    }
    return undiscoveredNeighbors
}



const zeichneFeld = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    feld.discovered = false;
    feld.treasure = false
    feld.onMouseEnter = function (event) {
        if (gameStage == "buryTreasure") {
        canvas.style.cursor = "pointer";
        this.strokeColor = "green"
        feld.strokeWidth = 5
    }
    }
    feld.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
        feld.strokeColor = null
        feld.strokeWidth = 0
    }
    feld.onClick = function (event) {
        if (gameStage == "buryTreasure") {
            if (feld.fillColor.equals("white")) {
                if(treasureBuried == false) {
                    event.currentTarget.fillColor = "black";
                    event.currentTarget.strokeWidth = 2;
                    feld.treasure = true
                    treasureBuried = true
                } else {
                    alert("Entferne den Schatz, bevor du ihn an anderer Stelle plazierst")
                }
            } else {
                event.currentTarget.fillColor = "white"
                event.currentTarget.strokeWidth = 0;
                feld.treasure = false
                treasureBuried = false
            }
        }
    }
    return feld;
}

const zeichneFeld2 = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    feld.discovered = false;
    feld.onMouseEnter = function (event) {
        if (gameStage == "huntTreasure" && turn == "yourTurn") {
            canvas.style.cursor = "pointer"
            feld.fillColor = "#e6f3f7"
        }
    }
    feld.onMouseLeave = function (event) {
        if (gameStage == "huntTreasure" && turn == "yourTurn") {
            canvas.style.cursor = "default"
            feld.fillColor = "white"
        } 
    }
    feld.onClick = function (event) {
        if (gameStage == "huntTreasure" && turn == "yourTurn") {
            if (feld.strokeColor.equals("white")) {
                event.currentTarget.strokeColor = "black"
                event.currentTarget.strokeWidth = 5
            } else {
                event.currentTarget.strokeColor = "white"
                event.currentTarget.strokeWidth = 0
            }
        }
    }
    return feld;
}

const zeichneWand = (x, y, hoehe, breite, farbe) => {
    let wand = new Path.Rectangle(new Point(x, y), new Size(hoehe, breite));
    wand.strokeColor = farbe;
    wand.strokeWidth = 2;
    wand.fillColor = farbe;
    wand.zu = false
    wand.onMouseEnter = function (event) {
        if (gameStage == "buildLabyrinth") {
        canvas.style.cursor = "pointer";
        wand.fillColor = "green"
        }
    }
    wand.onMouseLeave = function (event) {
        canvas.style.cursor = "default";
        wand.fillColor = "#eaeaea"
    }
    wand.onClick = function (event) {
        if (gameStage == "buildLabyrinth") {
            if (wand.strokeColor.equals("red")) {
                event.currentTarget.strokeColor = "#eaeaea"
                event.currentTarget.strokeWidth = 2
                this.sendToBack()
                wand.zu = false;
            } else {
                event.currentTarget.strokeColor = "red"
                event.currentTarget.strokeWidth = 5
                this.bringToFront()
                wand.zu = true;
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
        if (gameStage == "buildLabyrinth") {
            gameStage = "buryTreasure"
        } else if (gameStage == "buryTreasure" && treasureBuried == true) {
            gameStage = "huntTreasure"
            weiter.remove()
            text.remove()
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (y == 0) {
                        Field2[x] = [];
                    }
                    const punktX = 987+100*x;
                    const punktY = 87+100*y;
                    Field2[x][y] = {
                        feld: zeichneFeld2(punktX, punktY, "white"),
                    }
                    Field2[x][y].row = x
                    Field2[x][y].column = y
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
                        hoch: zeichneWand(punktX+900, punktY, 5, 100, "#eaeaea"),
                        quer: zeichneWand(punktY+900, punktX, 100, 5, "#eaeaea"),
                    }
                }
            }

            rahmenAussen = new Path.Rectangle(new Point(964, 64), new Size(830, 830));
            rahmenAussen.strokeColor = "black";
            rahmenAussen.strokeWidth = 15;

            rahmenInnen = new Path.Rectangle(new Point(982, 82), new Size(794,794));
            rahmenInnen.strokeColor = "blue";
            rahmenInnen.strokeWidth = 10;
            computerPlays();
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
            Field[x][y] = zeichneFeld(punktX, punktY, "white")
            Field[x][y].row = x
            Field[x][y].column = y
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
