function GameEvents() {

    this.lastEvent = false;
    this.latestEvent = false;

    this.previousShooterBallColor = false;
    this.shooterBallColor = false;

    this.gridBubbles = [];

/*This function has a color passed through it.
if that color exists, then the shooterBallColor = true;

*/
    this.setShooterBallColor = function(color) {
        if(color)
            this.previousShooterBallColor = this.shooterBallColor;

        if(this.shooterBallColor !== false && !color)// shooterballColor exists, but there is no color there
            {
              console.log("next should be fired soon")
              this.shotFired();
            }

        if(!this.shooterBallColor && color)//shooterBallColor does not exist and color exists, we are ready to shoot
            {
              console.log("READY MOTHERFUCKER");
              this.readyToShoot();
            }

        this.shooterBallColor = color;
    }

    this.bubbleIsNew = function(bubble) {
        for(var i = 0 ; i < this.gridBubbles.length ; i++) {

            var gridBubble = this.gridBubbles[i];

            if(bubble.x === gridBubble.x && bubble.y === gridBubble.y && bubble.color === gridBubble.color)
                return false;
        }
        return true;
    }



    this.newBubbles = function() {

        var newBubbles = [];

        var currentBubbles = grid.currentBubbles();

        for(var i = 0 ; i < currentBubbles.length ; i++) {

            if(this.bubbleIsNew(currentBubbles[i])) {
                newBubbles.push(currentBubbles[i]);
            }

        }

        return newBubbles;
    }

    this.bubbleWasRemoved = function(bubble) {
        var currentBubbles = grid.currentBubbles();

        for(var i = 0 ; i < currentBubbles.length ; i++) {

            var gridBubble = currentBubbles[i];

            if(bubble.x === gridBubble.x && bubble.y === gridBubble.y && bubble.color === gridBubble.color)
                return false;
        }
        return true;
    }

    this.removedBubbles = function() {
        var removedBubbles = [];

        var previousBubbles = this.gridBubbles;

        for(var i = 0 ; i < previousBubbles.length ; i++) {

            if(this.bubbleWasRemoved(previousBubbles[i])) {
                removedBubbles.push(previousBubbles[i]);
            }

        }

        return removedBubbles;
    }

    this.setGrid = function() {



        if(this.gridBubbles.length !== grid.currentBubbles().length) {
            this.gridHasChanged();

            var removedBubbles = this.removedBubbles();

            if(removedBubbles.length > 0) {

                if(removedBubbles[0].color === this.previousShooterBallColor) {

                    var removedCluster = removedBubbles[0].getCluster();

                    for(var i = 0 ; i < removedCluster.bubbles.length ; i++) {
                        grid.bubblesAlreadyRemoved.push(removedCluster.bubbles[i]);
                    }

                    var unattachedCluster = removedBubbles[0].getUnattachedCluster(removedCluster.bubbles);

                    for(var i = 0 ; i < unattachedCluster.length ; i++) {
                        grid.bubblesAlreadyRemoved.push(unattachedCluster[i]);
                    }

                }
            }

        } else {
      //      grid.bubblesAlreadyRemoved = [];
        }

        this.gridBubbles = grid.currentBubbles();
    }

    this.setConditions = function(data) {
        this.setShooterBallColor(data["shooterBallColor"]);
        this.setGrid();

    }

    this.getGrid = function() {
        return grid;
    }

    this.shotFired = function() {
        console.log("shot fired");
        availShots = grid.availableShots();
        colorArray = grid.currentColors();
        colorCount = colorArray.length;

        readyToShoot = false;

        var bestShot = grid.bestShot();

        console.log(grid.bestShot());

        if(bestShot) {
          console.log("about to fire!");
            var bestTouchPoint = bestShot.bestTouchPoint();
            console.log(bestTouchPoint);

            if(bestTouchPoint) {
                if(bestTouchPointTemp == null)
                    bestTouchPointTemp = bestTouchPoint;

                if(bestTouchPointTemp.x !== bestTouchPoint.x && bestTouchPointTemp.y !== bestTouchPoint.y) {
                    bestTouchPointTemp = bestTouchPoint;
                    console.log("moving right about now");
                    bestTouchPoint.moveRobot();
                } else {
                    setTimeout(this.shotFired, 100);
                }
            } else {
                setTimeout(this.shotFired, 100);
            }
        } else {
            setTimeout(this.shotFired, 100);
         }

    }

    this.readyToShoot = function() {
        grid.bubblesAlreadyRemoved = [];
        console.log("ready to shoot");

        colorArray = grid.currentColors();
        colorCount = colorArray.length;

        readyToShoot = true;

            var command = "axibot manual pen_down 100;";

                if(!robotMoving) {
                    robotMoving = true;

                    exec(command,(error, stdout, stderr) => {

                            robotMoving = false;

                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                          console.log(`stdout: ${stdout}`);
                          console.log(`stderr: ${stderr}`);


                        });
                } else {
                setTimeout(this.readyToShoot, 100);
            }


    }

    this.gridHasChanged = function() {
    //    console.log("grid has changed")
    }

}

module.exports = new GameEvents();
