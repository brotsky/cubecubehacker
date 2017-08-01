function TouchPoint(x,y) {
    this.x = x;
    this.y = y;

    this.moveRobot = function() {

        var robot_x = widthRatio * this.x;
        var robot_y = heightRatio * this.y + (105 * heightRatio);

        var command = "/usr/local/bin/axi down; /usr/local/bin/axi goto " + robot_x + " " + robot_y + "; /usr/local/bin/axi up;";

        if(readyToShoot)
            command += " /usr/local/bin/axi up;";


            if(!robotMoving) {
                robotMoving = true;


                return;

                exec(command,(error, stdout, stderr) => {

                      robotMoving = false;

                      if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                      }
                      console.log(`stdout: ${stdout}`);
                      console.log(`stderr: ${stderr}`);




                    });
            } else {
                setTimeout(this.moveRobot, 100);
            }





    }

    this.fireShot = function() {

        var command = "/usr/local/bin/axi goto" + this.x + " " + this.y;

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

for(var i = rotationPointY ; i > 110 ; i-=5) {
    var touchPoint = new TouchPoint(leftWall,i);
    touchPoints.push(touchPoint);
}

for(var i = leftWall ; i <= rightWall ; i+=5) {
    var touchPoint = new TouchPoint(i,110);
    touchPoints.push(touchPoint);
}

for(var i = 110 ; i < rotationPointY ; i+=5) {
    var touchPoint = new TouchPoint(rightWall,i);
    touchPoints.push(touchPoint);
}
