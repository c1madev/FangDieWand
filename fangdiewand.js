

let Wall = [];
let Wall2 = [];
let Field = [];
let Field2 = [];
let canvas = document.querySelector("canvas")
let gameStage = "buildLabyrinth";
let treasureBuried = false
let turn = "computersTurn"
let markedFields = 0
let accessibleFields
let startingField
let tryDiscoverField

const computerPlays = () => {
    while (turn = "computersTurn") {
        Field[0][0].discovered = true // ein Feld wird als bekannt markiert (0/0)
        Field[0][0].fillColor = "yellow" // dieses Feld wird durch gelbe Farbe visualisiert
        let Ausgangsfelder = AusgangsfeldFinden(); //mögliche Ausgangsfelder werden gefunden
        AusgangsfeldRandom = Math.floor(Ausgangsfelder.length * Math.random()) //daraus wird random eines Ausgewählt
        if(Ausgangsfelder.length > 0) {
            Ausgangsfeld = Ausgangsfelder[AusgangsfeldRandom]
        } else {
            gameStage = "finished"
            alert("Das Labyrinth ist unmöglich.\rDer Computer hat gewonnen.")
            return;
        }
        if(Ausgangsfeld.treasure == true) {
            Ausgangsfeld.fillColor = "orange"
            alert("Fast hätte ich A/1 beim Programmieren übersehen.\rTja, leider doch nicht.\rUm nocheinmal zu spielen, lade die Seite neu.")
            gameStage = "finished"
            return;
        }
        let nextFields = findUndiscoveredNeighbors(Ausgangsfeld.row, Ausgangsfeld.column, Field);
        nextFieldRandom = Math.floor(nextFields.length * Math.random()) //aus ihnen wird random ein Feld ausgewählt
        tryDiscoverField = nextFields[nextFieldRandom]
        if (Ausgangsfeld.row > tryDiscoverField.row && isZuWall(Ausgangsfeld.row, Ausgangsfeld.column, "hoch", Wall)) {
            Wall[Ausgangsfeld.row][Ausgangsfeld.column].hoch.strokeColor = "blue"
            Wall[Ausgangsfeld.row][Ausgangsfeld.column].hoch.discovered = true
            turn = "playersTurn"
            break
        } else if (Ausgangsfeld.row < tryDiscoverField.row && isZuWall(tryDiscoverField.row, tryDiscoverField.column, "hoch", Wall)) {
            Wall[tryDiscoverField.row][tryDiscoverField.column].hoch.discovered = true
            Wall[tryDiscoverField.row][tryDiscoverField.column].hoch.strokeColor = "blue"
            turn = "playersTurn"
            break
        } else if (Ausgangsfeld.column > tryDiscoverField.column && isZuWall(Ausgangsfeld.row, Ausgangsfeld.column, "quer", Wall)) {
            Wall[Ausgangsfeld.row][Ausgangsfeld.column].quer.discovered = true
            Wall[Ausgangsfeld.row][Ausgangsfeld.column].quer.strokeColor = "blue"
            turn = "playersTurn"
            break
        } else if (Ausgangsfeld.column < tryDiscoverField.column && isZuWall(tryDiscoverField.row, tryDiscoverField.column, "quer", Wall)) {
            Wall[tryDiscoverField.row][tryDiscoverField.column].quer.discovered = true
            Wall[tryDiscoverField.row][tryDiscoverField.column].quer.strokeColor = "blue"
            turn = "playersTurn"
            break
        } else {
            tryDiscoverField.fillColor = "yellow"
            tryDiscoverField.discovered = true
            if (tryDiscoverField.treasure == true) {
                tryDiscoverField.fillColor = "orange"
                alert("Das Spiel ist vorbei.\rDer Computer hat den Schatz gefunden.\rDu hast verloren.\rUm nocheinmal zu spielen, lade die Seite neu.")
                showLabyrinth()
                gameStage = "finished"
                break
            } 
        }
    }
}
const showLabyrinth = () => {
    for (let i = 0; i < Wall2.length; i++) {
        for (let y = 0; y < Wall2[i].length; y++) {
            if (Wall2[i][y].hoch.zu) {
                Wall2[i][y].hoch.strokeColor = "blue"
                Wall2[i][y].hoch.strokeWidth = 5
            }
            if (Wall2[i][y].quer.zu) {
                Wall2[i][y].quer.strokeColor = "blue"
                Wall2[i][y].quer.strokeWidth = 5
            }
        } 
    }
    for (let i = 0; i < Field2.length; i++) {
        for (let y = 0; y < Field2[i].length; y++) {
            if (Field2[i][y].treasure) {
                Field2[i][y].fillColor = "red"
                break
            }
        }
    }
    rahmenInnen2.bringToFront()
}

const computerBuildsLabyrinth = () => {
    let randXField = 0
    let randYField = 0
    while (randXField == 0 && randYField == 0) {
    randXField = Math.floor(Math.random()*Field2.length)
    randYField = Math.floor(Math.random()*Field2.length)
    }
    Field2[randXField][randYField].treasure = true
    setWalls()
}

const setWalls = () => {
    directions = ["hoch","quer"]
    for(let i = 0; i < 200; i++) {
        let randXWall = Math.floor(Math.random() * Wall2.length)
        let randYWall = Math.floor(Math.random() * Wall2.length)
        let randDir = directions[Math.floor(Math.random() * directions.length)]
        Wall2[randXWall][randYWall][randDir].zu = true
        if(allFieldsReachable(Field2)) {
        } else Wall2[randXWall][randYWall][randDir].zu = false
    }
}

const markAccessibleFields = (field) => {
    undiscoveredNeighbors = findUndiscoveredNeighbors(field.row, field.column, Field2)
    accessibleFields = isKnownWall(field, undiscoveredNeighbors)
    console.log(undiscoveredNeighbors, accessibleFields)
    for(let i = 0; i < accessibleFields.length; i++) {
        if (accessibleFields[i].fillColor.equals("#ccffcc")) {
            accessibleFields[i].fillColor = "white"
        } else {
            accessibleFields[i].fillColor = "#ccffcc"
        }
    }
}

const allFieldsReachable = (gameBoard) => {
    let boardWalls;
    if (gameBoard == Field) boardWalls = Wall
    else if (gameBoard == Field2) boardWalls = Wall2
    let reachableFields = {}
    reachableFields[[0, 0]] = true
    while(Object.values(reachableFields).length < 64) {
        formerLength = Object.values(reachableFields).length
        for(let i = 0; i < Object.values(reachableFields).length; i++) {
            let x = Math.floor(Object.keys(reachableFields)[i].split(",")[0])
            let y = Math.floor(Object.keys(reachableFields)[i].split(",")[1])
            neighbors = findUndiscoveredNeighbors(x,y,gameBoard)
            for(fields of neighbors) {
                if (gameBoard[x][y].row > fields.row && isZuWall(gameBoard[x][y].row, gameBoard[x][y].column, "hoch", boardWalls)) {

                } else if (gameBoard[x][y].row < fields.row && isZuWall(fields.row, fields.column, "hoch", boardWalls)) {
                    
                } else if (gameBoard[x][y].column > fields.column && isZuWall(gameBoard[x][y].row, gameBoard[x][y].column, "quer", boardWalls)) {
                    
                } else if (gameBoard[x][y].column < fields.column && isZuWall(fields.row, fields.column, "quer", boardWalls)) {

                } else reachableFields[[fields.row,fields.column]] = true
                    
            }
        } 
        if(formerLength == Object.values(reachableFields).length) return false
    }
    return true;
}

const AusgangsfeldFinden = () => {
    let discoveredFields = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (Field[x][y].discovered && findUndiscoveredNeighbors(x,y,Field).length > 0) {
                discoveredFields.push(Field[x][y])
            }
        }
    }
    return discoveredFields;
}

const findUndiscoveredNeighbors = (x, y, gameBoard) => {
    let boardWalls;
    if (gameBoard == Field) boardWalls = Wall
    else if (gameBoard == Field2) boardWalls = Wall2 
    let neighbors = [[x, y-1, "up"], [x, y+1, "down"], [x-1, y, "left"], [x+1, y, "right"]] // definiert mögliche Nachbarn
    let undiscoveredNeighbors = [] // Legt eine Array für alle positiven Dinge an
    for (coordinates of neighbors) { //Mit allen Wertegruppen aus neighbors wird folgendes gemacht:
        let checkX = coordinates[0] 
        let checkY = coordinates[1]
        let checkDir = coordinates[2]
        if (gameBoard[checkX] && gameBoard[checkX][checkY] && !(gameBoard[checkX][checkY].discovered)) { 
            if (checkDir == "up" && isUndiscoveredWall(x,y,"quer", boardWalls)) {
                undiscoveredNeighbors.push(gameBoard[checkX][checkY])
            } else if (checkDir == "down" && isUndiscoveredWall(x,y+1, "quer", boardWalls)) {
                undiscoveredNeighbors.push(gameBoard[checkX][checkY])
            } else if (checkDir == "left" && isUndiscoveredWall(x,y, "hoch", boardWalls)) {
                undiscoveredNeighbors.push(gameBoard[checkX][checkY])
            } else if (checkDir == "right" && isUndiscoveredWall(x+1,y, "hoch", boardWalls)) {
                undiscoveredNeighbors.push(gameBoard[checkX][checkY])
            }
        }
    }
    return undiscoveredNeighbors
}

const isUndiscoveredWall = (x, y, direction,boardWalls) => {
    return (boardWalls[x] && boardWalls[x][y] && !boardWalls[x][y][direction]?.discovered) 
}

const isZuWall = (x,y,direction,boardWalls) => {
    return (boardWalls[x] && boardWalls[x][y] && boardWalls[x][y][direction]?.zu)
}

const isKnownWall = (middleField, ListOfFields) => {
    let noWallBetween = [];
    for(fields of ListOfFields) {
        if (middleField.row > fields.row && Wall2[middleField.row][middleField.column].hoch.discovered) {

        } else if (middleField.row < fields.row && Wall2[fields.row][fields.column].hoch.discovered) {
            
        } else if (middleField.column > fields.column && Wall2[middleField.row][middleField.column].quer.discovered) {
            
        } else if (middleField.column < fields.column && Wall2[fields.row][fields.column].quer.discovered) {

        } else noWallBetween.push(fields)
            
    }
    return noWallBetween
}

const zeichneFeld = (x, y, farbe) => {
    let feld = new Path.Rectangle(new Point(x, y), new Size(91, 91))
    feld.fillColor = farbe;
    feld.strokeColor = farbe;
    feld.strokeWidth = 0;
    feld.discovered = false;
    feld.treasure = false
    feld.row = (x-87)/100
    feld.column = (y-87)/100
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
    feld.row = (x-87)/100
    feld.column = (y-987)/100
    feld.onMouseEnter = function (event) {
        if (gameStage == "huntTreasure" && turn == "playersTurn") {
            canvas.style.cursor = "pointer"
            if (feld.fillColor.equals("#ccffcc")) feld.fillColor = "#e5ffe5"
            else if (feld.fillColor.equals("yellow"))feld.fillColor = "orange"
            else feld.fillColor = "#e6f3f7"
        }
    }
    feld.onMouseLeave = function (event) {
        if (gameStage == "huntTreasure" && turn == "playersTurn") {
            canvas.style.cursor = "default"
            if(feld.fillColor.equals("#e5ffe5")) feld.fillColor = "#ccffcc"
            else if (feld.fillColor.equals("orange"))feld.fillColor = "yellow"
            else feld.fillColor = "white"
        } 
    }
    feld.onClick = function (event) {
        if (gameStage == "huntTreasure" && turn == "playersTurn") {
            if (markedFields == 0 && feld.strokeColor.equals("white")) {
                if (feld.discovered && findUndiscoveredNeighbors(feld.row, feld.column, Field2).length > 0) {
                    event.currentTarget.strokeColor = "black"
                    event.currentTarget.strokeWidth = 5
                    undiscoveredNeighbors = findUndiscoveredNeighbors(feld.row, feld.column, Field2)
                    accessibleFields = isKnownWall(feld, undiscoveredNeighbors)
                    startingField = this
                    markAccessibleFields(this);
                    markedFields = 1
                }
            } else if (markedFields == 1 && feld.strokeColor.equals("white")) {
                if (this == accessibleFields[0] || this == accessibleFields[1] || this == accessibleFields[2]) {
                    tryDiscoverField = this
                    if (startingField.row > tryDiscoverField.row && isZuWall(startingField.row, startingField.column, "hoch", Wall2)) {
                        turn = "computersTurn"
                        Wall2[startingField.row][startingField.column].hoch.strokeColor = "red"
                        Wall2[startingField.row][startingField.column].hoch.strokeWidth = 5
                        Wall2[startingField.row][startingField.column].hoch.discovered = true
                        tryDiscoverField.fillColor = "#e6f3f7"
                        markedFields = 0
                        startingField.strokeColor = "white"
                        startingField.strokeWidth = 0
                        computerPlays()
                    } else if (startingField.row < tryDiscoverField.row && isZuWall(tryDiscoverField.row, tryDiscoverField.column, "hoch", Wall2)) {
                        turn = "computersTurn"
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].hoch.strokeColor = "red"
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].hoch.strokeWidth = 5
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].hoch.discovered = true
                        tryDiscoverField.fillColor = "#e6f3f7"
                        markedFields = 0
                        startingField.strokeColor = "white"
                        startingField.strokeWidth = 0
                        computerPlays()
                    } else if (startingField.column > tryDiscoverField.column && isZuWall(startingField.row, startingField.column, "quer", Wall2)) {
                        turn = "computersTurn"
                        Wall2[startingField.row][startingField.column].quer.strokeColor = "red"
                        Wall2[startingField.row][startingField.column].quer.strokeWidth = 5
                        Wall2[startingField.row][startingField.column].quer.discovered = true
                        tryDiscoverField.fillColor = "#e6f3f7"
                        markedFields = 0
                        startingField.strokeColor = "white"
                        startingField.strokeWidth = 0
                        computerPlays()
                    } else if (startingField.column < tryDiscoverField.column && isZuWall(tryDiscoverField.row, tryDiscoverField.column, "quer", Wall2)) {
                        turn = "computersTurn"
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].quer.strokeColor = "red"
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].quer.strokeWidth = 5
                        Wall2[tryDiscoverField.row][tryDiscoverField.column].quer.discovered = true
                        tryDiscoverField.fillColor = "#e6f3f7"
                        markedFields = 0
                        startingField.strokeColor = "white"
                        startingField.strokeWidth = 0
                        computerPlays()
                    } else {
                        tryDiscoverField.discovered = true
                        tryDiscoverField.fillColor = "orange"
                        startingField.strokeColor = "white"
                        startingField.strokeWidth = 0
                        markedFields = 0
                        if (tryDiscoverField.treasure == true) {
                            gameStage = "finish"
                            alert("Du hast den Schatz gefunden.\rLade die Seite neu, um noch einmal zu spielen.")
                            showLabyrinth()
                        }
                    }
                    markAccessibleFields(startingField)
                } else {
                    startingField.strokeColor = "white"
                    startingField.strokeWidth = 0
                    markedFields = 0    
                    markAccessibleFields(startingField)
                    startingField = {}
                    
                }
            } else {
                feld.strokeColor = "white"
                feld.strokeWidth = 0
                startingField = {}
                accessibleFields;
                markAccessibleFields(this)
                markedFields = 0
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
                wand.zu = true;
                if (allFieldsReachable(Field)) {
                    event.currentTarget.strokeColor = "red"
                    event.currentTarget.strokeWidth = 5
                    this.bringToFront()
                } else {
                    alert("Alle Felder müssen erreichbar sein")
                    wand.zu = false;
                }
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
            rahmenInnen.bringToFront()
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
                    Field2[x][y] = zeichneFeld2(punktX, punktY, "white"),
                    Field2[x][y].row = x
                    Field2[x][y].column = y
                }
            }
        
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (y == 0) {
                        Wall2[x] = []
                    }
                    const punktX = 80 + 100*x
                    const punktY = 80 + 100*y
                    Wall2[x][y] = {
                        hoch: zeichneWand(punktX+900, punktY, 5, 100, "#eaeaea"),
                        quer: zeichneWand(punktX+900, punktY, 100, 5, "#eaeaea"),
                    }
                }
            }

            computerBuildsLabyrinth();

            rahmenAussen2 = new Path.Rectangle(new Point(964, 64), new Size(830, 830));
            rahmenAussen2.strokeColor = "black";
            rahmenAussen2.strokeWidth = 15;

            rahmenInnen2 = new Path.Rectangle(new Point(982, 82), new Size(794,794));
            rahmenInnen2.strokeColor = "blue";
            rahmenInnen2.strokeWidth = 10;

            Field2[0][0].discovered = true
            Field2[0][0].fillColor = "yellow"

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
        }
    }


    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            if (y == 0) {
                Wall[x] = []
            }
            const punktX = 80 + 100*x
            const punktY = 80 + 100*y
            Wall[x][y] = {
                hoch: zeichneWand(punktX, punktY, 5, 100, "#eaeaea"),
                quer: zeichneWand(punktX, punktY, 100, 5, "#eaeaea"),
            }
        }
    }

    rahmenInnen = new Path.Rectangle(new Point(82, 82), new Size(794,794));
    rahmenInnen.strokeColor = "red";
    rahmenInnen.strokeWidth = 10;
}
