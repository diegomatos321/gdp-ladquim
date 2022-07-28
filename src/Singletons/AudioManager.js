import Phaser from "phaser";
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import CrossSceneEventEmitter from "./CrossSceneEventEmitter";

export default class AudioManager extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.AUDIO_MANAGER})

    this.musicConfig = {
      loop: true,
      volume: 0.5
    };
    this.audioConfig = {
      volume: 0.5
    };

    this.currentBackgroundMusic = null;
    this.listOfAudioElements = []
  }

  init = () => {
    const localMusicConfig = window.localStorage.getItem("localMusicConfig");
    const localAudioConfig = window.localStorage.getItem("localAudioConfig");

    if (localMusicConfig) {
      this.musicConfig = JSON.parse(localMusicConfig);
    } else {
      window.localStorage.setItem("localMusicConfig", JSON.stringify(this.musicConfig));
    }
    
    if(localAudioConfig) {
      this.audioConfig = JSON.parse(localAudioConfig);
    } else {
      window.localStorage.setItem("localAudioConfig", JSON.stringify(this.audioConfig));
    }
  }

  create = () => {
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.PLAY_BACKGROUND_MUSIC, this.playBackgroundMusic)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.STOP_BACKGROUND_MUSIC, this.stopBackgroundMusic)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.PLAY_AUDIO, this.playAudio)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.STOP_AUDIO, this.stopAudio)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.MUSIC_SETTINGS_CHANGED, this.musicSettingsChanged);
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS, this.handleGetMusicSettings);
    // CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.AUDIO_SETTING_CHANGED, this.audioSettingsChanged);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
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

  stopAudio = (key) => {
    console.log("Stop Audio: " + key);
    this.sound.stopByKey(key)
  }

  musicSettingsChanged = (key, value) => {
    if (this.musicConfig[key] != value) {
      this.musicConfig[key] = value
      window.localStorage.setItem("localMusicConfig", JSON.stringify(this.musicConfig));

      if(this.currentBackgroundMusic) {
        this.currentBackgroundMusic.currentConfig[key] = value;
        this.currentBackgroundMusic[key] = value;
      }
    }
  }

  audioVolumeChanged = (key, value) => {
    if (this.audioConfig[key] != value) {
      this.audioConfig[key] = value
      window.localStorage.setItem("localAudioConfig", JSON.stringify(this.musicConfig));

      for (let audioElement of this.listOfAudioElements) {
        audioElement.currentConfig[key] = value;
        audioElement[key] = value
      }
    }
  }

  cleanEvents = () => {
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.PLAY_BACKGROUND_MUSIC, this.playBackgroundMusic)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.STOP_BACKGROUND_MUSIC, this.stopBackgroundMusic)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.PLAY_AUDIO, this.playAudio)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.STOP_AUDIO, this.stopAudio)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.MUSIC_SETTINGS_CHANGED, this.musicSettingsChanged);
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS, this.handleGetMusicSettings);
  }
}