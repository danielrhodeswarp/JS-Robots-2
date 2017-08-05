//Robot object
function Robot(robotId, color, script)
{
	//Properties-(prefixed to avoid collisions with userland junk-----------------------
	this._id = robotId;
	this._color = color;
	this._deadColor = 'orange';
	this._image = new Image();
	this._image.src = 'img/game/robot/robot_' + this._color + '.png';
	this._script = script;
	
	this._size = 31;
	this._offset = 15;	//To centre of size
	
	//access the arena object?? YES!
	this._x = /*Math.floor*/((Math.random() * (globalGame._arena.width - this._offset)) + this._offset);	//Are we sometimes going *over* walls with this????
	this._y = /*Math.floor*/((Math.random() * (globalGame._arena.height - this._offset)) + this._offset);
	
	this._topSpeed = 8;
	this._currentSpeed;
	this._currentDrivingAngle = '';
	this._moving = false;
	this._enginePower = 0;	//A percentage of topSpeed
	this._stopped = false;	//Have we been forcibly stopped?
	
	this._remove = false;
	this._disabled = false;
	
	this._bullets = {};
	this._bulletCounter = 0;
	
	this._damage = 0;
	
	this._currentScanAngle = '';
	
	this._missiles = {};
	this._missileCounter = 0;
	this._missileLauncherSlowness = 16;
	this._missileLauncherCountdown = 0;
	
	
	
	//Methods---------------------------
	
	
	
	//Crobots-esque API functions FOR THE USER---------------------
	
	//Degree should be within the range 0-359,
	//otherwise degree is forced into 0-359 by a modulo 360
	//operation, and made positive if necessary.
	//Resolution controls the scanner's sensing resolution, up to +/- 10 degrees. 
	//----
	//Return FALSE if no robots are within the scan range or a positive
	//integer representing the range to the closest robot
	this.scan = function(degree, resolution)
	{
		if(resolution < 0)
		{
			resolution = 0;
		}
		if(resolution > 10)
		{
			resolution = 10;
		}
		
		degree = makePositiveAngle(degree);
		this._currentScanAngle = degree;
		
		var candidates = {};
		var haveCandidates = false;
		
		for(var robotId in globalGame._robots)
		{
			//if(robotId == this._elementId)
			if(robotId == this._id)
			{
				continue;
			}
			
			var angleFromThis = Math.floor(getDirectionFromRobotAToRobotB(this, globalGame._robots[robotId]));
			//Integer needed only to get a resolution of zero working...!!!
			//(could do the Math.floor not here but in the final ELSE block below...)
			
			//
			var fromDegree = makePositiveAngle(degree - resolution);
			var toDegree = makePositiveAngle(degree + resolution);
			
			//log('Ang from this: ' + angleFromThis + '. Scan from ' + fromDegree + ' to ' + toDegree);
			
			//359 - 0 wraparound
			if(fromDegree > toDegree)
			{
				if(angleFromThis == 0)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, globalGame._robots[robotId]);
				}
				
				else if(angleFromThis < toDegree && angleFromThis > 0)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, globalGame._robots[robotId]);
				}
				
				else if(angleFromThis < 0 && angleFromThis > fromDegree)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, globalGame._robots[robotId]);
				}
			}
			
			else
			{
				if((angleFromThis >= fromDegree) && (angleFromThis <= toDegree))
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, globalGame._robots[robotId]);
				}
			}
		}
		
		//return false if no candidates
		if(!haveCandidates)
		{
			return false;
		}
		
		//return range of closest robot
		var minimum = 200000000;
		
		for(var candidateId in candidates)
		{
			if(candidates[candidateId] < minimum)
			{
				minimum = candidates[candidateId];
			}
		}
		
		//return minimum;	//Will be a float
		
		return Math.floor(minimum);	//Will be an integer (as per orig CROBOTS)
	};
	
	//fire a missile heading a specified range
	//and direction. Degree is forced into
	//the range 0-359 as in scan().  Range can be 0-350, with greater
	//ranges truncated to 350. 
	//----
	//Return TRUE if a missile was fired, or FALSE if the cannon is reloading
	this.cannon = function(degree, range)
	{
		//Reloading?
		if(this._missileLauncherCountdown > 0)
		{
			return false;
		}
		
		//Reset reload countdown
		this._missileLauncherCountdown = this._missileLauncherSlowness;
		
		var missileId = this._id + '_' + this._missileCounter;
		
		miss = new Missile(this._id, missileId, this._x, this._y, degree, range);
		
		this._missiles[missileId] = miss;
		
		this._missileCounter++;
		
		return true;
	};
	
	
	
	//activates the robot's drive mechanism, on a
	//specified heading and speed.  Degree is forced into the range
	//0-359 as in scan().  Speed is expressed as a percent, with 100 as
	//maximum.  A speed of 0 disengages the drive.  Changes in
	//direction can be negotiated at speeds of less than 50 percent (have/should actually implement this restriction Daniel???). 
	this.drive = function(degree, speed)
	{
		//If stopped then need diff angle to reactivate (or just stop for one turn?????~)
		if(this._stopped /*&& degree == this._currentDrivingAngle*/)	//makePositiveANgle() on degree?
		{	
			this._stopped = false;
			return false;	//Not per orig CROBOTS docs
		}
		
		
		
		degree = makePositiveAngle(degree);
		
		//log(degree);		
		
		//this._setEnginePower(speed);
		
		//this._move(degree);
		
		//Use current or desired engine power?? PROB DESIRED!!
		if(this._moving && degree != this._currentDrivingAngle && /*this._enginePower*/ speed > 50)
		{
			//log('too fast to turn!');
			//stop or what? NOP will continue with previous heading and speed
			return false;	//Not per orig CROBOTS docs
		}
		else
		{
			this._setEnginePower(speed);			this._move(degree);
			return true;	//Not per orig CROBOTS docs
		}
	};
	
	
	
	
	/*
	returns the percent

        of damage, 0-99. (100 percent damage means the robot is

        completely disabled, thus no longer running!) 
	*/
	this.damage = function()	//Should prob also do a getDamage()
	{
		return this._damage;
	};
	
	
	/*

        The speed() function returns the current speed of the robot.

        speed() takes no arguments, and returns the percent of speed,

        0-100.  Note that speed() may not always be the same as the last

        drive(), because of acceleration and deacceleration. 
		*/
	
	this.speed = function()	//Should prob also do a getSpeed()
	{
		return this._enginePower;
	};
	
	
	this.loc_x = function()	//Should prob also do a getX()
	{
		//return this._x;	//Will be a float
		
		return Math.floor(this._x);	//Will be an integer (as per orig CROBOTS)
	};
	
	this.loc_y = function()	//Should prob also do a getY()
	{
		//return this._y;	//Will be a float
		
		return Math.floor(this._y);	//Will be an integer (as per orig CROBOTS)
	};
	
		//Non "this." functions that robot scripts can use
		
		//rand(fromZeroToOneLessThanThisParamater)
		
		//sqrt(thisParamaterIsEnsuredPositiveAndTheSquareRootIsReturned)
		
		//sin (degree)	//Or just use Math. for this junk??
		//cos (degree)
		//tan (degree)
		//atan (ratio)	
		
		//----
	
	
	//End Crobots API functions-----------------
	
	//----HELPER---------
	/*
	this.driveTo = function(x, y, speed)
	{
		degree = makePositiveAngle(getDirectionFromRobotToPoint(this, x, y));
		
		this._setEnginePower(speed);
		
		this._move(degree);
	}
	*/
	
	this._stop = function(message)	//Don't really need message parm (debug junk)
	{
		//????
		//this._backtrack();
		//log('backtracking');
		
		//if(message == null){message = '';}else{message = ' due to ' + message;}
		//log('stopping ' + this._id + message);
		
		this._moving = false;
		this._enginePower = 0;
		this._currentSpeed = 0;
		//this._stopped = true;
		
	};
	
	this._stopHard = function(message)	//Don't really need message parm (debug junk)
	{
		//????
		//this._backtrack();	//A form of coordinate clipping
		//log('backtracking');
		
		//if(message == null){message = '';}else{message = ' due to ' + message;}
		//log('stopping HARD ' + this._id + message);
		
		this._moving = false;
		this._enginePower = 0;
		this._currentSpeed = 0;
		this._stopped = true;
		
	};
	
	this._backtrack = function()	//A form of coordinate clipping (like we have for wall hits)
	{
		//log(this._currentDrivingAngle - 180);
		this._shortMove(this._currentDrivingAngle - 180);
		//this._move(this._currentDrivingAngle - 180);
	};
	
	this._setEnginePower = function(power)
	{
		if(power < 0)
		{
			power = 0;
		}
		
		if(power > 100)
		{
			power = 100;
		}
		
		this._enginePower = power;
		
		this._currentSpeed = /*Math.floor*/((this._topSpeed / 100) * this._enginePower);
		
		//Housekeeping var
		this._moving = (this._currentSpeed > 0);
	};
	//----/HELPER--------
	
	
	
	//Set user's main routine
	this._setScript = function(script)
	{
		try
		{
			this._userUpdate = new Function(script);
		}
		
		catch(error)
		{
			alert('Could not LOAD the program for: ' + this._id.replace('_', ' ') + '\nError: "' + error + '"\nPlease check the program source');
			globalGame.stop();
		}
	};
	
	//
	this._shortMove = function(degree)
	{
		var sin = sine[degree];
		var cos = cosine[degree];
		//log(this._currentSpeed);
		this._x += /*Math.floor*/(sin * this._currentSpeed);	//Math.floor gave gradual rounding decrement when, for example, a robots was circling...
		this._y -= /*Math.floor*/(cos * this._currentSpeed);
	};
	
	//Change x and y based on direction and speed
	this._move = function(degree)
	{
		var sin = sine[degree];
		var cos = cosine[degree];
		
		this._x += /*Math.floor*/(sin * this._currentSpeed);	//Math.floor gave gradual rounding decrement when, for example, a robots was circling...
		this._y -= /*Math.floor*/(cos * this._currentSpeed);
		
		//Prob wanna return after each IF block (only wanna stop() once per turn!)
		
		if(this._x < 0)
		{
			this._x = 0;
			this._stop('wallhit');
			this._damage += globalGame._arena.wallDamage;
			
		}
		
		if(this._x >= globalGame._arena.width)
		{
			this._x = globalGame._arena.width - 1;
			this._stop('wallhit');
			this._damage += globalGame._arena.wallDamage;
			
		}
		
		if(this._y < 0)
		{
			this._y = 0;
			this._stop('wallhit');
			this._damage += globalGame._arena.wallDamage;
			
		}
		
		if(this._y >= globalGame._arena.height)
		{
			this._y = globalGame._arena.height - 1;
			this._stop('wallhit');
			this._damage += globalGame._arena.wallDamage;
			
		}
		
		//Housekeeping var
		this._currentDrivingAngle = degree;
	};
	
	
	
	
	
	//Internal main routine (user's main routine and some hidden internal stuff)
	this._update = function()
	{
		if(this._damage >= 100 && !this._remove)
		{
			globalGame._sfx.play('death');
			
			this._remove = true;
			
			//Remove also all missiles (explosions?) (but what about timing etc?)
			for(var missile in this._missiles)			{
				this._missiles[missile].remove = true;
			}
			
			
		}
		
		
		
		this._missileLauncherCountdown--;
		
		
		
		//Move missiles	
		for(var missile in this._missiles)
		{
			this._missiles[missile].move();
			
			//coldet?
			//NOPE, do it in explosion class (doing it here would be for all MISSILEs and not all EXPLOSIONS)
			//colDetExplosion(this._bullets[bullet], this._id);
			
			if(this._missiles[missile].remove)
			{
				
				delete this._missiles[missile];
				//this._missileCounter--;
			}
		}
		
		//User's script
		//if(!this._disabled)
		//{		
			try
			{	
				this._userUpdate();
			}
			
			catch(error)
			{
				alert('Could not EXECUTE the program for: ' + this._id.replace('_', ' ') + '\nError: "' + error + '"\nPlease check the program source');
				globalGame.stop();
			}
		//}
	};
	
	//Draw the robot and all owned bullets and missiles/explosions
	this._draw = function(context)	//context is an HTML5 2d context
	{
		var x = (this._x - this._offset);
		var y = (this._y - this._offset);
		
		
		
		if(!this._remove)	//? show minus deaths? or always set to zero? MINUS DEATHS APPEAR! so maybe drawing of death score is out a lil in terms of timing (sometimes the death score is positive ie. "2" or "1")....
		{
			//health display
			context.fillStyle = 'white';
				//nudge down and right
				var downNudge = 6;
				var rightNudge = 3;
			context.fillText(100 - this._damage, x + rightNudge, y + this._offset + downNudge, this._size);			
			
			//ie. following main block *under* our health display
			context.globalCompositeOperation = 'destination-over';
			
			
			context.drawImage(this._image, x, y);			
			
			
		//context.fillStyle = this._color;
			//var linGrad = context.createLinearGradient(x, y, x + this._size, y + this._size);
			//linGrad.addColorStop(0.25, this._color);
			//linGrad.addColorStop(0.5, 'lightgrey');
			//linGrad.addColorStop(0.75, this._color);
			//context.fillStyle = linGrad;
			
		//context.fillRect(x, y, this._size, this._size);
			
			//not working as expected colourwise AND crunching the CPU
			//context.rect(x, y, this._size, this._size);
			//context.shadowColor = 'black';
			//context.shadowBlur = 1;
			//context.fill();
		}
		else
		{
			//Let's somehow have it so active robots *roll over* dead robots
			log('robot dead dude');
			context.fillStyle = this._deadColor;
			//context.globalCompositeOperation = 'source-over';
			context.fillRect(x, y, this._size, this._size);
		}
		
		if(this._remove)
		{
			log('robot dead dude');
		}
		
		//if(!this._remove)
		//{
			
		//}
		
		
		
		//Draw missiles
				for(var missile in this._missiles)
		{
			this._missiles[missile].draw(context);
		}
	};
	
	//Constructor
		this._setScript(this._script);
	
	//----
}