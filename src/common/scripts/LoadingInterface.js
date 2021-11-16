import Phaser from "phaser"

export default class LoadingInterface extends Phaser.GameObjects.Container {
  constructor(scene, x, y){
    super(scene, x, y);
    const offSetX = this.scene.game.config.width / 4, leftTextPadding = 8;

    this.progressGraphic = this.scene.add.graphics();

    const shapeHeight = 16;
    this.shape = new Phaser.Geom.Rectangle(-offSetX, 0, 0, shapeHeight);
    this.progressGraphic.fillRectShape(this.shape);

    const fontSize = 16;
    this.textProgress = this.scene.add.text(0, leftTextPadding, "0%").setOrigin(0.5);
    this.fileProgressText = this.scene.add.text(-offSetX, this.shape.bottom + fontSize, "Iniciando Cena...").setOrigin(0, 0.5);

    this.add([this.progressGraphic, this.textProgress, this.fileProgressText])

    this.scene.load.on(Phaser.Loader.Events.FILE_PROGRESS, this.handleFileProgressBar);
    this.scene.load.on(Phaser.Loader.Events.PROGRESS, this.handleProgressBar);
    this.scene.load.on(Phaser.Loader.Events.COMPLETE, this.handleCompleteProgressBar);
    this.scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, this.handleProgressError);
    this.scene.events.on(Phaser.Scenes.Events.CREATE, this.handleSceneStart);
  }

  handleFileProgressBar = (file, progress) => {
    this.fileProgressText.setText(`Carregando: ${file.key}.${file.type} (${progress * 100}%)`);
  }

  handleProgressBar = (progress) => {
    const maxProgressWidth = this.scene.game.config.width / 2

    this.progressGraphic.clear();
    this.progressGraphic.fillStyle(0xffffff, 0.4);

    this.shape.width = progress * maxProgressWidth;
    this.progressGraphic.fillRectShape(this.shape);

    this.textProgress.setText(`${progress * 100}%`);
  }

  handleCompleteProgressBar = () => {
    this.fileProgressText.setText("Montando Cena...");
  }

  handleProgressError = (file) => {
    this.fileProgressText.setColor("#ff0000")
    this.fileProgressText.setText(`Ocorreu um erro ao carregar: ${file.key}.${file.type}`)
    this.fileProgressText.setColor("#fff")
  }

  handleSceneStart = () => {
    this.destroy();
  }
}