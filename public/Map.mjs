class Map{
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.canvasColor = 'green';

		this.refreshCanvas();
	}

	refreshCanvas() {
		this.ctx.fillStyle = this.canvasColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	renderDrawable(drawable) {
		this.ctx.fillStyle = drawable.getColor();
		this.ctx.fillRect(...drawable.getPositioning());
	}

	render(...objects){
		this.refreshCanvas();
		
		objects.forEach(object => {
			this.renderDrawable(object);
		});

		this.displayRankText(objects[0].calculateRank(objects));
	}

	displayRankText(rank){
		this.ctx.font = "30px Arial";
		this.ctx.fillText(rank, 10, 50);
	}
}

export default Map;