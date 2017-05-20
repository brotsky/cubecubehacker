// Modified by hokein
//
// Copyright 2014 Intel Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Author: Dongseong Hwang (dongseong.hwang@intel.com)

const {desktopCapturer} = require('electron');


let desktopSharing = false;
let localStream;

var Square = function(x, y) {
    this.x = x;
    this.y = y;
    this.top = false;
    this.bottom = false;
    this.left = false;
    this.right = false;
    
    return this;
}

let videoId = 'iphone-screen-stream';
let scaleFactor = 1;
let snapshot = false;
var colorData = [], grid = [], newPiecesGrid = [];

let gridColors = [
    [50, 38, 61, 255],
    [48, 39, 61, 255],
    [47, 38, 60, 255],
    [46, 38, 61, 255],
    [45, 41, 61, 255],
    [45, 40, 63, 255],
    [43, 41, 61, 255],
    [40, 39, 61, 255],
    [39, 41, 62, 255],    
    [40, 40, 59, 255],
    [44, 39, 60, 255],
    [42, 40, 60, 255],
    [46, 39, 60, 255],
    [46, 38, 60, 255],
    [44, 39, 62, 255],
    [49, 39, 61, 255],
    [5, 14, 35, 255],
    [39, 35, 56, 255],
    [0, 0, 0, 0],
    [45, 34, 55, 255],
    [35, 35, 56, 255],
    [42, 33, 54, 255],
    [35, 35, 54, 255],
    [38, 36, 54, 255],
    [41, 34, 56, 255],
    [44, 33, 54, 255],
    [41, 34, 54, 255],
    [44, 35, 55, 255],
    [38, 36, 56, 255],
    [42, 33, 56, 255],
    [44, 34, 57, 255],
    [38, 34, 54, 255],
    [39, 35, 55, 255],
    [36, 35, 55, 255],
    [39, 35, 54, 255],
    [37, 36, 56, 255],
    [36, 34, 55, 255],
    [36, 37, 54, 255],
    [37, 36, 54, 255],
    [4, 16, 31, 255],
    [2, 17, 31, 255],
    [7, 14, 31, 255],
    [255, 254, 255, 255],
    [56, 194, 49, 255],
    [56, 195, 52, 255],
    [0, 1, 9, 255]
    
];



function refresh() {
 /* $('select').imagepicker({
    hide_select : true
  });
  */
}

function addSource(source) {
  $('select').append($('<option>', {
    value: source.id.replace(":", ""),
    text: source.name
  }));
  $('select option[value="' + source.id.replace(":", "") + '"]').attr('data-img-src', source.thumbnail.toDataURL());
  refresh();
}

function showSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    for (let source of sources) {
        
      //  console.log(source);
        
    //  console.log("Name: " + source.name);
      
      
      if(source.name == "Movie Recording" || source.name == "CubeCube Demo" || source.name == "spinner demo" || source.name == "shooter play demo 4" || source.name == "debugger") {
          
          if(source.name == "debugger")
            debug = true;
          
        addSource(source);
        }
    }
  });
}

function toggle() {
  if (!desktopSharing) {
      
      
  //    console.log($('select').val());
      
      var id = false;
      
      if($('select').val() !== null) {
        id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
        onAccessApproved(id);
    }
        else 
            setTimeout(toggle, 100);
        
    
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    document.getElementById('enable-capture').innerHTML = "Enable Capture";

    $('select').empty();
    showSources();
    refresh();
  }
}

function onAccessApproved(desktop_id) {
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  document.getElementById('enable-capture').innerHTML = "Disable Capture";
//  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 640,
        maxWidth: 640,
        minHeight: 1107,
        maxHeight: 1107
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
            
    localStream = stream;
    document.querySelector('video').src = URL.createObjectURL(stream);
  /*  stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
    
    */
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

function isEmpty(colorDataArray) {
    for(var i = 0 ; i < gridColors.length ; i++) {
        if( Math.abs( colorDataArray[0] - gridColors[i][0] ) <= 3
            && Math.abs( colorDataArray[1] - gridColors[i][1] ) <= 3
            && Math.abs( colorDataArray[2] - gridColors[i][2] ) <= 3)
                return true;
    }
    
   // console.log("filled",colorDataArray);
    
    return false;
}

function countSquares(grid) {
    var count = 0;
    for(var i = 0 ; i < grid.length ; i++) {
        for(var j = 0 ; j < grid[i].length ; j++)
            if(grid[i][j] == 1)
                count++;
    }
    return count;
}

function doesShapeFit(squares, x, y) {
        
    if(x < 0 || x > 9 || y < 0 || y > 9)
        return false;
        
    for(var i = 0 ; i < squares.length ; i++) {
        
        if(typeof grid[x + squares[i].x] == "undefined")
            return false;
        if(typeof grid[x + squares[i].x][y + squares[i].y] == "undefined")
            return false; 
        
        if(grid[x + squares[i].x][y + squares[i].y] == 1)
            return false;
    }
    
    return true;
}

function sumOfCol(tempGrid,x) {
    var sum = 0;
    for(var i = 0 ; i < 10 ; i++)
        sum = sum + tempGrid[x][i];
    return sum;
}

function sumOfRow(tempGrid,x) {
    var sum = 0;
    for(var i = 0 ; i < 10 ; i++)
        sum = sum + tempGrid[i][x];
    return sum;
}

function doesItMatch(squares, x, y) {
    
    var tempGrid = [];
    
   // console.log("grid",grid);
    
    for(var i = 0 ; i < 10 ; i++)
        for(var j = 0 ; j < 10 ; j++) {
            if(typeof tempGrid[i] == "undefined")
                tempGrid[i] = [];
            tempGrid[i][j] = grid[i][j];
        }
    
    var numOfMatches = 0;
    
  for(var i = 0 ; i < squares.length ; i++)
        tempGrid[1*(x + squares[i].x)][1*(y + squares[i].y)] = 1;
    
 //   console.log("tempgrid",tempGrid);
    
    for(var i = 0 ; i < 10 ; i++) {
        
     //   console.log("col sum",sumOfCol(tempGrid,i));
       // console.log("row sum",sumOfRow(tempGrid,i));
        
        
        if(sumOfRow(tempGrid,i) == 10)
            numOfMatches++;
        if(sumOfCol(tempGrid,i) == 10)
            numOfMatches++;
    }
    
   // console.log("num of matches",numOfMatches + " at " + x + ", " + y);
    
    return numOfMatches;
    
 //   console.log(squares);
    
}

function getSquares(pgrid) {
    
    var squares = [], xOffset = 0, yOffset = 0;
    
    for(var i = 0 ; i < pgrid.length ; i++)
        for(var j = 0 ; j < pgrid[i].length ; j++)
            if(pgrid[i][j] == 1) {
                
                if(squares.length == 0) {
                    xOffset = i;
                    yOffset = j;
                }
                
                var sq = new Square(i - xOffset,j - yOffset);
                squares.push(sq);
            }
    if(squares.length > 0) {
        for(var i = 0 ; i < squares.length ; i++) {            
            var top = false, bottom = false, left = false, right = false;
            for(var j = 0 ; j < squares.length ; j++) {
                if(squares[i].x == squares[j].x && squares[i].y == squares[j].y + 1)                  
                    top = squares[j];
                if(squares[i].x == squares[j].x && squares[i].y == squares[j].y - 1)                  
                    bottom = squares[j];                
                if(squares[i].x == squares[j].x + 1 && squares[i].y == squares[j].y)                  
                    left = squares[j];
                if(squares[i].x == squares[j].x - 1 && squares[i].y == squares[j].y)                  
                    right = squares[j];
            }
            squares[i].top = top;
            squares[i].bottom = bottom;
            squares[i].left = left;
            squares[i].right = right;
        }
                    
    }
    return squares;
}

function getShape(squares) {    
    
    /*
         x
    */
    if(squares.length == 1)
        return "x";
    
    /*
         x x
    */
    if(squares.length == 2 && 
        squares[0].right && !squares[0].right.right)
        return "x x";
    
    /*
         x
         x
    */
    if(squares.length == 2 && 
        squares[0].bottom && !squares[0].bottom.bottom)
        return "x\nx";
    
    /*
         x x x
    */
    if(squares.length == 3 && 
        squares[0].right && squares[0].right.right && !squares[0].right.right.right)
        return "x x x";
    
    /*
         x
         x
         x
    */
    if(squares.length == 3 && 
        squares[0].bottom && squares[0].bottom.bottom && !squares[0].bottom.bottom.bottom)
        return "x\nx\nx";
    
    /*
         x x x x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.right && !squares[0].right.right.right.right)
        return "x x x x";
    
    /*
         x
         x
         x
         x
    */
    if(squares.length == 4 && 
        squares[0].bottom && squares[0].bottom.bottom && squares[0].bottom.bottom.bottom && !squares[0].bottom.bottom.bottom.bottom)
        return "x\nx\nx\nx";
    
    /*
         x x x x x
    */
    if(squares.length == 5 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.right && squares[0].right.right.right.right && !squares[0].right.right.right.right.right)
        return "x x x x x";
    
    /*
         x
         x
         x
         x
         x
    */
    if(squares.length == 5 && 
        squares[0].bottom && squares[0].bottom.bottom && squares[0].bottom.bottom.bottom && squares[0].bottom.bottom.bottom.bottom && !squares[0].bottom.bottom.bottom.bottom.bottom)
        return "x\nx\nx\nx\nx";
    
    /*
         x x
         x x
    */
    if(squares.length == 4 && 
        squares[0].right && !squares[0].right.right &&
        squares[0].bottom && squares[0].bottom.right && !squares[0].bottom.right.right)
        return "x x\nx x";
    
    /*
         x x x
         x x x
         x x x
    */
    if(squares.length == 9 && 
        squares[0].right && squares[0].right.right && !squares[0].right.right.right &&
        squares[0].bottom && squares[0].bottom.right && squares[0].bottom.right.right && !squares[0].bottom.right.right.right &&
        squares[0].bottom.bottom && squares[0].bottom.bottom.right && squares[0].bottom.bottom.right.right && !squares[0].bottom.bottom.right.right.right &&
        !squares[0].bottom.bottom.bottom)
        return "x x x\nx x x\nx x x";
    
    /*
         x x x
         x   x
         x x x
    */
    if(squares.length == 8 && 
        squares[0].right && squares[0].right.right && !squares[0].right.right.right &&
        squares[0].bottom && squares[0].right.right.bottom && !squares[0].right.right.bottom.right &&
        squares[0].bottom.bottom && squares[0].bottom.bottom.right && squares[0].bottom.bottom.right.right && !squares[0].bottom.bottom.right.right.right &&
        !squares[0].bottom.bottom.bottom)
        return "x x x\nx   x\nx x x";
    
    /*
           x
         x x x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right &&
        squares[0].right.top)
        return "  x  \nx x x";
    
    /*
         x x x
           x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right &&
        squares[0].right.bottom)
        return "x x x\n  x  ";
    
    /*
         x
         x x
         x
    */
    if(squares.length == 4 && 
        squares[0].bottom && squares[0].bottom.bottom &&
        squares[0].bottom.right)
        return "x\nx x\nx";
    
    /*
           x
         x x
           x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.top &&
        squares[0].right.bottom)
        return "  x\nx x\n  x";
    
    /*
         x x
           x
    */
    if(squares.length == 3 && 
        squares[0].right && squares[0].right.bottom)
        return "x x\n  x";
    
    /*
         x x
         x
    */
    if(squares.length == 3 && 
        squares[0].right && squares[0].bottom)
        return "x x\nx";
    
    /*
         x
         x x
    */
    if(squares.length == 3 && 
        squares[0].bottom && squares[0].bottom.right)
        return "x\nx x";
    
    /*
           x
         x x
    */
    if(squares.length == 3 && 
        squares[0].right && squares[0].right.top)
        return "  x\nx x";
    
    /*
         x x x
             x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.bottom)
        return "x x x\n    x";
    
    /*
         x x x
         x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right && squares[0].bottom)
        return "x x x\nx";
    
    /*
         x
         x x x
    */
    if(squares.length == 4 && 
        squares[0].bottom && squares[0].bottom.right && squares[0].bottom.right.right)
        return "x\nx x x";
    
    /*
             x
         x x x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.top)
        return "    x\nx x x";    
    
    /*
         x x x
             x
             x
    */
    if(squares.length == 5 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.bottom && squares[0].right.right.bottom.bottom)
        return "x x x\n    x\n    x";
    
    /*
         x x x
         x
         x
    */
    if(squares.length == 5 && 
        squares[0].right && squares[0].right.right && squares[0].bottom && squares[0].bottom.bottom)
        return "x x x\nx\nx";
    
    /*
         x
         x
         x x x
    */
    if(squares.length == 5 && 
        squares[0].bottom && squares[0].bottom.bottom && squares[0].bottom.bottom.right && squares[0].bottom.bottom.right.right)
        return "x\nx\nx x x";
    
    /*
             x
             x
         x x x
    */
    if(squares.length == 5 && 
        squares[0].right && squares[0].right.right && squares[0].right.right.top && squares[0].right.right.top.top)
        return "    x\n    x\nx x x";

    /*
         x x
           x x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.bottom && squares[0].right.bottom.right)
        return "x x\n  x x";
    
    /*
           x x
         x x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.top && squares[0].right.top.right)
        return "  x x\nx x";
    
    /*
         x 
         x x
           x
    */
    if(squares.length == 4 && 
        squares[0].bottom && squares[0].bottom.right && squares[0].bottom.right.bottom)
        return "x\nx x\n  x";
    
    /*
           x
         x x
         x
    */
    if(squares.length == 4 && 
        squares[0].right && squares[0].right.top && squares[0].bottom)
        return "  x\nx x\nx";
    
    return false;
}

function validatePiece(grid) {
 //   console.log("validate piece",grid);
 //   console.log("countSquares",countSquares(grid));
    if(countSquares(grid) == 0 || countSquares(grid) > 9)
        return false;
    
    var squares = getSquares(grid);
        
    if(getShape(squares))
        return true;
    
    return false;
}

function showGrid() {
    
    var gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    
    var table = document.createElement("table");
    
    for(var i = 0 ; i < 10 ; i++) {
        var tr = document.createElement("tr");
        for(var j = 0 ; j < 10 ; j++) {
            var td = document.createElement("td");
            
            if(typeof grid[j] != "undefined" && typeof grid[j][i] != "undefined" && grid[j][i] == 0)
                td.setAttribute("class", "empty");
            
            tr.appendChild(td);
        }
            
        table.appendChild(tr);
    }
    
    gridContainer.appendChild(table);
    
    var shapes = [];
    
    var bestMatchVal = 0;
            var bestMatch = false;
    
    for(var n = 1 ; n <= 3 ; n++) {
        
        if(validatePiece(newPiecesGrid[n])) {
        
            var gridNewPiecesContainer = document.getElementById('grid-new-piece-' + n);
            gridNewPiecesContainer.innerHTML = '';
            
            var table = document.createElement("table");
            
            for(var i = 0 ; i < 7 ; i++) {
                var tr = document.createElement("tr");
                for(var j = 0 ; j < 8 ; j++) {
                    var td = document.createElement("td");
                    
                    if(newPiecesGrid[n][j][i] == 0)
                        td.setAttribute("class", "empty");
                    
                    tr.appendChild(td);
                }
                    
                table.appendChild(tr);
            }
            
            gridNewPiecesContainer.appendChild(table);
            
            
            
            var squares = getSquares(newPiecesGrid[n]);
            
            var availableSpaces = [];
            
            
            
            if(grid.length > 0)
                for(var i = 0 ; i < 10 ; i++) {
                    for(var j = 0 ; j < 10 ; j++) {
                        if(doesShapeFit(squares, i, j)) {
                            availableSpaces.push({
                                x : i, 
                                y : j
                            });
                            if(doesItMatch(squares, i, j)) {
                                
                                if(doesItMatch(squares, i, j) > bestMatchVal) {
                                    bestMatchVal = doesItMatch(squares, i, j);
                                    bestMatch = {
                                        squares : squares,
                                        x : i,
                                        y : j
                                    };
                                }
                                
                             //   console.log(n + ") match at " + i + ", " + j);
                            }
                        }
                    }
                }
                
            
            
            
            
            shapes[n] = {
                squares : squares,
                availableSpaces : availableSpaces
            }
            
            
            
            
            
            
        }
    } 
    
    
    if(bestMatch) {
        for(var i = 0 ; i < bestMatch.squares.length ; i++) {            
            var r = bestMatch.y + bestMatch.squares[i].y + 1;
            var c = bestMatch.x + bestMatch.squares[i].x + 1;
            
            $("#grid tr:nth-child(" + r + ") td:nth-child(" + c + ")").addClass("placement");
        }
    }   
    
    if(shapes.length > 0) {
        var order_array = [];
        order_array[0] = [1,2,3];
        order_array[1] = [1,3,2];
        order_array[2] = [2,1,3];
        order_array[3] = [2,3,1];
        order_array[4] = [3,1,2];
        order_array[5] = [3,2,1];
        
        for(var o = 0 ; o < order_array.length ; o++) {
            var order = order_array[o];
            
            var tempGrid = [];
            
            for(var i = 0 ; i < 10 ; i++)
                for(var j = 0 ; j < 10 ; j++) {
                    if(typeof tempGrid[i] === "undefined")
                        tempGrid[i] = [];
                    tempGrid[i][j] = grid[i][j];
                }
            
            var matchCount = 0;
            
            for(var s = 0 ; s < order.length ; s++) {
                
            //    console.log(order[s]);
                
                var shape = shapes[order[s]];
           //     console.log(shape);
                var shapeAvailableSpaces = shape.availableSpaces;
                
                for(var a = 0 ; a < shapeAvailableSpaces.length ; a++) {
                    var space = shapeAvailableSpaces[a];
              //      console.log(space);
                    
                    
                       //find op moves here 
                    
                    
                    for(var i = 0 ; i < shape.squares.length ; i++)
                        tempGrid[1*(space.x + shape.squares[i].x)][1*(space.y + shape.squares[i].y)] = 1;
                    
                    for(var i = 0 ; i < 10 ; i++) {
                        if(sumOfRow(tempGrid,i) == 10) {
                    //        console.log("remove row " + i);
                            
                            matchCount++;
                            
                            for(var j = 0 ; j < 10 ; j++)
                                tempGrid[j][i] = 0;
                        }
                        
                        if(sumOfCol(tempGrid,i) == 10) {
                      //      console.log("remove col " + i);
                            
                            matchCount++;
                            
                            for(var j = 0 ; j < 10 ; j++)
                                tempGrid[i][j] = 0;
                        }
                    }
                    
                    
                    
                }
          //      console.log(shape);
            }
            
            gridToPrint(tempGrid);
  //          console.log("Match Count",matchCount);
            
        }
        
        
//        console.log(shapes);
    
    }
    
}

function capture(video, scaleFactor) {
    
    
    return;
    
    if(scaleFactor == null){
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
    var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
        
    var gridSize = 37;
   
    for(var i = 0 ; i < 10 ; i++) {
        for(var j = 0 ; j < 10 ; j++) {
            var data = ctx.getImageData(40 + i * gridSize, 90 + j * gridSize, 1, 1).data;
            
            if(typeof colorData[i] == "undefined")
                colorData[i] = [];
            if(typeof grid[i] == "undefined")
                grid[i] = [];
            
            colorData[i][j] = data;
            
            if(isEmpty(data))
                grid[i][j] = 0;
            else
                grid[i][j] = 1;
        }
    }
    for(var n = 1 ; n <= 3 ; n++)
        for(var i = 0 ; i < 8 ; i++) {
            for(var j = 0 ; j < 7 ; j++) {
                
                var nOffset = 0;
                if(n == 2)
                    nOffset = 110;
                else if(n == 3)
                    nOffset = 219;
                
                
                var data = ctx.getImageData(nOffset + 19 + i * 20, 554 + j * 19, 1, 1).data;
                
                if(typeof newPiecesGrid[n] == "undefined")
                    newPiecesGrid[n] = [];
                
                if(typeof newPiecesGrid[n][i] == "undefined")
                    newPiecesGrid[n][i] = [];
                            
                if(isEmpty(data))
                    newPiecesGrid[n][i][j] = 0;
                else
                    newPiecesGrid[n][i][j] = 1;
            }
        }
    
    showGrid();

 //   console.log("newPiecesGrid",newPiecesGrid);
        
    return canvas;
} 

function shoot(){
    var video  = document.getElementById(videoId);
    var output = document.getElementById('output');
   // var canvas = capture(video, scaleFactor);
    /*    canvas.onclick = function(){
            window.open(this.toDataURL());
        }; */
    snapshot = canvas;
   // output.innerHTML = '';
  //  output.appendChild(snapshot);
}

function gridToPrint(grid) {
    var str = "";
    for(var i = 0 ; i < grid.length ; i++) {
        for(var j = 0 ; j < grid.length ; j++) {
            if(grid[j][i] == 1)
                str += "1 ";
            else
                str += "0 ";
        }
        str += "\n";
    }
    console.log(str);
}

document.addEventListener("DOMContentLoaded", function(event) { 
  showSources();
  refresh();
  
  shoot();
  setInterval(shoot, 100);
});


$(window).load(function(){    
    setTimeout(function(){
        $("#enable-capture").trigger("click");
        setTimeout(shoot, 500);
    }, 1500);
    
});



document.getElementById('enable-capture').addEventListener('click', function(e) {
  toggle();
});

