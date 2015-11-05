/**
 *	flight controls
 *	adapted from Three.js FlyControls.js example by James Baicoianu
 *  mad props to him forever for helping me out with this on IRC^^^
 */
var mouse = new THREE.Vector2();
var ray = new THREE.Raycaster(new THREE.Vector3(),new THREE.Vector3(),1,16);

controls = function(object, domElement){
	this.object = object;
		
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if (domElement) this.domElement.setAttribute( 'tabindex', - 1 );
	
	this.movementSpeed = 1.0;
	this.rollSpeed = 1.0;
	
	this.dragToLook = false;
	this.autoForward = false;
	
	this.tmpQuaternion = new THREE.Quaternion();
	
	this.mouseStatus = 0;
	
	this.moveState = { up: 0, down: 0,
		left: 0, right: 0,
		forward: 0, back: 0,
		pitchUp: 0, pitchDown: 0,
		yawLeft: 0, yawRight: 0,
		rollLeft: 0, rollRight: 0
		};
	this.moveVector = new THREE.Vector3(0,0,0);
	this.rotationVector = new THREE.Vector3(0,0,0);
	
	this.handleEvent = function(event){
		if (typeof this[event.type]=='function'){
			this[event.type](event);
		}
	};
	
	this.keydown = function(event){
		if(event.altKey){
			return;
		}
		
		switch(event.keyCode){
		
			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

			case 87: /*W*/ this.moveState.forward = 1; break;
			case 83: /*S*/ this.moveState.back = 1; break;

			case 65: /*A*/ this.moveState.left = 1; break;
			case 68: /*D*/ this.moveState.right = 1; break;

			case 82: /*R*/ this.moveState.up = 1; break;
			case 70: /*F*/ this.moveState.down = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 1; break;
			case 40: /*down*/ this.moveState.pitchDown = 1; break;

			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;
			
		}
		this.updateMovementVector();
		this.updateRotationVector();
	};
	
	this.keyup = function(event){
		switch(event.keyCode){
		
			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			case 87: /*W*/ this.moveState.forward = 0; break;
			case 83: /*S*/ this.moveState.back = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 82: /*R*/ this.moveState.up = 0; break;
			case 70: /*F*/ this.moveState.down = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			case 69: /*E*/ this.moveState.rollRight = 0; break;

		}
		this.updateMovementVector();
		this.updateRotationVector();
	};
	
	this.mousedown = function(event){
		if(this.domElement!==document){
			this.domElement.focus();
			mouse.x = (event.pageX);
			mouse.y = (event.pageY);
		}
		
		event.preventDefault();
		event.stopPropagation();
		
		if(this.dragToLook){
			this.mouseStatus++;
		} else {
			switch(event.button){
				case 0: this.moveState.forward = 1; break;
				case 2: this.moveState.back = 1; break;
			}
			this.updateMovementVector();
			this.updateRotationVector();
		}
		
		click(mouse.x,mouse.y);
	};
	
	this.mousemove = function(event){
		//I have no idea why you do this. Something about normalized coordinates(between -1 and 1)
		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		
		raycaster.setFromCamera(mouse,camera);
		var intersects = raycaster.intersectObject(plane);
		if(intersects.length>0){
			cursor.position.set(0,0,0);
			cursor.lookAt(intersects[0].face.normal);
			cursor.position.copy(intersects[0].point);
		}
		//console.log("mouse: ("+mouse.x+","+mouse.y+")");
	};
	
	this.mouseup = function(event){
		event.preventDefault();
		event.stopPropagation();
		
		if(this.dragToLook){
			this.mouseStatus--;
			this.moveState.yawLeft=this.moveState.pitchDown=0;
		} else {
			switch(event.button){
				case 0: this.moveState.forward = 0; break;
				case 2: this.moveState.back = 0; break;
			}
		
			this.updateMovementVector();
		}
		
		this.updateRotationVector();
	};
	
	this.update = function(delta){
		var moveMult = delta*this.movementSpeed;
		var rotMult = delta*this.rollSpeed;
		
		this.object.translateX(this.moveVector.x*moveMult);
		this.object.translateY(this.moveVector.y*moveMult);
		this.object.translateZ(this.moveVector.z*moveMult);
		
		//calculate whether player height is above the average of nearest points
		//very rought, only works in one quadrant because I forgot negative numbers exist
		//wait that should be really east to fix
		var indX = Math.floor(this.object.position.x);
		var indY = Math.floor(this.object.position.y);
		var ind  = (indY*10)+(indX-1);
		var badAvg = (planeGeo.vertices[ind].z +planeGeo.vertices[ind+1].z+
			planeGeo.vertices[ind+10].z+planeGeo.vertices[ind+11].z)/4;
		
		if(this.object.position.z <= badAvg){
			this.object.position.z = badAvg + 1;
		}
		
		this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
		this.object.quaternion.multiply(this.tmpQuaternion);
		
		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
	};
	
	this.updateMovementVector = function(){
		var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = (-this.moveState.left + this.moveState.right )*4.20;
		this.moveVector.y = (-this.moveState.down + this.moveState.up );
		this.moveVector.z = (-forward + this.moveState.back );
		
		/*var originPoint = frame.position.clone();
	
		for (var vertexIndex = 0; vertexIndex < frame.geometry.vertices.length; vertexIndex++)
		{		
			var localVertex = frame.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( frame.matrix );
			var directionVector = globalVertex.sub( frame.position );
			
			ray.set( originPoint, directionVector.clone().normalize());
			//var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObject( plane );
			if ( collisionResults.length > 0 /*&& collisionResults[0].distance < directionVector.length() ){ 
				this.moveVector.addVectors(this.moveVector,-directionVector.clone().normalize());
				console.log("something");
			}
		}*/
		
		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
	};
	
	this.updateRotationVector = function() {
		this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = (-this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
	};
	
	function bind(scope, fn){
		return function(){
			fn.apply(scope, arguments);
		};
	};
	
	function contextmenu(event){
		event.preventDefault();
	};
	
	this.dispose = function() {
		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _mousedown, false );
		this.domElement.removeEventListener( 'mousemove', _mousemove, false );
		this.domElement.removeEventListener( 'mouseup', _mouseup, false );

		window.removeEventListener( 'keydown', _keydown, false );
		window.removeEventListener( 'keyup', _keyup, false );
	};

	var _mousemove = bind(this, this.mousemove);
	var _mousedown = bind(this, this.mousedown);
	var _mouseup = bind(this, this.mouseup);
	var _keydown = bind(this, this.keydown);
	var _keyup = bind(this, this.keyup);

	this.domElement.addEventListener('contextmenu', contextmenu, false);

	this.domElement.addEventListener('mousemove', _mousemove, false);
	this.domElement.addEventListener('mousedown', _mousedown, false);
	this.domElement.addEventListener('mouseup',   _mouseup, false);

	window.addEventListener('keydown', _keydown, false);
	window.addEventListener('keyup',   _keyup, false);

	this.updateMovementVector();
	this.updateRotationVector();
};
	