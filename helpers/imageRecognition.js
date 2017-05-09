var colorArrayMatches = function(c1,c2) {
    var dx = c1[0] - c2[0];
    var dy = c1[1] - c2[1];
    var dz = c1[2] - c2[2];
    if ((c1[2] - c1[1]) >= 100 && (c1[0] - c1[2]) >= 60) {
        return true;
    }
    return dx * dx + dy * dy + dz * dz < 3500;
}

var getBubbleColor = function(iData) {
    
    var purple = [208,65,252];
    var purple2 = [197,81,247];
    var purple3 = [188,67,247];
    var purpleCrossHair = [126,45,154];
    var purpleCrossHair2 = [132,42,160];
    var green = [66,192,1];
    var green2 = [113,197,57];
    var greenCrossHair = [53,109,21];
    var orange = [247,156,0];
    var orange2 = [240,172,58];
    var orangeCrossHair = [145,87,17];
    var orangeCrossHair2 = [147,84,18];
    var lightblue = [50,162,240];
    var lightblueCrossHair = [42,94,152];
    var blue = [23,57,209];
    var red = [203,44,34];
    var red2 = [186,52,33];
    var lightpurple = [204,203,250];
    var darkpurple = [74,73,115];
    
                
    if(colorArrayMatches(iData.data,purple))
        return "purple";
    else if(colorArrayMatches(iData.data,purple2))
        return "purple";
    else if(colorArrayMatches(iData.data,purple3))
        return "purple";
    else if(colorArrayMatches(iData.data,purpleCrossHair))
        return "purple";
    else if(colorArrayMatches(iData.data,purpleCrossHair2))
        return "purple";
    else if(colorArrayMatches(iData.data,green))
        return "green";
    else if(colorArrayMatches(iData.data,green2))
        return "green";
    else if(colorArrayMatches(iData.data,greenCrossHair))
        return "green";
    else if(colorArrayMatches(iData.data,orange))
        return "orange";
    else if(colorArrayMatches(iData.data,orange2))
        return "orange";
//    else if(colorArrayMatches(iData.data,orangeCrossHair))
  //      return "orange";
  //  else if(colorArrayMatches(iData.data,orangeCrossHair2))
  //      return "orange";
    else if(colorArrayMatches(iData.data,lightblue))
        return "lightblue";
    else if(colorArrayMatches(iData.data,lightblueCrossHair))
        return "lightblue";
    else if(colorArrayMatches(iData.data,blue))
        return "blue";
    else if(colorArrayMatches(iData.data,red))
        return "red";
    else if(colorArrayMatches(iData.data,red2))
        return "red";
    else if(colorArrayMatches(iData.data,lightpurple))
        return "lightpurple";
    else if(colorArrayMatches(iData.data,darkpurple))
        return "darkpurple";
    else
        return false;
}

function isPlayingShooter(videoContext) {
    var isPlaying = true;
    
    //make sure the bottom corner is light purple
    var checkIfOnGameColor = videoContext.getImageData(iPhoneScreenWidth - 10, iPhoneScreenHeight - 10, 1, 1);
    if(getBubbleColor(checkIfOnGameColor) !== "lightpurple") {
        isPlaying = false;
    }
    
    //make sure the space next to on deck bubble is light purple
    var checkIfOnGameColor = videoContext.getImageData(rotationPointX + gridSpacing, rotationPointY + onDeckOffset, 1, 1);
    if(getBubbleColor(checkIfOnGameColor) !== "lightpurple") {
        isPlaying = false;
    }
    
    var checkIfOnGameColor = videoContext.getImageData(rotationPointX, iPhoneScreenHeight * .59, 1, 1);
        
    //if there is dark purple in the middle of screen the game is over
    if(getBubbleColor(checkIfOnGameColor) === "darkpurple") {
        isPlaying = false;
    }
    
  //  console.log("isPlaying",isPlaying);
    
    return isPlaying;
        
}