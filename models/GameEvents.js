function GameEvents() {
    
    this.lastEvent = false;
    this.latestEvent = false;
    
    this.previousShooterBallColor = false;
    this.shooterBallColor = false;
    
    this.gridBubbles = [];
    
    this.setShooterBallColor = function(color) {
        if(color)
            this.previousShooterBallColor = this.shooterBallColor;
        
        if(this.shooterBallColor !== false && !color)
            this.shotFired();
        
        if(!this.shooterBallColor && color)
            this.readyToShoot();
                
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
    }
    
    this.readyToShoot = function() {
        grid.bubblesAlreadyRemoved = [];
        console.log("ready to shoot");
    }
    
    this.gridHasChanged = function() {
    //    console.log("grid has changed")
    }
    
}

module.exports = new GameEvents();