const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPositions = [];

// iniciamos el juego
window.addEventListener('load', setCanvasSize);
// aplicamos responsive design al canvas cada vez que cambiamos el tamaño de la ventana
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {

    //console.log({canvasSize, elementsSize});

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    // trim quita los espacios al inicio y final de un string
    // split separa los caracteres
    // split crea un arreglo a partir de un string, cada que se encuentra un salto de linea \n
    const mapRows = map.trim().split('\n');
    // creamos un array de arrays
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    //console.log({map, mapRows, mapRowCols});

    //limpiamos el arreglo de posiciones del enemigo
    enemyPositions = [];
    
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
                    //console.log({playerPosition});
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX.toFixed(3),
                    y: posY.toFixed(3),
                });
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
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        console.log('Regalo');
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x == playerPosition.x;
        const enemyCollisionY = enemy.y == playerPosition.y;
        return enemyCollisionX && enemyCollisionY;
    });
    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('subiste de nivel');
    level++;
    startGame();
}

function levelFail() {
    console.log('chocaste con un enemigo');
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Terminastes el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'superastes el record';
        } else {
            pResult.innerHTML = 'no superastes el record';
        }
    } else {
        localStorage.setItem('record_time', playerTime)
        pResult.innerHTML = 'Primera vez? muy bien, ahora supera tu tiempo :)'
    }

    //console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']) // [1,2,3]
    //console.log(heartsArray);

    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
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
    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Izquierda');
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    console.log('Derecha');
    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log('Abajo');
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}
