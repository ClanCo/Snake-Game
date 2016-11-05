var snake;
var apple;
var snakeGame;

/********************* function event ************************/
window.onload = function()
{
    snakeGame= new snakeGame(900,600,20,75);
    snake = new Snake([[6,4],[5,4],[4,4],[3,4]],"right");
    apple = new Apple([10,10]);
    snakeGame.init(snake,apple);
}

document.onkeydown = function handleKeyDown(e)
{
    var key = e.keyCode;
    var newDirection;
    console.log(key);
        
    switch(key)
        {
            case 37:
                newDirection = "left";
                break;
                    
            case 38:
                newDirection = "up";
                break;
                    
            case 39:
                newDirection = "right";
                break;
                    
            case 40:
                newDirection = "down";
                break;
                    
            case 32:
                snake = new Snake([[6,4],[5,4],[4,4],[3,4]],"right");
                apple = new Apple([10,10]);
                snakeGame.init(snake,apple);
                return;
                    
            default :
                console.log("Wrong key pressed");
                return;
                      
            }
        snakeGame.snake.setDirection(newDirection);
}

/****************** Game Constructor ***********************/

function snakeGame(canvasWidth, canvasHeight, blockSize, delay)
{
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.border = "1px solid";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.blockSize = blockSize;
    this.delay = delay; //time in ms    
    this.snake;
    this.apple;
    this.widthInBlocks = canvasWidth/blockSize;
    this.heightInBlocks = canvasHeight/blockSize;
    this.score;   
    var instance = this;
    var timeout;
    
    this.init = function(snake,apple)
    {
        this.snake = snake;
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    };
    
    var refreshCanvas = function()
    {
        instance.snake.advance();
        
        if (instance.checkCollision())
            {
                instance.gameOver();
            }
        else
            {
                if(instance.snake.isEatingApple(instance.apple))
                    {
                        instance.score++;
                        instance.snake.ateApple = true;
                        do
                        {
                            instance.apple.setNewPosition(instance.widthInBlocks,instance.heightInBlocks);
                        }while(instance.apple.isOnSnake(instance.snake))
                        
                    }
                instance.ctx.clearRect(0,0,instance.canvas.width,instance.canvas.height);     
                instance.snake.draw(instance.ctx, instance.blockSize);
                instance.apple.draw(instance.ctx, instance.blockSize);
                instance.drawScore();
                timeout = setTimeout(refreshCanvas,delay);
            }
        
    }
        
    this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;   
            var head = this.snake.body[0];
            var rest = this.snake.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = this.widthInBlocks - 1;
            var maxY = this.heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minX || snakeY > maxY;

            
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                {
                    wallCollision = true;
                }
            for(var i = 0; i < rest.length; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                        {
                            snakeCollision = true;
                        }
                }
            return wallCollision || snakeCollision;
        };
        
    this.gameOver = function()
    {
        this.ctx.save();
        this.ctx.fillText("Game Over!",5,15);
        this.ctx.fillText("Press space to play again!", 5, 30);
        this.ctx.restore();
    };
    
    this.drawScore = function()
    {
        this.ctx.save();
        this.ctx.fillText(this.score.toString(),5,this.canvas.height - 5);
        this.ctx.restore();
    };

    return this;
}
    
/****************** Snake Constructor ***********************/
    
function Snake(body,direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(ctx,blockSize)
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0 ; i <this.body.length ; i++)
            {
                var x = this.body[i][0] * blockSize;
                var y = this.body[i][1] * blockSize;
                ctx.fillRect(x,y,blockSize,blockSize);
            }
            ctx.restore();                 
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "up": 
                    nextPosition[1]--;
                break;
                
                case "down": 
                    nextPosition[1]++;
                break;
                
                case "right": 
                    nextPosition[0]++;
                break;
                
                case "left": 
                    nextPosition[0]--;
                break;
                
                default : console.log("wrong position give");
                    break;
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                    this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection)
        {
           var allowedDirections;
            switch(this.direction)
                {
                    case "right":        
                    case "left": 
                        allowedDirections =["up","down"];
                    break;
                    
                    case "up":
                    case "down":
                        allowedDirections =["left","right"];
                    break;
                        
                    default : throw("Invalid Direction");
                        break;
                }
            if(allowedDirections.indexOf(newDirection) > -1)
                {
                    this.direction = newDirection;
                }
        };
            
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else 
                return false;
        };
    }
    
/************************** Apple Constructor **********************/
    
function Apple(position)
    {
        this.position = position;
        
        this.draw = function(ctx,blockSize)
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0]* blockSize + radius;
            var y = this.position[1]* blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        
        this.setNewPosition = function(widthInBlocks,heightInBlocks)
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX,newY];
        };
        
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;
            
            for(var i = 0; i < snakeToCheck.body.length; i++ )
                {
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                        {
                            isOnSnake = true;
                        } 
                }
            return isOnSnake;
        };
    
    }   

