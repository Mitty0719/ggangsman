import { Airship } from './module/airship.js';
import { Firecracker } from './module/firecracker.js';
import Data from '../src/data.json' assert { type: 'json' };
class App{
  constructor(){
    this.sectionInfo = [
      {
        sectionNum: 0,
        screenHeight: 0,
        screenRatio: 1,
        values: {

        },
        objs: {
          timerDay: document.querySelector('.timer-day'),
          timerTime: document.querySelector('.timer-time')
        }
      },
      {
        sectionNum: 1,
        screenHeight: 0,
        screenRatio: 1,
        values: {
        },
        objs: {
          textTitle: document.querySelector('.text-content .title'),
          textContent: document.querySelector('.text-content .content .content-space'),
          textAuto: document.querySelector('.text-auto')
        }
      },
      {
        sectionNum: 2,
        screenHeight: 0,
        screenRatio: 1,
        values: {

        },
        objs: {
          galleryCon: document.querySelector('.gallery-con')
        }
      },
      {
        sectionNum: 3,
        screenHeight: 0,
        screenRatio: 5,
        values: {
          cardText1_opacity_in: [0, 1, {start: 0.01, end: 0.09}],
          cardText1_opacity_out: [1, 0, {start: 0.11, end: 0.19}],
          cardText2_opacity_in: [0, 1, {start: 0.2, end: 0.29}],
          cardText2_opacity_out: [1, 0, {start: 0.31, end: 0.39}],
          cardText3_opacity_in: [0, 1, {start: 0.4, end: 0.49}],
          cardText3_opacity_out: [1, 0, {start: 0.51, end: 0.59}],
          cardText4_opacity_in: [0, 1, {start: 0.6, end: 0.69}],
          cardText4_opacity_out: [1, 0, {start: 0.71, end: 0.79}],
          cardImgCon_opacity_out: [1, 0, {start: 0.71, end: 0.79}]
        },
        objs: {
          cardImgCon: document.querySelector('.card-img-con'),
          cardText1: document.querySelector('.card-text-1'),
          cardText2: document.querySelector('.card-text-2'),
          cardText3: document.querySelector('.card-text-3'),
          cardText4: document.querySelector('.card-text-4'),
        }
      },
      {
        sectionNum: 4,
        screenHeight: 0,
        screenRatio: 1,
        values: {

        },
        objs: {
        }
      }
    ];
    this.stageWidth = document.body.clientWidth;
    this.currentY = 0; // window.pageYOffset
    this.currentSection = -1; // 현재 section
    this.prevSectionHeight = 0; // 이전 section 높이 합
    this.enteringSection = true; // section 진입 여부
    this.showContentText = false; // textSection content 표시여부
    this.contentTextArray = Data.text.split('');
    this.contentTextCnt = 0;
    this.purposeTime = new Date(2022, 2, 10, 0);

    this.canvas = null;
    this.ctx = null;
    this.crackers = new Set();
    this.airships = [];

    this.setMainTimer();
    this.setLayout();

    // airship 객체 생성
    for(let i = 0; i < 3; i++){
      this.airships[i] = new Airship(this.stageWidth, this.sectionInfo[4].screenHeight, i);
    }

    window.addEventListener('scroll', ()=>{
      this.checkScroll();
    });
    window.addEventListener('resize', ()=>{
      
    });
    window.addEventListener('keydown', ()=>{
      if(this.currentSection === 1){
        this.typeContentText(this.sectionInfo[1].objs.textContent);
      }
    });

    // this.sampleFire = new Firecracker(this.stageWidth, this.sectionInfo[4].screenHeight);


    // 임시
    this.createGallery();
  }

  setLayout(){
    // 초기 화면 타이핑 이벤트 동작을 위한 임의 스크롤
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);

    const contentSection = document.querySelectorAll('.content-section');
    const loadCon = document.querySelector('.load-con');
    for(let i = 0; i < this.sectionInfo.length; i++){
      this.sectionInfo[i].screenHeight = window.innerHeight * this.sectionInfo[i].screenRatio;
      contentSection[i].style.height = `${this.sectionInfo[i].screenHeight}px`;
    }

    loadCon.style.width = `${this.stageWidth}px`;
    loadCon.style.height = `${this.sectionInfo[0].screenHeight}px`;
  }

    calcAnimationValues(values, currentYOffset){
      let value; // return value
      let sectionHeight = this.sectionInfo[this.currentSection].screenHeight;

      let partScrollStart = sectionHeight * values[2].start;
      let partScrollEnd = sectionHeight * values[2].end;
      let partScrollHeight = partScrollEnd - partScrollStart;
      let sectionScrollRatio = currentYOffset - this.prevSectionHeight / sectionHeight;

      if(sectionScrollRatio >= partScrollStart && sectionScrollRatio <= partScrollEnd){
          value = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      }else if(sectionScrollRatio < partScrollStart){
          value = values[0];
      }else if(sectionScrollRatio > partScrollEnd){
          value = values[1];
      }

      return value;
    }
    playAnimation(){
      let currentYOffset = this.currentY - this.prevSectionHeight;
      let currentRatio = currentYOffset / this.sectionInfo[this.currentSection].screenHeight;
      const objs = this.sectionInfo[this.currentSection].objs;
      const values = this.sectionInfo[this.currentSection].values;

      switch(this.currentSection){
        case 0:
          if(this.enteringSection){
            this.typeText(objs.timerDay);
            this.typeText(objs.timerTime);
          }
          break;
        case 1:
          if(this.enteringSection && !this.showContentText){
            // typeText(sectionInfo[1].objs.textContent, true, 20);
            this.showContentText = true;
          }
          objs.textAuto.addEventListener('click', ()=>{
            // document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'z'}));
            const autoId = setInterval(()=>{
              this.typeContentText(objs.textContent);
              if(this.currentSection !== 1){
                clearInterval(autoId);
              }
            }, 30);
          })
          break;
        case 2:
          break;
        case 3:
          if((this.prevSectionHeight + (500 - (window.innerHeight - objs.cardImgCon.clientHeight) / 2)) < this.currentY){
            objs.cardImgCon.classList.add('holding-elem');
          }else{
            objs.cardImgCon.classList.remove('holding-elem');
          }
          if(currentRatio <= 0.1){
            objs.cardText1.style.opacity = this.calcAnimationValues(values.cardText1_opacity_in, currentYOffset);
          }else if(currentRatio <= 0.3){
            objs.cardText1.style.opacity = this.calcAnimationValues(values.cardText1_opacity_out, currentYOffset);
            objs.cardText2.style.opacity = this.calcAnimationValues(values.cardText2_opacity_in, currentYOffset);
          }else if(currentRatio <= 0.5){
            objs.cardText2.style.opacity = this.calcAnimationValues(values.cardText2_opacity_out, currentYOffset);
            objs.cardText3.style.opacity = this.calcAnimationValues(values.cardText3_opacity_in, currentYOffset);
          }else if(currentRatio <= 0.7){
            objs.cardText3.style.opacity = this.calcAnimationValues(values.cardText3_opacity_out, currentYOffset);
            objs.cardText4.style.opacity = this.calcAnimationValues(values.cardText4_opacity_in, currentYOffset);
          }else{
            objs.cardText4.style.opacity = this.calcAnimationValues(values.cardText4_opacity_out, currentYOffset);
            objs.cardImgCon.style.opacity = this.calcAnimationValues(values.cardImgCon_opacity_out, currentYOffset);
          }
          break;
        case 4:
          if(this.enteringSection){
            this.canvas = document.querySelector('.firecracker-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = this.sectionInfo[4].screenHeight;

            if(!this.hasEnterCanvas){
              document.addEventListener('click', (e)=>{
                this.crackers.add(new Firecracker(e.clientX, this.sectionInfo[4].screenHeight));
                this.checkAirshipOut();
              });
              this.hasEnterCanvas = true;

              requestAnimationFrame(this.animateFirecracker.bind(this));
            }
          }
          break;
      }
      // console.log(currentSection);
    }
    checkScroll(){ // scroll Loop
      this.prevSectionHeight = 0;
      this.currentY = window.pageYOffset;
      this.enteringSection = true;

      for(let i = 0; i <= this.sectionInfo.length; i++){
        if(this.currentY < this.prevSectionHeight + this.sectionInfo[i].screenHeight){
          // console.log(currentSection, i);
          if(this.currentSection === i){
            this.enteringSection = false;
          } else {
            this.currentSection = i;
          }
          break;
        }
        this.prevSectionHeight += this.sectionInfo[i].screenHeight;
      }
      // console.log(currentSection);
      document.body.setAttribute('id', `visible-${this.currentSection}`);
      
      this.playAnimation();
    }
    typeText(textDOM){
      const realText = textDOM.innerText.split(''); // 현재 시각 폼 받아오는 함수 만들어서 받아오기
      let textCnt = 0;

      const typeId = setInterval(()=>{
        const junkText = [];
        let junkChar;
        for(let i = 0; i < textCnt; i++){
          junkText.push(realText[i]);
        }
        for(let i = textCnt; i < realText.length; i++){
          junkChar = String.fromCharCode(Math.random() * 57 + 65);
          junkText.push(junkChar);
        }
        textDOM.innerText = junkText.join('');
      }, 80);

      const cntId = setInterval(()=>{
        textCnt++;
        if(textCnt > realText.length){
          clearInterval(typeId);
          clearInterval(cntId);
          // 타이머 시작
          setInterval(this.setMainTimer.bind(this), 1000);
        }
      }, 240);
    }
    typeContentText(textDOM){
        if(this.contentTextCnt > this.contentTextArray.length) return;
        let contentText = '';
        for(let i = 0; i < this.contentTextCnt; i++){
            contentText += this.contentTextArray[i];
        }
        textDOM.innerText = contentText;
        this.contentTextCnt++;
    };
    setMainTimer(){
      const currentTime = new Date;
      const betweenSeconds = Math.floor((this.purposeTime.getTime() - currentTime.getTime()) / 1000);
      const daySeconds = betweenSeconds % (3600 * 24);
      
      const days = `${Math.floor(betweenSeconds / 3600 / 24)} Days`;
      const time = `${Math.floor(daySeconds / 3600).toString().padStart(2, '0')}h ${Math.floor(daySeconds % 3600 / 60).toString().padStart(2, '0')}m ${Math.floor(daySeconds % 3600 % 60).toString().padStart(2, '0')}s`;
      
      this.sectionInfo[0].objs.timerDay.innerText = days;
      this.sectionInfo[0].objs.timerTime.innerText = time;
    }

    animateFirecracker(){
      requestAnimationFrame(this.animateFirecracker.bind(this));
      this.ctx.clearRect(0, 0, this.stageWidth, this.sectionInfo[4].screenHeight);
      // airship
      for(let i = 0; i < this.airships.length; i++){
        for(let cracker of this.crackers.values()){
          if(cracker.isArrive){
            this.airships[i].crash(cracker);
          }
        }
        this.airships[i].draw(this.ctx);
      }

      // firecracker
      for(let cracker of this.crackers.values()){
        cracker.draw(this.ctx);
        if(cracker.isFinish && cracker.level < 0){
          this.crackers.delete(cracker);
        }
        if(cracker.opacity <= 0){
          this.crackers.delete(cracker);
        }
      }

    }

    checkAirshipOut(){
      for(let i = 0; i < this.airships.length; i++){
        if(this.airships[i].direction === 1){
          if(this.airships[i].x > this.stageWidth){
            this.airships[i] = new Airship(this.stageWidth, this.sectionInfo[4].screenHeight, i);
          }
        }else{
          if(this.airships[i].x < 0){
            this.airships[i] = new Airship(this.stageWidth, this.sectionInfo[4].screenHeight, i);
          }
        }
      }
    }

    createGallery(){
      const gallery = Data.gallery;
      for(let i = 0; i < gallery.length; i++){
        const galleryItem = document.createElement('li');
        const imgCon = document.createElement('figure');
        const img = document.createElement('img');
        const tagCon = document.createElement('ul');

        galleryItem.classList.add('gallery');
        imgCon.classList.add('img-con');
        tagCon.classList.add('tag-con');
        img.src = gallery[i].src;

        for(let j = 0; j < gallery[i].tag.length; j++){
          const tag = document.createElement('li');
          tag.classList.add('tag');
          tag.innerHTML = `#${gallery[i].tag[j]}`;
          tagCon.appendChild(tag);
        }

        imgCon.appendChild(img);
        galleryItem.appendChild(imgCon);
        galleryItem.appendChild(tagCon);
        this.sectionInfo[2].objs.galleryCon.appendChild(galleryItem);
        // <li class="gallery">
        //   <figure class="img-con">
        //     <img src="src/images/sample.png" alt="img"/>
        //   </figure>
        //   <ul class="tag-con">
        //     <li class="tag">#SAMPLE</li>
        //     <li class="tag">#HAPPY</li>
        //     <li class="tag">#HAPYYYYY</li>
        //   </ul>
        // </li>
      }
    }
}

window.onload = () => {
  new App();
}