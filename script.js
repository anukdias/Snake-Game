// define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
 // js constant board = the "game-board" from html file
 // console.log(board);  you can use console.log to test js code w/ inspect element

 // Define game variables
 const gridSize = 20; // changeable grid size
 let snake = [{x: 10, y: 10}]; // This is where snake starts - 
 // in the middle of the 20 by 20 grid
 //(maybe I can make random start implementation)
 let food = generateFood(); // need to create random location for food
 let direction = 'right'; // default to right
 let gameInterval;
 let gameSpeedDelay = 200;
 let gameStarted = false;
 let highScore = 0;

 //draw game map, snake, and food
 function draw() {
    board.innerHTML = ''; // set it to empty initially to reset board
    drawSnake();
    drawFood();
    updateScore();
 }

 //Draw snake- Creates every snake element and gives it all the snake class
 function drawSnake() { 
    snake.forEach((segment) => {
       const snakeElement = createGameElement('div', 'snake'); 
       setPosition(snakeElement, segment);
       board.appendChild(snakeElement);
    });
 }

 // Create a snake or food cube/div (cube and div are same here)
 function createGameElement(tag, className) {
    const element = document.createElement(tag); 
    // Creates new html element inside the JavaScript, the tag for it will be div
    element.className = className;
    return element;
    // creates div with className of snake if called from drawSnake
 }

 // Set the position of snake or food
 function setPosition(element, position) { 
    element.style.gridColumn = position.x;
    // x coordinate of snake
    element.style.gridRow = position.y;
    // sets y coordinate of snake
 }

 // Testing draw function
 //draw();

 function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
 }

 function generateFood() {
    const x = Math.floor((gridSize *  Math.random())) + 1; 
    const y = Math.floor((gridSize * Math.random())) + 1;
    return {x, y}; // brackets mean return as object
 }

 function move() {
    // "shallow copy" head 
    const head = { ...snake[0]}; // copy of snake without changing it
    switch (direction){
        case 'right':
            head.x++; // increase x coord if right movement
            break;
        case 'left':
            head.x--; // decrease x coord if left movement
            break;
        case 'up':
            head.y--; // decrease y coord if up movement
            break;
        case 'down':
            head.y++; // increase y coord if down movement
            break;
    }
    snake.unshift(head);
    // unshift adds a snake object to the beginning of the array
    if(head.x === food.x && head.y === food.y) {
        food = generateFood(); // generate new food
        increaseSpeed();
        clearInterval(gameInterval); // reset move function- clear past interval
        gameInterval = setInterval(() => {
            move();
           checkCollision();
            draw();
        }, gameSpeedDelay)
    } else {
        snake.pop(); // removes the last element -- makes sense because just added new one with unshift    
        // no need to run snake.pop if you get food because the snake grows with food
    }
 }

 // Test moving
 //  setInterval(() => {
 //     move(); // move first
 //     draw(); // draw again new position

 //  }, 200);

 // Start game function
 function startGame(){
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
 }

 function handleKeyPress(event){
    if(
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')  // for any browser's space key
     ) {
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'ArrowDown':
                direction = 'down'
                break;
            case 'ArrowLeft':
                direction = 'left'
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
        }
    }
 }

 document.addEventListener('keydown', handleKeyPress); 
 // for every key pressed, it calls handleKeyPress function
 
 function increaseSpeed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if(gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }  else if(gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }  else if(gameSpeedDelay > 20) {
        gameSpeedDelay -= 1;
    } 
 }

 function checkCollision() {
    const head = snake[0];
    // Collision with border
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    // Collision with itself
    for(let i  = 1; i < snake.length; i++) { // increment thru snake length
        if(head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
 }

 function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
 }

 function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
    // set text of Score to snake length, turn to string, and make it a triple digit number
    // so score at 0 = 000, score at 20 = 020 for nice arcade visuals
 }

 function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block'; 
    logo.style.display = 'block';
 }

 function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    } 
    highScoreText.style.display = 'block';
 }