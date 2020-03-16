var ctx = document.querySelector("canvas").getContext("2d");
var numberOfColumns = 300;
var gridSize = 600;

// Initialise the grid
var grid = new Array(gridSize).fill(0);
for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(gridSize).fill(0);
}


// Initialise the neighbourCount store array
var neighbourStore = new Array(gridSize).fill(0);
for (var i = 0; i < neighbourStore.length; i++) {
    neighbourStore[i] = new Array(gridSize).fill(0);
}


// Setup the GOL grid
function initialiseGOL() {
    // Set starting pattern
    // grid[8][18] = 1;
    // grid[8][19] = 1;
    // grid[9][18] = 1;
    // grid[9][19] = 1;
    // grid[18][18] = 1;
    // grid[18][19] = 1;
    // grid[18][20] = 1;
    // grid[19][17] = 1;
    // grid[19][21] = 1;
    // grid[20][16] = 1;
    // grid[20][22] = 1;
    // grid[21][16] = 1;
    // grid[21][22] = 1;
    // grid[22][19] = 1;
    // grid[23][17] = 1;
    // grid[23][21] = 1;
    // grid[24][18] = 1;
    // grid[24][19] = 1;
    // grid[24][20] = 1;
    // grid[25][19] = 1;
    // grid[28][16] = 1;
    // grid[28][17] = 1;
    // grid[28][18] = 1;
    // grid[29][16] = 1;
    // grid[29][17] = 1;
    // grid[29][18] = 1;
    // grid[30][15] = 1;
    // grid[30][19] = 1;
    // grid[32][14] = 1;
    // grid[32][15] = 1;
    // grid[32][19] = 1;
    // grid[32][20] = 1;
    // grid[42][16] = 1;
    // grid[42][17] = 1;
    // grid[43][16] = 1;
    // grid[43][17] = 1;

    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            grid[i][j] = Math.floor(Math.random() * 3);
        }
    }
}

initialiseGOL();

// Get the number of neighbours of a given cell. Wrap grid
function getNeighbours(i, j) {
    var neighbours = 0;
    var iBehind = i - 1;
    var iInfront = i + 1;
    var jBehind = j - 1;
    var jInfront = j + 1;
    if (i == 0) {
        iBehind = gridSize - 1;
    }
    if (i == gridSize - 1) {
        iInfront = gridSize - 1;
    }
    if (j == 0) {
        jBehind = gridSize - 1;
    }
    if (j == gridSize - 1) {
        jInfront = gridSize - 1;
    }
    neighbours += grid[iBehind][jBehind];
    neighbours += grid[iBehind][j];
    neighbours += grid[iBehind][jInfront];
    neighbours += grid[i][jBehind];
    neighbours += grid[i][jInfront];
    neighbours += grid[iInfront][jBehind];
    neighbours += grid[iInfront][j];
    neighbours += grid[iInfront][jInfront];
    return neighbours;
}

// Iterate the GOL grid
function stepGOL() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            neighbourStore[i][j] = getNeighbours(i, j);
        }
    }
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            if (neighbourStore[i][j] == 3) {
                grid[i][j] = 1;
            }
            if (neighbourStore[i][j] < 2) {
                grid[i][j] = 0;
            }
            if (neighbourStore[i][j] > 3) {
                grid[i][j] = 0;
            }
        }
    }
}

function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        canvas.width = width;
        canvas.height = height;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
color1 = getRandomColor();
color2 = getRandomColor();

function render() {
    stepGOL();
    resize(ctx.canvas);
    ctx.save();
    new Promise((resolve) => setTimeout(resolve, 5000));
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    var cellSize = Math.round(h / numberOfColumns);
    var numberOfRows = Math.round(h / cellSize);
    var hw = w / 2;
    var hh = h / 2;
    ctx.clearRect(0, 0, w, h);
    var grd = ctx.createLinearGradient(-hw, -hh, hw, hh);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    ctx.fillStyle = grd;

    ctx.translate(hw, hh);
    for (var i = 0; i < (numberOfColumns * 2); ++i) {
        hh = h / 2;
        for (var j = 0; j < numberOfRows; ++j) {
            if (grid[i][j] == 1) {
                ctx.fillRect(-hw, -hh, cellSize, cellSize);
            }
            hh -= cellSize;
        }
        hw -= cellSize;
    }
    ctx.restore();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);