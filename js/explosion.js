//Explosion object
function Explosion(explosionId, x, y)
{
	//Properties
	this.x;
	this.y;
	
	this.size = 63;
	this.offset = 31;	//To centre of size
	
	this.color = 'orange';	
	
	this.finished = false;
	this.id;
	this.damage = 10;
	
	//??
	this.countDown = 10;
	this.fadeRate = 1;
	
	
	
	
	
	this.update = function()
	{
		if(this.finished)return;
		
		//alert(this.fadeRate);
		
		//this.countDown--;
		////this.size = this.size - this.fadeRate;
		//this.offset = this.offset - this.fadeRate;	//Is it OK for coldet to change the offset onl y and not also the size???
		//this.damage--;
		
		colDetExplosion(this);	//a global function (eek!) in maths.js
		this.finished = true;
		
		
		
			
		
		//if(this.countDown == 0)
		//{
		//	this.finished = true;
		//}
	};
	
	this.draw = function(context)	//context is an HTML5 2d context
	{
				
		globalGame._sfx.play('explosion');
		
		//canvas circle methods take CENTRE of circle as a parm so no need to offset if drawing as a circle
		
		//AS SQUARE
		//context.fillStyle = this.color;
		//context.fillRect((this.x - this.offset), (this.y - this.offset), this.size, this.size);
		
		//AS CIRCLE
		//context.fillStyle = this.color;
	//make explosions go "over" robots
	context.globalCompositeOperation = 'lighter';	//'xor' or 'lighter'
		var radGrad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.offset);
		radGrad.addColorStop(0, 'red');
		radGrad.addColorStop(0.5, 'orange');
		radGrad.addColorStop(1, 'yellow');
		context.fillStyle = radGrad;
		context.beginPath();
		context.arc(this.x, this.y, this.offset, 0, 2 * Math.PI);
		context.fill();
		
	};
	
	//Constructor
	
		this.x = x;
		this.y = y;
		
		this.id = explosionId;
		
		
	//----
}