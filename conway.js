var ctx = document.querySelector("canvas").getContext("2d");
var numberOfColumns = 680;
if (window.innerWidth < 721){
    numberOfColumns = 400
}
var gridSize = numberOfColumns * 2;
var restartCounter = 0;

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


function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setupGilder(x, y){
    grid[x][y] = 1;
    grid[x][y+1] = 1;
    grid[x+1][y] = 1;
    grid[x+1][y+1] = 1;
    grid[x+10][y] = 1;
    grid[x+10][y+1] = 1;
    grid[x+10][y+2] = 1;
    grid[x+11][y-1] = 1;
    grid[x+11][y+3] = 1;
    grid[x+12][y-2] = 1;
    grid[x+12][y+4] = 1;
    grid[x+13][y-2] = 1;
    grid[x+13][y+4] = 1;
    grid[x+14][y+1] = 1;
    grid[x+15][y-1] = 1;
    grid[x+15][y+3] = 1;
    grid[x+16][y] = 1;
    grid[x+16][y+1] = 1;
    grid[x+16][y+2] = 1;
    grid[x+17][y+1] = 1;
    grid[x+20][y-2] = 1;
    grid[x+20][y-1] = 1;
    grid[x+20][y] = 1;
    grid[x+21][y-2] = 1;
    grid[x+21][y-1] = 1;
    grid[x+21][y] = 1;
    grid[x+22][y-3] = 1;
    grid[x+22][y+1] = 1;
    grid[x+24][y-4] = 1;
    grid[x+24][y-3] = 1;
    grid[x+24][y+1] = 1;
    grid[x+24][y+2] = 1;
    grid[x+34][y-2] = 1;
    grid[x+34][y-1] = 1;
    grid[x+35][y-2] = 1;
    grid[x+35][y-1] = 1;
}

// Setup the GOL grid
function initialiseGOL() {
    restartCounter++;
    color1 = getRandomColor();
    color2 = invertColor(color1);

    if (restartCounter % 4 == 0) {
        for (var i = 0; i < grid.length; i++) {
            grid[i] = new Array(gridSize).fill(0);
        }
        var startY = 18
        var startX = 8
        for (var x = startX; x < grid[0].length; x += numberOfColumns/5){
            for (var y = startY; y < grid.length; y += numberOfColumns/8){
                setupGilder(x, y);
            }
        }
    } else {
        // Set random starting pattern
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[0].length; j++) {
                grid[i][j] = Math.floor(Math.random() * 3);
            }
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

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function render() {
    stepGOL();
    resize(ctx.canvas);
    ctx.save();
    new Promise((resolve) => setTimeout(resolve, 5000));
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    var cellSize = Math.round(w / numberOfColumns);
    var numberOfRows = Math.round(h / cellSize);
    var hw = w / 2;
    var hh = h / 2;
    ctx.clearRect(0, 0, w, h);
    var grd = ctx.createLinearGradient(-hw, -hh, hw, hh);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    ctx.fillStyle = grd;

    ctx.translate(hw, hh);
    for (var i = 0; i < (numberOfColumns * 1.5); ++i) {
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