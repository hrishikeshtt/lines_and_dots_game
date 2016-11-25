import { Component } from '@angular/core';
@Component({
    selector: 'my-app',
    template: '<h1>{{this.Topic}}</h1>'
})
export class AppComponent {
    Topic: string;
    constructor() {
        this.Topic = "Play Dots and Lines"
    }
}

@Component({
    selector: 'line-draw',
    template: '<h2>Start the game by clicking between the lines</h2>'
})
export class LineDrawing {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: number;
    startX: number;
    startY: number;
	
	width : number;
	height : number;
	
	noOfPlayers : number;

    constructor() {

        this.size = 5;

        this.startX = 50;
        this.startY = 50;
        this.width = 3;
        this.height = 3;

        this.canvas = <HTMLCanvasElement>document.getElementById('cnvs');
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 1280, 720);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";

        this.ctx.lineWidth = 0;
		
		this.noOfPlayers = 3;

        // Drawing points
		this.DrawPoints (this):
        
		// Getting clicked positions and draw line
        this.GetClickedPosition(this);
    }
	DrawPoints(lineDrawing: this){
		for (var i = 1; i <= this.size; i++) {
            for (var j = 1; j <= this.size; j++) {
                this.ctx.strokeRect(this.startX * i, this.startY * j, this.width, this.height);
            }
        }
	}
    GetClickedPosition(lineDrawing: this) {

		var noOfPlayers = this.noOfPlayers;
		
        var drawnLineCoordinates: Array<Array<number>> = [];
		
		var numberOfClicks = 0;
		
		var players : new Player[] = [];
		
		// Creating player objects
		for( var i = 0 ; i < noOfPlayers; i++ ){			
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
            var lesserX , lesserY = 50, greaterX , greaterY;
            var clientX = event.clientX;
            var clientY = event.clientY;
            var clickedX = clientX - 30; // Pixel adjustment
            var clickedY = clientY - 170; // Pixel adjustment
            

            for (var i = 0; i < lineDrawing.size - 1; i++) {
                if (clientX > 80 + (50 * i) && clientX < 80 + (50 * (i + 1))) {
                    lesserX = lineDrawing.startX * (i + 1);
                    greaterX = lineDrawing.startX * (i + 2);
                }
                if (clientY > 220 + (50 * i) && clientY < 220 + (50 * (i + 1))) {
                    lesserY = lineDrawing.startY * (i + 1);
                    greaterY = lineDrawing.startY * (i + 2);
                }
            }

			var quadPosition = 0;
			var quadPositionCalculator = new QuadPosition();
			quadPosition = quadPositionCalculator.CalculateQuadPosition( lesserY, clickedY, lesserX, clickedX, greaterX );
			console.log( quadPosition );
           

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
            var currentCoordinates : Array<number> = [];
			currentCoordinates.push(x1);
			currentCoordinates.push(y1);
			currentCoordinates.push(x2);
			currentCoordinates.push(y2);
			
			var isDrawn = false;
			
            if (drawnLineCoordinates.length > 0) {				
				for( let coordinate of drawnLineCoordinates){
					if(coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x2 && coordinate[3] == y2 ){
						isDrawn = true;
						alert("Sorry, It is already drawn");
						break;
					}
				}
				if(!isDrawn){
					if(currentCoordinates[0] != undefined && currentCoordinates[1] != undefined && currentCoordinates[2] != undefined && currentCoordinates[3] != undefined)
					{
						drawnLineCoordinates.push(currentCoordinates);
						
						 //Drawing the line
						lineDrawing.ctx.moveTo(x1, y1);
						lineDrawing.ctx.lineTo(x2, y2);
						lineDrawing.ctx.stroke();
					}
				}
            }
            else { // First time adding of coordinates                
                drawnLineCoordinates.push(currentCoordinates);

                //Drawing the line
                lineDrawing.ctx.moveTo(x1, y1);
                lineDrawing.ctx.lineTo(x2, y2);
                lineDrawing.ctx.stroke();
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
			
			for ( let coordinate of drawnLineCoordinates ){
				
				if(!isDrawn){ // need to check other sides only when the line is not already drawn
				
				if(y1 == y2){ //  horizontal lines
	
					// checking up square
					if( coordinate[0] == x1 && coordinate[1] == y1 - 50 && coordinate[2] == x1 && coordinate[3] == y1 ){ // Checking vertical up-left line is drawn
						verticalUpLeft = true;
					}
					if( coordinate[0] == x1 && coordinate[1] == y1 - 50 && coordinate[2] == x2 && coordinate[3] == y1-50 ){ // Checking horizontal up line is drawn
						horizontalUp = true;
					}
					if( coordinate[0] == x2 && coordinate[1] == y1 - 50 && coordinate[2] == x2 && coordinate[3] == y1 ){ // Checking vertical up-right line is drawn
						verticalUpRight = true;
					}
					
					// checking down square
					if( coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x1 && coordinate[3] == y1 + 50 ){ // Checking vertical down-left line is drawn
						verticalDownLeft = true;
					}
					if( coordinate[0] == x1 && coordinate[1] == y1 + 50 && coordinate[2] == x2 && coordinate[3] == y1 + 50 ){ // Checking horizontal down line is drawn
						horizontalDown = true;
					}
					if( coordinate[0] == x2 && coordinate[1] == y1 && coordinate[2] == x2 && coordinate[3] == y1 + 50 ){ // Checking vertical down-right line is drawn
						verticalDownRight = true;
					} 
				}
				else if ( x1 == x2 ){
					
					// checking left square
					if( coordinate[0] == x1 - 50 && coordinate[1] == y1 && coordinate[2] == x1 && coordinate[3] == y1  ){ // Checking horizontal left-up line is drawn
						horizontalLeftUp = true;
					}
					if( coordinate[0] == x1 - 50 && coordinate[1] == y1 && coordinate[2] == x1 - 50 && coordinate[3] == y2 ){ // Checking vertical left line is drawn
						verticalLeft = true;
					}
					if( coordinate[0] == x1 - 50 && coordinate[1] == y2 && coordinate[2] == x1 && coordinate[3] == y2 ){ // Checking horizontal left-down line is drawn
						horizontalLeftDown = true;
					} 
					
					// checking right square
					if( coordinate[0] == x1 && coordinate[1] == y1 && coordinate[2] == x1 + 50 && coordinate[3] == y1  ){ // Checking horizontal right-up line is drawn
						horizontalRightUp = true;
					}
					if( coordinate[0] == x1 + 50 && coordinate[1] == y1 && coordinate[2] == x1 + 50 && coordinate[3] == y2 ){ // Checking vertical right line is drawn
						verticalRight = true;
					}
					if( coordinate[0] == x1 && coordinate[1] == y2 && coordinate[2] == x1 + 50 && coordinate[3] == y2 ){ // Checking horizontal right-down line is drawn
						horizontalRightDown = true;
					} 
				}
				}
			}
			
			// alert message for succeessfull up squre
			if( verticalUpLeft && horizontalUp && verticalUpRight ){
					alert("Up square completed");
					players[playerIndex].Squares ++;
					
					// // Writing player name inside the completed square					
					// lineDrawing.ctx.fillStyle = "red";
					// lineDrawing.ctx.font = "10pt sans-serif";
					// lineDrawing.ctx.textAlign="center"; 
					// lineDrawing.ctx.fillText( players[playerIndex].Name, ( lesserX + greaterX ) / 2, ( lesserY + greaterY ) / 2 );
					
					numberOfClicks -- ;
				}

			// alert message for succeessfull down squre
			if( verticalDownLeft && horizontalDown && verticalDownRight ){
					alert("Down square completed");
					players[playerIndex].Squares ++;
					
					// // Writing player name inside the completed square					
					// lineDrawing.ctx.fillStyle = "red";
					// lineDrawing.ctx.font = "10pt sans-serif";
					// lineDrawing.ctx.textAlign="center"; 
					// lineDrawing.ctx.fillText( players[playerIndex].Name, ( lesserX + greaterX ) / 2, ( lesserY + greaterY ) / 2 );
					
					numberOfClicks -- ;
				}
				
			// alert message for succeessfull left squre
			if( horizontalLeftUp && verticalLeft && horizontalLeftDown ){
					alert("Left square completed");
					players[playerIndex].Squares ++;
					
					// // Writing player name inside the completed square					
					// lineDrawing.ctx.fillStyle = "red";
					// lineDrawing.ctx.font = "10pt sans-serif";
					// lineDrawing.ctx.textAlign="center"; 
					// lineDrawing.ctx.fillText( players[playerIndex].Name, ( lesserX + greaterX ) / 2, ( lesserY + greaterY ) / 2 );
					
					numberOfClicks -- ;
				}
				
			// alert message for succeessfull right squre
			if( horizontalRightUp && verticalRight && horizontalRightDown ){
					alert("Right square completed");
					players[playerIndex].Squares ++;
					
					// // Writing player name inside the completed square					
					// lineDrawing.ctx.fillStyle = "red";
					// lineDrawing.ctx.font = "10pt sans-serif";
					// lineDrawing.ctx.textAlign="center"; 
					// lineDrawing.ctx.fillText( players[playerIndex].Name, ( lesserX + greaterX ) / 2, ( lesserY + greaterY ) / 2 );
					
					numberOfClicks -- ;
				}
				
				numberOfClicks ++ ;
				
        }, false);
    }
};

class QuadPosition {
	
	lesserY : number;
	clickedY : number;
	lesserX : number;
	clickedX : number;
	greaterX : number;
	
	CalculateQuadPosition(lesserY, clickedY, lesserX, clickedX, greaterX ){
		this.lesserY = lesserY;
		this.clickedY = clickedY;
		this.lesserX = lesserX;
		this.clickedX = clickedX;
		this.greaterX = greaterX;
		
		 // CALCULATING THE DIAGONAL QUAD POSITION ( excluding the chance of clicking in the diagonal )

            if ((this.lesserY - this.clickedY) > (this.lesserX - this.clickedX)) { // checking first diagonal - above ( y - y1 > m ( x - x1 ) + b )
                if ((this.lesserY - this.clickedY > -(this.greaterX - this.clickedX))) { // checking second diagonal - above ( - symbol is beacuse of slope )
                    return 0; // above 1 and above 2
                }
                else { // checking second diagonal - below
                    return 1; // above 1 and below 2
                }
            }
            else { // checking first diagonal - below
                if ((this.lesserY - this.clickedY > -(this.greaterX - this.clickedX))) { // checking second diagonal - above
                    return 2; // below 1 and above 2
                }
                else { // checking second diagonal - below
                    return 3; // below 1 and below 2
                }
            }
	}
};

class Player {
	Name : string;
	Squares : number;
	
};






























