document.getElementById('start').addEventListener('click', start)
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

function start(){
    var audio = new Audio( "media/tetrisMusic.mp3" );
    function music(){
        audio.play();
        audio.loop = true;
    }
    music()
    alert(" Arrow keys move right and left, 'Q' rotates right and 'W' rotates left, and Swipe right and left to move on Touch Screen,  Enjoy!!")
    
    var arena = createMatrix(12, 20);
    console.log(arena);
    

    context.scale(20, 20);
    const matrix = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ];
    const player = {
        pos: {x:5, y:5},
        matrix: null,
        score: 0
    }
    
    function arenaSweep(){
        let rowCount = 1;
        outer:  for(let y = arena.length - 1; y > 0; --y){
            for (let x = 0; x < arena[y].length; ++x){
                if(arena[y][x] === 0){
                    continue outer;
                }
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;
            player.score += rowCount * 10;
            rowCount *= 2;
        }
        
    }
    function collide(arena, player){
        const [n, s] = [player.matrix, player.pos];
        for(let y = 0; y < n.length; y++){
            for(let x = 0; x < n[y].length; x++){
                if(n[y][x] !==0 && 
                    (arena[y + s.y] && 
                arena[y + s.y][x + s.x]) !== 0){
                    return true;
                }
            }
        }
        return false;
    }
    
    function createMatrix(w, h){
        const matrix = [];
        while (h--){
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }
    
    function createPiece(type){
        if(type === 'T'){
            return [
        [0, 0, 0],
        [7, 7, 7],
        [0, 7, 0]
            ];
        }
        else if (type === 'O'){
            return [
                [1, 1],
                [1, 1]
            ];
        }
        else if (type === 'L'){
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2]
            ];
        }
        else if(type === 'J'){
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0]
            ];
        }
        else if (type === 'I'){
            return [
                [0, 4, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 0, 0]
            ];
        }
        else if(type === 'S'){
            return [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0]
            ];
        }
        else if (type === 'Z'){
            return [
                [6, 6, 0],
                [0, 6, 6],
                [0, 0, 0]
            ];
        }
    }
    
    const colors = [
        null,
        '#CC1100	',
        'blue',
        '#9400D3',
        '#ED9121',
        '#E0427F',
        '#00ff7f',
        'yellow'
    ]
    function draw(){
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, {x:0, y:0});
        drawMatrix(player.matrix, player.pos );
        
    }
    function drawMatrix(matrix, offset){
        matrix.forEach((row, y) => {
            row.forEach((value, x)=>{
                if(value !== 0){
                    context.fillStyle = colors[value] ;
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function endgame(){

    }
    function merge(arena, player){
        player.matrix.forEach((row, y) => {
            row.forEach((value, x)=>{
                if (value !== 0){
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            })
        })
    }
    
    function playerDrop(){
        player.pos.y++;
        if(collide(arena, player)){
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
        }
        dropCounter = 0;
    }
    
    function playerMove(dir){
        player.pos.x += dir;
        if (collide(arena, player)){
            player.pos.x -= dir;
        }
    }
    function playerReset(){
        const pieces = 'ILJOTSZ';
        player.matrix = createPiece((pieces[pieces.length * Math.random() | 0]));
        player.pos.y = 0;
        player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
        if (collide(arena, player)){
            arena.forEach(row => row.fill(0));
            player.score = 0;
            updateScore();
        }
        
    }
    function playerRotate(dir){
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(arena, player)){
            player.pos.x += offset;
            offset = - (offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length){
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }
    function rotate(matrix, dir){
        for (let y = 0; y < matrix.length; y++){
            for(let x = 0; x < y; x++ ){
                [ 
                    matrix[x][y],
                    matrix[y][x]
                ] = [
                    matrix[y][x],
                    matrix[x][y] 
                ];
            }
        }
        if (dir > 0 ){
            matrix.forEach(row => row.reverse());
        }
        else{
            matrix.reverse();
        }
    }
    
    let dropCounter = 0;
    var dropInterval = 800;
    
    if(player.score >= 10){
        dropInterval = 400;
    }
    else if (player.score >= 30){
        dropInterval = 400;
    }
    else if (player.score >= 50){
        dropInterval = 300;
    }
    
    let lastTime = 0;
    
    function update(time= 0){
        const deltaTime =  time- lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if ( dropCounter> dropInterval){
            playerDrop();
        }
        draw();
        requestAnimationFrame(update);
    }
    
    
    function updateScore(){
        document.getElementById("score").textContent = player.score;
    }
    
    
    
    
    document.addEventListener('swiped-right', event =>{
        playerMove(1);  
    })
    document.addEventListener('swiped-left', event =>{
        playerMove(-1);  
    })
    document.addEventListener('swiped-down', event =>{
        playerDrop();  
    })
    document.getElementById('leftR').addEventListener('click', event =>{
        playerRotate(-1);
    })
    document.getElementById('rightR').addEventListener('click', event =>{
        playerRotate(1);
    })
    
    document.addEventListener('keydown', event =>{
        if (event.keyCode === 37){
            playerMove(-1);
        }
        else if (event.keyCode === 39 ){
            
            playerMove(1);
        }
        else if (event.keyCode === 40){
            playerDrop();
        }
        else if (event.keyCode === 81){
            playerRotate(-1);
        }
        else if (event.keyCode === 87){
            playerRotate(1);
        }  
    })
    function pause(){
        audio.pause();
        audio.currentTime = 0;
    }

    document.getElementById('pause').addEventListener('click', pause);

    function resume(){
        audio.play();
        audio.currentTime = 0;
    }

    document.getElementById('resume').addEventListener('click', resume)
    //there are 20 lines in the arena
    
    //  arena[19].fill(1);
    
    updateScore()
    playerReset()
    update();
    document.getElementById('start').removeEventListener('click', start);
}


/* I do not want to take full credit for this game because this youtube video was a big help
https://www.youtube.com/watch?v=H2aW5V46khA */