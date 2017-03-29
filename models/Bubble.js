function Bubble(x,y,color) {
    
    this.x = x;
    this.y = y;
    this.points = function() {
        
        var points = 0;
        
        if(this.color !== 0)
            return points;
        
        var cluster = this.getCluster(shooterBallColor);
                
        for(var i = 0 ; i < cluster.size ; i++) {
            if(i < 3)
                points += 10;
            else
                points += 10 * (i - 2);
        }
        
        if(cluster.size > 2) {
            var unattachedCluster = this.getUnattachedCluster(cluster.bubbles);
            
            points += unattachedCluster.length * 100;            
        }
        
        return points;
    }
    
    this.getCenterX = function() {
        var centerX = 68 + this.x * gridSpacing;
        
        if(this.y % 2 === 1)
            centerX += gridSpacing / 2;
        
        return centerX;
        
    }
    
    this.getCenterY = function() {
        return 204 + this.y * gridSpacing;
    }
            
    this.color = color;
    
    this.adjacentSpaces = function() {
        var spaces = [];
        
        var checkLocations = [
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x, this.y - 1],
            [this.x, this.y + 1]
        ];
        
        if(this.y % 2 === 0) {
            checkLocations.push([this.x - 1,this.y - 1]);
            checkLocations.push([this.x - 1,this.y + 1]);
        } else {
            checkLocations.push([this.x + 1,this.y - 1]);
            checkLocations.push([this.x + 1,this.y + 1]);
        }
        
        for(var i = 0 ; i < checkLocations.length ; i++) {
            if(typeof grid.grid[checkLocations[i][0]] != "undefined" && typeof grid.grid[checkLocations[i][0]][checkLocations[i][1]] != "undefined")
                spaces.push(grid.grid[checkLocations[i][0]][checkLocations[i][1]]);
        }
        
        return spaces;
    }
    
    this.adjacentMatches = function(colorToMatch) {
        var matches = [];
        
        if(colorToMatch == null)
            colorToMatch = this.color;
        
        var spaces = this.adjacentSpaces();
        
        for(var i = 0 ; i < spaces.length ; i++) {
            if(spaces[i].color === colorToMatch)
                matches.push(spaces[i]);
        }
        
        return matches;
    }
    
    this.countFilledNeighbors = function() {
        var spaces = this.adjacentSpaces();
        
        var count = 0;
        
        for(var i = 0 ; i < spaces.length ; i++) {
            if(spaces[i].color !== 0)
                count++;
        }
        
        return count;
    }
    
    this.alreadyInCluster = function(match, bubbles) {
        for(var i = 0 ; i < bubbles.length ; i++)
            if(bubbles[i].x == match.x && bubbles[i].y == match.y)
                return true;
        return false;
    }

    this.getClusterMatches = function(bubbles, colorToMatch) {
        
        if(colorToMatch == null)
            colorToMatch = this.color;
        
        var bubbles = bubbles;
        if(bubbles == null)
            bubbles = [this];
        var matches = this.adjacentMatches(colorToMatch);
        if(matches.length === 0)
            return bubbles;
        else {
            for(var i = 0 ; i < matches.length ; i++) {
                if(!this.alreadyInCluster(matches[i],bubbles)) {
                    bubbles.push(matches[i]);
                    bubbles = matches[i].getClusterMatches(bubbles, colorToMatch);
                }
            }
        }
        
        return bubbles;
    }
    
    this.getCluster = function(colorToMatch) {
        
        if(colorToMatch == null)
            colorToMatch = this.color;
        
        var matches = this.getClusterMatches([this],colorToMatch); //we need to add colorToMatch
        
        return {
            "bubbles" : matches,
            "size" : matches.length
        }
    }
    
    this.touchPoints = [];
    
    this.addTouchPoint = function(touchPoint,hasBounce) {
        this.touchPoints.push({
            "touchPoint" : touchPoint,
            "hasBounce" : hasBounce
        });
    }
    
    this.getClusterAnyColor = function(bubbles, withOutCluster) {
        var bubbles = bubbles;
        if(bubbles === null)
            bubbles = [this];
                
        var withOutCluster = withOutCluster;
        
        if(typeof withOutCluster === "undefined")
            withOutCluster = [];
                
        var adjacentMatches = this.adjacentSpaces();
        
        var matches = [];
        for(var i = 0 ; i < adjacentMatches.length ; i++) {
            if(adjacentMatches[i].color !== 0) {
                if(withOutCluster !== false) {
                    if(!this.alreadyInCluster(adjacentMatches[i],withOutCluster))
                        matches.push(adjacentMatches[i]);
                } else {
                    matches.push(adjacentMatches[i]);
                }                
            }
        }
        
        if(matches.length === 0)
            return bubbles;
        else {
            for(var i = 0 ; i < matches.length ; i++) {
                if(!this.alreadyInCluster(matches[i],bubbles)) {
                    bubbles.push(matches[i]);
                    bubbles = matches[i].getClusterAnyColor(bubbles, withOutCluster);
                }
            }
        }
        
        return bubbles;
    }
    
    this.connectedToTop = function(withOutCluster) {
                        
        var withOutCluster = withOutCluster;
        
        if(typeof withOutCluster === "undefined")
            withOutCluster = [];
        
        var adjacent = this.adjacentSpaces();
        
        if(this.color === 0)
            return false;
        
        if(this.y === 0)
            return true;
                    
        var cluster = this.getClusterAnyColor([],withOutCluster);
        
        for(var i = 0 ; i < cluster.length ; i++) {
            if(cluster[i].y === 0)
                return true;
        }
        
        return false;
    }
    
    this.getUnattachedCluster = function(withOutCluster) {
        var array = [];
        
        var currentBubbles = grid.currentBubbles();
        
        for(var i = 0 ; i < currentBubbles.length ; i++) {
            if(!currentBubbles[i].connectedToTop(withOutCluster) && !this.alreadyInCluster(currentBubbles[i],withOutCluster))
                array.push(currentBubbles[i]);
        }
        
        return array;
    }
    
    return;
}
