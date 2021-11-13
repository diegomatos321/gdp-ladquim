export default class MusicPlayer {

  static StartMusic(scene, musicName) {

    console.log(scene)
    console.log("aa")
    music = scene.add.audio(musicName)
    music.play()

  }
}