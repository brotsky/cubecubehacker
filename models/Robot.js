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
  command = "axibot manual xy_move " + _this.m1a +" "+ _this.m1b + " " +  _this.move_time + ";sleep 3; axibot manual xy_move " + (-_this.m1a) + " "+ (-_this.m1b) + " " +  _this.move_time + ";";//" axibot manual disable_motors;";

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
   var deltaM1 = Math.abs(toM2);
   var deltaM2 = Math.abs(toM2);

   var maxM = Math.max(deltaM1,deltaM2);

   var move_time = Math.ceil(this.move_time * 4 * (maxM / (this.MAXm2)));

   if(move_time < 1)
    move_time = 1;

   console.log("move_time",move_time);

   return move_time;

 }


this.goto = function(x, y) {

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

  var _this =this;


  setTimeout(function(){
    _this.isMoving = false;
  },moveTime);

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

return;
}


module.exports = new Robot();
