export class Firecracker{
  constructor(x, stageHeight){
    // this.x = Math.floor(Math.random() * stageWidth); // random ? or 클릭하면 터지게
    this.x = x;
    this.y = stageHeight;

    this.targetY = Math.floor(Math.random() * 500); // 임의 값
    this.vy = 5; // speed
    this.width = 10;
    this.fireFlow = Math.floor(Math.random() * 6) + 8; // 폭죽 갈래
    this.radius = this.width; // 폭죽 범위
    this.radiusGap = 20 // 폭죽 단계 당 거리
    this.level = 0;
    this.maxLevel = Math.floor(Math.random() * 8) + 3;

    this.isExplode = false;
    this.isFinish = false;

    this.targetCentX = this.x + (this.width / 2);
    this.targetCentY = this.targetY + (this.width / 2);
  }

  draw(ctx){
    this.vy = (this.y - this.targetY) / 20; 
    if(this.y - this.targetY < 3){ // 폭죽 펑
      this.explode(ctx);
    } else {
      this.y -= this.vy;
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
        if(this.level < this.maxLevel && !this.isFinish){
          this.level++;
        }else{
          this.level--;
          this.isFinish = true;
        }
      }, 300);
      this.isExplode = true;
    }
  }
}