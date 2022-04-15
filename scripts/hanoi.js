let background = '#0';

class Grid{
    constructor(ctx, size, width, height, initial, scale_factor) {
        this.ctx = ctx;
        this.size = size;
        this.width = width;
        this.height = height;
        this.scale_factor = scale_factor
        this.block = Math.floor(width / 6)
        
        this.cols = Math.floor(this.width / size);
        this.rows = Math.floor(this.height / size);
        
        this.data = Array(this.cols * this.rows).fill(initial);
        this.clear(initial)
        console.log('Grid created');
    }

    clear(initial) {
        this.ctx.fillStyle = initial;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    fill(x, y, color, disk_size) {
        let x_draw = (2 * x + 1) * this.block - disk_size * this.scale_factor / 2
        <!-- console.log(x, y, color); -->
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x_draw, this.height - (y + 1) * size, disk_size * scale_factor, size);
    }
    
    get_color(x, y) {
        if ((x < 0) || (y < 0) || (x >= this.cols) || (y >= this.rows)) {
            return -1;
        }
        <!-- console.log(x, y, this.data[x + y * this.cols]); -->
        return this.data[x + y * this.cols];
    }
}

class Disk{
    constructor(size, x, y, bright, background, grid) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.grid = grid;
        this.bright = bright
        this.background = background

        this.draw(true)
        console.log('Creating disk at ', this.x, ', ', this.y, ' with size ', this.size)
    }

    draw(use_bright) {
        if (use_bright) {
            this.grid.fill(this.x, this.y, this.bright, this.size);
        }
        else {
            this.grid.fill(this.x, this.y, this.background, this.size);
        }
    }

    move(new_x, new_y) {
        this.draw(false)
        this.x = new_x
        this.y = new_y
        this.draw(true)
    }
}

// define exploration combinations
let dx_4 = [-1,  0,  0,  1];
let dy_4 = [ 0, -1,  1,  0];

// define possible color combinations
let COLORS = ['#FF0000', '#7F0000',  
             '#00FF00', '#007F00', 
             '#FFFF00', '#7F7F00', 
             '#0000FF', '#00007F', 
             '#FF00FF', '#7F007F', 
             '#00FFFF', '#007F7F', 
             '#FFFFFF', '#7F7F7F', 
];
let BACKGROUND = '#000000';

let grid = 0;
let size = getParam('size', 10, 1, 20);
let crawlers_finished = 0;
let complete = getParam('complete', 0, 0, 1) ;

let num_disks = 10
let towers = [[], [], []]

let lastTimestamp = 0;

window.onload = init;

function init(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    reset(context, size, canvas, BACKGROUND);
    
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function getParam(name, defaultValue, minValue, maxValue) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has(name)) {
        value = urlParams.get(name);
        if ((minValue !== undefined) && (minValue > value)) {
            return minValue;
        }
        if ((maxValue !== undefined) && (maxValue < value)) {
            return maxValue;
        }
        return value;
    }
    return defaultValue;
}

function reset() {
    if (grid == 0) {
        scale_factor = Math.floor(canvas.width / num_disks / 3)
        grid = new Grid(context, size, canvas.width, canvas.height, BACKGROUND, scale_factor);
    }
    else {
        grid.clear(BACKGROUND)
    }
    let towers = [[], [], []]
    for (var i = num_disks; i > 0; i--) {
        j = Math.floor(towers.length * Math.random())
        towers[j].push(new Disk(i, j, towers[j].length, COLORS[i % COLORS.length], BACKGROUND, grid))
    }
}

function gameLoop(timeStamp) {
    // Update game objects in the loop
    if ((lastTimestamp == 0) || (timeStamp - lastTimestamp > 20)) {
        update();
        lastTimestamp = timeStamp;
    }
    draw();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    <!-- console.log('Updating', crawlers.length,'crawlers'); -->
//    reset();
}

function draw() {
}

function drawAll() {
}
