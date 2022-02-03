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

    window.addEventListener('scroll', ()=>{
        checkScroll();
    })
    window.addEventListener('resize', ()=>{
        
    })
    setLayout();
})()