var Keys = function() {
	up = false,
	left = false,
	right = false,
	down = false;
	space = false;
		
	var onKeyDown = function(e) {
		var self = this;
		switch (e.keyCode) {
			// Controls
			case 32:
                self.space = true;
                break;
			case 37: // Left
				self.left = true;
				break;
			case 38: // Up
				self.up = true;
				break;
			case 39: // Right
				self.right = true; // Will take priority over the left key
				break;
			case 40: // Down
				self.down = true;
				break;
		}
	};
	
	var onKeyUp = function(e) {
		var self = this;
		switch (e.keyCode) {
			case 32:
                self.space = false;
                break;
			case 37: // Left
				self.left = false;
				break;
			case 38: // Up
				self.up = false;
				break;
			case 39: // Right
				self.right = false;
				break;
			case 40: // Down
				self.down = false;
				break;
		}
	};
	
	var check = function(){
        return this.up || this.down || this.left || this.right || this.space;
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		space: space,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp,
		check: check
	};
};

var Weapon = function(){
    
    var x = 0,
        y = 0,
        atk = false,
        motion = [],
        step = 0,
        dmg = 2,
        width = 5;
    
    var getDmg = function(){
        return dmg;
    };
    
    var setDmg = function(newDmg){
        dmg = newDmg;
    };
    
    var update = function(playerX, playerY, playerW, playerH){
        
        x = playerX;
        y = playerY;
        
        if(atk){
            if(step >= motion.length){
                step = 0;
                atk = false;
                motion = [];
                x = 0;
                y = 0;
            }else{
                x = motion[step].x;
                y = motion[step++].y;
            }
        }
    };
    
    var getX = function(){
        return x;
    };
    
    var getY = function(){
        return y;
    };
    
    var setX = function(newX){
        x = newX;
    };
    
    var setY = function(newY){
        y = newY;
    };
    
    return {
        getDmg: getDmg,
        update: update,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        width: width
    };
};

var Player = function(){
    var x = 0,
		y = 0,
		width = 25,
		height = 25,
		weapon = new Weapon(),
		facing = 0;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};
	
	var update = function(pX, pY, wX, wY) {
		x = pX;
		y = pY;
		weapon.setX(wX);
		weapon.setY(wY);
	};
	
	var draw = function(ctx){

        ctx.fillStyle = "yellow";
        ctx.fillRect(weapon.getX() - weapon.width / 2, weapon.getY()- weapon.width / 2, 5, 5);
        
        ctx.fillStyle = "blue";
        ctx.fillRect(x-width/2, y-height / 2, width, height);
        
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		draw: draw,
		update: update,
		weapon: weapon,
		facing: facing
	};
};