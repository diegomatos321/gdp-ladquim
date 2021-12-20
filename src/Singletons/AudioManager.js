import Phaser from "phaser";
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import CrossSceneEventEmitter from "./CrossSceneEventEmitter";

export default class AudioManager extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.AUDIO_MANAGER})

    this.musicConfig = {
      loop: true
    };
    this.audioConfig = null;

    this.currentBackgroundMusic = null;
    this.listOfAudioElements = []

    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.PLAY_BACKGROUND_MUSIC, this.playBackgroundMusic)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.STOP_BACKGROUND_MUSIC, this.stopBackgroundMusic)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.PLAY_AUDIO, this.playAudio)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.MUSIC_SETTINGS_CHANGED, this.musicSettingsChanged);
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS, this.handleGetMusicSettings);
    // CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.AUDIO_SETTING_CHANGED, this.audioSettingsChanged);
  }

  init = () => {
    const localMusicConfig = window.localStorage.getItem("localMusicConfig");
    const localAudioConfig = window.localStorage.getItem("localAudioConfig");

    if (localMusicConfig !== null) {
      this.musicConfig = JSON.parse(localMusicConfig);
      this.audioConfig = JSON.parse(localAudioConfig);
    }
  }

  playBackgroundMusic = (key) => {
    if(this.currentBackgroundMusic != null) {
      this.currentBackgroundMusic.destroy();
    }

    this.currentBackgroundMusic = this.sound.add(key, this.musicConfig);
    this.currentBackgroundMusic.play();
  }

  stopBackgroundMusic = () => {
    if (this.currentBackgroundMusic == null) return;

    this.currentBackgroundMusic.stop();
  }

  handleGetMusicSettings = () => {
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.RESPONSE_GET_MUSIC_SETTINGS, this.musicConfig)
  }

  playAudio = (key) => {
    const newAudioElement = this.sound.add(key, this.audioConfig);
    newAudioElement.play();

    this.listOfAudioElements.push(newAudioElement);
  }

  musicSettingsChanged = (key, value) => {
    if (this.musicConfig[key] != value) {
      this.musicConfig[key] = value

      if(this.currentBackgroundMusic) {
        this.currentBackgroundMusic.currentConfig[key] = value;
        this.currentBackgroundMusic[key] = value;
      }
    }
  }

  audioVolumeChanged = (key, value) => {
    if (this.audioConfig[key] != value) {
      this.audioConfig[key] = value

      for (let audioElement of this.listOfAudioElements) {
        audioElement.currentConfig[key] = value;
        audioElement[key] = value
      }
    }
  }
}