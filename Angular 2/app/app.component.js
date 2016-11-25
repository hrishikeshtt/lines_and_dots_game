"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
let AppComponent = class AppComponent {
    constructor() {
        this.Topic = "Play Dots and Lines";
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: '<h1>{{this.Topic}}</h1>'
    }), 
    __metadata('design:paramtypes', [])
], AppComponent);
exports.AppComponent = AppComponent;
let LineDrawing = class LineDrawing {
    constructor() {
        this.size = 5;
        this.startX = 50;
        this.startY = 50;
        this.width = 3;
        this.height = 3;
        this.canvas = document.getElementById('cnvs');
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 1280, 720);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 0;
        this.noOfPlayers = 3;
        // Drawing points
        this.DrawPoints(this);
        // Getting clicked positions and draw line
        this.GetClickedPosition(this);
    }
    DrawPoints(lineDrawing) {
        for (var i = 1; i <= this.size; i++) {
            for (var j = 1; j <= this.size; j++) {
                this.ctx.strokeRect(this.startX * i, this.startY * j, this.width, this.height);
            }
        }
    }
    GetClickedPosition(lineDrawing) {
        var noOfPlayers = this.noOfPlayers;
        var drawnLineCoordinates = [];
        var numberOfClicks = 0;
        var players = [];
        // Creating player objects
        for (var i = 0; i < noOfPlayers; i++) {
            var player = new Player();
            player.Name = 'P' + i;
            player.Squares = 0;
            players.push(player);
        }
        this.canvas.addEventListener('click', function (event) {
            // Player details
            var playerIndex = numberOfClicks % noOfPlayers;
            lineDrawing.ctx.beginPath();
            lineDrawing.ctx.strokeStyle = "yellow";
            // GETTING FOUR ADJACENT POINTS
            var lesserX, lesserY, greaterX, greaterY;
            var clientX = event.clientX;
            var clientY = event.clientY;
            var clickedX = clientX - 30; // Pixel adjustment;  clicked ( 80, 200 ) is ( 50, 50 )
            var clickedY = clientY - 150; // Pixel adjustment
            for (var i = 0; i < lineDrawing.size - 1; i++) {
                if (clientX > 80 + (50 * i) && clientX < 80 + (50 * (i + 1))) {
                    lesserX = lineDrawing.startX * (i + 1);
                    greaterX = lineDrawing.startX * (i + 2);
                }
                if (clientY > 200 + (50 * i) && clientY < 200 + (50 * (i + 1))) {
                    lesserY = lineDrawing.startY * (i + 1);
                    greaterY = lineDrawing.startY * (i + 2);
                }
            }
            var quadPosition = 0;
            var quadPositionCalculator = new QuadPosition();
            quadPosition = quadPositionCalculator.CalculateQuadPosition(lesserY, clickedY, lesserX, clickedX, greaterX);
            // SETTING XY POINTS TO DRAW LINE
            var x1;
            var y1;
            var x2;
            var y2;
            switch (quadPosition) {
                case 0: {
                    x1 = lesserX;
                    x2 = greaterX;
                    y1 = lesserY;
                    y2 = lesserY;
                    break;
                }
                case 1: {
                    y1 = lesserY;
                    y2 = greaterY;
                    x1 = greaterX;
                    x2 = greaterX;
                    break;
                }
                case 2: {
                    y1 = lesserY;
                    y2 = greaterY;
                    x1 = lesserX;
                    x2 = lesserX;
                    break;
                }
                case 3: {
                    y1 = greaterY;
                    y2 = greaterY;
                    x1 = lesserX;
                    x2 = greaterX;
                    break;
                }
            }
            // Checking already line drawn or not            
            var currentCoordinates = [];
            currentCoordinates.push(x1);
            currentCoordinates.push(y1);
            currentCoordinates.push(x2);
            currentCoordinates.push(y2);
            var isDrawn = false;
            if (drawnLineCoordinates.length > 0 && quadPosition != -1) {
                for (let coordinate of drawnLineCoordinates) {
                    if (coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x2 && coordinate[3] == y2) {
                        isDrawn = true;
                        alert("Sorry, It is already drawn");
                        break;
                    }
                }
                if (!isDrawn) {
                    if (currentCoordinates[0] != undefined && currentCoordinates[1] != undefined && currentCoordinates[2] != undefined && currentCoordinates[3] != undefined) {
                        drawnLineCoordinates.push(currentCoordinates);
                        //Drawing the line
                        lineDrawing.ctx.moveTo(x1, y1);
                        lineDrawing.ctx.lineTo(x2, y2);
                        lineDrawing.ctx.stroke();
                        numberOfClicks++;
                    }
                }
            }
            else if (quadPosition != -1) {
                drawnLineCoordinates.push(currentCoordinates);
                //Drawing the line
                lineDrawing.ctx.moveTo(x1, y1);
                lineDrawing.ctx.lineTo(x2, y2);
                lineDrawing.ctx.stroke();
                numberOfClicks++;
            }
            // Checking for completed square
            // For up square
            var verticalUpLeft = false;
            var horizontalUp = false;
            var verticalUpRight = false;
            // For down square
            var verticalDownLeft = false;
            var horizontalDown = false;
            var verticalDownRight = false;
            // For left square
            var horizontalLeftUp = false;
            var verticalLeft = false;
            var horizontalLeftDown = false;
            // For right square
            var horizontalRightUp = false;
            var verticalRight = false;
            var horizontalRightDown = false;
            for (let coordinate of drawnLineCoordinates) {
                if (!isDrawn) {
                    if (y1 == y2) {
                        // checking up square
                        if (coordinate[0] == x1 && coordinate[1] == y1 - 50 && coordinate[2] == x1 && coordinate[3] == y1) {
                            verticalUpLeft = true;
                        }
                        if (coordinate[0] == x1 && coordinate[1] == y1 - 50 && coordinate[2] == x2 && coordinate[3] == y1 - 50) {
                            horizontalUp = true;
                        }
                        if (coordinate[0] == x2 && coordinate[1] == y1 - 50 && coordinate[2] == x2 && coordinate[3] == y1) {
                            verticalUpRight = true;
                        }
                        // checking down square
                        if (coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x1 && coordinate[3] == y1 + 50) {
                            verticalDownLeft = true;
                        }
                        if (coordinate[0] == x1 && coordinate[1] == y1 + 50 && coordinate[2] == x2 && coordinate[3] == y1 + 50) {
                            horizontalDown = true;
                        }
                        if (coordinate[0] == x2 && coordinate[1] == y1 && coordinate[2] == x2 && coordinate[3] == y1 + 50) {
                            verticalDownRight = true;
                        }
                    }
                    else if (x1 == x2) {
                        // checking left square
                        if (coordinate[0] == x1 - 50 && coordinate[1] == y1 && coordinate[2] == x1 && coordinate[3] == y1) {
                            horizontalLeftUp = true;
                        }
                        if (coordinate[0] == x1 - 50 && coordinate[1] == y1 && coordinate[2] == x1 - 50 && coordinate[3] == y2) {
                            verticalLeft = true;
                        }
                        if (coordinate[0] == x1 - 50 && coordinate[1] == y2 && coordinate[2] == x1 && coordinate[3] == y2) {
                            horizontalLeftDown = true;
                        }
                        // checking right square
                        if (coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x1 + 50 && coordinate[3] == y1) {
                            horizontalRightUp = true;
                        }
                        if (coordinate[0] == x1 + 50 && coordinate[1] == y1 && coordinate[2] == x1 + 50 && coordinate[3] == y2) {
                            verticalRight = true;
                        }
                        if (coordinate[0] == x1 && coordinate[1] == y2 && coordinate[2] == x1 + 50 && coordinate[3] == y2) {
                            horizontalRightDown = true;
                        }
                    }
                }
            }
            // alert message for succeessfull up squre
            if (verticalUpLeft && horizontalUp && verticalUpRight) {
                alert("Up square completed");
                players[playerIndex].Squares++;
                // Writing player name inside the completed square					
                lineDrawing.ctx.fillStyle = "red";
                lineDrawing.ctx.font = "10pt sans-serif";
                lineDrawing.ctx.textAlign = "center";
                lineDrawing.ctx.fillText(players[playerIndex].Name, (x1 + x2) / 2, (y1 + y1 - 50) / 2);
            }
            // alert message for succeessfull down squre
            if (verticalDownLeft && horizontalDown && verticalDownRight) {
                alert("Down square completed");
                players[playerIndex].Squares++;
                // Writing player name inside the completed square					
                lineDrawing.ctx.fillStyle = "red";
                lineDrawing.ctx.font = "10pt sans-serif";
                lineDrawing.ctx.textAlign = "center";
                lineDrawing.ctx.fillText(players[playerIndex].Name, (lesserX + greaterX) / 2, (lesserY + greaterY) / 2);
            }
            // alert message for succeessfull left squre
            if (horizontalLeftUp && verticalLeft && horizontalLeftDown) {
                alert("Left square completed");
                players[playerIndex].Squares++;
                // Writing player name inside the completed square					
                lineDrawing.ctx.fillStyle = "red";
                lineDrawing.ctx.font = "10pt sans-serif";
                lineDrawing.ctx.textAlign = "center";
                lineDrawing.ctx.fillText(players[playerIndex].Name, (x1 + x1 - 50) / 2, (lesserY + greaterY) / 2);
            }
            // alert message for succeessfull right squre
            if (horizontalRightUp && verticalRight && horizontalRightDown) {
                alert("Right square completed");
                players[playerIndex].Squares++;
                // Writing player name inside the completed square					
                lineDrawing.ctx.fillStyle = "red";
                lineDrawing.ctx.font = "10pt sans-serif";
                lineDrawing.ctx.textAlign = "center";
                lineDrawing.ctx.fillText(players[playerIndex].Name, (lesserX + greaterX) / 2, (lesserY + greaterY) / 2);
            }
            // Showing the result				
            // var  completedSquares = 0;
            // var winner = null;
            // var previousPlayerSquares = 0;
            // for( let player of players ){
            // completedSquares = completedSquares + player.Squares;				
            // if( previousPlayerSquares < player.Squares ){
            // previousPlayerSquares = player.Squares;
            // winner = player.Name;
            // }
            // }
            // if(completedSquares == 1){
            // // Writing result					
            // lineDrawing.ctx.fillStyle = "green";
            // lineDrawing.ctx.font = "30pt sans-serif";
            // lineDrawing.ctx.textAlign="center"; 
            // lineDrawing.ctx.fillText( "Game over", 500, 100 );
            // lineDrawing.ctx.fillText( "Winner is " + winner, 500, 200 );				
            // }
        }, false);
    }
};
LineDrawing = __decorate([
    core_1.Component({
        selector: 'line-draw',
        template: '<h2>Start the game by clicking between the lines</h2>'
    }), 
    __metadata('design:paramtypes', [])
], LineDrawing);
exports.LineDrawing = LineDrawing;
;
class QuadPosition {
    CalculateQuadPosition(lesserY, clickedY, lesserX, clickedX, greaterX) {
        this.lesserY = lesserY;
        this.clickedY = clickedY;
        this.lesserX = lesserX;
        this.clickedX = clickedX;
        this.greaterX = greaterX;
        // CALCULATING THE DIAGONAL QUAD POSITION ( excluding the chance of clicking in the diagonal )
        if (this.lesserY != undefined && this.lesserX != undefined && this.greaterX) {
            if ((this.lesserY - this.clickedY) > (this.lesserX - this.clickedX)) {
                if ((this.lesserY - this.clickedY > -(this.greaterX - this.clickedX))) {
                    return 0; // above 1 and above 2
                }
                else {
                    return 1; // above 1 and below 2
                }
            }
            else {
                if ((this.lesserY - this.clickedY > -(this.greaterX - this.clickedX))) {
                    return 2; // below 1 and above 2
                }
                else {
                    return 3; // below 1 and below 2
                }
            }
        }
        else {
            return -1;
        }
    }
}
;
class Player {
}
;
//# sourceMappingURL=app.component.js.map