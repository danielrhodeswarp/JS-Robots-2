//Missile object
function Missile(ownerRobotId, missileId, x, y, direction, range)
{
	//Properties
	this.x;
	this.y;
	this.direction;
	this.id;
	this.speed = /*8*/16;
	this.hitWall = false;
	this.remove = false;
	this.ownerRobotId;	//is this ever used?
	this.damage = 0;
	this.color = 'yellow';
	this.size = 15;
	this.offset = 7;	//To centre of size
	this.range;
	this.maxRange = 350;
	this.exploding = false;
	
	
	//Constructor
	
		this.ownerRobotId = ownerRobotId;
		this.id = missileId;
		this.x = x;
		this.y = y;
		this.direction = makePositiveAngle(direction);
		
		
		if(range > this.maxRange)range = this.maxRange;
		
		this.range = range;
		
		
		
		
	//----
	
	this.setHitWall = function()
	{
		this.hitWall = false;
		
		if(this.x < 0 || this.x > globalGame._arena.width || this.y < 0 || this.y > globalGame._arena.height)
		{
			this.hitWall = true;
			
		}
	};
	
	//Change x and y based on current direction bearing
	this.changeCoords = function()
	{
		sin = sine[this.direction];
		cos = cosine[this.direction];
		
		this.x += sin * this.speed;	//Precalc?
		this.y -= cos * this.speed;
		
		
		this.range -= this.speed;
	};
	
	this.reachedTarget = function()
	{
		return(this.range < 0);
	};
	
	this.move = function()
	{
		this.changeCoords();
		
		this.setHitWall();
		
	
		
		if((this.hitWall && !this.exploding) || (this.reachedTarget() && !this.exploding))
		{
			//this.remove = true;
			
			this.exploding = true;
			
			this.explosion = new Explosion(this.id, this.x, this.y);
		}
	};
	
	this.draw = function(context)	//context is an HTML5 2d context
	{
		if(this.exploding)
		{
			this.explosion.draw(context);
			this.explosion.update();
			
			if(this.explosion.finished)
			{
				this.explosion = null;
				this.remove = true;
			}
		}
		
		else
		{
			//canvas circle methods take CENTRE of circle as a parm so no need to offset if drawing as a circle
			
			//AS SQUARE
			//context.fillStyle = this.color;
			//context.fillRect((this.x - this.offset), (this.y - this.offset), this.size, this.size);
		
			//AS CIRCLE
			context.fillStyle = this.color;
			context.beginPath();
			context.arc(this.x, this.y, this.offset, 0, 2 * Math.PI);
			context.fill();
		
		}
		
	};
}