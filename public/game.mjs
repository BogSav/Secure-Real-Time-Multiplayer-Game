import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import Map from  './Map.mjs'

import {gameSettings} from './game-config.mjs'

const getRandInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

document.addEventListener('DOMContentLoaded', () => {

	const socket = io();
	let enemyPlayers = [];
	let direction;
	let player;
	let collectible = null;

	socket.on('connect_error', err => {
		console.log(err.message);
		console.log(err.data);
	});

	socket.on('testare', data => {
		console.log("testare");
	})

	socket.on('new_enemy', data => {
		enemyPlayers.push(new Player({
				x : data.x,
				y : data.y,
				score : data.score,
				id : data.id,
				enemy: true
			})
		)
	});

	var canvas = document.getElementById('game-window');
	canvas.width = gameSettings.canvasWidth;
	canvas.height = gameSettings.canvasHeight;

	let map = new Map(canvas);

	(async () => {
		player = new Player({
			x : getRandInt(Player.width, canvas.width - Player.width), 
			y : getRandInt(Player.height, canvas.height - Player.height),
			score : 0,
			enemy : false
		});

		socket.on('connect', () => {
			player.id = socket.id;

			socket.emit('new_player', {
				x : player.x,
				y : player.y,
				score : player.score,
				id : player.id
			});
		})

		await new Promise(resolve => {
			socket.on('game_state', data => {
				collectible = new Collectible(data.collectible);
				data.players.forEach(player => {
					if(player != null)
						enemyPlayers.push(new Player({
								x : player.x,
								y : player.y,
								score : player.score,
								id : player.id,
								enemy : true
							})
						)
				});
				resolve();
			});
		});

		socket.on('update_collectible_position', data => {
			collectible.y = data.y;
			collectible.x = data.x;
		});

		socket.on('update_player_location', data => {
			enemyPlayers.forEach(enemy => {
				if(enemy.id == data.id)
				{
					enemy.x = data.x;
					enemy.y = data.y;
					enemy.score = data.score;
				}
			});
		});

		socket.on('enemy_gone', data => {
			console.log("A player has connected: " + data.id);
			enemyPlayers = enemyPlayers.filter(enemy => enemy.id != data.id);
		});

		map.render(player, collectible, ...enemyPlayers);

		while(true){
			await new Promise(resolve => setTimeout(resolve, gameSettings.deltaTime));

			if(player.isMoving == true)
			{
				player.movePlayer(direction, gameSettings.playerSpeed);
				player.clampPosition(canvas);

				socket.emit('player_new_location', {x : player.x, y : player.y, id : player.id, score : player.score});

				if(player.collision(collectible))
				{
					collectible.refreshPosition(getRandInt, canvas, player);
					player.score += collectible.value;
					socket.emit('collectible_new_location', {x : collectible.x, y : collectible.y});
				}
			}

			map.render(player, collectible, ...enemyPlayers);
		}
	})();

	document.addEventListener('keydown', e => {
		player.isMoving = true;
		direction = e.code;
	});

	document.addEventListener('keyup', e => {
		player.isMoving = false;
	});
})
