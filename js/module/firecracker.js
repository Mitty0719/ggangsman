const COLORS = ['#FFBE33', '#7EDB60', '#1DB8F5', '#C992E0'];
const COLORS_RGBA = [
  {r: 255, g: 190, b: 51, a: 1},
  {r: 126, g: 219, b: 96, a: 0.86},
  {r: 29, g: 184, b: 245, a: 0.96},
  {r: 202, g: 146, b: 224, a: 0.88},
  {r: 255, g: 255, b: 40, a: 0.88},
];
const TYPE = ['basic', 'basic', 'basic', 'smile'];

export class Firecracker{
  constructor(x, stageHeight){
    // this.x = Math.floor(Math.random() * stageWidth); // random ? or 클릭하면 터지게
    this.x = x;
    this.y = stageHeight;

    this.type = TYPE[Math.floor(Math.random() * TYPE.length)];

    this.targetY = Math.floor(Math.random() * 500); // 임의 값
    this.vy = 5; // speed
    this.width = 10;
    this.fireFlow = Math.floor(Math.random() * 6) + 8; // 폭죽 갈래
    this.radius = this.width; // 폭죽 범위
    this.radiusGap = 20 // 폭죽 단계 당 거리
    this.level = 0;
    this.maxLevel = Math.floor(Math.random() * 8) + 3;
    this.color = COLORS_RGBA[Math.floor(Math.random() * COLORS_RGBA.length)];

    this.opacity = 1;
    this.diameter = Math.floor(Math.random() * 30) + 60; // 스마일 원형
    this.width2 = this.width * 2;
    this.width3 = this.width * 3;

    this.isExplode = false;
    this.isFinish = false;
    this.isArrive = false;

    if(this.type === 'basic'){
      this.explode = this.explodeBasic;
    }else if(this.type === 'smile'){
      this.explode = this.explodeSmile;
    }

    this.targetCentX = this.x + (this.width / 2);
    this.targetCentY = this.targetY + (this.width / 2);
  }

  draw(ctx){
    ctx.save();
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a * this.opacity})`;
    this.vy = (this.y - this.targetY) / 20; 
    if(this.y - this.targetY < 3){ // 폭죽 펑
      this.explode(ctx);
      this.isArrive = true;
    } else {
      this.y -= this.vy;
    }

    ctx.fillRect(this.x, this.y, this.width, this.width);
    ctx.restore();
  }
  
  explodeBasic(ctx){
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
      }, 240);
      this.isExplode = true;
    }
  }

  explodeSmile(ctx){
    const angle = Math.PI * 2 / 20;

    for(let j = 0; j < 20; j++){
      const x = (this.diameter) * Math.cos(angle * j) + this.x;
      const y = (this.diameter) * Math.sin(angle * j) + this.y;

      ctx.fillRect(x, y, this.width, this.width);
    }
    // 눈
    ctx.fillRect(this.targetCentX - this.width3, this.targetCentY - this.width2, this.width, this.width2);
    ctx.fillRect(this.targetCentX + this.width2, this.targetCentY - this.width2, this.width, this.width2);

    // 입
    ctx.fillRect(this.targetCentX - this.width2 - this.width, this.targetCentY + this.width2, this.width, this.width);
    ctx.fillRect(this.targetCentX - this.width2, this.targetCentY + this.width3, this.width3 + this.width, this.width);
    ctx.fillRect(this.targetCentX + this.width2, this.targetCentY + this.width2, this.width, this.width);

    if(this.opacity > 0){
      this.opacity -= 0.003;
    }
  }
}