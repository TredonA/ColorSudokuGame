/**
 * gol.js
 *
 * EECS 183: Final Project
 * Fall 2016
 *
 * Implements Game of Life.
 * Implements Reach options.
 */


var Constants = {
    numberOfRows: 9,
    numberOfColumns: 9,
    cellSize: 40,
    DefaultColorWhite: "#ffffff",
    DefaultColorGrey: "#d9d9d9",
    ColorBlue: "#0000e6",
    ColorRed: "#990000",
    ColorPurple: "#b300b3",
    ColorPink: "#ffb3d1",
    ColorOrange: "#ff8533",
    ColorYellow: "#ffff00",
    ColorGreen: "#00cc00",
    ColorBlack: "#000000",
    ColorTeal: "#00ffff",
    isConstant: false,
    passesRowRule: true,
    passesColumnRule: true,
    BoardTracker: 0,
    CurrentRow: 0,
    CurrentColumn: 0,
    RuleTracker: 0,
    CellColor: "Teal"
};


/**
 * Creates an HTML table representing canvas and inserts it into HTML.
 */
function createCanvas() {
    var canvasTable = $("<table>", {id: "canvas-table"});
    var canvasTableHead = $("<thead>");
    // add rows and columns
    for (var rowIndex = 0; rowIndex < Constants.numberOfRows; rowIndex++) {
        // make a row
        var canvasRow = $("<tr>");
        for (var columnIndex = 0; columnIndex < Constants.numberOfColumns; columnIndex++) {
            // make a cell
            var canvasCell = $("<td>");
            canvasRow.append(canvasCell);
        }
        canvasTableHead.append(canvasRow);
    }
    canvasTable.append(canvasTableHead);
    // add table to HTML
    $("#canvas-container").append(canvasTable);

    // set size of cells
    $("#canvas-table td").css({
        width: Constants.cellSize,
        height: Constants.cellSize,
    });
}


/**
 * Returns cell from HTML canvas table at specified rowIndex and columnIndex.
 */
function getCanvasCellAtIndex(rowIndex, columnIndex) {
    return $("#canvas-table tr:eq(" + rowIndex + ") td:eq(" + columnIndex + ")");
}

function createGameGrid() {
    var grid = new Array(Constants.numberOfRows);
    for (var row = 0; row < Constants.numberOfRows; row++) {
        grid[row] = new Array(Constants.numberOfColumns);
        for (var col = 0; col < Constants.numberOfColumns; col++) {
            grid[row][col] = {
                isConstant: false,
                CellColor: "Undefined",
            };
            if ((row >= 0 && row < 3) && (col >= 0 && col < 3)) {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorGrey);
            }
            else if ((row >= 6 && row < 9) && (col >= 0 && col < 3)) {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorGrey);
            }
            else if ((row >= 3 && row < 6) && (col >= 3 && col < 6)) {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorGrey);
            }
            else if ((row >= 0 && row < 3) && (col >= 6 && col < 9)) {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorGrey);
            }
            else if ((row >= 6 && row < 9) && (col >= 6 && col < 9)) {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorGrey);
            }
            else {
                (getCanvasCellAtIndex(row, col)).css("background-color", Constants.DefaultColorWhite);
            }
        }
    }
    return grid;
}


/**
 * Executes when entire HTML document loads.
 */
$(document).ready(function () {
        createCanvas();
        var gameGrid = createGameGrid();
        console.log("hello world");
        initialBoard(gameGrid);
        var CurrentColor;

        $("#submit-color").click(function(){
            Constants.CurrentRow = document.getElementById("grid-rows").value - 1;
            Constants.CurrentColumn = document.getElementById("grid-columns").value - 1;
            CurrentColor = document.getElementById("Color-select").value;

            setColor(gameGrid, Constants.CurrentRow, Constants.CurrentColumn, CurrentColor);

            
        });
        $("#Instructions").click(function () {
            window.open("https://tredona.github.io/SudokuInstructionHolder/");
            return false;
        });
    
        $("#NextBoard").click(function () {
            gameGrid = createGameGrid();
            nextBoard(gameGrid);
        });
        $("#Reset-button").click(function () {
            gameGrid = createGameGrid();
            if (Constants.BoardTracker == 0) {
                initialBoard(gameGrid)
            }
            else {
                Constants.BoardTracker--;
                nextBoard(gameGrid);
            }
        });
    // TODO: Add a click event listener for your clear button here.
    //       Do not modify any code above this!


})

//Checks if Row already contains the intended color already
function checkRowRule(grid, row, column, color) {
    for (var k = 0; k < Constants.numberOfColumns; k++) {
        if (k != column) {
            if (grid[row][k].CellColor != color) {
                Constants.RuleTracker++;
            }
            else {

            }
        }
    }
    if (Constants.RuleTracker != 8) {
        Constants.RuleTracker = 0;
        return false;
    }
    else {
        Constants.RuleTracker = 0;
        return true;
    }
}
//Check if column already contains the intended color already
function checkColRule(grid, row, column, color) {
    for (var k = 0; k < Constants.numberOfColumns; k++) {
        if (k != row) {
            if (grid[k][column].CellColor != color) {
                Constants.RuleTracker++;
            }
        }
    }
    if (Constants.RuleTracker != 8) {
        Constants.RuleTracker = 0;
        return false;
    }
    else {
        Constants.RuleTracker = 0;
        return true;
    }
}
//Check if 3x3 region contains the intended color already
function checkThreeByThree(grid, row, column, color) {
    if ((row >= 0 && row < 3) && (column >= 0 && column < 3)) {
        for (var i = 0; i < 3; i++) {
            for (var k = 0; k < 3; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 3 && row < 6) && (column >= 0 && column < 3)) {
        for (var i = 3; i < 6; i++) {
            for (var k = 0; k < 3; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 6 && row < 9) && (column >= 0 && column < 3)) {
        for (var i = 6; i < 9; i++) {
            for (var k = 0; k < 3; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 0 && row < 3) && (column >= 3 && column < 6)) {
        for (var i = 0; i < 3; i++) {
            for (var k = 3; k < 6; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }

    else if ((row >= 3 && row < 6) && (column >= 3 && column < 6)) {
        for (var i = 3; i < 6; i++) {
            for (var k = 3; k < 6; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }

    else if ((row >= 6 && row < 9) && (column >= 3 && column < 6)) {
        for (var i = 6; i < 9; i++) {
            for (var k = 3; k < 6; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 0 && row < 3) && (column >= 6 && column < 9)) {
        for (var i = 0; i < 3; i++) {
            for (var k = 6; k < 9; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 3 && row < 6) && (column >= 6 && column < 9)) {
        for (var i = 3; i < 6; i++) {
            for (var k = 6; k < 9; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    else if ((row >= 6 && row < 9) && (column >= 6 && column < 9)) {
        for (var i = 6; i < 9; i++) {
            for (var k = 6; k < 9; k++) {
                if ((i != row) || (k != column)) {
                    if (grid[i][k].CellColor != color) {
                        Constants.RuleTracker++;
                    }
                }
            }
        }
    }
    if (Constants.RuleTracker != 8) {
        Constants.RuleTracker = 0;
        return false;
    }
    else {
        Constants.RuleTracker = 0;
        return true;
    }
}

 function setColor(grid, row, column, color)
{
     //Make sure the intended cell was part of the original board
     if (grid[row][column].isConstant == true) {
         alert("Invalid Input! The cell you have attempted to change is part of the original board");
         return;
     }
         // Make sure the intended color doesn't violate row rule
     else if (checkRowRule(grid, row, column, color) == false) {
         alert("Invalid Input! The color you have attempted to submit violates the following rule:\nEach row must not have the same color twice.");
         return;
     }
         //Make sure the intended color doesn't violate column rule
     else if (checkColRule(grid, row, column, color) == false) {
         alert("Invalid Input! The color you have attempted to submit violates the following rule:\nEach column must not have the same color twice.");
         return;
     }
         //Make sure the intended color doesn't violate 3 by 3 region rule
     else if (checkThreeByThree(grid, row, column, color) == false) {
         alert("Invalid Input! The color you have attempted to submit violates the following rule:\nEach 3 by 3 region must not have the same color twice.");
         return;
     }
     else{
         if(color == "Blue"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorBlue);
             grid[row][column].CellColor = "Blue";
         }
         else if(color == "Red"){
                 (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorRed);
                 grid[row][column].CellColor = "Red";
         }
         else if(color == "Purple"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorPurple);
             grid[row][column].CellColor = "Purple";
         }
         else if(color == "Pink"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorPink);
             grid[row][column].CellColor = "Pink";
         }
         else if(color == "Orange"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorOrange);
             grid[row][column].CellColor = "Orange";
         }
         else if(color == "Yellow"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorYellow);
             grid[row][column].CellColor = "Yellow";
         }
         else if(color == "Green"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorGreen);
             grid[row][column].CellColor = "Green";
         }
         else if(color == "Black"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorBlack);
             grid[row][column].CellColor = "Black";
         }
         else if(color == "Teal"){
             (getCanvasCellAtIndex(row, column)).css("background-color", Constants.ColorTeal);
             grid[row][column].CellColor = "Teal";
         }
     }
     if (isBoardFilled(grid) == true) {
         alert("Congratulations! You have successfully competed this board.");
         gameGrid = createGameGrid();
         nextBoard(gameGrid);
     }
 }

 function isBoardFilled(grid) {
     var cellCount = 0;
     for (var i = 0; i < Constants.numberOfRows; i++) {
         for (var k = 0; k < Constants.numberOfColumns; k++) {
             if ((grid[i][k].CellColor == "Blue") ||
                 (grid[i][k].CellColor == "Red") ||
                 (grid[i][k].CellColor == "Purple") ||
                 (grid[i][k].CellColor == "Pink") ||
                 (grid[i][k].CellColor == "Orange") ||
                 (grid[i][k].CellColor == "Yellow") ||
                 (grid[i][k].CellColor == "Green") ||
                 (grid[i][k].CellColor == "Black") ||
                 (grid[i][k].CellColor == "Teal")) {
                 cellCount++;
             }
         }
     }
     if (cellCount == 81) {
         cellCount = 0;
         alert("Congratulations! You have successfully completed this board.");
         return true;
     }
     else {
         return false;
     }
 }
 function initialBoard(grid) {
     //Easy Board Possible as the initial board
     (getCanvasCellAtIndex(0, 1)).css("background-color", Constants.ColorOrange);
     grid[0][1].isConstant = true;
     grid[0][1].CellColor = "Orange";
     (getCanvasCellAtIndex(0, 2)).css("background-color", Constants.ColorRed);
     grid[0][2].isConstant = true;
     grid[0][2].CellColor = "Red";
     (getCanvasCellAtIndex(0, 3)).css("background-color", Constants.ColorGreen);
     grid[0][3].isConstant = true;
     grid[0][3].CellColor = "Green";
     (getCanvasCellAtIndex(0, 4)).css("background-color", Constants.ColorTeal);
     grid[0][4].isConstant = true;
     grid[0][4].CellColor = "Teal";
     (getCanvasCellAtIndex(0, 7)).css("background-color", Constants.ColorPurple);
     grid[0][7].isConstant = true;
     grid[0][7].CellColor = "Purple";
     (getCanvasCellAtIndex(0, 8)).css("background-color", Constants.ColorPink);
     grid[0][8].isConstant = true;
     grid[0][8].CellColor = "Pink";
     (getCanvasCellAtIndex(1, 0)).css("background-color", Constants.ColorGreen);
     grid[1][0].isConstant = true;
     grid[1][0].CellColor = "Green";
     (getCanvasCellAtIndex(1, 6)).css("background-color", Constants.ColorYellow);
     grid[1][6].isConstant = true;
     grid[1][6].CellColor = "Yellow";
     (getCanvasCellAtIndex(1, 7)).css("background-color", Constants.ColorOrange);
     grid[1][7].isConstant = true;
     grid[1][7].CellColor = "Orange";
     (getCanvasCellAtIndex(2, 2)).css("background-color", Constants.ColorBlack);
     grid[2][2].isConstant = true;
     grid[2][2].CellColor = "Black";
     (getCanvasCellAtIndex(2, 3)).css("background-color", Constants.ColorRed);
     grid[2][3].isConstant = true;
     grid[2][3].CellColor = "Red";
     (getCanvasCellAtIndex(2, 4)).css("background-color", Constants.ColorYellow);
     grid[2][4].isConstant = true;
     grid[2][4].CellColor = "Yellow";
     (getCanvasCellAtIndex(2, 6)).css("background-color", Constants.ColorTeal);
     grid[2][6].isConstant = true;
     grid[2][6].CellColor = "Teal";
     (getCanvasCellAtIndex(3, 4)).css("background-color", Constants.ColorGreen);
     grid[3][4].isConstant = true;
     grid[3][4].CellColor = "Green";
     (getCanvasCellAtIndex(3, 5)).css("background-color", Constants.ColorYellow);
     grid[3][5].isConstant = true;
     grid[3][5].CellColor = "Yellow";
     (getCanvasCellAtIndex(3, 8)).css("background-color", Constants.ColorPurple);
     grid[3][8].isConstant = true;
     grid[3][8].CellColor = "Purple";
     (getCanvasCellAtIndex(4, 1)).css("background-color", Constants.ColorRed);
     grid[4][1].isConstant = true;
     grid[4][1].CellColor = "Red";
     (getCanvasCellAtIndex(4, 4)).css("background-color", Constants.ColorBlue);
     grid[4][4].isConstant = true;
     grid[4][4].CellColor = "Blue";
     (getCanvasCellAtIndex(4, 7)).css("background-color", Constants.ColorBlack);
     grid[4][7].isConstant = true;
     grid[4][7].CellColor = "Black";
     (getCanvasCellAtIndex(5, 0)).css("background-color", Constants.ColorOrange);
     grid[5][0].isConstant = true;
     grid[5][0].CellColor = "Orange";
     (getCanvasCellAtIndex(5, 3)).css("background-color", Constants.ColorBlack);
     grid[5][3].isConstant = true;
     grid[5][3].CellColor = "Black";
     (getCanvasCellAtIndex(5, 4)).css("background-color", Constants.ColorRed);
     grid[5][4].isConstant = true;
     grid[5][4].CellColor = "Red";
     (getCanvasCellAtIndex(6, 2)).css("background-color", Constants.ColorOrange);
     grid[6][2].isConstant = true;
     grid[6][2].CellColor = "Orange";
     (getCanvasCellAtIndex(6, 4)).css("background-color", Constants.ColorPurple);
     grid[6][4].isConstant = true;
     grid[6][4].CellColor = "Purple";
     (getCanvasCellAtIndex(6, 5)).css("background-color", Constants.ColorRed);
     grid[6][5].isConstant = true;
     grid[6][5].CellColor = "Red";
     (getCanvasCellAtIndex(6, 6)).css("background-color", Constants.ColorGreen);
     grid[6][6].isConstant = true;
     grid[6][6].CellColor = "Green";
     (getCanvasCellAtIndex(7, 1)).css("background-color", Constants.ColorPink);
     grid[7][1].isConstant = true;
     grid[7][1].CellColor = "Pink";
     (getCanvasCellAtIndex(7, 2)).css("background-color", Constants.ColorGreen);
     grid[7][2].isConstant = true;
     grid[7][2].CellColor = "Green";
     (getCanvasCellAtIndex(7, 8)).css("background-color", Constants.ColorBlack);
     grid[7][8].isConstant = true;
     grid[7][8].CellColor = "Black";
     (getCanvasCellAtIndex(8, 0)).css("background-color", Constants.ColorRed);
     grid[8][0].isConstant = true;
     grid[8][0].CellColor = "Red";
     (getCanvasCellAtIndex(8, 1)).css("background-color", Constants.ColorBlue);
     grid[8][1].isConstant = true;
     grid[8][1].CellColor = "Blue";
     (getCanvasCellAtIndex(8, 4)).css("background-color", Constants.ColorBlack);
     grid[8][4].isConstant = true;
     grid[8][4].CellColor = "Black";
     (getCanvasCellAtIndex(8, 5)).css("background-color", Constants.ColorGreen);
     grid[8][5].isConstant = true;
     grid[8][5].CellColor = "Green";
     (getCanvasCellAtIndex(8, 6)).css("background-color", Constants.ColorPurple);
     grid[8][6].isConstant = true;
     grid[8][6].CellColor = "Purple";
     (getCanvasCellAtIndex(8, 7)).css("background-color", Constants.ColorPink);
     grid[8][7].isConstant = true;
     grid[8][7].CellColor = "Pink";
 }

 function nextBoard(grid){
     Constants.BoardTracker ++;
     switch (Constants.BoardTracker) {
         case 1:
             (getCanvasCellAtIndex(0, 1)).css("background-color", Constants.ColorBlack);
             grid[0][1].isConstant = true;
             grid[0][1].CellColor = "Black";
             (getCanvasCellAtIndex(0, 5)).css("background-color", Constants.ColorPink);
             grid[0][5].isConstant = true;
             grid[0][5].CellColor = "Pink";
             (getCanvasCellAtIndex(1, 1)).css("background-color", Constants.ColorTeal);
             grid[1][1].isConstant = true;
             grid[1][1].CellColor = "Teal";
             (getCanvasCellAtIndex(1, 2)).css("background-color", Constants.ColorPurple);
             grid[1][2].isConstant = true;
             grid[1][2].CellColor = "Purple";
             (getCanvasCellAtIndex(1, 4)).css("background-color", Constants.ColorGreen);
             grid[1][4].isConstant = true;
             grid[1][4].CellColor = "Green";
             (getCanvasCellAtIndex(1, 6)).css("background-color", Constants.ColorRed);
             grid[1][6].isConstant = true;
             grid[1][6].CellColor = "Red";
             (getCanvasCellAtIndex(1, 7)).css("background-color", Constants.ColorBlack);
             grid[1][7].isConstant = true;
             grid[1][7].CellColor = "Black";
             (getCanvasCellAtIndex(2, 0)).css("background-color", Constants.ColorYellow);
             grid[2][0].isConstant = true;
             grid[2][0].CellColor = "Yellow";
             (getCanvasCellAtIndex(2, 2)).css("background-color", Constants.ColorPink);
             grid[2][2].isConstant = true;
             grid[2][2].CellColor = "Pink";
             (getCanvasCellAtIndex(2, 4)).css("background-color", Constants.ColorBlack);
             grid[2][4].isConstant = true;
             grid[2][4].CellColor = "Black";
             (getCanvasCellAtIndex(2, 7)).css("background-color", Constants.ColorGreen);
             grid[2][7].isConstant = true;
             grid[2][7].CellColor = "Green";
             (getCanvasCellAtIndex(3, 6)).css("background-color", Constants.ColorBlack);
             grid[3][6].isConstant = true;
             grid[3][6].CellColor = "Black";
             (getCanvasCellAtIndex(3, 7)).css("background-color", Constants.ColorPink);
             grid[3][7].isConstant = true;
             grid[3][7].CellColor = "Pink";
             (getCanvasCellAtIndex(4, 2)).css("background-color", Constants.ColorOrange);
             grid[4][2].isConstant = true;
             grid[4][2].CellColor = "Orange";
             (getCanvasCellAtIndex(4, 3)).css("background-color", Constants.ColorBlack);
             grid[4][3].isConstant = true;
             grid[4][3].CellColor = "Black";
             (getCanvasCellAtIndex(4, 5)).css("background-color", Constants.ColorRed);
             grid[4][5].isConstant = true;
             grid[4][5].CellColor = "Red";
             (getCanvasCellAtIndex(4, 6)).css("background-color", Constants.ColorYellow);
             grid[4][6].isConstant = true;
             grid[4][6].CellColor = "Yellow";
             (getCanvasCellAtIndex(5, 1)).css("background-color", Constants.ColorPink);
             grid[5][1].isConstant = true;
             grid[5][1].CellColor = "Pink";
             (getCanvasCellAtIndex(5, 2)).css("background-color", Constants.ColorYellow);
             grid[5][2].isConstant = true;
             grid[5][2].CellColor = "Yellow";
             (getCanvasCellAtIndex(6, 1)).css("background-color", Constants.ColorYellow);
             grid[6][1].isConstant = true;
             grid[6][1].CellColor = "Yellow";
             (getCanvasCellAtIndex(6, 4)).css("background-color", Constants.ColorOrange);
             grid[6][4].isConstant = true;
             grid[6][4].CellColor = "Orange";
             (getCanvasCellAtIndex(6, 6)).css("background-color", Constants.ColorPink);
             grid[6][6].isConstant = true;
             grid[6][6].CellColor = "Pink";
             (getCanvasCellAtIndex(6, 8)).css("background-color", Constants.ColorGreen);
             grid[6][8].isConstant = true;
             grid[6][8].CellColor = "Green";
             (getCanvasCellAtIndex(7, 1)).css("background-color", Constants.ColorPurple);
             grid[7][1].isConstant = true;
             grid[7][1].CellColor = "Purple";
             (getCanvasCellAtIndex(7, 2)).css("background-color", Constants.ColorGreen);
             grid[7][2].isConstant = true;
             grid[7][2].CellColor = "Green";
             (getCanvasCellAtIndex(7, 4)).css("background-color", Constants.ColorTeal);
             grid[7][4].isConstant = true;
             grid[7][4].CellColor = "Teal";
             (getCanvasCellAtIndex(7, 6)).css("background-color", Constants.ColorOrange);
             grid[7][6].isConstant = true;
             grid[7][6].CellColor = "Orange";
             (getCanvasCellAtIndex(7, 7)).css("background-color", Constants.ColorRed);
             grid[7][7].isConstant = true;
             grid[7][7].CellColor = "Red";
             (getCanvasCellAtIndex(8, 3)).css("background-color", Constants.ColorPurple);
             grid[8][3].isConstant = true;
             grid[8][3].CellColor = "Purple";
             (getCanvasCellAtIndex(8, 7)).css("background-color", Constants.ColorBlue);
             grid[8][7].isConstant = true;
             grid[8][7].CellColor = "Blue";
             break;
         case 2:
             (getCanvasCellAtIndex(0, 1)).css("background-color", Constants.ColorBlue);
             grid[0][1].isConstant = true;
             grid[0][1].CellColor = "Black";
             (getCanvasCellAtIndex(0, 7)).css("background-color", Constants.ColorTeal);
             grid[0][7].isConstant = true;
             grid[0][7].CellColor = "Black";
             (getCanvasCellAtIndex(1, 1)).css("background-color", Constants.ColorTeal);
             grid[1][1].isConstant = true;
             grid[1][1].CellColor = "Black";
             (getCanvasCellAtIndex(1, 2)).css("background-color", Constants.ColorYellow);
             grid[1][2].isConstant = true;
             grid[1][2].CellColor = "Black";
             (getCanvasCellAtIndex(1, 5)).css("background-color", Constants.ColorPurple);
             grid[1][5].isConstant = true;
             grid[1][5].CellColor = "Black";
             (getCanvasCellAtIndex(1, 7)).css("background-color", Constants.ColorBlack);
             grid[1][7].isConstant = true;
             grid[1][7].CellColor = "Black";
             (getCanvasCellAtIndex(1, 8)).css("background-color", Constants.ColorBlue);
             grid[1][8].isConstant = true;
             grid[1][8].CellColor = "Black";
             (getCanvasCellAtIndex(2, 0)).css("background-color", Constants.ColorOrange);
             grid[2][0].isConstant = true;
             grid[2][0].CellColor = "Black";
             (getCanvasCellAtIndex(2, 1)).css("background-color", Constants.ColorGreen);
             grid[2][1].isConstant = true;
             grid[2][1].CellColor = "Black";
             (getCanvasCellAtIndex(2, 5)).css("background-color", Constants.ColorBlack);
             grid[2][5].isConstant = true;
             grid[2][5].CellColor = "Black";
             (getCanvasCellAtIndex(3, 0)).css("background-color", Constants.ColorYellow);
             grid[3][0].isConstant = true;
             grid[3][0].CellColor = "Black";
             (getCanvasCellAtIndex(3, 3)).css("background-color", Constants.ColorGreen);
             grid[3][3].isConstant = true;
             grid[3][3].CellColor = "Black";
             (getCanvasCellAtIndex(3, 6)).css("background-color", Constants.ColorBlue);
             grid[3][6].isConstant = true;
             grid[3][6].CellColor = "Black";
             (getCanvasCellAtIndex(3, 7)).css("background-color", Constants.ColorOrange);
             grid[3][7].isConstant = true;
             grid[3][7].CellColor = "Black";
             (getCanvasCellAtIndex(4, 0)).css("background-color", Constants.ColorBlack);
             grid[4][0].isConstant = true;
             grid[4][0].CellColor = "Black";
             (getCanvasCellAtIndex(4, 3)).css("background-color", Constants.ColorRed);
             grid[4][3].isConstant = true;
             grid[4][3].CellColor = "Black";
             (getCanvasCellAtIndex(4, 5)).css("background-color", Constants.ColorBlue);
             grid[4][5].isConstant = true;
             grid[4][5].CellColor = "Black";
             (getCanvasCellAtIndex(4, 8)).css("background-color", Constants.ColorPink);
             grid[4][8].isConstant = true;
             grid[4][8].CellColor = "Black";
             (getCanvasCellAtIndex(5, 1)).css("background-color", Constants.ColorPink);
             grid[5][1].isConstant = true;
             grid[5][1].CellColor = "Black";
             (getCanvasCellAtIndex(5, 2)).css("background-color", Constants.ColorBlue);
             grid[5][2].isConstant = true;
             grid[5][2].CellColor = "Black";
             (getCanvasCellAtIndex(5, 5)).css("background-color", Constants.ColorOrange);
             grid[5][5].isConstant = true;
             grid[5][5].CellColor = "Black";
             (getCanvasCellAtIndex(5, 8)).css("background-color", Constants.ColorRed);
             grid[5][8].isConstant = true;
             grid[5][8].CellColor = "Black";
             (getCanvasCellAtIndex(6, 3)).css("background-color", Constants.ColorBlue);
             grid[6][3].isConstant = true;
             grid[6][3].CellColor = "Black";
             (getCanvasCellAtIndex(6, 7)).css("background-color", Constants.ColorPurple);
             grid[6][7].isConstant = true;
             grid[6][7].CellColor = "Black";
             (getCanvasCellAtIndex(6, 8)).css("background-color", Constants.ColorTeal);
             grid[6][8].isConstant = true;
             grid[6][8].CellColor = "Black";
             (getCanvasCellAtIndex(7, 0)).css("background-color", Constants.ColorTeal);
             grid[7][0].isConstant = true;
             grid[7][0].CellColor = "Black";
             (getCanvasCellAtIndex(7, 1)).css("background-color", Constants.ColorYellow);
             grid[7][1].isConstant = true;
             grid[7][1].CellColor = "Black";
             (getCanvasCellAtIndex(7, 3)).css("background-color", Constants.ColorBlack);
             grid[7][3].isConstant = true;
             grid[7][3].CellColor = "Black";
             (getCanvasCellAtIndex(7, 6)).css("background-color", Constants.ColorOrange);
             grid[7][6].isConstant = true;
             grid[7][6].CellColor = "Black";
             (getCanvasCellAtIndex(7, 7)).css("background-color", Constants.ColorBlue);
             grid[7][7].isConstant = true;
             grid[7][7].CellColor = "Black";
             (getCanvasCellAtIndex(8, 1)).css("background-color", Constants.ColorBlack);
             grid[8][1].isConstant = true;
             grid[8][1].CellColor = "Black";
             (getCanvasCellAtIndex(8, 7)).css("background-color", Constants.ColorPink);
             grid[8][7].isConstant = true;
             grid[8][7].CellColor = "Black";
             break;
         case 3:
             (getCanvasCellAtIndex(0, 2)).css("background-color", Constants.ColorPink);
             grid[0][2].isConstant = true;
             grid[0][2].CellColor = "Black";
             (getCanvasCellAtIndex(0, 4)).css("background-color", Constants.ColorBlue);
             grid[0][4].isConstant = true;
             grid[0][4].CellColor = "Black";
             (getCanvasCellAtIndex(1, 2)).css("background-color", Constants.ColorTeal);
             grid[1][2].isConstant = true;
             grid[1][2].CellColor = "Black";
             (getCanvasCellAtIndex(1, 5)).css("background-color", Constants.ColorYellow);
             grid[1][5].isConstant = true;
             grid[1][5].CellColor = "Black";
             (getCanvasCellAtIndex(1, 7)).css("background-color", Constants.ColorOrange);
             grid[1][7].isConstant = true;
             grid[1][7].CellColor = "Black";
             (getCanvasCellAtIndex(2, 1)).css("background-color", Constants.ColorOrange);
             grid[2][1].isConstant = true;
             grid[2][1].CellColor = "Black";
             (getCanvasCellAtIndex(2, 3)).css("background-color", Constants.ColorPurple);
             grid[2][3].isConstant = true;
             grid[2][3].CellColor = "Black";
             (getCanvasCellAtIndex(2, 7)).css("background-color", Constants.ColorBlack);
             grid[2][7].isConstant = true;
             grid[2][7].CellColor = "Black";
             (getCanvasCellAtIndex(3, 1)).css("background-color", Constants.ColorPurple);
             grid[3][1].isConstant = true;
             grid[3][1].CellColor = "Black";
             (getCanvasCellAtIndex(3, 5)).css("background-color", Constants.ColorRed);
             grid[3][5].isConstant = true;
             grid[3][5].CellColor = "Black";
             (getCanvasCellAtIndex(3, 7)).css("background-color", Constants.ColorBlue);
             grid[3][7].isConstant = true;
             grid[3][7].CellColor = "Black";
             (getCanvasCellAtIndex(4, 0)).css("background-color", Constants.ColorYellow);
             grid[4][0].isConstant = true;
             grid[4][0].CellColor = "Black";
             (getCanvasCellAtIndex(4, 2)).css("background-color", Constants.ColorBlack);
             grid[4][2].isConstant = true;
             grid[4][2].CellColor = "Black";
             (getCanvasCellAtIndex(4, 4)).css("background-color", Constants.ColorOrange);
             grid[4][4].isConstant = true;
             grid[4][4].CellColor = "Black";
             (getCanvasCellAtIndex(4, 6)).css("background-color", Constants.ColorRed);
             grid[4][6].isConstant = true;
             grid[4][6].CellColor = "Black";
             (getCanvasCellAtIndex(4, 8)).css("background-color", Constants.ColorPurple);
             grid[4][8].isConstant = true;
             grid[4][8].CellColor = "Black";
             (getCanvasCellAtIndex(5, 1)).css("background-color", Constants.ColorBlue);
             grid[5][1].isConstant = true;
             grid[5][1].CellColor = "Black";
             (getCanvasCellAtIndex(5, 3)).css("background-color", Constants.ColorPink);
             grid[5][3].isConstant = true;
             grid[5][3].CellColor = "Black";
             (getCanvasCellAtIndex(5, 7)).css("background-color", Constants.ColorGreen);
             grid[5][7].isConstant = true;
             grid[5][7].CellColor = "Black";
             (getCanvasCellAtIndex(6, 1)).css("background-color", Constants.ColorBlack);
             grid[6][1].isConstant = true;
             grid[6][1].CellColor = "Black";
             (getCanvasCellAtIndex(6, 5)).css("background-color", Constants.ColorOrange);
             grid[6][5].isConstant = true;
             grid[6][5].CellColor = "Black";
             (getCanvasCellAtIndex(6, 7)).css("background-color", Constants.ColorYellow);
             grid[6][7].isConstant = true;
             grid[6][7].CellColor = "Black";
             (getCanvasCellAtIndex(7, 1)).css("background-color", Constants.ColorTeal);
             grid[7][1].isConstant = true;
             grid[7][1].CellColor = "Black";
             (getCanvasCellAtIndex(7, 3)).css("background-color", Constants.ColorBlack);
             grid[7][3].isConstant = true;
             grid[7][3].CellColor = "Black";
             (getCanvasCellAtIndex(7, 6)).css("background-color", Constants.ColorYellow);
             grid[7][6].isConstant = true;
             grid[7][6].CellColor = "Black";
             (getCanvasCellAtIndex(8, 4)).css("background-color", Constants.ColorPink);
             grid[8][4].isConstant = true;
             grid[8][4].CellColor = "Black";
             (getCanvasCellAtIndex(8, 6)).css("background-color", Constants.ColorBlue);
             grid[8][6].isConstant = true;
             grid[8][6].CellColor = "Black";
             break;
         case 4:
             (getCanvasCellAtIndex(0, 5)).css("background-color", Constants.ColorPink);
             grid[0][5].isConstant = true;
             grid[0][5].CellColor = "Black";
             (getCanvasCellAtIndex(1, 4)).css("background-color", Constants.ColorBlack);
             grid[1][4].isConstant = true;
             grid[1][4].CellColor = "Black";
             (getCanvasCellAtIndex(1, 5)).css("background-color", Constants.ColorPurple);
             grid[1][5].isConstant = true;
             grid[1][5].CellColor = "Black";
             (getCanvasCellAtIndex(1, 7)).css("background-color", Constants.ColorYellow);
             grid[1][7].isConstant = true;
             grid[1][7].CellColor = "Black";
             (getCanvasCellAtIndex(1, 8)).css("background-color", Constants.ColorBlue);
             grid[1][8].isConstant = true;
             grid[1][8].CellColor = "Black";
             (getCanvasCellAtIndex(2, 0)).css("background-color", Constants.ColorGreen);
             grid[2][0].isConstant = true;
             grid[2][0].CellColor = "Black";
             (getCanvasCellAtIndex(2, 2)).css("background-color", Constants.ColorOrange);
             grid[2][2].isConstant = true;
             grid[2][2].CellColor = "Black";
             (getCanvasCellAtIndex(2, 3)).css("background-color", Constants.ColorTeal);
             grid[2][3].isConstant = true;
             grid[2][3].CellColor = "Black";
             (getCanvasCellAtIndex(2, 6)).css("background-color", Constants.ColorPurple);
             grid[2][6].isConstant = true;
             grid[2][6].CellColor = "Black";
             (getCanvasCellAtIndex(3, 0)).css("background-color", Constants.ColorTeal);
             grid[3][0].isConstant = true;
             grid[3][0].CellColor = "Black";
             (getCanvasCellAtIndex(3, 2)).css("background-color", Constants.ColorPurple);
             grid[3][2].isConstant = true;
             grid[3][2].CellColor = "Black";
             (getCanvasCellAtIndex(3, 4)).css("background-color", Constants.ColorOrange);
             grid[3][4].isConstant = true;
             grid[3][4].CellColor = "Black";
             (getCanvasCellAtIndex(4, 1)).css("background-color", Constants.ColorOrange);
             grid[4][1].isConstant = true;
             grid[4][1].CellColor = "Black";
             (getCanvasCellAtIndex(4, 7)).css("background-color", Constants.ColorBlack);
             grid[4][7].isConstant = true;
             grid[4][7].CellColor = "Black";
             (getCanvasCellAtIndex(5, 4)).css("background-color", Constants.ColorPink);
             grid[5][4].isConstant = true;
             grid[5][4].CellColor = "Black";
             (getCanvasCellAtIndex(5, 6)).css("background-color", Constants.ColorTeal);
             grid[5][6].isConstant = true;
             grid[5][6].CellColor = "Black";
             (getCanvasCellAtIndex(5, 8)).css("background-color", Constants.ColorRed);
             grid[5][8].isConstant = true;
             grid[5][8].CellColor = "Black";
             (getCanvasCellAtIndex(6, 2)).css("background-color", Constants.ColorGreen);
             grid[6][2].isConstant = true;
             grid[6][2].CellColor = "Black";
             (getCanvasCellAtIndex(6, 5)).css("background-color", Constants.ColorBlack);
             grid[6][5].isConstant = true;
             grid[6][5].CellColor = "Black";
             (getCanvasCellAtIndex(6, 6)).css("background-color", Constants.ColorBlue);
             grid[6][6].isConstant = true;
             grid[6][6].CellColor = "Black";
             (getCanvasCellAtIndex(6, 8)).css("background-color", Constants.ColorYellow);
             grid[6][8].isConstant = true;
             grid[6][8].CellColor = "Black";
             (getCanvasCellAtIndex(7, 0)).css("background-color", Constants.ColorBlue);
             grid[7][0].isConstant = true;
             grid[7][0].CellColor = "Black";
             (getCanvasCellAtIndex(7, 1)).css("background-color", Constants.ColorTeal);
             grid[7][1].isConstant = true;
             grid[7][1].CellColor = "Black";
             (getCanvasCellAtIndex(7, 3)).css("background-color", Constants.ColorYellow);
             grid[7][3].isConstant = true;
             grid[7][3].CellColor = "Black";
             (getCanvasCellAtIndex(7, 4)).css("background-color", Constants.ColorGreen);
             grid[7][4].isConstant = true;
             grid[7][4].CellColor = "Black";
             (getCanvasCellAtIndex(8, 3)).css("background-color", Constants.ColorRed);
             grid[8][3].isConstant = true;
             grid[8][3].CellColor = "Black";
             break;
         default:
             alert("Thanks for taking the time to play our game. Let us know what you think!");
             break;
     }
 }