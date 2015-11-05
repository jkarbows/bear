/*
 *	"world generator"
 *	we'll start with basic noise, then improve
 *	hope and pray for a single mountain surrounded by a forest
 *	need cave generator for inside the mountain
 */
var plane, planeGeo;

function generateWorld(){
	//create the playing surface plane(width,height,segments,segments)
	planeGeo = new THREE.PlaneGeometry( 10000, 10000, 99, 99  );
	//geometry.rotateX( - Math.PI / 2 );
	var vertices = [];

	for ( var i = 0, l = planeGeo.vertices.length; i < l; i ++ ) {

		planeGeo.vertices[ i ].z = 35 * Math.sin( i / 2 );
		vertices[i] = planeGeo.vertices[ i ].z;
		//hV.set(Math.floor(i/10),Math.floor(i%10),planeGeo.vertices[i].z);
	}

	/*var texture = THREE.ImageUtils.loadTexture( "textures/water.jpg" );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 5 );*/

	planeMat = new THREE.MeshPhongMaterial( { color: 0x0044ff, shading: THREE.FlatShading} );
	plane = new THREE.Mesh(planeGeo, planeMat);
	//plane.receiveShadow = true;
	scene.add(plane);
	
	//add "trees"
	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	geometry.rotateX( Math.PI / 2 );
	
	var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	//var cast = new THREE.Raycaster();
	//cast.far = 500;
	
	for(var i = 0; i < 500; i ++){
		var mesh = new THREE.Mesh(geometry, material),
		plx = (Math.random()-0.5) * 1000, ply = (Math.random()-0.5) * 1000;
		var ind = (Math.floor(ply)*10)+Math.floor(plx);

		mesh.position.x = plx;
		mesh.position.y = ply;
		//cast.set(new THREE.Vector3(plx,ply,35),new THREE.Vector3(0,0,-1));
		//var intersect = cast.intersectObject(plane);
		mesh.position.z = vertices[ind];//(Math.random()-0.5) * 50;
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = false;
		scene.add(mesh);

	}
}

function generateHeight(width,height){
	var size = width*height, data = new Uint8Array(size),
	perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

	for ( var j = 0; j < 4; j ++ ) {
		for ( var i = 0; i < size; i ++ ) {
			var x = i % width, y = ~~ ( i / width );
			data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

		}
		quality *= 5;
	}

	return data;

}

/*function initBirds() {
	var geometry = new THREE.BirdGeometry();

	// For Vertex and Fragment
	birdUniforms = {
		color: { type: "c", value: new THREE.Color( 0xff2200 ) },
		texturePosition: { type: "t", value: null },
		textureVelocity: { type: "t", value: null },
		time: { type: "f", value: 1.0 },
		delta: { type: "f", value: 0.0 }
	};

	// ShaderMaterial
	var material = new THREE.ShaderMaterial( {
		uniforms:       birdUniforms,
		vertexShader:   document.getElementById( 'birdVS' ).textContent,
		fragmentShader: document.getElementById( 'birdFS' ).textContent,
		side: THREE.DoubleSide

	});

	birdMesh = new THREE.Mesh( geometry, material );
	birdMesh.rotation.y = Math.PI / 2;
	birdMesh.matrixAutoUpdate = false;
	birdMesh.updateMatrix();

	scene.add(birdMesh);
}

var hash = document.location.hash.substr( 1 );
if (hash) hash = parseInt(hash, 0);

// TEXTURE WIDTH FOR SIMULATION 
var birdWidth = hash || 32;

var BIRDS = birdWidth * birdWidth;

// Custom Geometry - using 3 triangles each. No UVs, no normals currently.
THREE.BirdGeometry = function () {

	var triangles = BIRDS * 3;
	var points = triangles * 3;

	THREE.BufferGeometry.call( this );

	var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
	var birdColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
	var references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
	var birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );

	this.addAttribute( 'position', vertices );
	this.addAttribute( 'birdColor', birdColors );
	this.addAttribute( 'reference', references );
	this.addAttribute( 'birdVertex', birdVertex );

	// this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );


	var v = 0;

	function verts_push() {
		for (var i=0; i < arguments.length; i++) {
			vertices.array[v++] = arguments[i];
		}
	}

	var wingsSpan = 20;

	for (var f = 0; f<BIRDS; f++ ) {

		// Body
		verts_push(
			0, -0, -20,
			0, 4, -20,
			0, 0, 30
		);

		// Left Wing
		verts_push(
			0, 0, -15,
			-wingsSpan, 0, 0,
			0, 0, 15
		);

		// Right Wing
		verts_push(
			0, 0, 15,
			wingsSpan, 0, 0,
			0, 0, -15
		);

	}

	for( var v = 0; v < triangles * 3; v++ ) {

		var i = ~~(v / 3);
		var x = (i % birdWidth) / birdWidth;
		var y = ~~(i / birdWidth) / birdWidth;

		var c = new THREE.Color(
			0x444444 +
			~~(v / 9) / BIRDS * 0x666666
		);

		birdColors.array[ v * 3 + 0 ] = c.r;
		birdColors.array[ v * 3 + 1 ] = c.g;
		birdColors.array[ v * 3 + 2 ] = c.b;

		references.array[ v * 2     ] = x;
		references.array[ v * 2 + 1 ] = y;

		birdVertex.array[ v         ] = v % 9;

	}

	this.scale( 0.2, 0.2, 0.2 );

};

THREE.BirdGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );*/


//texture generation function from webgl geometry terrain generation example
function generateTexture( data, width, height ) {

var canvas, canvasScaled, context, image, imageData,
level, diff, vector3, sun, shade;

vector3 = new THREE.Vector3( 0, 0, 0 );

sun = new THREE.Vector3( 1, 1, 1 );
sun.normalize();

canvas = document.createElement( 'canvas' );
canvas.width = width;
canvas.height = height;

context = canvas.getContext( '2d' );
context.fillStyle = '#000';
context.fillRect( 0, 0, width, height );

image = context.getImageData( 0, 0, canvas.width, canvas.height );
imageData = image.data;

for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

	vector3.x = data[ j - 2 ] - data[ j + 2 ];
	vector3.y = 2;
	vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
	vector3.normalize();

	shade = vector3.dot( sun );

	imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
	imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
	imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
}

context.putImageData( image, 0, 0 );

// Scaled 4x

canvasScaled = document.createElement( 'canvas' );
canvasScaled.width = width * 4;
canvasScaled.height = height * 4;

context = canvasScaled.getContext( '2d' );
context.scale( 4, 4 );
context.drawImage( canvas, 0, 0 );

image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
imageData = image.data;

for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

	var v = ~~ ( Math.random() * 5 );

	imageData[ i ] += v;
	imageData[ i + 1 ] += v;
	imageData[ i + 2 ] += v;

}

context.putImageData( image, 0, 0 );

return canvasScaled;

}