
self.addEventListener('message', function(e)
{
	var data = e.data;
	
	switch(data.command)
	{
		case 'play':
			//log('request to PLAY the sfx of ' . data.tag);
			self.postMessage({command:'log', message:'request to PLAY the sfx of ' + data.tag});
			
			break;
		
		case 'passandplay':
			//log('request to PLAY the sfx of ' . data.tag);
			self.postMessage({command:'log', message:'request to PLAY the Audio object of ' + data.audio});
			//play(data.tag);
			break;
		
		case 'start':
			self.postMessage('WORKER STARTED: ' + data.msg);
			break;
			
		case 'stop':
			self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
			self.close(); // Terminates the worker.
			break;
		
		default:
			self.postMessage('Unknown command: ' + data.msg);
  };
}, false);




var finished = false;

//while(!finished)
//{
//	
//}
