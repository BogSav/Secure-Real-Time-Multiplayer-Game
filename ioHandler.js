module.exports = function(io) {

  let players = [];

  let collectible = {
    x : 20,
    y : 20,
    value : 1,
    id : 'merge'
  };

  io.on('connect_error', (err) => {
    console.log(err.message);
  });
  
  io.on('connection', (socket) => {
    console.log('A user has connected: ' + socket.id);

    socket.on('new_player', data => {

      players.push({playerData : data, socket : socket});

      players.forEach(player => {
        if(player.socket.id != socket.id)
          player.socket.emit('new_enemy', data);
      });

      socket.emit('game_state', {
        "players" : players.map(player => {
          if(player.socket.id != socket.id) 
            return player.playerData;
        }),
        "collectible" : collectible
      });
    });

    socket.on('player_new_location', data => {
      players.forEach(player => {
        player.socket.emit('update_player_location', data);
      });
    });

    socket.on('collectible_new_location', data => {
      collectible.x = data.x;
      collectible.y = data.y;

      players.forEach(player => {
        player.socket.emit('update_collectible_position', collectible);
      });
    });

    socket.on('disconnect', () => {
      console.log('A user has disconnected: ' + socket.id);

      players = players.filter(player => player.socket.id != socket.id);

      players.forEach(player => {
        player.socket.emit('enemy_gone', {id : socket.id});
      }); 
    });

  });
}