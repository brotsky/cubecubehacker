function Robot() {

  this.currentM1 = 0;
  this.currentM2 = 0;

  this.isMoving = false;
  this.MAXm1= 12000;
  this.MAXm2 =15800;
  this.m1a = 12000;
  this.m1b = 12000;
  this.m2a = 15800;
  this.m2b = -15800;
  this.m1a+=this.m2a;
  this.m1b+=this.m2b;
  this.move_time = 1500;


this.tester = function(){

  var _this = this;

  setTimeout(function(){
  command = "axibot manual xy_move " + _this.m1a +" "+ _this.m1b + " " +  _this.move_time + ";sleep 2; axibot manual xy_move " + (-_this.m1a) + " "+ (-_this.m1b) + " " +  _this.move_time + ";";//" axibot manual disable_motors;";

//command += "sleep 5;";

//command = "axibot manual xy_move " + m2a +" "+ m2b + " 3000;sleep 5; axibot manual xy_move " + (-m2a) + " "+ (-m2b) + " 3000;";//" axibot manual disable_motors;";


  console.log(command);

  exec(command,(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
       }
       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
     });
   }, 0);
   return;
 }

 this.getMoveTime = function(toM1, toM2) {
   var deltaM1 = Math.abs(toM2) + Math.abs(toM1);

  //  var maxM = Math.max(deltaM1,deltaM2);
  var maxDelta= 31600;

   var move_time = Math.ceil((1500* deltaM1)/maxDelta);
   if(move_time < 100)
    move_time = 100;

   console.log("move_time",move_time);

   return move_time;

 }


this.goto = function(x, y, callback) {

  if(this.isMoving) {
    console.log("ERROR", "robot is currently moving");
    return;
  }

  this.isMoving = true;



  this.m1a = y*0.01*this.MAXm1;
  this.m1b = y*0.01*this.MAXm1;
  this.m2a = x*0.01*this.MAXm2;
  this.m2b = -x*0.01*this.MAXm2;

  this.m1 = this.m1a + this.m2a;
  this.m2 = this.m1b + this.m2b;

  this.m1 -= this.currentM1;
  this.m2 -= this.currentM2;

  var moveTime = this.getMoveTime(this.m1, this.m2);

  this.m1= Math.round(this.m1);
  this.m2 = Math.round(this.m2);

  var _this =this;


  setTimeout(function(){
    _this.isMoving = false;

    if(typeof callback == "function")
      callback(true);

  },moveTime * 2);

  setTimeout(function(){
  command = "axibot manual xy_move " + _this.m1 +" "+ _this.m2 + " " +  moveTime + ";";//sleep 3; axibot manual xy_move " + (-_this.m1a) + " "+ (-_this.m1b) + " " +  _this.move_time + ";";//" axibot manual disable_motors;";

//command += "sleep 5;";

//command = "axibot manual xy_move " + m2a +" "+ m2b + " 3000;sleep 5; axibot manual xy_move " + (-m2a) + " "+ (-m2b) + " 3000;";//" axibot manual disable_motors;";


  console.log(command);

  exec(command,(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
       } else {
         _this.currentM1 += _this.m1;
         _this.currentM2 += _this.m2;
       }
       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
     });
   }, 0);

return;

}

this.stylusUp = function(callback){



    var command = "axibot manual pen_up 100;";

    console.log(command);
 //   return;
    exec(command,(error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });

        setTimeout(function(){
          if(typeof callback == "function")
            callback(true);
        },400);
}

this.stylusDown = function(callback) {


    var command = "axibot manual pen_down 100;";

    console.log(command);
 //   return;
    exec(command,(error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
        setTimeout(function(){
          if(typeof callback == "function")
            callback(true);
        },400);
}

return;
}


module.exports = new Robot();
