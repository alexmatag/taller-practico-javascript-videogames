const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementsSize;

// iniciamos el juego
window.addEventListener('load', setCanvasSize);
// aplicamos responsive design al canvas cada vez que cambiamos el tamaño de la ventana
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    startGame();
}

function startGame() {

    //console.log({canvasSize, elementsSize});

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[0];
    // trim quita los espacios al inicio y final de un string
    // split separa los caracteres
    // split crea un arreglo a partir de un string, cada que se encuentra un salto de linea \n
    const mapRows = map.trim().split('\n');
    // creamos un array de arrays
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    //console.log({map, mapRows, mapRowCols});
    
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji =  emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            game.fillText(emoji, posX, posY);
            //console.log({row, rowI, col, colI});
        });
    });

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row );
    //     }
    // }
}