var Player = function(){
    var x = 0,
		y = 0,
		width = 25,
		height = 25,
		vel = 2,
		atkStart = 0,
		weapon = new Weapon(),
		facing = 0;
		
	var getAtkStart = function(){
        return atkStart;
	};
		
	var setAtkStart = function(time){
        atkStart = time;
	};

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

	// Update player position
	var update = function(keys) {

        var prevWepX = weapon.getX(),
            prevWepY = weapon.getY();
    
        weapon.update(x, y, width, height);
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= vel;
			this.facing = 0;
		} else if (keys.down) {
			y += vel;
			this.facing = 2;
		}

		// Left key takes priority over right
		if (keys.left) {
			x -= vel;
			this.facing = 3;
		} else if (keys.right) {
			x += vel;
			this.facing = 1;
		}
		
		return prevX != x || prevY != y || !(weapon.getX() == prevX && weapon.getY() == prevY);
	};
	
	var moveX = function(dX){
        x += dX;
	};
	
	var moveY = function(dY){
        y += dY;
	};

	// Define which variables and methods can be accessed
	return {
        weapon: weapon,
        getAtkStart: getAtkStart,
        setAtkStart: setAtkStart,
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		vel: vel,
		moveX: moveX,
		moveY: moveY,
		facing: facing
	};
};

exports.Player = Player;

var Weapon = function(){
    
    var x = 0,
        y = 0,
        atk = false,
        motion = [],
        step = 0,
        dmg = 2;
    
    var getDmg = function(){
        return dmg;
    };
    
    var setDmg = function(newDmg){
        dmg = newDmg;
    };
    
    var swing = function(pos, facing){
        this.atk = true;
        
        var animLength = 7,
            x = 0,
            y = 0,
            start = animLength,
            angle = 4 * Math.PI;
        motion = [];
        
        switch(facing){
            case 0: //facing up;
                start *= -1;
                break;
            case 1: //facing right;
                break;
            case 2: //facing down;
                break;
            case 3: //facing Left;
                start *= .25;
                break;
        }
        
        for(var i = 0; i < 6; i++){
            x = 30 * Math.cos(angle * (i + start) / 24);
            y = -30 * Math.sin(angle * (i + start) / 24);
            motion[i] = {x:x, y:y};
        }
        
        motion[animLength - 1] = {x:0, y:0};
    };
    
    var thrust = function(pos, facing){
        this.atk = true;
        x = 0;
        y = 0;
        
        switch(facing){
            case 0: //facing up;
                motion = [{x:x, y:y},{x:x, y:y-15},{x:x, y:y-20},{x:x, y:y-30},{x:x, y:y-20},{x:x, y:y-15},{x:x, y:y}];
                break;
            case 1: //facing right;
                motion = [{x:x, y:y},{x:x+15, y:y},{x:x+20, y:y},{x:x+30, y:y},{x:x+20, y:y},{x:x+15, y:y},{x:x, y:y}];
                break;
            case 2: //facing down;
                motion = [{x:x, y:y},{x:x, y:y+15},{x:x, y:y+20},{x:x, y:y+30},{x:x, y:y+20},{x:x, y:y+15},{x:x, y:y}];
                break;
            case 3: //facing Left;
                motion = [{x:x, y:y},{x:x-15, y:y},{x:x-20, y:y},{x:x-30, y:y},{x:x-20, y:y},{x:x-15, y:y},{x:x, y:y}];
                break;
        }
    };
    
    var update = function(playerX, playerY, playerW, playerH){
        
        x = playerX;
        y = playerY;
        
        if(this.atk){
            if(step >= motion.length){
                step = 0;
                atk = false;
                motion = [];
                x = playerX;
                y = playerY;
            }else{
                x = motion[step].x + playerX;
                y = motion[step++].y + playerY;
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
        setDmg: setDmg,
        swing: swing,
        thrust: thrust,
        update: update,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        atk: atk
    };
};

exports.Weapon = Weapon;