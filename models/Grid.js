function Grid() {

    this.grid = [];

    this.bubblesAlreadyRemoved = [];

    this.resetGrid = function() {
        for(var i = 0 ; i < 11 ; i++) {
            this.grid[i] = [];
            for(var j = 0 ; j < 15 ; j++) {
                this.grid[i][j] = new Bubble(i,j,0);
            }
        }
    }


    this.bubbleWasRemoved = function(bubble) {

        for(var i = 0 ; i < this.bubblesAlreadyRemoved.length ; i++) { //traverses bubblesAlreadyRemoved array

            var gridBubble = this.bubblesAlreadyRemoved[i];// grid bubble = ith bubble

            if(bubble.x === gridBubble.x && bubble.y === gridBubble.y && bubble.color === gridBubble.color) // if the bubblewasremoved and bubblesalreadyremoved are exactly the same
                return true;
        }
        return false;
    }

    this.add = function(x,y,contents,iData) {


        if(!contents || contents == "transparent")
            contents = 0;

        if(contents === "#34a5f2")
            contents = "lightblue";


        var bubble = new Bubble(x, y, contents, iData );

        bubble.removed = this.bubbleWasRemoved(bubble);

    //    if(bubble.adjacentMatches(0).length < 6) //don't add falling pieces

        this.grid[x][y] = bubble;


        return !bubble.removed;
    }

    this.validateGrid = function() {
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                var bubble = this.grid[i][j];
                if(!bubble.connectedToTop())
                    this.grid[i][j].color = 0;
            }
        }
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
                if(typeof this.grid[i] != "undefined" && typeof this.grid[i][j] != "undefined")
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

    this.currentBubbles = function() {
        var array = [];
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                if(typeof this.grid[i] != "undefined" && typeof this.grid[i][j] != "undefined" && this.grid[i][j].color !== 0)
                array.push(this.grid[i][j]);
            }
        }

        return array;
    }

    this.allBubbleSpaces = function() {
        var array = [];
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                if(typeof this.grid[i] != "undefined" && typeof this.grid[i][j] != "undefined")
                array.push(this.grid[i][j]);
            }
        }

        return array;
    }


    //used for validation
    this.checkAvailableShots = function(availableShots) {
        var availableSet = new Set();

        for(var i = 0 ; i < availableShots.length ; i++) {

            var passed = true;

            if(availableShots[i].countFilledNeighbors() === 6)
                passed = false;

            if(availableShots[i].y === 0 && availableShots[i].countFilledNeighbors() === 4)
                passed = false;

            if(passed)
                availableSet.add(availableShots[i]);
        }
        var array = [];

        availableSet.forEach(function(value) {
        array.push(value);
        });
        return array;
    }

    this.availableShots = function() {

        var array = [];// array [] is created
        for(var i = 0 ; i < 11 ; i++) {
            for(var j = 0 ; j < 15 ; j++) {
                if((this.grid[i][j].countFilledNeighbors() >0) && this.grid[i][j].color === 0)
                array.push(this.grid[i][j]);
            }
        }//
//         var sortedBubbles = this.bubblesSortedByDistance(); //sorted bubbles is an array that also calls a function that sorts the bubbles by distance closest to the shooter
//
//         var lastEmptyBubble = sortedBubbles[0]; //lastEmptyBubble var is equal to the first index of sortedBubbles
// // this is the variable we will assign in order to find the available shot
//         for(var i = 0 ; i < touchPoints.length ; i++) { // for loop that traverses touchPoints
//
//             var touchPoint = touchPoints[i]; //
//
//             var touchPointX = touchPoint.x;
//             var touchPointY = touchPoint.y;
//
//             if (touchPointX === 385)
//             {
//               touchPointX =384;
//             }
//
//             for(var s = 0 ; s < sortedBubbles.length ; s++ ) {
//
//                 var shot = sortedBubbles[s]; // starts from 0
//                 // For iPhone:
//                 // var centerX = 68 + shot.x * gridSpacing;
//                 // var centerY = 204 + shot.y * gridSpacing;
//
//                 var centerX = 120 + shot.x * gridSpacing; //
//                 var centerY = 130 + shot.y * gridSpacing;//
//
//                 if(shot.y % 2 === 1)
//                     centerX += gridSpacing / 2;
//
//                 var radius = gridSpacing / 2;
//
//                 deltaX = rotationPointX - touchPointX; // trying to find the slope between the ball and the shooter
//                 deltaY = rotationPointY - touchPointY;
//
//                 if(deltaX != 0)
//                     m = deltaY / deltaX; // slope between ball and shooter
//                 else
//                     m = 100000;
//
//                 var n = rotationPointY - m * rotationPointX; //"b" -> now we have equation of a line
//
//                 var intersections = []; // trying to find the intersections
//
//                 intersections = findCircleLineIntersections(radius * bubbleIntersectionRadius, centerX, centerY, m, n);
// // finds circle line intersections from this line that we have
//                 var hasBounce = false; // determines if we have a shot off the wall
//
// // if there are no intersections
//                 if(intersections.length === 0 && !isVee(touchPointX,touchPointY))//(touchPointX === rightWall || touchPointX === leftWall) ) {
//                   {
//
//                     m = - m;
//                     n = touchPointY - m * touchPointX;
//                     intersections = findCircleLineIntersections(radius * bubbleIntersectionRadius, centerX, centerY, m, n);
//
//                     hasBounce = true; // changed this to false, so we can see if the first part worked
//                 }
//
//                 if(intersections.length !== 0) {// if there arent any intersections
//                     if(shot.color !== 0 || shot.y === 0 || shot.removed === true) {
//
//                         var shotToRecord = lastEmptyBubble;
//                         if(shot.y === 0)
//                             shotToRecord = shot;
//
//                         if((shotToRecord.color === 0 || shotToRecord.removed === true) && (shotToRecord.countFilledNeighbors() > 0 || shotToRecord.y === 0)) {
//                             shotToRecord.addTouchPoint(touchPoint,hasBounce);
//                             if(!this.alreadyInCollection(shotToRecord,array))
//                                 array.push(shotToRecord);
//                         }
//                         break;
//                     } else {
//                         lastEmptyBubble = shot;
//                     }
//                 }

          //  }
        //}

        //validate the available shots
        return this.checkAvailableShots(array);

    }

    this.bestShot = function() {

        var withColor = shooterBallColor;

        if(!withColor)
            withColor = onDeckBallColor

        var shots = this.availableShots();

        var mostPoints = 0;
        var shotWithMostPoints = false;

        for(var i = 0 ; i < shots.length ; i++) {

            var points = shots[i].points(withColor);

            if(points > mostPoints) {
                mostPoints = points;
                shotWithMostPoints = shots[i];
            }
        }

        return shotWithMostPoints;
    }

    this.currentColors = function() {
        var currentBubbles = this.currentBubbles();

        var colors = [];

        for(var i = 0 ; i < currentBubbles.length ; i++)
            if( colors.indexOf(currentBubbles[i].color) === -1 )
                colors.push(currentBubbles[i].color);

        return colors;
    }

    this.colorCount = function() {
        return this.currentColors().length;
    }

    this.numberOfRows = function() {
        var colorCount = this.colorCount();
        if (colorCount === 6) {
            return 1;
        } else if (colorCount === 5) {
            return 2;
        } else if (colorCount === 4) {
            return 3;
        } else if (colorCount === 3) {
            return 4;
        } else if (colorCount === 2) {
            return 5;
        } else if (colorCount === 1) {
            return 6;
        }
    }

    return;
}
