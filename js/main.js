import { Airship } from './module/airship.js';
import { Firecracker } from './module/firecracker.js';
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
    this.contentTextArray = '그레고리력으로 69번째 날에 해당한다. 강감찬 장군이 거란군을 맞아 귀주 대첩에 승리했으며,  독립협회에서 첫 만민공동회를 개최한 날이다. 제 2차 세계 대전에서 미 공군 B-29 폭격기가 도쿄 대공습을 감행한 날이기도 하다. 영국의 축구 클럽인 첼시 FC가 창단되었으며 대한민국의 제 18대 대통령인 박근혜 전 대통령이 헌법재판소의 판결에 따라 파면되었다. 티베트 민족 봉기 기념일이며 마리오의 날이기도 하다. 한국노동조합총연맹이 이날에 창립되었으며 1958년부터 1993년까지는 근로자의 날 이었다. 탄생화는 느릅나무이며 꽃말은 고귀함을 상징한다. 시야가 넓은 자신만이 아니라 모두 번영하기를 바라는 사람이다. 탄생석은 아쿠아마린, 하울라이트 이며 영원한 젊은과 행복을 상징한다. 탄생목은 수양버들이며 우울을 상징한다. 여행을 좋아하는 몽상가이며 변덕스라우나 정직하다. 조선 16대 국왕 인조, 스페인 작곡가 파블로 데 사라사테,  대한민국 독립운동가 장인환, 미국의 배우 척 노리스, 알카에다의 지도자 오사마 빈라덴, 대한민국의 MC 박미선, 대한민국의 희극인 장도연, 미국의 가수 캐리 언더우드, 대한민국의 강현구가 탄생한 날이다.'.split('');
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
    
}

window.onload = () => {
  new App();
}