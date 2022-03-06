export class Birthday{
  constructor(){
    this.birthdayStage = document.querySelector('.birthday-stage');
    this.birthdayTextCon = document.querySelector('.birthday-text-con');
    this.crapButton = document.querySelector('.crap-button');
    this.crapText = document.querySelector('.crap-text');
    this.musicButton = document.querySelector('.music-button');

    this.music = new Audio('./src/audios/birthday1.mp3');
    this.playButton = document.querySelector('.controller-button-con .button-play');
    this.playButtonImg = document.querySelector('.controller-button-con .button-play .play-img');
    this.progressCon = document.querySelector('.controller-progress-con');
    this.progress = document.querySelector('.controller-progress-con .current-progress');
    this.currentTime = document.querySelector('.controller-time-con .current-time');
    this.wholeTime = document.querySelector('.controller-time-con .whole-time');

    this.assets = ['./src/images/controller_pause.png', './src/images/controller_play.png'];
    this.isPlaying = false;

    this.playButton.addEventListener('click', this.clickPlayButton.bind(this));
    this.progressCon.addEventListener('click', this.setCurrentTime.bind(this));

    this.showTextCon();
  }
  showTextCon(){
    this.birthdayStage.style.display = 'flex';
    setTimeout(()=>{
      this.birthdayStage.style.opacity = 1;
    }, 500);

    this.crapButton.addEventListener('click', ()=>{
      this.crapText.style.opacity = 1;
      setTimeout(()=>{
        this.musicButton.style.opacity = 1;
      }, 2000);
    });

    this.musicButton.addEventListener('click', ()=>{
      this.hideTextCon();
    });
  }
  hideTextCon(){
    this.birthdayTextCon.style.opacity = 0;
    setTimeout(()=>{
      this.birthdayTextCon.style.display = 'none';
    }, 1000);

    this.setWholeTime();
  }

  clickPlayButton(){
    if(this.isPlaying){
      this.pauseMusic();
    }else{
      this.playMusic();
    }
  }
  playMusic(){
    this.music.play();
    this.playButtonImg.style.backgroundImage = `url("${this.assets[0]}")`;
    this.isPlaying = true;
  }
  pauseMusic(){
    this.music.pause();
    this.playButtonImg.style.backgroundImage = `url("${this.assets[1]}")`;
    this.isPlaying = false;
  }
  updateProgress(){
    this.currentTime.innerHTML = `${Math.floor(this.music.currentTime / 60).toString().padStart(2, '0')}:${Math.floor(this.music.currentTime % 60).toString().padStart(2, '0')}`;
    this.progress.style.width = `${Math.floor(this.music.currentTime / this.music.duration * 100)}%`;

    if(this.music.currentTime === this.music.duration){
      this.music.currentTime = 0;
      this.pauseMusic();
    }
  }
  setCurrentTime(e){
    const ratio = e.offsetX / e.target.clientWidth;
    this.music.currentTime = Math.floor(this.music.duration * ratio);
  }
  setWholeTime(){
    this.wholeTime.innerHTML = `${Math.floor(this.music.duration / 60).toString().padStart(2, '0')}:${Math.floor(this.music.duration % 60).toString().padStart(2, '0')}`;
  }
}