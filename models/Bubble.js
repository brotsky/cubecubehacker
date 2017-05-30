function Bubble(x, y, color, iData) {

    this.x = x;
    this.y = y;

    this.imageData = iData;

    this.removed = false;

    this.points = function(withColor = shooterBallColor) {

        var points = 0;

        if (this.color !== 0)
            return points;

        var cluster = this.getCluster(withColor);

        for (var i = 0; i < cluster.size; i++) {
            if (i < 3)
                points += 10;
            else
                points += 10 * (i - 2);
        }

        if (cluster.size > 2) {
            var unattachedCluster = this.getUnattachedCluster(cluster.bubbles);

            points += unattachedCluster.length * 100;
        }

        //prioritize shots that are higher up if they have the same points
        points += (15 - this.y) / 100;

        return points;
    }

    this.truePoints = function(withColor = shooterBallColor) {
        var points = 0;

        if (this.color !== 0)
            return points;

        var cluster = this.getCluster(withColor);

        for (var i = 0; i < cluster.size; i++) {
            if (i < 3)
                points += 10;
            else
                points += 10 * (i - 2);
        }

        if (cluster.size > 2) {
            var unattachedCluster = this.getUnattachedCluster(cluster.bubbles);

            points += unattachedCluster.length * 100;
        }

        return points;
    }

    this.getCenterX = function() {
        // for iPhone:
        // var centerX = 68 + this.x * gridSpacing;

        // for iPad:
        var centerX = 120 + this.x * gridSpacing;

        if (this.y % 2 === 1)
            centerX += gridSpacing / 2;

        return centerX;

    }

    this.getCenterY = function() {
        // for iPhone:
        // return 204 + this.y * gridSpacing;

        //for iPad:
        return 130 + this.y * gridSpacing;
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

        if (this.y % 2 === 0) {
            checkLocations.push([this.x - 1, this.y - 1]);
            checkLocations.push([this.x - 1, this.y + 1]);
        } else {
            checkLocations.push([this.x + 1, this.y - 1]);
            checkLocations.push([this.x + 1, this.y + 1]);
        }

        for (var i = 0; i < checkLocations.length; i++) {
            if (typeof grid.grid[checkLocations[i][0]] != "undefined" && typeof grid.grid[checkLocations[i][0]][checkLocations[i][1]] != "undefined")
                spaces.push(grid.grid[checkLocations[i][0]][checkLocations[i][1]]);
        }

        return spaces;
    }

    this.adjacentMatches = function(colorToMatch) {
        var matches = [];

        if (colorToMatch == null)
            colorToMatch = this.color;

        var spaces = this.adjacentSpaces();

        for (var i = 0; i < spaces.length; i++) {
            if (spaces[i].color === colorToMatch)
                matches.push(spaces[i]);
        }

        return matches;
    }

    this.countFilledNeighbors = function() {
        var spaces = this.adjacentSpaces();

        var count = 0;

        for (var i = 0; i < spaces.length; i++) {
            if (spaces[i].color !== 0 && spaces[i].removed === false)
                count++;
        }

        return count;
    }

    this.alreadyInCluster = function(match, bubbles) {
        for (var i = 0; i < bubbles.length; i++)
            if (bubbles[i].x == match.x && bubbles[i].y == match.y)
                return true;
        return false;
    }

    this.getClusterMatches = function(bubbles, colorToMatch) {

        if (colorToMatch == null)
            colorToMatch = this.color;

        var bubbles = bubbles;
        if (bubbles == null)
            bubbles = [this];
        var matches = this.adjacentMatches(colorToMatch);
        if (matches.length === 0)
            return bubbles;
        else {
            for (var i = 0; i < matches.length; i++) {
                if (!this.alreadyInCluster(matches[i], bubbles)) {
                    bubbles.push(matches[i]);
                    bubbles = matches[i].getClusterMatches(bubbles, colorToMatch);
                }
            }
        }

        return bubbles;
    }

    this.getCluster = function(colorToMatch) {

        if (colorToMatch == null)
            colorToMatch = this.color;

        var matches = this.getClusterMatches([this], colorToMatch); //we need to add colorToMatch

        return {
            "bubbles": matches,
            "size": matches.length
        }
    }

    this.touchPoints = [];

    this.addTouchPoint = function(touchPoint, hasBounce) {
        this.touchPoints.push({
            "touchPoint": touchPoint,
            "hasBounce": hasBounce
        });
    }

    this.averageTouchPointX = function(touchPoints) {
        var sum = 0;

        for (var i = 0; i < touchPoints.length; i++)
            sum += touchPoints[i].touchPoint.x;

        return sum / touchPoints.length;
    }

    this.averageTouchPointY = function(touchPoints) {
        var sum = 0;

        for (var i = 0; i < touchPoints.length; i++)
            sum += touchPoints[i].touchPoint.y;

        return sum / touchPoints.length;
    }

    this.bestTouchPoint = function() {

        var withBounce = [];
        var withoutBounce = [];

        for (var i = 0; i < this.touchPoints.length; i++) {
            if (this.touchPoints[i].hasBounce)
                withBounce.push(this.touchPoints[i]);
            else
                withoutBounce.push(this.touchPoints[i]);
        }

        if (withoutBounce.length > 0) {

            var touchPoint = new TouchPoint(this.averageTouchPointX(withoutBounce), this.averageTouchPointY(withoutBounce));

            return touchPoint;
        } else if (withBounce.length > 0) {
            var touchPoint = new TouchPoint(this.averageTouchPointX(withBounce), this.averageTouchPointY(withBounce));

            return touchPoint;
        }


        return false;
    }

    this.getClusterAnyColor = function(bubbles, withOutCluster) {
        var bubbles = bubbles;
        if (bubbles === null)
            bubbles = [this];

        var withOutCluster = withOutCluster;

        if (typeof withOutCluster === "undefined")
            withOutCluster = [];

        var adjacentMatches = this.adjacentSpaces();

        var matches = [];
        for (var i = 0; i < adjacentMatches.length; i++) {
            if (adjacentMatches[i].color !== 0) {
                if (withOutCluster !== false) {
                    if (!this.alreadyInCluster(adjacentMatches[i], withOutCluster))
                        matches.push(adjacentMatches[i]);
                } else {
                    matches.push(adjacentMatches[i]);
                }
            }
        }

        if (matches.length === 0)
            return bubbles;
        else {
            for (var i = 0; i < matches.length; i++) {
                if (!this.alreadyInCluster(matches[i], bubbles)) {
                    bubbles.push(matches[i]);
                    bubbles = matches[i].getClusterAnyColor(bubbles, withOutCluster);
                }
            }
        }

        return bubbles;
    }

    this.connectedToTop = function(withOutCluster) {

        var withOutCluster = withOutCluster;

        if (typeof withOutCluster === "undefined")
            withOutCluster = [];

        var adjacent = this.adjacentSpaces();

        if (this.color === 0)
            return false;

        if (this.y === 0)
            return true;

        var cluster = this.getClusterAnyColor([], withOutCluster);

        for (var i = 0; i < cluster.length; i++) {
            if (cluster[i].y === 0)
                return true;
        }

        return false;
    }

    this.getUnattachedCluster = function(withOutCluster) {
        var array = [];

        var currentBubbles = grid.currentBubbles();

        for (var i = 0; i < currentBubbles.length; i++) {
            if (!currentBubbles[i].connectedToTop(withOutCluster) && !this.alreadyInCluster(currentBubbles[i], withOutCluster))
                array.push(currentBubbles[i]);
        }

        return array;
    }

    var bubbleInfo = {
        location: [x, y],
        color: "red",
        points: 0

    };

    var sameBlockerArr = [];

    this.hasSamePointValue = function() {

        var availShots = grid.availableShots();

        for (var i = 0; i < availShots.length; i++) {
            if (availShots[i].blocker().color == this.blocker().color && availShots[i].blocker().points == this.blocker().points) {
                
                sameBlockerArr.push(availShots[i].blocker());
                //sameCluster function with availShots[i] and blocker
                // availShots[i].blocker();
            }
            return availShots[i].blocker();
            //return sameBlockerArr;
            //console.log(bubbleInfo);
        }

        return bubbleInfo;
    }

    this.sameCluster = function(withColor = shooterBallColor) {
        var test = this.hasSamePointValue();

        console.log(test);


    }

    this.disappearingCluster = function() {

        if (this.truePoints() >= 30) {
            return true;
        }

        return false;
    }

    this.blocker = function(withColor = shooterBallColor) {
        var blockerPoints = 0;

        var colors = grid.currentColors();

        for (var i = 0; i < colors.length; i++) {
            var color = colors[i];
            if (color != withColor) {
                var points = this.truePoints(color);
                if (points > blockerPoints) {
                    bubbleInfo.location[0] = this.x;
                    bubbleInfo.location[1] = this.y;
                    bubbleInfo.color =  color;
                    bubbleInfo.points = points;

                    blockerPoints = points;
                }
            }

        }

        return bubbleInfo;
    }

    this.isBlocker = function(withColor = shooterBallColor) {
        this.hasSamePointValue();
        //console.log(bubbleInfo);

        //console.log("colors",colors);


        if (!this.disappearingCluster()) {
            if (this.blocker() > this.truePoints()) {
                this.hasSamePointValue();

                //return "blocker";
            }
        } else {
            return "dissBall"
        }


        return "notBlocker";
    }

    return;
}

module.exports = new Bubble();
