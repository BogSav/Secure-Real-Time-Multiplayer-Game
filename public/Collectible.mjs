import {collectibleSettings} from './game-config.mjs'

class Collectible {
  static height;
  static width;
  static color;

  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;

    this.value = value;

    this.id = id;
  }

  getColor(){
    return Collectible.color;
  }

  getPositioning(){
    return [this.x, this.y, Collectible.width, Collectible.height];
  }

  refreshPosition(getRandInt, canvas, ...players){
    do{
      this.x = getRandInt(Collectible.width, canvas.width - Collectible.width);
      this.y = getRandInt(Collectible.height, canvas.height - Collectible.height);
    }while(players.some(player => player.collision(this)))
  }
}

Collectible.width = collectibleSettings.collectibleWidth;
Collectible.height = collectibleSettings.collectibleHeight;
Collectible.color = collectibleSettings.collectibleColor;

try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
