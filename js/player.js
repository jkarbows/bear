var playerSpeed = 4; playerVelY = 0; playerVelX = 0; free = true;

function playerMovement() {
	if (Key.isDown(Key.A)){
		if(free){
			playerVelY = playerSpeed * 0.5;
		} else {
			playerVelY = 0;
			pulseBox.scale.z += (10 - pulseBox.scale.z) * 0.2;
		}
	}
	else if(Key.isDown(Key.D)){
		if(free){
			playerVelY = -playerSpeed * 0.5;
		} else {
			playerVelY = 0;
			pulseBox.scale.z += (10 - pulseBox.scale.z) * 0.2;
		}
	}
	else{
		playerVelY = 0;
	}
	
	if (Key.isDown(Key.W)){
		if(free){
			playerVelX = playerSpeed * 0.5;
		} else {
			playerVelX = 0;
			pulseBox.scale.x += (10-pulseBox.scale.y) * 0.2;
		}
	}
	else if(Key.isDown(Key.S)){
		if(free){
			playerVelX = -playerSpeed * 0.5;
		} else {
			player.scale.x += (10-player.scale.x) * 0.2;
		}
	}
	//I kind of enjoy the lack of a stop ww
	
	pulseBox.position.y += playerVelY;
	pulseBox.position.x += playerVelX;
};


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