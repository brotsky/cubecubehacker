function TouchPoint(x,y) {
    this.x = x;
    this.y = y;
    
    this.moveRobot = function() {
        
        var robot_x = widthRatio * this.x;
        var robot_y = heightRatio * this.y + (105 * heightRatio);
        
        
        var command = "/usr/local/bin/axi down; /usr/local/bin/axi goto " + robot_x + " " + robot_y + "; /usr/local/bin/axi up;";
        
        console.log(command);
      //  return;
        if(!debug)
            exec(command,(error, stdout, stderr) => {
                  if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                  }
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
                });
        
        
    }
    
    return;
}

var touchPoints = [];
        
for(var i = rotationPointY ; i > 100 ; i-=5) {
    var touchPoint = new TouchPoint(leftWall,i);        
    touchPoints.push(touchPoint);  
}

for(var i = leftWall ; i <= rightWall ; i+=5) {
    var touchPoint = new TouchPoint(i,100);
    touchPoints.push(touchPoint);            
}   

for(var i = 100 ; i < rotationPointY ; i+=5) {
    var touchPoint = new TouchPoint(rightWall,i);        
    touchPoints.push(touchPoint);
}  