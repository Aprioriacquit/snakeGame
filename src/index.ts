import * as PIXI from "pixi.js";
import log2 = PIXI.utils.log2;

class Snake extends PIXI.Application {
    protected ms: number = 100;
    protected speed: number = 20;
    protected appWidth: number = 500;
    protected appHeight: number = 500;
    protected orientation: string = "";

    constructor() {
        super();
        this.view.height = this.appHeight;
        this.view.width = this.appWidth;
        document.body.append(this.view);
        this.gameAnimation(this.ms);
    }

﻿protected randomNumber(min: number, max: number, num: number):number {
        return Math.floor(Math.floor(Math.random() * (max - min + 1) + min) / num) * num;
    }

    protected drawObject(isSnake, x = this.randomNumber(0,480,20),y = this.randomNumber(0,480,20)): PIXI.Graphics {
        let object = new PIXI.Graphics();
        isSnake ? object.beginFill(0xFF0000) : object.beginFill(0xcff02e);
        object.drawRect(0, 0, 20, 20);
        object.position.set(x, y);
        isSnake ? object.name = "food": object.name = "snake";
        return object;
    }
    protected drawChildObject(snakeX: number,snakeY: number): PIXI.Graphics {
        let object = new PIXI.Graphics();
        object.beginFill(0x26d420);
        object.drawRect(0, 0, 20, 20);
        object.name = `${this.stage.children.length}`;
        object.position.set(snakeX, snakeY);
        return object;
    }

    protected newToOldParser(old: PIXI.DisplayObject[]): number[][]{
        let object: number[][] = [];
        for(let i:number = 0; i < old.length; i++){
            object.push([old[i].x, old[i].y]);
        }
        return object;
    }

    protected moveSnake(snake: PIXI.Graphics, food: PIXI.Graphics): void {
        let oldPosition: number[][] = this.newToOldParser(this.stage.children);
        document.onkeydown = (e) => {
            switch (e.code) {
                case "ArrowUp"    : case "KeyW" : if(this.stage.children[2]?this.stage.children[2].y !== snake.y - this.speed: true)this.orientation = "UP"    ; break;
                case "ArrowDown"  : case "KeyS" : if(this.stage.children[2]?this.stage.children[2].y !== snake.y + this.speed: true)this.orientation = "DOWN"  ; break;
                case "ArrowLeft"  : case "KeyA" : if(this.stage.children[2]?this.stage.children[2].x !== snake.x - this.speed: true)this.orientation = "LEFT"  ; break;
                case "ArrowRight" : case "KeyD" : if(this.stage.children[2]?this.stage.children[2].x !== snake.x + this.speed: true)this.orientation = "RIGHT" ; break;
            }
        };
        switch (this.orientation) {
            case "UP"    : {snake.y -= this.speed; break;}
            case "DOWN"  : {snake.y += this.speed; break;}
            case "LEFT"  : {snake.x -= this.speed; break;}
            case "RIGHT" : {snake.x += this.speed; break;}
        }
        if(oldPosition.find((elem, i) => i > 2 && elem[0] === snake.x && elem[1] === snake.y)){
            console.log("END GAME");

        }


        if(this.stage.children.length > 2){
            for(let i:number = 2; i<this.stage.children.length;i++){
                this.stage.children[i].x = oldPosition[i-1][0];
                this.stage.children[i].y = oldPosition[i-1][1];
            }
        }

        if (snake.x > 480){
            snake.x = 0;
        } else if (snake.x < 0){
            snake.x = 500;
        } else if (snake.y > 480){
            snake.y = 0;
        } else if (snake.y < 0){
            snake.y = 500;
        }

        if(snake.x > food.x - food.width && snake.y > food.y - food.height &&
            snake.x < food.x + food.width && snake.y < food.y + food.height) {
            this.stage.removeChildAt(0);
            this.stage.addChildAt(this.drawChildObject(this.stage.children[this.stage.children.length-1].x, this.stage.children[this.stage.children.length-1].y), this.stage.children.length);
            console.log(this.stage.children);
        }
    }

    protected gameAnimation(ms: number): void {
        let food: PIXI.Graphics;
        let snake: PIXI.Graphics = this.drawObject(false);
        this.stage.addChild(snake);
        setInterval(() => this.moveSnake(snake, food), ms);
        this.ticker.add(() => {
            if(this.stage.children[0].name != "food") {
                food = this.drawObject(true);
                console.log(snake.x,snake.y,this.orientation);
                this.stage.addChildAt(food, 0);
            }
        })
    }
}

new Snake();
