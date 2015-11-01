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
}