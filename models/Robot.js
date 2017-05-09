function Robot() {
    
    this.goto = function(x, y) {
        console.log("go to " + x + " " + y);
    }

}

module.exports = new Robot();