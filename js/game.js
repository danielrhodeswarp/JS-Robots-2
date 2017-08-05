//Game object
function Game(arena)
{
	//Properties (prefixed to avoid collisions with userland junk but OOPS that would be the Robot class and not this Game class!!!!)
	this._arena;
	this._stopped = true;
	this._paused = false;
	this._fps = 15;	//fps AND game speed :-/
	this._timerFrequency = 1000 / this._fps;	//1000(ms) / FPS
	this._intervalId = null;
	this._robots = {};	//Accessed by a few other scripts too
	this._robotCount = 0;
	this._robotCollisionDamage = 2;
	this._mute = false;
	
	//Constructor
	this._arena = arena;
		this._sfx = new SfxServer({crash:'wav/sfx/metal_hit.wav', explosion:'wav/sfx/pistol.wav', death:'wav/sfx/robot.wav'});
	//----
	
	//
	this.toggleMute = function()
	{
		this._mute = !this._mute;
		this._sfx.setMute(this._mute);
	}
	
	//
	this.mute = function()
	{
		this._mute = true;
		this._sfx.setMute(this._mute);
	}
	
	//
	this.unmute = function()
	{
		this._mute = false;
		this._sfx.setMute(this._mute);
	}
	
	//
	this.getMute = function()
	{
		return this._mute;
	}
	
	//Triggered before a new play
	this.reset = function()
	{
		this._robots = {};
		this._robotCount = 0;
		
		this._paused = false;
		this._stopped = false;
		
		this._arena.context.font = '14px monospace';
		
		clearInterval(this._intervalId);	//otherwise game gets faster and faster with each restart!
	};
	
	//put game instructions on initial empty canvas
	this.displayBlurb = function()
	{
		this._arena.context.fillStyle = '#770000';
		this._arena.context.font = 'bold 14pt monospace';/*Chrome not bolding when 'bold 18px monospace' ...??? (yet 17px and 19px bold perfectly!!?!)*/
		this._arena.context.fillText('JS Robots is a JavaScript programming game.', 10, 30);
		this._arena.context.fillText('You must battle it out with other robots', 10, 50);
		this._arena.context.fillText('in a martian wilderness!', 10, 70);
		this._arena.context.fillText('Up to four human players can multiplay', 10, 110);
		this._arena.context.fillText('(non networked) against each other and / or', 10, 130);
		this._arena.context.fillText('up to four CPU players.', 10, 150);
		this._arena.context.fillText('It\'s every robot for itself and the last', 10, 190);
		this._arena.context.fillText('robot standing wins!', 10, 210);
		this._arena.context.fillText('Choose / enter your player scripts below', 10, 250);
		this._arena.context.fillText('then press the play button above.', 10, 270);
		this._arena.context.fillText('For game rules and robot programming', 10, 310);
		this._arena.context.fillText('information, see the above how to play page.', 10, 330);
		this._arena.context.font = 'bold 22pt monospace';
		this._arena.context.fillText('scan...engage...FIRE!', 40, 390);
	}
	
	//Load robots
	this.init = function()
	{
		for(var loop = 1; loop < 5; loop++)
		{
			if(document.getElementById('cpu_' + loop + '_on').checked)
			{
				robot = new Robot('cpu_' + loop, document.getElementById('cpu_' + loop + '_color').value, makeOneLine(document.getElementById(document.getElementById('cpu_' + loop + '_program').value).value));
				
				this.addRobot('cpu_' + loop,robot);
			}
			
			if(document.getElementById('player_' + loop + '_on').checked)
			{
				robot = new Robot('player_' + loop, document.getElementById('player_' + loop + '_color').value, makeOneLine(document.getElementById('player_' + loop + '_program_source').value));
				
				this.addRobot('player_' + loop, robot);
			}
		}
		
		if(this._robotCount < 2)
		{
			alert('Select at least 2 robots please');
			this.stop();
			return false;
		}
		
		return true;
	};
	
	//Other methods
	this.addRobot = function(robotId, robotObject)
	{
		this._robots[robotId] = robotObject;
		this._robotCount++;
	};
	
	this.removeRobot = function(robotId)
	{
		delete this._robots[robotId];
		this._robotCount--;
	};
	
	this.draw = function()
	{
		this._arena.context.clearRect(0, 0, this._arena.width, this._arena.height);	//wipe
		
		
		
		for(var robotId in this._robots)
		{
			this._robots[robotId]._draw(this._arena.context);
			
			this.drawStatistics(this._robots[robotId]);
		}
	};
	
	this.drawStatistics = function(robot)
	{
		document.getElementById(robot._id + '_damage').innerHTML = robot._damage;
		document.getElementById(robot._id + '_speed').innerHTML = robot._enginePower;
		document.getElementById(robot._id + '_heading').innerHTML = robot._currentDrivingAngle;
		document.getElementById(robot._id + '_scan').innerHTML = robot._currentScanAngle;
	};
	
	this.update = function()
	{
		for(var robotId in this._robots)
		{
			this._robots[robotId]._update();
		}
	};
	
	//start playing the first time (called once per full game)
	this.play = function()
	{
		if(!this._stopped)
		{
			return;
		}
		
		this.reset();
		var initSuccess = this.init();
		
		if(!initSuccess)
		{
			return;
		}
		
		//Record game start time
		this._startDate = new Date();
				
		
		//this._intervalId = setInterval('mainGameLoop()', this._timerFrequency);
		//this._intervalId = setInterval('this.mainGameLoop()', this._timerFrequency);
		//this._intervalId = setInterval(this.mainGameLoop, this._timerFrequency);
		this._intervalId = setIntervalWithContext(this.mainGameLoop, this._timerFrequency, this);
		
	};
	
	this.pause = function()	//But don't forget game timing!
	{
		this._paused = true;
	};
	
	this.unpause = function()	//But don't forget game timing!
	{
		this._paused = false;
	};
	
	this.togglePause = function()	//But don't forget game timing!
	{
		this._paused = !this._paused;
	};
	
	this.stop = function()
	{
		this._stopped = true;
		this._paused = false;
	};
	
	
	
	
	
	
	this.mainGameLoop = function()
	{
		if(this._stopped)	//ie. "stopping" breaks the game loop
		{
			return;
		}
		
		if(!this._paused)	//ie. "pausing" keeps the game loop but NOPs
		{
			this.update();
			this.collisionDetection();
			this.removeDeadRobots();
			this.draw();
			this.announceWinnerIfAppropriate();
		}
		
		
		
	}
	
	
	this.collisionDetection = function()
	{
		for(var robotId in this._robots)
		{
			this.checkRobotCollision(robotId);
		}
	};
	
	this.checkRobotCollision = function(robotIdToCheck)	//Need to (?) intelligently remove dublies here Daniel...
	{
		var robot = this._robots[robotIdToCheck];
		
		for(var robotId in this._robots)
		{
			if(robotId == robotIdToCheck)
			{
				continue;
			}
			
			var robotB = this._robots[robotId];
			
			//Ignore other robot if that is already stopped forcibly
			if(robotB._stopped)
			{
				continue;
			}
			
			var distance = getDistanceBetweenRobotAAndRobotB(robot, robotB);
			
			//nb. origin of robots is their geometric centre
			
			if(distance < 32)	//?or double the robot offset or what? OI
			{

				this._sfx.play('crash');
				
				//if(robotIdToCheck == 'player_1'){log(distance);}
				
				//if(!this._robots[robotId]._stopped){
				this._robots[robotId]._damage += this._robotCollisionDamage;
				this._robots[robotId]._stopHard('collision');
				
				//}
				
				
				
				//if(!this._robots[robotIdToCheck]._stopped){
				this._robots[robotIdToCheck]._damage += this._robotCollisionDamage;
				this._robots[robotIdToCheck]._stopHard('collision');
				//}
				
				
				
				//NEW!
				return;
				
			}
			
		}
	};
	
	
	this.removeDeadRobots = function()
	{
		for(var robotId in this._robots)
		{
			if(this._robots[robotId]._remove)
			{
				this.removeRobot(robotId);
			}
		}
	};
	
	this.announceWinnerIfAppropriate = function()
	{
		var counter = 0;
		var robotId;
		
		for(var robotId in this._robots)
		{
			counter++;
			robotId = robotId;
		}
		
		if(counter == 0)
		{
			this.stop();
			alert('Draw!');
		}
		
		if(counter == 1)
		{
			var endDate = new Date();
			var winTimeInMs = endDate.getTime() - this._startDate.getTime();
					
						
			var robotName = robotId.replace('_', ' ');
						
			this._arena.context.fillStyle = 'red';
			this._arena.context.font = '40px monospace';
			this._arena.context.fillText(robotName + ' wins!', 50, 150);
			
			
			this.stop();
			
						
			//If *player* win then show 'em their time
			if(robotName.charAt(0) == 'p')
			{
				doScoring(robotId, robotName, winTimeInMs);
			}
		}
	};
}

/*
//Main game loop
function mainGameLoopTurd()
{
	if(globalGame._stopped)	//ie. "stopping" breaks the game loop
	{
		return;
	}
	
	if(!globalGame._paused)	//ie. "pausing" keeps the game loop but NOPs
	{
		globalGame.update();
		globalGame.collisionDetection();
		globalGame.removeDeadRobots();
		globalGame.draw();
		globalGame.announceWinnerIfAppropriate();
	}
	
	//MAKES MORE SENSE to use an *interval* and to set that
	//OUTSIDE of this loop!!!
	//setTimeout('mainGameLoop()', globalGame._timerFrequency);
	
}
*/
