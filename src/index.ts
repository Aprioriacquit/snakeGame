import * as PIXI from "pixi.js";

class Snake extends PIXI.Application {
    protected ms: number = 100;
    protected speed: number = 15;
    protected appWidth: number = 500;
    protected appHeight: number = 500;
    protected orientation: string = "";
    protected snakeTails: PIXI.Graphics[] = [];

    constructor() {
        super();
        this.view.height = this.appHeight;
        this.view.width = this.appWidth;
        document.body.append(this.view);
        this.gameAnimation(this.ms);
    }

    protected drawObject(isSnake): PIXI.Graphics {
        let object = new PIXI.Graphics();
        let x = Math.floor(Math.random() * this.appWidth);
        let y = Math.floor(Math.random() * this.appWidth);
        isSnake ? object.beginFill(0xFF0000) : object.beginFill(0x15FF00);
        object.drawRect(0, 0, 20, 20);
        object.position.set(x, y);
        return object;
    }

    protected addPostionToTail(snake, tail): void {
        tail.position.set(snake.x, snake.y);
        snake.addChild(tail);
    }

    protected moveSnake(snake: PIXI.Graphics, food: PIXI.Graphics): void {
        this.snakeTails.forEach(tail => this.addPostionToTail(snake, tail));

        document.onkeydown = (e) => {
            switch (e.code) {
                case "ArrowUp"    : case "KeyW" : this.orientation = "UP"    ; break;
                case "ArrowDown"  : case "KeyS" : this.orientation = "DOWN"  ; break;
                case "ArrowLeft"  : case "KeyA" : this.orientation = "LEFT"  ; break;
                case "ArrowRight" : case "KeyD" : this.orientation = "RIGHT" ; break;
            }
        };

        switch (this.orientation) {
            case "UP"    : snake.y -= this.speed; break;
            case "DOWN"  : snake.y += this.speed; break;
            case "LEFT"  : snake.x -= this.speed; break;
            case "RIGHT" : snake.x += this.speed; break;
        }

        if(snake.x >= food.x - food.width && snake.y >= food.y - food.height &&
            snake.x <= food.x + food.width && snake.y <= food.y + food.height) {
            this.stage.removeChild(food);
        }
    }

    protected gameAnimation(ms: number): void {
        let food: PIXI.Graphics;
        let snake: PIXI.Graphics = this.drawObject(false);
        this.stage.addChild(snake);
        setInterval(() => this.moveSnake(snake, food), ms);
        this.ticker.add(() => {
            if(this.stage.children.length < 2) {
                food = this.drawObject(true);
                this.stage.addChild(food);
                this.snakeTails.push(this.drawObject(true));
            }
        })
    }
}

new Snake();
