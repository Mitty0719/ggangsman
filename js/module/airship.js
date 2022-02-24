import { getRandomSign } from "../util.js";

const SMOKE_COLOR = [
  {r: 255, g: 255, b: 255, a: 0.5},
  {r: 255, g: 0, b: 0, a: 0.5},
  {r: 200, g: 200, b: 200, a: 0.5},
  {r: 50, g: 50, b: 50, a: 0.5},
];

const AIRSHIP_INFO = [
  {src: '/src/images/airship1.png', direction: 1, y: 0.15, vx: 0.2},
  {src: '/src/images/airship2.png', direction: -1, y: 0.22, vx: 0.4},
  {src: '/src/images/airship3.png', direction: 1, y: 0.3, vx: 0.3},
]

export class Airship{
  constructor(stageWidth, stageHeight, index){
    const airshipInfo = AIRSHIP_INFO[index];

    this.width = 175;
    this.height = 128;

    this.direction = airshipInfo.direction;
    this.x = this.direction === 1 ? (-this.width - 100) : (stageWidth + 100); // 100 여분값
    this.y = stageHeight * airshipInfo.y;

    this.vx = airshipInfo.vx * this.direction;
    this.vy = 0;

    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;

    this.image = new Image();
    this.image.src = airshipInfo.src;

    this.hasCrash = false;
    this.angle = 0;
    this.smoke = [];
  }

  draw(ctx){
    ctx.save();
    this.x += this.vx;
    this.maxX += this.vx;
    if(this.hasCrash){
      this.angle = this.angle < 10 ? this.angle + 0.005 : this.angle;
      this.y += 0.1;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.rotate((Math.PI / 180) * this.angle * this.direction);
      for(let i = 0; i < this.smoke.length; i++){
        this.smoke[i].a -= 0.0005;
        this.smoke[i].x -= this.smoke[i].vx;
        this.smoke[i].y += this.smoke[i].vy;
        ctx.fillStyle = `rgba(${this.smoke[i].r}, ${this.smoke[i].g}, ${this.smoke[i].b}, ${this.smoke[i].a})`;
        ctx.fillRect(this.smoke[i].x, this.smoke[i].y, 10, 10);
      }
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  crash(cracker){
    if((this.x < cracker.targetCentX && this.maxX > cracker.targetCentX) && (this.y < cracker.targetCentY && this.maxY > cracker.targetCentY)){
      if(!this.hasCrash){
        setInterval(this.makeSmoke.bind(this), 200);
      }
      this.hasCrash = true;
      this.vy = 0.1;
    }
  }
  makeSmoke(){
    const moveX = Math.floor(Math.random() * 10) * getRandomSign() + 40;
    const moveY = Math.floor(Math.random() * 10) * getRandomSign() + 70;
    const {r, g, b, a} = SMOKE_COLOR[Math.floor(Math.random() * SMOKE_COLOR.length)];
    this.smoke[this.smoke.length] = {x: this.x + moveX, y: this.y + moveY, vx : 0.01, vy : 0.01 * getRandomSign(),  r: r, g: g, b: b, a: a};
  }

  // 텍스트 넣어도 재밌을 듯
}