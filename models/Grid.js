function Grid() {
    
    this.grid = [];
            
    this.resetGrid = function() {
        for(var i = 0 ; i < 11 ; i++) {
            this.grid[i] = [];
            for(var j = 0 ; j < 15 ; j++) {
                this.grid[i][j] = new Bubble(i,j,0);
            }
        }
    }
    
    this.add = function(x,y,contents) {
        
        var bubble = new Bubble(x, y, contents);
        
    //    if(bubble.adjacentMatches(0).length < 6) //don't add falling pieces
            this.grid[x][y] = bubble;
    }
    
    this.countInRow = function(row) {
        var count = 0;
        for(var i = 0 ; i < 11 ; i++)
            if(this.grid[i][row].color != 0)
                count++;
        return count;
    }
    
    this.lastRow = function() {
        for(var i = 0 ; i < 15 ; i++) {
            if(this.countInRow(i) == 0)
                return i - 1;
        }
        return 15;
    }
    
    this.getColoredBubbles = function(color) {
        var array = [];
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                if(this.grid[i][j].color === color)
                    array.push(this.grid[i][j]);
            }
        }
        return array;
    }
    
    this.alreadyInCollection = function(match, bubbles) {
        for(var i = 0 ; i < bubbles.length ; i++)
            if(bubbles[i].x == match.x && bubbles[i].y == match.y)
                return true;
        return false;
    }
    
    this.getPossibleShots = function(color) {
        
        var array = [];
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                if(typeof this.grid[i] != "undefined" && typeof this.grid[i][j] != "undefined" && this.grid[i][j].color != 0 && this.grid[i][j].adjacentMatches(0).length > 0) {
                    
                    var matches = this.grid[i][j].adjacentMatches(0);
                    for(var m = 0 ; m < matches.length ; m++) {
                        if(!this.alreadyInCollection(matches[m],array))
                            array.push(matches[m]);
                    }                        
                }
            }
        }
        
        return array;
    }
    
    this.bubblesSortedByDistance = function() {
        var array = [];
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                array.push(this.grid[i][j]);
            }
        }
        
        array.sort(function(a,b){
            var distanceA = distanceBetweenPoints(a.getCenterX(),a.getCenterY(), rotationPointX, rotationPointY);
            var distanceB = distanceBetweenPoints(b.getCenterX(),b.getCenterY(), rotationPointX, rotationPointY);
            return distanceA - distanceB;
        });
        
        return array;
        
    }
    
    this.availableShots = function() {
        
        var array = [];
        
        var sortedBubbles = this.bubblesSortedByDistance();
        var lastEmptyBubble = sortedBubbles[0];
        
        for(var i = 0 ; i < touchPoints.length ; i++) {
            
            var touchPointX = touchPoints[i].x;
            var touchPointY = touchPoints[i].y;
                            
            for(var s = 0 ; s < sortedBubbles.length ; s++ ) {
                
                var shot = sortedBubbles[s];
                
                var centerX = 68 + shot.x * gridSpacing;
                var centerY = 204 + shot.y * gridSpacing;
                
                if(shot.y % 2 === 1)
                    centerX += gridSpacing / 2;
                
                var radius = gridSpacing / 2;
                
                deltaX = rotationPointX - touchPointX;
                deltaY = rotationPointY - touchPointY;
                                
                if(deltaX != 0)
                    m = deltaY / deltaX;
                else
                    m = 100000;
                
                var n = rotationPointY - m * rotationPointX;
                
                var intersections = findCircleLineIntersections(radius, centerX, centerY, m, n);
                if(intersections.length === 0 && (touchPointX === rightWall || touchPointX === leftWall)) {
                    m = -1 * m;
                    n = touchPointY - m * touchPointX;
                    intersections = findCircleLineIntersections(radius, centerX, centerY, m, n);
                }
                
                if(intersections.length !== 0) {
                    if(shot.color !== 0 || shot.y === 0) {
                        
                        var shotToRecord = lastEmptyBubble;
                        if(shot.y === 0)
                            shotToRecord = shot;
                        
                        if(!this.alreadyInCollection(shotToRecord,array) && shotToRecord.color === 0 && (shotToRecord.countFilledNeighbors() > 0 || shotToRecord.y === 0))
                            array.push(shotToRecord);
                        break;
                    } else {
                        lastEmptyBubble = shot;
                    }
                }
            }
        }
        
        return array;
        
    }
    
    return;
}