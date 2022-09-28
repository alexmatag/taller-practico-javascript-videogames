const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

let canvasSize;
let elementsSize;

const playerPosition = {
    x: undefined,
    y: undefined,
};

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
    
    // borramos todo y empezamos a renderizar todo desde cero
    game.clearRect(0,0,canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji =  emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            }

            game.fillText(emoji, posX, posY);
            //console.log({row, rowI, col, colI});
        });
    });

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row );
    //     }
    // }

    movePlayer();
}

function movePlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}

function moveUp() {
    console.log('Arriba');
    playerPosition.y -= elementsSize;
    startGame();
}

function moveLeft() {
    console.log('Izquierda');
    playerPosition.x -= elementsSize;
    startGame();
}

function moveRight() {
    console.log('Derecha');
    playerPosition.x += elementsSize;
    startGame();
}

function moveDown() {
    console.log('Abajo');
    playerPosition.y += elementsSize;
    startGame();
}