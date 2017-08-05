//sfx server object
//construct with, eg:
//var mySfxServer = new SfxServer({crash:'wav/metal_hit.wav', explosion:'wav/pistol.wav'});
function SfxServer(tagsAndFilesObject)
{
	
	this.sfx = {};
	//this.worker;
	this.mute = false;
	
	//Constructor
	
	for(var tag in tagsAndFilesObject)
	{
		try
		{
			this.sfx[tag] = new Audio(tagsAndFilesObject[tag]);
		}
		
		catch(error)
		{
			//alert(error);
		}
		
	}
	
	/*
	this.worker = new Worker('js/sfx_server_worker.js');
	this.worker.onerror = function(e) {  
    alert("Error in file: "+e.filename+"\nline: "+e.lineno+"\nDescription: "+e.message);
    }
    
this.worker.onmessage = function (event) {
  var data = event.data;
	
	switch(data.command)
	{
		case 'log':
			log(data.message);
			break;
	}
};    
    */
    

		
	//----
	
	
	this.setMute = function(mute)
	{
		this.mute = mute;
	}
	
	
	this.play = function(theTag)
	{
		if(this.mute)
		{
			return false;
		}
		
		try
		{	//load() or currentTime = 0  ????
			//this.sfx[theTag].currentTime = 0;
			this.sfx[theTag].load();
			this.sfx[theTag].play();
		}
		
		catch(error)
		{
			//alert(error);
			return false;
		}
		
		return true;
		
		//this.worker.postMessage({command:'play', tag:theTag});
		
	}
}
