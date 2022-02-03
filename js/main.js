(()=>{
    const sectionInfo = [
        {
            sectionNum: 0,
            screenHeight: 0,
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
            values: {

            },
            objs: {

            }
        },
        {
            sectionNum: 2,
            screenHeight: 0,
            values: {

            },
            objs: {

            }
        },
        {
            sectionNum: 3,
            screenHeight: 0,
            values: {

            },
            objs: {

            }
        },
        {
            sectionNum: 4,
            screenHeight: 0,
            values: {

            },
            objs: {

            }
        }
    ];
    let currentY = 0; // window.pageYOffset
    let currentSection = 0; // 현재 section
    let prevSectionHeight = 0; // 이전 section 높이 합
    let enteringSection = true; // section 진입 여부
    
    function playAnimation(){
        switch(currentSection){
            case 1:
                if(enteringSection){
                    typeText(sectionInfo[0].objs.timerDay);
                    typeText(sectionInfo[0].objs.timerTime);
                }
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
        }
        // console.log(currentSection);
    }


    function setLayout(){
        // 초기 화면 타이핑 이벤트 동작을 위한 임의 스크롤
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);

        const contentSection = document.querySelectorAll('.content-section');
        for(let i = 0; i < sectionInfo.length; i++){
            sectionInfo[i].screenHeight = contentSection[i].clientHeight;
            // console.log(sectionInfo[i].screenHeight);
        }
    }
    function checkScroll(){
        prevSectionHeight = 0;
        currentY = window.pageYOffset;
        enteringSection = true;

        for(let i = 0; i <= sectionInfo.length; i++){
            if(currentY < prevSectionHeight){
                if(currentSection === i){
                    enteringSection = false;
                } else {
                    currentSection = i;
                }
                break;
            }
            prevSectionHeight += sectionInfo[i].screenHeight;
        }
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
    setLayout();
})()