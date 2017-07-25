
var radius = 51/2 - 3; // if on ipad
function secondLineCoordinates(Xjared, Yjared) {
//function that
  var changingX = (Xjared - rotationPointX); // change in x values between rotationPointX and JaredX
  let m = (Yjared - rotationPointY) / changingX; // slope is change in Y/ change in X
  topWallX = ((topWall - newY) / -m) + newX; // top Wall x= (110- Yjared) / - slope added to Xjared
  return topWallX;

}

function isVee(Xjared, Yjared) { // function that determines if a coordinate is in the "V" (only needs one line)
  var mCurrent =  (Xjared- rotationPointX)/(Yjared- rotationPointY);
  var mRight = (rightWall - rotationPointX)/(110 - rotationPointY);
  var mLeft = (leftWall- rotationPointX)/(110 - rotationPointY);

  if (mCurrent >= mRight && mCurrent <= mLeft) return true;
  else return false;
}

function getWallCoordinates(Xjared, Yjared) {
var coordArray = [];
  var changingX = (Xjared - rotationPointX);
  if (changingX === 0) {
    changingX = 0.00001;
  }
  let m = (Yjared - rotationPointY) / changingX;

  if (m > 0) {
    if (Xjared < leftWall)
    {
      Xjared = leftWall;
    }
     newY = (m*(leftWall - Xjared)) + Yjared;
     newX = leftWall;
     coordArray = [];
     coordArray.push(leftWall);
     coordArray.push(newY);
     return coordArray;
  } else {
    if (Xjared > rightWall)
    {
      Xjared = rightWall;
    }
      newY = (m*(rightWall - Xjared)) + Yjared;
      newX = rightWall;
      coordArray = [];
      coordArray.push(rightWall);
      coordArray.push(newY);
      return coordArray;
  }

}
function numberBallsOnPath(arr, numberWhereToStart)
{
          if (arr === undefined) return arr;
          arrCopy = arr;
          var arr2 =[];
          var distanceA;
          var distanceB;

          var closest = arrCopy[0];
          var lth = arr.length;

//function that finds the closest ball

        while (arr2.length != lth){
          for (var i=0; i< arrCopy.length ; i++)
          {
            distanceA = distanceBetweenPoints(closest.getCenterX(), closest.getCenterY(), rotationPointX, rotationPointY);
            distanceB = distanceBetweenPoints(arrCopy[i].getCenterX(), arrCopy[i].getCenterY(), rotationPointX, rotationPointY);
            if (distanceA > distanceB)
            {
              closest = arrCopy[i];
            }

          }
          arr2.push(closest);
          var a = arrCopy.indexOf(closest);
          arrCopy.splice(a,1);
          closest = arrCopy[0];
        }

          var index = 0;
          for (var i =0; i< arr2.length; i++)
          {
            index = i+numberWhereToStart;
            context.font = "14px Helvetica";
            context.fillStyle = "black";
            context.fillText(index, arr2[i].getCenterX(), arr2[i].getCenterY());
          }
          return arr2;

}

        function numberBallsOnSecondPath(arr,numberWhereToStart, wallpointX, wallpointY)
        {
          if (arr === undefined) return arr;
          arrCopy = arr;
          var arr2 =[];
          var distanceA;
          var distanceB;

          var closest = arrCopy[0];
          var lth = arr.length;

        //function that finds the closest ball

        while (arr2.length != lth)
            {
              for (var i=0; i< arrCopy.length ; i++)
              {
                distanceA = distanceBetweenPoints(closest.getCenterX(), closest.getCenterY(), wallpointX, wallpointY);
                distanceB = distanceBetweenPoints(arrCopy[i].getCenterX(), arrCopy[i].getCenterY(), wallpointX, wallpointY);
                if (distanceA > distanceB)
                {
                  closest = arrCopy[i];
                }

              }
                arr2.push(closest);
                var a = arrCopy.indexOf(closest);
                arrCopy.splice(a,1);
                closest = arrCopy[0];
            }

          var index = 0;
          for (var i =0; i< arr2.length; i++)
          {
            index = i+numberWhereToStart;
            context.font = "14px Helvetica";
            context.fillStyle = "black";
            context.fillText(index, arr2[i].getCenterX(), arr2[i].getCenterY());
          }
          return arr2;

        }

        function highlightBubblesOnPath(m,b)
        {
          var currentBubbs = grid.allBubbleSpaces();
          var inters;
          var arr = [];

          for (var i = 0; i < currentBubbs.length ; i++){
            inters = findCircleLineIntersections(radius*1.2, currentBubbs[i].getCenterX(), currentBubbs[i].getCenterY(),m,b);
            if (inters.length > 0) // if greater than 0 we know that there is an intersection
            {
              arr.push(currentBubbs[i]);
              highlight(currentBubbs[i]);
            }
          }
          return arr;
        }

        function highlight(bubble) // we just need access to the x and y, not the color itself
        {
          context.beginPath();
          context.arc(bubble.getCenterX(),bubble.getCenterY(), radius, 0, 2 * Math.PI, false);
          context.fillStyle = 'lightpink';
          context.fill();
          context.stroke();

        }
