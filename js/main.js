var globalGame;

//jQuery onload-alike
//$(function(){prepareJRobots();});
window.onload = function(){prepareJRobots()};

//once per page load
function prepareJRobots()
{
	makeLookupTables();
	
	globalGame = new Game(new Arena('arena'));
	
	globalGame.displayBlurb();	//put game instructions on initial empty canvas
}
