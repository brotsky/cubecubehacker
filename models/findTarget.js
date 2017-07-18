var iPhoneScreenWidth = 768;
var leftWall = (95 / 768) * iPhoneScreenWidth;
var rightWall = (688 / 768) * iPhoneScreenWidth;
var topWall = 110;
var rotationPointY = (910 / 1024) * iPhoneScreenHeight;

function Target(videoContext)
{
  this.videoContext = videoContext;

  this.findAllPixels = function()
      {
        var pixelArray = [];
        for (var i= leftWall; i< rightWall; i++)
        {
          for (var j= topWall ; j< rotationPointY ; j--)
          {
            var pixel = videoContext.getImageData(i, j, 1, 1);
            pixelArray.push(pixel);
          }

        }
        return pixelArray;

      }
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
