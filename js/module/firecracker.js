export class Firecracker{
  constructor(stageWidth, stageHeight){
    this.x = Math.floor(Math.random() * stageWidth); // random ? or 클릭하면 터지게
    this.y = stageHeight;

    this.targetY = 200; // 임의 값
    this.vy = 10; // speed
  }

  draw(ctx){
    if(this.y > this.targetY){ // 폭죽 상승
      this.y -= this.vy;
    } else {

    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, 5, 5);
  }
}