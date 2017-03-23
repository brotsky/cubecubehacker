function Bubble(x,y,color) {
    
    this.x = x;
    this.y = y;
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

    
    this.getClusterMatches = function(bubbles) {
        var bubbles = bubbles;
        if(bubbles == null)
            bubbles = [this];
        var matches = this.adjacentMatches();
        if(matches.length === 0)
            return bubbles;
        else {
            for(var i = 0 ; i < matches.length ; i++) {
                if(!this.alreadyInCluster(matches[i],bubbles)) {
                    bubbles.push(matches[i]);
                    bubbles = matches[i].getClusterMatches(bubbles);
                }
            }
        }
        
        return bubbles;
    }
    
    this.getCluster = function() {
        
        var matches = this.getClusterMatches();
        
        return {
            "bubbles" : matches,
            "size" : matches.length
        }
    }
    
    return ;
}
