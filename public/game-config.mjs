let gameSettings = 
{
	"canvasHeight" : 480,
	"canvasWidth" : 640,

	"deltaTime" : 10, //Time between frames
	//10 offers around 100FPS
	//5 offers 200-140FPS
	"playerSpeed" : 10 //Px per frame
}

let playerSettings = 
{
	"playerWidth" : 40,
	"playerHeight" : 40,

	"playerColor" : 'blue',
	"playerEnemyColor" : 'red'
}

let collectibleSettings = 
{
	"collectibleWidth" : 20,
	"collectibleHeight" : 20,

	"collectibleColor" : 'white'
}

export { gameSettings, playerSettings, collectibleSettings };