let cols = 0;
let rows = 0;
let data = 0;

// define possible color combinations
let COLORS_16 = ['#000000', '#0F0000', '#1F0000', '#2F0000', 
                 '#3F0000', '#4F0000', '#5F0000', '#6F0000', 
                 '#7F0000', '#8F0000', '#9F0000', '#AF0000', 
                 '#BF0000', '#CF0000', '#DF0000', '#EF0000', 
];
let COLORS_24 = ['#FF0000', '#DF001F', '#BF003F', '#9F005F', 
                 '#7F007F', '#5F009F', '#3F00BF', '#1F00DF',
                 '#0000FF', '#001FDF', '#003FBF', '#005F9F',
                 '#007F7F', '#009F5F', '#00BF3F', '#00DF1F',
                 '#00FF00', '#1FDF00', '#3FBF00', '#5F9F00',
                 '#7F7F00', '#9F5F00', '#BF3F00', '#DF1F00',
];
let COLORS_12 = ['#FF0000', '#BF003F',  
                 '#7F007F', '#3F00BF', 
                 '#0000FF', '#003FBF', 
                 '#007F7F', '#00BF3F', 
                 '#00FF00', '#3FBF00', 
                 '#7F7F00', '#BF3F00', 
];

// define exploration combinations
let dx_8 = [-1, -1, -1,  0,  0,  1,  1,  1];
let dy_8 = [-1,  0,  1, -1,  1, -1,  0,  1];
let dx_4 = [-1,  0,  0,  1];
let dy_4 = [ 0, -1,  1,  0];

// select configuration
let COLORS = COLORS_24;
let dx = dx_8;
let dy = dy_8;
let size = 3;

let instantUpdate = false;

window.onload = init;

function init(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    cols = Math.floor(canvas.width / size);
    rows = Math.floor(canvas.height / size);
    
    console.log(cols, rows);
    data = [...Array(cols * rows)].map(() => Math.floor(Math.random() * COLORS.length));
    console.log(data[0], data[1]);
    
    
    drawAll();
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Update game objects in the loop
    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    oldData = data.slice();
    for(x = 0; x < cols; x++){
        for(y = 0; y < rows; y++){
            for(i = 0; i < dx.length; i++){
                x2 = (x + dx[i] + cols) % cols;
                y2 = (y + dy[i] + rows) % rows;
                if (oldData[x2 + y2 * cols] == (oldData[x + y * cols] + 1) % COLORS.length) {
                    data[x + y * cols] = oldData[x2 + y2 * cols];
                    if (instantUpdate) {
                        context.fillStyle = COLORS[data[x + y * cols] % COLORS.length];
                        context.fillRect(x * size, y * size, size, size);
                    }
                    break;
                }
            }
        }
    }
}

function draw() {
    if (!instantUpdate) {
        drawAll();
    }
}

function drawAll() {
    for(x = 0; x < cols; x++){
        for(y = 0; y < rows; y++){
            context.fillStyle = COLORS[data[x + y * cols] % COLORS.length];
            context.fillRect(x * size, y * size, size, size);
        }
    }
}
