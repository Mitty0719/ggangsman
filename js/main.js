import { Airship } from './module/airship.js';
import { Firecracker } from './module/firecracker.js';
// import Data from '../src/data.json' assert { type: 'json' };
// import Data from '../src/data.json';
import { Birthday } from './module/birthday.js';

class App{
  constructor(jsonData){
    this.data = jsonData;
    this.stage = document.querySelector('.stage');
    this.cursor = document.querySelector('.cursor');
    this.cursorPoint = document.querySelector('.cursor .point')
    this.cursorAura = document.querySelector('.cursor .aura');
    this.canvas = document.querySelector('.firecracker-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.contentSection = document.querySelectorAll('.content-section');
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
        screenRatio: 10,
        values: {
          cardText1_opacity_in: [0, 1, {start: 0.01, end: 0.15}],
          cardText1_opacity_out: [1, 0, {start: 0.17, end: 0.33}],
          cardText2_opacity_in: [0, 1, {start: 0.34, end: 0.48}],
          cardText2_opacity_out: [1, 0, {start: 0.50, end: 0.66}],
          cardText3_opacity_in: [0, 1, {start: 0.67, end: 0.81}],
          cardText3_opacity_out: [1, 0, {start: 0.83, end: 0.99}],
          cardSubText1_opacity_in: [0, 1, {start: 0.05, end: 0.15}],
          cardSubText2_opacity_in: [0, 1, {start: 0.38, end: 0.48}],
          cardSubText3_opacity_in: [0, 1, {start: 0.71, end: 0.81}],
          cardImgCon_opacity_out: [1, 0, {start: 0.83, end: 0.99}]
        },
        objs: {
          cardImgCon: document.querySelector('.card-img-con'),
          flipEffect: document.querySelector('.flip-effect'),
          cardText1: document.querySelector('.card-text-1'),
          cardText2: document.querySelector('.card-text-2'),
          cardText3: document.querySelector('.card-text-3'),
          cardSubText1: document.querySelector('.card-sub-text-1'),
          cardSubText2: document.querySelector('.card-sub-text-2'),
          cardSubText3: document.querySelector('.card-sub-text-3'),
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
    this.totalHeight = 0; // 전체 높이
    this.currentY = 0; // window.pageYOffset
    this.currentSection = -1; // 현재 section
    this.prevSectionHeight = 0; // 이전 section 높이 합
    this.enteringSection = true; // section 진입 여부
    this.showContentText = false; // textSection content 표시여부
    this.contentTextArray = this.data.text.split('');
    this.contentTextCnt = 0;
    this.purposeTime = new Date(2022, 2, 10, 0);
    this.images = [[],[]];

    this.crackers = new Set();
    this.airships = [];

    this.setProgress();
    this.setLayout();
    this.loadImages();
    this.setMainTimer();
    this.createGallery();
    this.devideCardImage();
    this.createAirship();



    window.addEventListener('scroll', ()=>{
      this.checkScroll();
    });
    window.addEventListener('resize', ()=>{
      this.setLayout();
    });
    window.addEventListener('keydown', ()=>{
      if(this.currentSection === 1){
        this.typeContentText(this.sectionInfo[1].objs.textContent);
      }
    });
    window.addEventListener('mousemove', (e)=>{
      this.cursor.style.top = `${e.clientY}px`;
      this.cursor.style.left = `${e.clientX}px`;
    });
    //events
    this.sectionInfo[1].objs.textAuto.addEventListener('click', ()=>{
      // document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'z'}));
      const autoId = setInterval(()=>{
        this.typeContentText(this.sectionInfo[1].objs.textContent);
        if(this.currentSection !== 1){
          clearInterval(autoId);
        }
      }, 30);
    });
    this.sectionInfo[2].objs.galleryCon.addEventListener('click', this.clickGalleryTag.bind(this));
    document.addEventListener('click', (e)=>{
      this.crackers.add(new Firecracker(e.clientX, this.sectionInfo[4].screenHeight));
      this.checkAirshipOut();
    });
  }

  setLayout(){
    this.stageWidth = document.body.clientWidth;
    let screenRatio = window.innerHeight / window.innerWidth;
    screenRatio = screenRatio > 1 ? screenRatio : 1;
    
    const loadCon = document.querySelector('.load-con');
    for(let i = 0; i < this.sectionInfo.length; i++){
      if(i === 2){
        this.sectionInfo[i].screenHeight = window.innerHeight * this.sectionInfo[i].screenRatio * screenRatio;
      }else{
        this.sectionInfo[i].screenHeight = window.innerHeight * this.sectionInfo[i].screenRatio;
      }
      this.contentSection[i].style.height = `${this.sectionInfo[i].screenHeight}px`;
    }
    loadCon.style.width = `${this.stageWidth}px`;
    loadCon.style.height = `${this.sectionInfo[0].screenHeight}px`;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.sectionInfo[4].screenHeight;
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
          break;
        case 2:
          break;
        case 3:
          // if((this.prevSectionHeight + (500 - (window.innerHeight - objs.cardImgCon.clientHeight) / 2)) < this.currentY){
          //   objs.cardImgCon.classList.add('holding-elem');
          // }else{
          //   objs.cardImgCon.classList.remove('holding-elem');
          // }
          
          if(currentRatio <= 0.16){
            objs.cardText1.style.opacity = this.calcAnimationValues(values.cardText1_opacity_in, currentYOffset);
            objs.cardSubText1.style.opacity = this.calcAnimationValues(values.cardSubText1_opacity_in, currentYOffset);
          }else if(currentRatio <= 0.49){
            objs.cardText1.style.opacity = this.calcAnimationValues(values.cardText1_opacity_out, currentYOffset);
            objs.cardText2.style.opacity = this.calcAnimationValues(values.cardText2_opacity_in, currentYOffset);
            objs.cardSubText1.style.opacity = this.calcAnimationValues(values.cardText1_opacity_out, currentYOffset);
            objs.cardSubText2.style.opacity = this.calcAnimationValues(values.cardSubText2_opacity_in, currentYOffset);
          }else if(currentRatio <= 0.82){
            objs.cardText2.style.opacity = this.calcAnimationValues(values.cardText2_opacity_out, currentYOffset);
            objs.cardText3.style.opacity = this.calcAnimationValues(values.cardText3_opacity_in, currentYOffset);
            objs.cardSubText2.style.opacity = this.calcAnimationValues(values.cardText2_opacity_out, currentYOffset);
            objs.cardSubText3.style.opacity = this.calcAnimationValues(values.cardSubText3_opacity_in, currentYOffset);
          }else{
            objs.cardText3.style.opacity = this.calcAnimationValues(values.cardText3_opacity_out, currentYOffset);
            objs.cardSubText3.style.opacity = this.calcAnimationValues(values.cardText3_opacity_out, currentYOffset);
            objs.cardImgCon.style.opacity = this.calcAnimationValues(values.cardImgCon_opacity_out, currentYOffset);
          }

          if(currentRatio > 0.08 && currentRatio < 0.15){
            objs.flipEffect.style.backgroundImage = `url("${this.data.card[0]}")`;
            objs.flipEffect.classList.add('active');
          }else if(currentRatio > 0.24 && currentRatio < 0.33){
            objs.flipEffect.classList.remove('active');
          }else if(currentRatio > 0.40 && currentRatio < 0.48){
            objs.flipEffect.style.backgroundImage = `url("${this.data.card[1]}")`;
            objs.flipEffect.classList.add('active');
          }else if(currentRatio > 0.58 && currentRatio < 0.66){
            objs.flipEffect.classList.remove('active');
          }else if(currentRatio > 0.74 && currentRatio < 0.81){
            objs.flipEffect.style.backgroundImage = `url("${this.data.card[2]}")`;
            objs.flipEffect.classList.add('active');
          }else if(currentRatio > 0.91 && currentRatio < 0.99){
            objs.flipEffect.classList.remove('active');
          }else{
            objs.flipEffect.classList.remove('active');
          }
          break;
        case 4:
          if(this.enteringSection){

            if(!this.hasEnterCanvas){
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
          this.mainTimerId = setInterval(this.setMainTimer.bind(this), 1000);
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
      // const currentTime = new Date(2022, 2, 10);
      const betweenSeconds = Math.floor((this.purposeTime.getTime() - currentTime.getTime()) / 1000);
      const daySeconds = betweenSeconds % (3600 * 24);
      
      const days = `${Math.floor(betweenSeconds / 3600 / 24)} Days`;
      const time = `${Math.floor(daySeconds / 3600).toString().padStart(2, '0')}h ${Math.floor(daySeconds % 3600 / 60).toString().padStart(2, '0')}m ${Math.floor(daySeconds % 3600 % 60).toString().padStart(2, '0')}s`;
      
      this.sectionInfo[0].objs.timerDay.innerText = days;
      this.sectionInfo[0].objs.timerTime.innerText = time;

      if(betweenSeconds <= 0 && !this.isBirthday){
        clearInterval(this.mainTimerId);
        this.setBirthday();
        this.isBirthday = true;
      }
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
      const gallery = this.data.gallery;
      for(let i = 0; i < gallery.length; i++){
        const galleryItem = document.createElement('li');
        const imgCon = document.createElement('figure');
        const filter = document.createElement('div');
        const img = document.createElement('img');
        const tagCon = document.createElement('ul');

        galleryItem.classList.add('gallery');
        imgCon.classList.add('img-con');
        tagCon.classList.add('tag-con');
        filter.classList.add('filter');
        img.src = gallery[i].src;

        for(let j = 0; j < gallery[i].tag.length; j++){
          const tag = document.createElement('li');
          tag.classList.add('tag');
          tag.innerHTML = `#${gallery[i].tag[j][0]}`;
          tag.setAttribute('data-color', gallery[i].tag[j][1]);
          tagCon.appendChild(tag);
        }

        imgCon.appendChild(filter);
        imgCon.appendChild(img);
        galleryItem.appendChild(imgCon);
        galleryItem.appendChild(tagCon);
        this.sectionInfo[2].objs.galleryCon.appendChild(galleryItem);
      }
    }
    clickGalleryTag(e){
      const target = e.target;
      if(target.classList.contains('tag')){
        target.parentNode.childNodes.forEach((tag)=>{
          tag.classList.remove('selected');
        })
        target.classList.add('selected');
        const filter = target.parentNode.previousSibling.querySelector('.filter');
        filter.className = 'filter';
        setTimeout(()=>{
          filter.classList.add(target.getAttribute('data-color'));
        }, 500);
      }
    }
    devideCardImage(){
      const row = 4;
      const column = 4;
      const width = 100 / column;
      const height = 100 / row;
      const imgWidth = 100 * column;
      const imgHeight = 100 * row;
      const flipEffect = this.sectionInfo[3].objs.flipEffect;

      let setStyle = `transform: translate(50px, 50px); opacity: 0;`;
      let htmlStr = ``;
      for(let i = 0; i < row; i++){
        for(let j = 0; j < column; j++){
          let top = -i * 100;
          let left = -j * 100;
          let delaySpeed = ((column - j) - (i * 0.5)) * 0.25;

          htmlStr += `<div class="flip-item" style="${setStyle} width:${width}%; height:${height}%; transition-delay:${delaySpeed}s">`
          htmlStr += `  <div class="flip-img" style="width:${imgWidth}%; height:${imgHeight}%; top:${top}%; left:${left}%;"></div>`;
          htmlStr += `</div>`;
        }
      }
      flipEffect.innerHTML = htmlStr;
    }
    loadImages(){
      const gallery = this.data.gallery;
      const card = this.data.card;
      for(let i = 0; i < gallery.length; i++){
        const image = new Image();
        image.src = gallery[i]['src'];
        this.images[0][i] = image;
      }
      for(let i = 0; i < card.length; i++){
        const image = new Image();
        image.src = card[i]
        this.images[1][i] = image;
      }
    }
    setProgress(){
      const loadCon = document.querySelector('.load-con')
      const progress = document.querySelector('.load-progress');
      const ratio = document.querySelector('.load-ratio span');
      let progressRatio = 0;
      setTimeout(()=>{
        const progressIntId = setInterval(()=>{
          progress.style.height = `${100 - progressRatio++}%`;
          ratio.innerHTML = progressRatio;
          if(progressRatio >= 100){
            clearInterval(progressIntId);
            setTimeout(this.setLoaded.bind(this, loadCon), 1000);
          }
        } ,30);
        loadCon.addEventListener('transitionend', ()=>{
          loadCon.style.display = 'none';
        });
      }, 1000)
    }
    setLoaded(loadCon){
      loadCon.classList.add('loaded');
      this.stage.style.height = 'initial';
      for(let i = 0; i < this.contentSection.length; i++){
        this.contentSection[i].style.opacity = 1;
      }

      // 초기 화면 타이핑 이벤트 동작을 위한 임의 스크롤
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
    }
    createAirship(){
      // airship 객체 생성
      for(let i = 0; i < 3; i++){
        this.airships[i] = new Airship(this.stageWidth, this.sectionInfo[4].screenHeight, i);
      }
    }
    setBirthday(){
      this.stage.style.display = 'none';
      this.cursorPoint.classList.add('black');
      this.cursorAura.classList.add('border-black');
      
      const birthday = new Birthday();
      
      setInterval(()=>{
        birthday.updateProgress();
      }, 1000);
    }
}

window.onload = () => {
  fetch('../src/data.json')
  .then(response => {
    return response.json();
  })
  .then(jsonData => {
    new App(jsonData);
  });
  // .finally(()=> new App(data));
}