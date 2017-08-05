//var globalNick;

/*
function sendScriptToPastebucketReaction(responseJson)
{
	eval('var pastebucket = ' + responseJson);
		
	//alert(pastebucket.response.URL);
	//alert(pastebucket.response.OK);
	
	//pastebucket api can sometimes *not* return us a piece of JSON
	//(eg. if data parm is an empty string) which means that the above eval
	//doesn't give us what we expect (and pastebucket var becomes null)
	//so we need this additional check which is annoying...
	if(!pastebucket.response)
	{
		alert('Oops. PasteBucket failed this time. Never mind.');
		return;
	}
	
	if(pastebucket.response.OK)
	{
		a.jax({action:'sendPastebucketLinkToTwitter', method:'POST', format:'text', reaction:sendPastebucketLinkToTwitterReaction, url:pastebucket.response.URL, nickname:globalNick});
	}
	
	else
	{
		alert('Oops. PasteBucket said: "' + pastebucket.response.ErrorMessage + '"');
	}
}
*/

//send score to twitter (if they enter a nickname)
//publish script to pastebucket.com and tweet link to this (if they agree)
function doScoring(robotId, robotName, winTimeInMs)
{
	//alert('Congratulations ' + robotName + '!\nYou won in ' + winTimeInMs + 'ms!');
	

	/*
	//Twitter sending for actual live version at jsrobots.com
	
	var nick = prompt('Congratulations ' + robotName + '!\nYou won in ' + winTimeInMs + 'ms!\nEnter your nickname for the Twitter hall of fame:\n(twitter.com/jsrobots)');
	
	if(!nick || nick == '')
	{
		//Nothing (proper) entered OR dialogue cancelled
	}
	
	else
	{
		var scriptPreset = document.getElementById(robotId + '_program').options[document.getElementById(robotId + '_program').selectedIndex].innerHTML;
		
		var defeatedThing = getDefeatedThingString(getCheckedRobotsExcluding(robotId));
		
		a.jax({action:'sendScoreToTwitter', method:'POST', format:'text', reaction:sendScoreToTwitterReaction, nickname:nick, script_preset:scriptPreset, defeated_thing:defeatedThing, time:winTimeInMs});
		
	}
	*/
	
	/*
	var paste = confirm('Do you also want to publish your winning script on PasteBucket (for a month) and tweet a public link to it?');
	
	if(paste)
	{
		globalNick = nick || 'Some player';	//nick could be empty here
		var theTitle = globalNick + "'s winning script on jsrobots.com";
		
		var theData = document.getElementById(robotId + '_program_source').value;
		
		a.jax({action:'sendscripttopastebucket', method:'POST', format:'json', reaction:sendScriptToPastebucketReaction, title:theTitle, data:theData});
	}
	*/
	
}

function getDefeatedThingString(robotIds)	//an array
{
	if(robotIds.length == 1)	//Only one opponent (so specify script type)
	{
		var scriptPreset = document.getElementById(robotIds[0] + '_program').options[document.getElementById(robotIds[0] + '_program').selectedIndex].innerHTML;
		if(scriptPreset == 'blank')	//Applicable for human players only
		{
			scriptPreset = 'original script';
		}
		
		if(robotIds[0].charAt(0) == 'c')	//CPU
		{
			return 'the CPU\'s' + String.fromCharCode(32) + scriptPreset;	//Crunch-safe space!
		}
		
		else	//Player
		{
			return robotIds[0].replace('_', ' ') + '\'s' + String.fromCharCode(32) + scriptPreset;	//Crunch-safe space!
		}
	}
	
	else	//Multiple opponents (give number of opponents)
	{
		return robotIds.length + String.fromCharCode(32) + 'opponents';	//Crunch-safe space!
	}
}

function getCheckedRobotsExcluding(winningRobotId)	//winner is only ever a human player
{
	var robotIds = [];
	
	for(var loop = 1; loop < 5; loop++)
	{
		if(document.getElementById('player_' + loop + '_on').checked)
		{
			if('player_' + loop != winningRobotId)
			{
				robotIds.push('player_' + loop);
			}
		}
		
		if(document.getElementById('cpu_' + loop + '_on').checked)
		{
			robotIds.push('cpu_' + loop);
		}
	}
	
	return robotIds;
}

function sendScoreToTwitterReaction(responseText)
{
	//NOP
}

function sendPastebucketLinkToTwitterReaction(responseText)
{
	//NOP
}