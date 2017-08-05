//
function makeOneLine(stringy)
{
	var noSingleLineComments = stringy.replace(/[/][/].*/g, '');
	
	var oneLine = noSingleLineComments.replace(/(\n|\r)/g, '');
	
	return oneLine;
}

//VERY useful for debugging your robot scripts! or indeed the game logic itself!
function log(message)
{
	var p = document.createElement('p');
	p.innerHTML = message;
	p.style.margin = 0;
	
	document.getElementById('console').appendChild(p);
}

//from http://javascriptisawesome.blogspot.co.uk/2011/11/setinterval-with-context.html
setIntervalWithContext = function(code, delay, context)
{
	return setInterval(function(){code.call(context);}, delay);
}

//from http://javascriptisawesome.blogspot.co.uk/2011/11/setinterval-with-context.html
setTimeoutWithContext = function(code, delay, context)
{
	return setTimeout(function(){code.call(context);}, delay)
}
