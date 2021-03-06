var ServiceManager = require('../managers/ServiceManager'),
    Message = require('../models/Message'),
    Events = require('../constants/Events');

var MessageHelper = function(){
	var serviceManager = new ServiceManager();
	return{
		handleSpecialMessage : function(messageFromClient, timestamp, callback){
		    	var createdMessage = new Message();
				createdMessage.User = messageFromClient.substring(0,messageFromClient.indexOf(':'));
				createdMessage.Timestamp = timestamp;
				createdMessage.Content = messageFromClient.substring(messageFromClient.indexOf(':'),messageFromClient.length);

				if(messageFromClient.indexOf('/img ') > -1)
				{
					var imageURL =  messageFromClient.substring(messageFromClient.indexOf('/img ') + 5,messageFromClient.length);
					serviceManager.checkImageIntegrity(imageURL, function(code){
						if(code == 200)
						{
							createdMessage.ImageUrl = imageURL;
						}
						else
						{
							createdMessage.ImageUrl = "http://www.yiyinglu.com/wp-content/uploads/2013/11/lifting-a-dreamer-2009.jpg";
						}
						return callback(createdMessage);
					});
				}
				else if(messageFromClient.indexOf('/lights ') > -1)
				{
					var lightCommand =  messageFromClient.substring(messageFromClient.indexOf('/lights ') + 8,messageFromClient.length);
					if(lightCommand.toUpperCase().trim() == "ON" || lightCommand.toUpperCase().trim() == "OFF")
					{
					    var lightSwitchObj = {};
			    		lightSwitchObj.state = lightCommand;
						serviceManager.setLightState(lightCommand);
						createdMessage.Content = "has turned the lights " + lightCommand;

						return callback(createdMessage);
					}
				}
				else
				{
					return callback(createdMessage);
				}
		}
	}
}

module.exports = new MessageHelper;
