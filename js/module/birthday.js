export class Birthday{
  constructor(){
    this.music = new Audio('./src/audios/birthday1.mp3');
    this.playButton = document.querySelector('.controller-button-con .button-play');
    this.playButtonImg = document.querySelector('.controller-button-con .button-play .play-img');
    this.progressCon = document.querySelector('.controller-progress-con');
    this.progress = document.querySelector('.controller-progress-con .current-progress');

    this.playButton.addEventListener('click', this.clickPlayButton.bind(this));
    this.assets = ['./src/images/controller_pause.png', './src/images/controller_play.png'];
    this.isPlaying = false;

    
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
    this.progress.style.width = `${this.music.currentTime / this.music.duration * 100}%`;
    console.log(this.music.currentTime, this.music.duration);
  }
}