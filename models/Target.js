
function Target(videoContext)
{
  this.videoContext = videoContext;

  this.findAllPixels = function()
      {
        var pixelArray = [];
        for (var i= 95; i< 688; i+=8) // was 110 to 808, changing it to 808-910
        {
          for (var j= 110 ; j< 808 ; j+=8)
          {
            var pixel = videoContext.getImageData(i, j, 4, 4);
            pixelArray.push({
              pixel : pixel,
              x : i,
              y : j
            });
          }
        }

      // else if (m<=0)
      // {
      //   for (var i= 110; i< 808; i+=8)
      //   {
      //     for (var j= 95 ; j< 688 ; j+=8)
      //     {
      //       var pixel = videoContext.getImageData(i, j, 4, 4);
      //       pixelArray.push({
      //         pixel : pixel,
      //         x : i,
      //         y : j
      //       });
      //     }
      //   }
      // }

        return pixelArray;

      }
}

function scaleDownTargetArray(targetArray)
{
 var mySet = new Set();
  newTargetArray =[];

  for ( var i =0; i<targetArray.length-5 ; i++)
  {
    if (targetArray[i].x === targetArray[i +1].x && targetArray[i+1].x === targetArray[i +2].x && targetArray[i+2].x === targetArray[i +3].x && targetArray[i+3].x === targetArray[i +4].x &&targetArray[i+4].x === targetArray[i +5].x)
    {
     mySet.add(targetArray[i]);
     mySet.add(targetArray[i+1]);
     mySet.add(targetArray[i+2]);
     mySet.add(targetArray[i+3]);
     mySet.add(targetArray[i+4]);
     mySet.add(targetArray[i+5]);

    }
  }

  mySet.forEach(function(value) {
  newTargetArray.push(value);
});

for (var i =0 ; i< newTargetArray.length-1; i++)
{
  var diff= (newTargetArray[i+1].y - newTargetArray[i].y);

  if (diff > 24)
    newTargetArray.splice(i,1);
}

  return newTargetArray;
}

function findMax (targetArray)
{
  var pos = 0;

if (targetArray.length >0){

  for (var i = 0; i< targetArray.length ;i++)
  {
    if (targetArray[i].y > targetArray[pos].y)
    {
      pos = i;
    }
  }
}

  return pos;
}
// code for finding the targetGray
      // var pixelArray = findAllPixels();
      // var grayTarget1 = [129, 116, 161];
      // var grayTarget2 = [132, 117, 163];
      // var grayTarget3= [130, 115, 160];
      //
      // context.fillStyle = "#000"; //black
      //
      // for (var i=0; i < pixelArray.length ; i++)
      // {
      //   if(pixelArray[i].data == (grayTarget1 || grayTarget2 || grayTarget3))
      //   {
      //
      //   context.fillRect( pixelArray[i].width, pixelArray[i].height, 1, 1 );
      //   }
      // }


function squareAroundPos (targetArray, pos)
{
  targetArray = [];
  var x = pos [0];
  var y= pos [1];

  for (var i= (x-90); i< (x+90); i+=1) // was 110 to 808, changing it to 808-910
  {
    for (var j= (y-90) ; j< (y+90) ; j+=1)
    {
      var pixel = videoContext.getImageData(i, j, 4, 4);
      targetArray.push({
        pixel : pixel,
        x : i,
        y : j
      });
    }
  }

      return targetArray;

}
