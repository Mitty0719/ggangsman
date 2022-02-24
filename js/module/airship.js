import { getRandomSign } from "../util.js";

const SMOKE_COLOR = [
  {r: 255, g: 255, b: 255, a: 0.5},
  {r: 255, g: 0, b: 0, a: 0.5},
  {r: 200, g: 200, b: 200, a: 0.5},
  {r: 50, g: 50, b: 50, a: 0.5},
]

export class Airship{
  constructor(){
    this.x = 100;
    this.y = 100;

    this.width = 175;
    this.height = 128;

    this.vx = 0.1;
    this.vy = 0;

    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;

    this.image = new Image();
    this.image.src = `/src/images/airship.png`;

    this.hasCrash = false;
    this.angle = 0;
    this.smoke = [];
  }

  draw(ctx){
    ctx.save();
    this.x += this.vx;
    if(this.hasCrash){
      this.angle = this.angle < 0.15 ? this.angle + 0.0002 : this.angle;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.rotate(this.angle);
      for(let i = 0; i < this.smoke.length; i++){
        this.smoke[i].a -= 0.0005;
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
    this.smoke[this.smoke.length] = {x: this.x + moveX, y: this.y + moveY, r: r, g: g, b: b, a: a};
  }
}