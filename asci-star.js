import chalk from 'chalk';
let matrix = [];

const COLS = 230;
const ROWS = 60;


export function getCirclePoints(
    totalRows,
    totalCols,
    radius,
    {
        xScale = 0.5,    // adjust horizontal stretch for terminal aspect ratio
        thickness = 1.0, // only used for ring mode
        fill = false
    } = {}
) {
    const centerRow = Math.floor(totalRows / 2);
    const centerCol = Math.floor(totalCols / 2);

    const points = [];

    for (let row = 0; row < totalRows; row++) {
        const yDist = row - centerRow;

        for (let col = 0; col < totalCols; col++) {
            const xDist = (col - centerCol) * xScale;
            const distance = Math.sqrt(xDist * xDist + yDist * yDist);

            const isWithinCircle = fill
                ? distance <= radius
                : Math.abs(distance - radius) <= thickness / 2;

            if (!isWithinCircle) continue;

            const angle = Math.atan2(yDist, xDist);

            points.push({
                row,
                col,
                angle
            });
        }
    }

    return points;
}


function initMatrix() {

    for (let i = 0; i < ROWS; i++) {
        matrix[i] = [];
        for (let j = 0; j < COLS; j++) {
            matrix[i][j] = " ";
        }
    }
}

function markPoints(points, char ) {
    for (const point of points) {
        
        matrix[point.row][point.col] = char;
        
        
    };
}

function ringNoiseGenerator(points, char, noiseRange) {
    for (const point of points) {
        let col = point.col;
        let row = point.row;
        let random = col + Math.floor(Math.random() * noiseRange);
        for (let t = col; t < random; t++) {
            matrix[row][t] = char;

        }
    }
}
function forwardEdgeNoiseGenerator(points, char) {
    for (const point of points) {
        let col = point.col;
        let row = point.row;
        let span = Math.floor(Math.random() * 3);
        for (let t = col; t > col - span; t--) {
            if (t < 0) break;
            matrix[row][t] = char;

        }
    }
}
function spiralNoiseGenerator(points, char,noiseRange1,noiseRange2) {
    for (const point of points) {
        let col = point.col;
        let row = point.row;
        let random = col + Math.floor(Math.random() * noiseRange1);
        let vertCounter = 0, horzCounter = 0;
        
        for (let t = col; t < random; t++) {
            vertCounter+=5;
            horzCounter+=1;
            let random = Math.floor(Math.random() * noiseRange2);
            if (row+horzCounter >= ROWS) break;
            if (t+vertCounter*random >= COLS) break;
            matrix[row+horzCounter][t+vertCounter*random] = char;
        }
    }
}

const keys = ["@", "#", "$", "%", "&", "*", "+", "-", "=", "~", "^", "?", "!", "/", "|", "<", ">", ";", ":", ".", ",", "`" ];
function getRandomChar(keys) {
    const index = Math.floor(Math.random() * keys.length);
    return keys[index];
}



const points = getCirclePoints(ROWS, COLS, 20, { fill: false });
const points2 = getCirclePoints(ROWS, COLS-5, 10, { fill: false });
initMatrix();
markPoints(points, "*");
process.stdout.write('\x1b[2J'); // clear screen
process.stdout.write('\x1b[H');   // move to 0,0
let maxTime = 500;
let time = 0;
for (let i = 0; i < matrix.length; i++) {
    const centerCol = Math.floor(COLS / 2);

    // Only left half of circle
    const leftOnly = points.filter(point => point.col < centerCol)
    const rightOnly = points.filter(point => point.col > centerCol);
    ringNoiseGenerator(rightOnly, "*",10);

    ringNoiseGenerator(leftOnly, "*",15);
    markPoints(points, "*");
    forwardEdgeNoiseGenerator(leftOnly, "*");

    if (i % 2 === 0){

        spiralNoiseGenerator(points, "*",Math.floor(Math.random() * i),Math.floor(Math.random() * i));
        console.log(chalk.bgGray(chalk.green(matrix[i].join(''))));
    }else{
        spiralNoiseGenerator(rightOnly, "*",Math.floor(Math.random() * i),Math.floor(Math.random() * i));
        console.log(chalk.bgGray(chalk.red(matrix[i].join(''))));
    }
    initMatrix();
    //console.log(`${i} >= ${matrix.length-1}`);
    if(i >= matrix.length -1){
        process.stdout.write('\x1b[0;0H');
        console.log(chalk.bgRed(`i=${i} time=${time}`));
        i = 0;
        time++;
        if (time >= maxTime) break;
    }

}
    
