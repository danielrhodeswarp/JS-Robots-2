//
function playButton()
{
	globalGame.play();
}

//
function stopButton()
{
	globalGame.stop();
}

//
function pauseButton()
{
	globalGame.togglePause();
}

//
function restartButton()
{
	globalGame.stop();
	globalGame.play();
	
	var button = document.getElementById('play_and_pause_button');
	var buttonImage = document.getElementById('play_and_pause_button_img');
	
	//set play/pause button for pause
		button.pressedAtLeastOnce = true;	//fudge for if game is started initially with the REstart button!
	buttonImage.src = 'img/icon/control_pause_blue.png';
	buttonImage.alt = 'Pause';
	button.title = 'Pause';
	button.gamePlaying = true;
}

//
function playAndPauseButton()
{
	var button = document.getElementById('play_and_pause_button');
	var buttonImage = document.getElementById('play_and_pause_button_img');
	
	if(!button.pressedAtLeastOnce)
	{
		button.pressedAtLeastOnce = true;
		button.gamePlaying = true;
		
		globalGame.play();
	}
	
	else
	{
		
		globalGame.togglePause();
		
		
		
		button.gamePlaying = !button.gamePlaying;
	}
	
	//change gfx, title and alt of button
	if(button.gamePlaying)
	{
		buttonImage.src = 'img/icon/control_pause_blue.png';
		buttonImage.alt = 'Pause';
		button.title = 'Pause';
	}
	else
	{
		buttonImage.src = 'img/icon/control_play_blue.png';
		buttonImage.alt = 'Resume';
		button.title = 'Resume';
	}
}

//
function toggleSfx()
{
	globalGame.toggleMute();
	
	var mute = globalGame.getMute();
	
	var button = document.getElementById('sound_button');
	var buttonImage = document.getElementById('sound_button_img');
	
	if(mute)
	{
		buttonImage.src = 'img/icon/sound.png';
		buttonImage.alt = 'Unmute';
		button.title = 'Unmute';
	}
	
	else
	{
		buttonImage.src = 'img/icon/sound_mute.png';
		buttonImage.alt = 'Mute';
		button.title = 'Mute';
	}
}

//
function toggleLogDisplay()
{
	var console = document.getElementById('console');
	
	if(console.style.display == 'none')
	{
		console.style.display = 'block';
	}
	
	else if(console.style.display == 'block')
	{
		console.style.display = 'none';
	}
}

//Load player script on <select>'s onchange
function setPlayer(number, programName)
{
	document.getElementById('player_' + number + '_program_source').value = document.getElementById(programName).value;
}

//
function catchTab(e)
{
	var key = null;
	
	if(window.event) key = event.keyCode;
	else if(e.which) key = e.which;
	
	//key = window.event.keyCode || event.which;
	
	if(key != null && key == 9)	//Tab = 9
	{
		//IE and Opera
		if(document.selection)
		{
			this.focus();
			var sel = document.selection.createRange();
			sel.text = '\t';
		}
		
		//Mozilla + Netscape
		else if(this.selectionStart || this.selectionStart == "0")
		{
			var start = this.selectionStart;
			var end = this.selectionEnd;
			this.value = this.value.substring(0,start) + '\t' + this.value.substring(end,this.value.length);
			this.selectionStart = this.selectionEnd = start + 1;	//move cursor to AFTER just inserted tab
		}
		
		else this.value += '\t';	//Last resort, simply append tab to end of text
		
		return false;	//IMPORTANT! Kill the actual tabbing event
	}
}
