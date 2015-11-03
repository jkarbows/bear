//hey isn't this supposed to be a player class...

//for some reason this broke when I added an init() function
//and for some reason moving it here made it work again
var torVelX = 1, torVelY = 1, torSpeed = 2;
function torPhys(){
	torK.position.x += torVelX * torSpeed;
	torK.position.y += torVelY * torSpeed;
	//shitty bounce logic
	if (torK.position.y <= -200){
		torVelY = -torVelY;
	}
	if (torK.position.y >= 200){
		torVelY = -torVelY;
	}
	if (torK.position.x <= -400){
		torVelX = -torVelX;
	}
	if (torK.position.x >= 400){
		torVelX = -torVelX;
	}
	//speed limit
	if (torVelY > torSpeed*2){
		torVelY = torSpeed*2;
	} else if(torVelY < -torSpeed*2){
		torVelY = -torSpeed*2;
	}
};