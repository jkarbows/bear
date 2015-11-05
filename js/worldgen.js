/*
 *	"world generator"
 *	we'll start with basic noise, then improve
 *	hope and pray for a single mountain surrounded by a forest
 *	need cave generator for inside the mountain
 */

function generateWorld(){
	//create the playing surface plane(width,height,segments,segments)
	var height = 1000, width = 1000;
	var planeGeo = new THREE.PlaneGeometry(height,width,100,100);
	planeGeo.dynamic=true;
	
	data = generateHeight(height,width);
	
	var vertices = planeGeo.vertices;
	for(var i=0, j=0, l=vertices.length;  i<l; i++, j+=3){
		vertices[j+1]=data[i]*10;
	}
	
	var planeMat = new THREE.MeshLambertMaterial( { color: 0x4BD121 });
	var plane = new THREE.Mesh(generateHeight(planeGeo), planeMat);
	//plane.receiveShadow = true;
	scene.add(plane);
	//plane.position.z = -5;
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