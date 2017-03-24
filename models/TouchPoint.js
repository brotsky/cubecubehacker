function TouchPoint(x,y) {
    this.x = x;
    this.y = y;
    
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