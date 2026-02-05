import chalk from 'chalk';
let matrix = [];


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

    for (let i = 0; i < 40; i++) {
        matrix[i] = [];
        for (let j = 0; j < 120; j++) {
            matrix[i][j] = " ";
        }
    }
}

const points = getCirclePoints(40, 120, 10, { fill: false });
function markPoints(){
    for (const point of points) {
        let char = "@";
        
        matrix[point.row][point.col] = char;
        
        
    };
}

function ringNoiseGenerator() {
    for (const point of points) {
        let char = "@";
        let col = point.col;
        let row = point.row;
        let random = col + Math.floor(Math.random() * 8);
        for (let t = col; t < random; t++) {
            matrix[row][t] = char;
        }
    }
}

initMatrix();
markPoints();
process.stdout.write('\x1b[2J'); // clear screen
process.stdout.write('\x1b[H');   // move to 0,0

let maxTime = 10000;
let time = 0;
for (let i = 0; i < matrix.length; i++) {
    ringNoiseGenerator();
    for (const point of points) {
        let char = ".";
        let col = point.col;
        let row = point.row;
        let random = col + Math.floor(Math.random() * 8);
        let counter = 1;
        for (let t = col; t < random; t++) {
            counter++;
            matrix[row+counter][t+counter] = char;
        }
    }
    if (i % 2 === 0){
        console.log(chalk.green(matrix[i].join('')));
    }else{
        console.log(chalk.red(matrix[i].join('')));
    }
    initMatrix();
    markPoints();
    //console.log(`${i} >= ${matrix.length-1}`);
    if(i >= matrix.length -1){
        process.stdout.write('\x1b[0;0H');
        console.log(chalk.bgRed(`i=${i} time=${time}`));
        i = 0;
        time++;
        if (time >= maxTime) break;
    }

}
    