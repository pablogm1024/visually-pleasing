let background = '#0';

class Grid{
    constructor(ctx, size, width, height, initial) {
        this.ctx = ctx;
        this.size = size;
        this.width = width;
        this.height = height;
        
        this.cols = Math.floor(this.width / size);
        this.rows = Math.floor(this.height / size);
        
        this.data = Array(this.cols * this.rows).fill(initial);

        this.ctx.fillStyle = initial;
        this.ctx.fillRect(0, 0, width, height);
        console.log('Grid created');
    }
    
    fill(x, y, color) {
        <!-- console.log(x, y, color); -->
        this.data[x + y * this.cols] = color;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * size, y * size, size, size);
    }
    
    get_color(x, y) {
        if ((x < 0) || (y < 0) || (x >= this.cols) || (y >= this.rows)) {
            return -1;
        }
        <!-- console.log(x, y, this.data[x + y * this.cols]); -->
        return this.data[x + y * this.cols];
    }
}

// define exploration combinations
let dx_4 = [-1,  0,  0,  1];
let dy_4 = [ 0, -1,  1,  0];

class Crawler {
    constructor(x, y, bright, dark, grid) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bright = bright;
        this.dark = dark;
        this.grid = grid;
        this.finished = false;
        
        this.grid.fill(this.x, this.y, this.bright);
    }
    
    get_exits(color, distance) {
        var result = [];
        <!-- console.log(dx_4.length, "directions explored"); -->
        for (var i = 0; i < dx_4.length; i++) {
            if (this.grid.get_color(this.x + distance * dx_4[i], this.y + distance * dy_4[i]) == color) {
                result.push(i);
            }
        }
        <!-- console.log(result.length, "exits found"); -->
        return result;
    }
    
    advance(direction) {
        for (var i = 0; i < 2; i++) {
            this.x += dx_4[direction];
            this.y += dy_4[direction];
            this.grid.fill(this.x, this.y, this.bright);
        }
    }
    
    retreat(direction) {
        for (var i = 0; i < 2; i++) {
            this.grid.fill(this.x, this.y, this.dark);
            this.x += dx_4[direction];
            this.y += dy_4[direction];
        }
    }
    
    move(background) {
        <!-- console.log('Moving crawler', this.bright); -->
        var forward = this.get_exits(background, 2);
        if (forward.length > 0) {
            this.advance(forward[Math.floor(Math.random() * forward.length)]);
            return true;
        }
        var backward = this.get_exits(this.bright, 1);
        if (backward.length > 0) {
            this.retreat(backward[0]);
            return true;
        }
        this.finished = true;
        return false;
    }
}

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
let crawlers = [];
let size = getParam('size', 3, 1, 20);
let crawlers_finished = 0;
let complete = getParam('complete', 0, 0, 1) ;

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
    grid = new Grid(context, size, canvas.width, canvas.height, BACKGROUND);
    crawlers = [];
    var numCrawlers = getParam('numCrawlers', 7, 1);
    
    for (var i = 0; i < numCrawlers; i++) {
        do {
            x = 2 * Math.floor(Math.random() * grid.cols / 2);
            y = 2 * Math.floor(Math.random() * grid.rows / 2);
        } while (grid.get_color(x, y) != BACKGROUND);
        console.log(x, y);
        var newCrawler = new Crawler(x, y, COLORS[(2 * i) % COLORS.length], 
        COLORS[(2 * i + 1) % COLORS.length], grid);
        crawlers.push(newCrawler);
    }
    crawlers_finished = 0;
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
    for (var i = 0; i < crawlers.length; i++) {
        if (crawlers[i].finished) {
            continue;
        }
        <!-- console.log('Crawler', i); -->
        if (crawlers[i].move(BACKGROUND) == false) {
            crawlers_finished += 1;
        }
    }
    if (crawlers_finished - complete >= crawlers.length - 1) {
        reset();
    }
}

function draw() {
}

function drawAll() {
}
