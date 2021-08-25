import {playerSettings} from './game-config.mjs'

class Player {
  static width;
  static height;

  constructor({x, y, score, id, enemy = false}) {
    this.x = x;
    this.y = y;

    this.color = enemy == true ? playerSettings.playerEnemyColor : playerSettings.playerColor;

    this.score = score;

    this.id = id;

    this.isMoving = false;
  }

  movePlayer(dir, speed) {
    switch(dir)
    {
      case 'right':
      case 'ArrowRight':
        this.x += speed;
        break;
      case 'left':
      case 'ArrowLeft':
        this.x -= speed;
        break;
      case 'ArrowUp':
        this.y -= speed;
        break;
      case 'ArrowDown':
        this.y += speed;
        break;
      default:
        console.log("wrong key bossule" + dir)
        break;
    }
  }

  clampPosition(canvas) {
    if(this.x < 0)
      this.x = 0;
    if(this.y < 0)
      this.y = 0;
    if(this.x + Player.width > canvas.width)
      this.x = canvas.width - Player.width;
    if(this.y + Player.height > canvas.height)
      this.y = canvas.height - Player.height;
  }

  getColor() {
    return this.color;
  }

  collision(item) {
    let position = item.getPositioning();

    return (this.y < position[1] + position[3] &&
      this.y + Player.height > position[1] &&
      this.x < position[0] + position[2] &&
      this.x + Player.width > position[0]
      ) 
  }

  calculateRank(arrr) {
    let arr = arrr.filter(obj => obj instanceof Player);
    let length = arr.length;
    let position = length;

    arr.forEach(player => {
      if(this.score > player.score)
        position--;
    });

    return 'Rank: ' + position + '/' + length;
  }

  getPositioning(){
    return [this.x, this.y, Player.width, Player.height];
  }
}

Player.width = playerSettings.playerWidth;
Player.height = playerSettings.playerHeight;

export default Player;
