(()=>{
    const sectionInfo = [
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
            screenRatio: 3,
            values: {
                cardImgCon_opacity_out: [0, 1, {start: 0.8, end: 0.9}],
            },
            objs: {
                cardImgCon: document.querySelector('.card-img-con')
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
    let currentY = 0; // window.pageYOffset
    let currentSection = -1; // 현재 section
    let prevSectionHeight = 0; // 이전 section 높이 합
    let enteringSection = true; // section 진입 여부
    let showContentText = false; // textSection content 표시여부
    let contentTextArray = '그레고리력으로 69번째 날에 해당한다. 강감찬 장군이 거란군을 맞아 귀주 대첩에 승리했으며,  독립협회에서 첫 만민공동회를 개최한 날이다. 제 2차 세계 대전에서 미 공군 B-29 폭격기가 도쿄 대공습을 감행한 날이기도 하다. 영국의 축구 클럽인 첼시 FC가 창단되었으며 대한민국의 제 18대 대통령인 박근혜 전 대통령이 헌법재판소의 판결에 따라 파면되었다. 티베트 민족 봉기 기념일이며 마리오의 날이기도 하다. 한국노동조합총연맹이 이날에 창립되었으며 1958년부터 1993년까지는 근로자의 날 이었다. 탄생화는 느릅나무이며 꽃말은 고귀함을 상징한다. 시야가 넓은 자신만이 아니라 모두 번영하기를 바라는 사람이다. 탄생석은 아쿠아마린, 하울라이트 이며 영원한 젊은과 행복을 상징한다. 탄생목은 수양버들이며 우울을 상징한다. 여행을 좋아하는 몽상가이며 변덕스라우나 정직하다. 조선 16대 국왕 인조, 스페인 작곡가 파블로 데 사라사테,  대한민국 독립운동가 장인환, 미국의 배우 척 노리스, 알카에다의 지도자 오사마 빈라덴, 대한민국의 MC 박미선, 대한민국의 희극인 장도연, 미국의 가수 캐리 언더우드, 대한민국의 강현구가 탄생한 날이다.'.split('');
    let contentTextCnt = 0;


    function setLayout(){
        // 초기 화면 타이핑 이벤트 동작을 위한 임의 스크롤
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);

        const contentSection = document.querySelectorAll('.content-section');
        for(let i = 0; i < sectionInfo.length; i++){
            sectionInfo[i].screenHeight = window.innerHeight * sectionInfo[i].screenRatio;
            contentSection[i].style.height = sectionInfo[i].screenHeight + 'px';
            // console.log(sectionInfo[i].screenHeight);
        }
    }

    function playAnimation(){
        switch(currentSection){
            case 0:
                if(enteringSection){
                    typeText(sectionInfo[0].objs.timerDay);
                    typeText(sectionInfo[0].objs.timerTime);
                }
                break;
            case 1:
                if(enteringSection && !showContentText){
                    // typeText(sectionInfo[1].objs.textContent, true, 20);
                    showContentText = true;
                }
                sectionInfo[1].objs.textAuto.addEventListener('click', ()=>{
                    // document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'z'}));
                    let autoId = setInterval(()=>{
                        typeContentText(sectionInfo[1].objs.textContent);
                        if(currentSection !== 1){
                            clearInterval(autoId);
                        }
                    }, 30);
                })
                break;
            case 2:
                break;
            case 3:
                if((prevSectionHeight + (100 - (window.innerHeight - sectionInfo[3].objs.cardImgCon.clientHeight) / 2)) < currentY){
                    sectionInfo[3].objs.cardImgCon.classList.add('holding-elem');
                }
                // if(currentY > prevSectionHeight){
                //     sectionInfo[3].objs.cardImgCon.classList.remove('holding-elem');
                // }
                break;
            case 4:
                break;
        }
        // console.log(currentSection);
    }
    function checkScroll(){ // scroll Loop
        prevSectionHeight = 0;
        currentY = window.pageYOffset;
        enteringSection = true;

        for(let i = 0; i <= sectionInfo.length; i++){
            if(currentY < prevSectionHeight + sectionInfo[i].screenHeight){
                // console.log(currentSection, i);
                if(currentSection === i){
                    enteringSection = false;
                } else {
                    currentSection = i;
                }
                break;
            }
            prevSectionHeight += sectionInfo[i].screenHeight;
        }
        // console.log(currentSection);
        document.body.setAttribute('id', `visible-${currentSection}`);
        
        playAnimation();
    }
    function typeText(textDOM){
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
                setInterval(setMainTimer, 1000);
            }
        }, 240);
    }
    function typeContentText(textDOM){
        if(contentTextCnt > contentTextArray.length) return;
        let contentText = '';
        for(let i = 0; i < contentTextCnt; i++){
            contentText += contentTextArray[i];
        }
        textDOM.innerText = contentText;
        contentTextCnt++;
    };
    const purposeTime = new Date(2022, 2, 10, 0);
    function setMainTimer(){
        const currentTime = new Date;
        const betweenSeconds = Math.floor((purposeTime.getTime() - currentTime.getTime()) / 1000);
        const daySeconds = betweenSeconds % (3600 * 24);
        
        const days = `${Math.floor(betweenSeconds / 3600 / 24)} Days`;
        const time = `${Math.floor(daySeconds / 3600).toString().padStart(2, '0')}h ${Math.floor(daySeconds % 3600 / 60).toString().padStart(2, '0')}m ${Math.floor(daySeconds % 3600 % 60).toString().padStart(2, '0')}s`;
        
        sectionInfo[0].objs.timerDay.innerText = days;
        sectionInfo[0].objs.timerTime.innerText = time;
    }
    setMainTimer();

    window.addEventListener('scroll', ()=>{
        checkScroll();
    })
    window.addEventListener('resize', ()=>{
        
    })
    window.addEventListener('keydown', ()=>{
        if(currentSection === 1){
            typeContentText(sectionInfo[1].objs.textContent);
        }
    })
    setLayout();
})()