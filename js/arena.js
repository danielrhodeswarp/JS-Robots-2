//Arena object
function Arena(canvasElementId)	//HTML5 canvas element ID
{
	//Properties
	this.canvasElementId = canvasElementId;
	this.element = document.getElementById(this.canvasElementId);
	
	
		this.context = this.element.getContext('2d');
		//this.context.font = '14px monospace';	//moved to Game::reset()
	
	this.wallDamage = 2;
	
	//Constructor
	
	//
	this.width = this.element.getAttribute('width');
	this.height = this.element.getAttribute('height');
	
	
	
	
	//----
	
	//Methods
	
	function resetFontSize()
	{
	}
}