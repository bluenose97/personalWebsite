var ctx = document.querySelector("canvas").getContext("2d");
var numberOfColumns = 200;
var numberOfRows = 200;

var grid = new Array(numberOfRows).fill(0);
for (var i = 0; i < grid.length; i++){
    grid[i] = new Array(numberOfColumns).fill(0);
}
// Setup the GOL grid
function initialiseGOL(){

}

function getNeighbours(){

}

// Iterate the GOL grid
function stepGOL(){

}

function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        canvas.width = width;
        canvas.height = height;
    }
}

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
    grd.addColorStop(0, "#e60008");
    grd.addColorStop(1, "#001a66");
    ctx.fillStyle = grd;
    
    ctx.translate(hw, hh);
    for (var i = 0; i < (numberOfColumns * numberOfRows); ++i) {
        hh = h / 2;
        for (var j = 0; j < numberOfRows; ++j) {
            if (j % 20 == 0 && i % Math.floor(Math.random() * 20) == 0){
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