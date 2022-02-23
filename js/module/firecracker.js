export class Firecracker{
  constructor(stageWidth, stageHeight){
    // this.x = Math.floor(Math.random() * stageWidth); // random ? or 클릭하면 터지게
    this.x = 100;
    this.y = stageHeight;

    this.targetY = 200; // 임의 값
    this.vy = 5; // speed
    this.width = 10;
    this.fireFlow = 8; // 폭죽 갈래
    this.radius = this.width; // 폭죽 범위
    this.radiusGap = 20 // 폭죽 단계 당 거리
    this.level = 0;
    this.maxLevel = 5;

    this.isExplode = false;

    this.targetCentX = this.x + (this.width / 2);
    this.targetCentY = this.targetY + (this.width / 2);
  }

  draw(ctx){
    if(this.y > this.targetY){ // 폭죽 상승
      this.y -= this.vy;
    } else {
      this.explode(ctx);
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.width);
  }
  
  explode(ctx){
    this.radius = this.width;
    const angle = Math.PI * 2 / this.fireFlow;
    for(let i = 0; i < this.level; i++){
      for(let j = 0; j < this.fireFlow; j++){
        const x = (this.radius) * Math.cos(angle * j) + this.x;
        const y = (this.radius) * Math.sin(angle * j) + this.y;

        ctx.fillRect(x, y, this.width, this.width);
      }
      this.radius += this.radiusGap;
    }
    if(!this.isExplode){
      setInterval(()=>{
        this.level = this.level < this.maxLevel ? this.level + 1 : this.maxLevel;
      }, 500);
      this.isExplode = true;
    }
    console.log(this.level, this.maxLevel);
  }
}