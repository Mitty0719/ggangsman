(()=>{
    const sectionInfo = [
        {
            sectionNum: 0,
            screenHeight: 0,
            values: {

            },
            objs: {
                
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
    
    function playAnimation(){
        switch(currentSection){

        }
    }


    function setLayout(){
        const contentSection = document.querySelectorAll('.content-section');
        for(let i = 0; i < sectionInfo.length; i++){
            sectionInfo[i].screenHeight = contentSection[i].clientHeight;
            // console.log(sectionInfo[i].screenHeight);
        }
    }
    function checkScroll(){
        prevSectionHeight = 0;
        currentY = window.pageYOffset;

        for(let i = 0; i <= sectionInfo.length; i++){
            if(currentY < prevSectionHeight){
                currentSection = i;
                break;
            }
            prevSectionHeight += sectionInfo[i].screenHeight;
        }
        document.body.setAttribute('id', `visible-${currentSection}`);
        
        playAnimation();
    }
    const test = document.querySelector('.timer-day');
    const test2 = document.querySelector('.timer-time');
    typeText(test);
    typeText(test2);
    function typeText(textDOM){
        const realText = textDOM.innerText.split('');
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
            }
        }, 240);
    }

    window.addEventListener('scroll', ()=>{
        checkScroll();
    })
    window.addEventListener('resize', ()=>{
        
    })
    setLayout();
})()