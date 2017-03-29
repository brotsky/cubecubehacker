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
    
                
    if(colorArrayMatches(iData.data,purple))
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
    else if(colorArrayMatches(iData.data,orangeCrossHair))
        return "orange";
    else if(colorArrayMatches(iData.data,orangeCrossHair2))
        return "orange";
    else if(colorArrayMatches(iData.data,lightblue))
        return "lightblue";
    else if(colorArrayMatches(iData.data,lightblueCrossHair))
        return "lightblue";
    else if(colorArrayMatches(iData.data,blue))
        return "blue";
    else if(colorArrayMatches(iData.data,red))
        return "red";
    else
        return false;
}